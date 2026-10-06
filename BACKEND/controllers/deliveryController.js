import { successResponse } from "../utils/apiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";
import {
  listDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from "../services/deliveryService.js";

export const list = async (req, res) => {
  const r = await listDeliveries(req);
  return successResponse(res, {
    data: r.rows,
    pagination: getPaginationMeta(r),
  });
};
export const getOne = async (req, res) => {
  const item = await getDelivery(req.params.id);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Livraison introuvable", errors: [] });
  return successResponse(res, { data: item });
};
export const create = async (req, res) =>
  successResponse(res, {
    statusCode: 201,
    message: "Livraison créée avec succès",
    data: await createDelivery({
      data: req.body,
      userId: req.user.id,
      ipAddress: req.ip,
    }),
  });
export const update = async (req, res) =>
  successResponse(res, {
    message: "Livraison modifiée avec succès",
    data: await updateDelivery({
      id: req.params.id,
      data: req.body,
      userId: req.user.id,
      ipAddress: req.ip,
    }),
  });
export const remove = async (req, res) => {
  await deleteDelivery({
    id: req.params.id,
    userId: req.user.id,
    ipAddress: req.ip,
  });
  return successResponse(res, { message: "Livraison supprimée avec succès" });
};
