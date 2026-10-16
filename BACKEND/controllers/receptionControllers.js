import { Reception, Delivery, Reference, User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";
import { createReception } from "../services/receptionService.js";

export const list = async (req, res) => {
  const where = {};
  if (req.query.deliveryId) where.deliveryId = req.query.deliveryId;
  if (req.query.referenceId) where.referenceId = req.query.referenceId;
  if (req.query.status) where.status = req.query.status;
  const rows = await Reception.findAll({
    where,
    include: [
      { model: Delivery, as: "delivery" },
      { model: Reference, as: "reference" },
      { model: User, as: "receiver", attributes: ["id", "name", "email"] },
    ],
    order: [["receivedAt", "DESC"]],
  });
  return successResponse(res, { data: rows });
};

export const create = async (req, res) =>
  successResponse(res, {
    statusCode: 201,
    message: "Réception enregistrée avec succès",
    data: await createReception({
      ...req.body,
      userId: req.user.id,
      ipAddress: req.ip,
    }),
  });
