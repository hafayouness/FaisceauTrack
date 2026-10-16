import {
  Delivery,
  DeliveryItem,
  Reception,
  Reference,
  User,
} from "../models/index.js";

import sequelize from "../config/database.js";
import { DELIVERY_STATUS, RECEPTION_STATUS } from "../constants/index.js";
import { createHistory } from "../utils/audit.js";

export const createReception = async ({
  deliveryId,
  referenceId,
  quantityReceived,
  comment,
  userId,
  ipAddress,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const delivery = await Delivery.findByPk(deliveryId, { transaction });
    if (!delivery)
      throw Object.assign(new Error("Livraison introuvable"), {
        statusCode: 404,
      });
    if (
      ![DELIVERY_STATUS.ARRIVED, DELIVERY_STATUS.PARTIAL_RECEPTION].includes(
        delivery.status,
      )
    )
      throw Object.assign(
        new Error("La livraison doit être arrivée avant la réception"),
        { statusCode: 409 },
      );

    const item = await DeliveryItem.findOne({
      where: { deliveryId, referenceId },
      include: [{ model: Reference, as: "reference" }],
      transaction,
    });
    if (!item)
      throw Object.assign(
        new Error("Cette référence ne fait pas partie de la livraison"),
        { statusCode: 404 },
      );
    const existing = await Reception.findOne({
      where: { deliveryId, referenceId },
      transaction,
    });
    if (existing)
      throw Object.assign(
        new Error(
          "Une réception existe déjà pour cette référence dans cette livraison",
        ),
        { statusCode: 409 },
      );

    const expected = Number(item.quantity);
    const received = Number(quantityReceived);
    if (received < 0)
      throw Object.assign(
        new Error("La quantité reçue ne peut pas être négative"),
        { statusCode: 422 },
      );
    if (received === expected) {
      // completed
    }
    const status =
      received === expected
        ? RECEPTION_STATUS.COMPLETED
        : received < expected
          ? RECEPTION_STATUS.PARTIAL
          : RECEPTION_STATUS.WITH_ISSUE;
    const reception = await Reception.create(
      {
        deliveryId,
        referenceId,
        quantityExpected: expected,
        quantityReceived: received,
        status,
        comment: comment || null,
        receivedBy: userId,
        receivedAt: new Date(),
      },
      { transaction },
    );

    const totalItems = await DeliveryItem.count({
      where: { deliveryId },
      transaction,
    });
    const totalReceptions = await Reception.count({
      where: { deliveryId },
      transaction,
    });
    const hasIssue = await Reception.count({
      where: { deliveryId, status: RECEPTION_STATUS.WITH_ISSUE },
      transaction,
    });
    const hasPartial = await Reception.count({
      where: { deliveryId, status: RECEPTION_STATUS.PARTIAL },
      transaction,
    });
    let newDeliveryStatus = delivery.status;
    if (totalReceptions === totalItems)
      newDeliveryStatus =
        hasIssue || hasPartial
          ? DELIVERY_STATUS.PARTIAL_RECEPTION
          : DELIVERY_STATUS.RECEIVED;
    else newDeliveryStatus = DELIVERY_STATUS.PARTIAL_RECEPTION;
    if (newDeliveryStatus !== delivery.status) {
      const oldStatus = delivery.status;
      delivery.status = newDeliveryStatus;
      delivery.updatedBy = userId;
      if (!delivery.arrivalDate) delivery.arrivalDate = new Date();
      await delivery.save({ transaction });
      await createHistory({
        userId,
        action: "STATUS_CHANGE",
        entity: "Delivery",
        entityId: delivery.id,
        details: {
          before: { status: oldStatus },
          after: { status: newDeliveryStatus },
        },
        ipAddress,
        transaction,
      });
    }

    await createHistory({
      userId,
      action: "RECEPTION",
      entity: "Reception",
      entityId: reception.id,
      details: {
        deliveryId,
        referenceId,
        quantityExpected: expected,
        quantityReceived: received,
        discrepancy: expected - received,
        status,
      },
      ipAddress,
      transaction,
    });
    await transaction.commit();
    return Reception.findByPk(reception.id, {
      include: [
        { model: Delivery, as: "delivery" },
        { model: Reference, as: "reference" },
        { model: User, as: "receiver", attributes: ["id", "name", "email"] },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
