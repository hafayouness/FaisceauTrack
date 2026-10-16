import { Op } from "sequelize";
import { Delivery, Reference, Reception } from "../models/index.js";
import { DELIVERY_STATUS, RECEPTION_STATUS } from "../constants/index.js";

export const getDashboard = async () => {
  const [
    references,
    deliveries,
    preparation,
    transit,
    arrived,
    received,
    partial,
    issues,
    recentDeliveries,
  ] = await Promise.all([
    Reference.count({ where: { isActive: true } }),
    Delivery.count(),
    Delivery.count({ where: { status: DELIVERY_STATUS.PREPARATION } }),
    Delivery.count({ where: { status: DELIVERY_STATUS.IN_TRANSIT } }),
    Delivery.count({ where: { status: DELIVERY_STATUS.ARRIVED } }),
    Delivery.count({ where: { status: DELIVERY_STATUS.RECEIVED } }),
    Delivery.count({ where: { status: DELIVERY_STATUS.PARTIAL_RECEPTION } }),
    Reception.count({
      where: {
        [Op.or]: [
          { status: RECEPTION_STATUS.WITH_ISSUE },
          { status: RECEPTION_STATUS.PARTIAL },
        ],
      },
    }),
    Delivery.findAll({ limit: 10, order: [["createdAt", "DESC"]] }),
  ]);
  return {
    references,
    deliveries,
    preparation,
    transit,
    arrived,
    received,
    partialReception: partial,
    anomalies: issues,
    recentDeliveries,
  };
};
