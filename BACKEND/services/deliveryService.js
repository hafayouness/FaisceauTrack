import { Op } from "sequelize";
import sequelize from "../config/database.js";
import {
  Delivery,
  DeliveryItem,
  Reference,
  Destination,
  Transporter,
  Trailer,
  Reception,
  User,
} from "../models/index.js";
import { DELIVERY_STATUS } from "../constants/index.js";
import { createHistory } from "../utils/audit.js";
import { getPagination } from "../utils/pagination.js";

const include = [
  { model: Destination, as: "destination" },
  { model: Transporter, as: "transporter" },
  { model: Trailer, as: "trailer" },
  { model: User, as: "creator", attributes: ["id", "name", "email"] },
  {
    model: DeliveryItem,
    as: "items",
    include: [{ model: Reference, as: "reference" }],
  },
  {
    model: Reception,
    as: "receptions",
    include: [
      { model: Reference, as: "reference" },
      { model: User, as: "receiver", attributes: ["id", "name", "email"] },
    ],
  },
];

export const listDeliveries = async (req) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.destinationId) where.destinationId = req.query.destinationId;
  if (req.query.transporterId) where.transporterId = req.query.transporterId;
  if (req.query.trailerId) where.trailerId = req.query.trailerId;
  if (req.query.dateFrom || req.query.dateTo) {
    where.createdAt = {};
    if (req.query.dateFrom)
      where.createdAt[Op.gte] = new Date(req.query.dateFrom);
    if (req.query.dateTo) where.createdAt[Op.lte] = new Date(req.query.dateTo);
  }
  if (req.query.referenceId) {
    where.id = {
      [Op.in]: sequelize.literal(
        `(SELECT "deliveryId" FROM "DeliveryItems" WHERE "referenceId" = '${String(req.query.referenceId).replaceAll("'", "''")}')`,
      ),
    };
  }
  if (req.query.search)
    where.deliveryNumber = { [Op.iLike]: `%${req.query.search}%` };
  const result = await Delivery.findAndCountAll({
    where,
    include,
    distinct: true,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return { ...result, page, limit };
};

export const getDelivery = (id) => Delivery.findByPk(id, { include });

export const createDelivery = async ({ data, userId, ipAddress }) => {
  const transaction = await sequelize.transaction();
  try {
    if (!Array.isArray(data.items) || data.items.length === 0)
      throw Object.assign(
        new Error("Une livraison doit contenir au moins une référence"),
        { statusCode: 422 },
      );
    const ids = data.items.map((x) => x.referenceId);
    if (new Set(ids).size !== ids.length)
      throw Object.assign(
        new Error(
          "Une référence ne peut apparaître qu'une seule fois dans une livraison",
        ),
        { statusCode: 422 },
      );

    const [destination, transporter, trailer] = await Promise.all([
      Destination.findByPk(data.destinationId, { transaction }),
      Transporter.findByPk(data.transporterId, { transaction }),
      Trailer.findByPk(data.trailerId, { transaction }),
    ]);
    if (!destination?.isActive)
      throw Object.assign(new Error("Destination invalide ou inactive"), {
        statusCode: 422,
      });
    if (!transporter?.isActive)
      throw Object.assign(new Error("Transporteur invalide ou inactif"), {
        statusCode: 422,
      });
    if (!trailer?.isActive)
      throw Object.assign(new Error("Remorque invalide ou inactive"), {
        statusCode: 422,
      });

    const references = await Reference.findAll({
      where: { id: ids, isActive: true },
      transaction,
    });
    if (references.length !== ids.length)
      throw Object.assign(
        new Error("Une ou plusieurs références sont invalides ou inactives"),
        { statusCode: 422 },
      );

    const delivery = await Delivery.create(
      {
        deliveryNumber: data.deliveryNumber,
        destinationId: data.destinationId,
        transporterId: data.transporterId,
        trailerId: data.trailerId,
        status: data.status || DELIVERY_STATUS.PREPARATION,
        preparationDate: data.preparationDate || new Date(),
        departureDate: data.departureDate || null,
        arrivalDate: data.arrivalDate || null,
        notes: data.notes || null,
        createdBy: userId,
        updatedBy: userId,
      },
      { transaction },
    );

    await DeliveryItem.bulkCreate(
      data.items.map((item) => ({ ...item, deliveryId: delivery.id })),
      { transaction },
    );
    await createHistory({
      userId,
      action: "CREATE",
      entity: "Delivery",
      entityId: delivery.id,
      details: {
        deliveryNumber: delivery.deliveryNumber,
        itemCount: data.items.length,
      },
      ipAddress,
      transaction,
    });
    await transaction.commit();
    return getDelivery(delivery.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateDelivery = async ({ id, data, userId, ipAddress }) => {
  const transaction = await sequelize.transaction();
  try {
    const delivery = await Delivery.findByPk(id, {
      include: [{ model: DeliveryItem, as: "items" }],
      transaction,
    });
    if (!delivery)
      throw Object.assign(new Error("Livraison introuvable"), {
        statusCode: 404,
      });
    if (
      [
        DELIVERY_STATUS.IN_TRANSIT,
        DELIVERY_STATUS.ARRIVED,
        DELIVERY_STATUS.PARTIAL_RECEPTION,
        DELIVERY_STATUS.RECEIVED,
        DELIVERY_STATUS.CANCELLED,
      ].includes(delivery.status) &&
      data.items
    ) {
      throw Object.assign(
        new Error(
          "Les références ne peuvent plus être modifiées après le départ",
        ),
        { statusCode: 409 },
      );
    }
    const before = delivery.toJSON();
    const allowed = [
      "deliveryNumber",
      "destinationId",
      "transporterId",
      "trailerId",
      "status",
      "preparationDate",
      "departureDate",
      "arrivalDate",
      "notes",
    ];
    const patch = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowed.includes(key)),
    );
    patch.updatedBy = userId;
    await delivery.update(patch, { transaction });

    if (data.items) {
      const ids = data.items.map((x) => x.referenceId);
      if (new Set(ids).size !== ids.length)
        throw Object.assign(
          new Error("Référence dupliquée dans la livraison"),
          { statusCode: 422 },
        );
      await DeliveryItem.destroy({ where: { deliveryId: id }, transaction });
      await DeliveryItem.bulkCreate(
        data.items.map((item) => ({ ...item, deliveryId: id })),
        { transaction },
      );
    }

    const action =
      before.status !== delivery.status ? "STATUS_CHANGE" : "UPDATE";
    await createHistory({
      userId,
      action,
      entity: "Delivery",
      entityId: id,
      details: { before, after: delivery.toJSON() },
      ipAddress,
      transaction,
    });
    await transaction.commit();
    return getDelivery(id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteDelivery = async ({ id, userId, ipAddress }) => {
  const transaction = await sequelize.transaction();
  try {
    const delivery = await Delivery.findByPk(id, { transaction });
    if (!delivery)
      throw Object.assign(new Error("Livraison introuvable"), {
        statusCode: 404,
      });
    if (
      ![DELIVERY_STATUS.PREPARATION, DELIVERY_STATUS.CANCELLED].includes(
        delivery.status,
      )
    )
      throw Object.assign(
        new Error(
          "Seules les livraisons en préparation ou annulées peuvent être supprimées",
        ),
        { statusCode: 409 },
      );
    const before = delivery.toJSON();
    await delivery.destroy({ transaction });
    await createHistory({
      userId,
      action: "DELETE",
      entity: "Delivery",
      entityId: id,
      details: { before },
      ipAddress,
      transaction,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
