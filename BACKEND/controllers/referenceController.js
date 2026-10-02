import { Reference } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";
import {
  listReferences,
  getReferenceTraceability,
} from "../services/referenceService.js";
import { createHistory } from "../utils/audit.js";

export const list = async (req, res) => {
  const r = await listReferences({ req });
  return successResponse(res, {
    data: r.rows,
    pagination: getPaginationMeta(r),
  });
};
export const getOne = async (req, res) => {
  const item = await Reference.findByPk(req.params.id);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Référence introuvable", errors: [] });
  return successResponse(res, { data: item });
};
export const create = async (req, res) => {
  const item = await Reference.create(req.body);
  await createHistory({
    userId: req.user.id,
    action: "CREATE",
    entity: "Reference",
    entityId: item.id,
    details: { after: item.toJSON() },
    ipAddress: req.ip,
  });
  return successResponse(res, {
    statusCode: 201,
    message: "Référence créée avec succès",
    data: item,
  });
};
export const update = async (req, res) => {
  const item = await Reference.findByPk(req.params.id);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Référence introuvable", errors: [] });
  const before = item.toJSON();
  await item.update(req.body);
  await createHistory({
    userId: req.user.id,
    action: "UPDATE",
    entity: "Reference",
    entityId: item.id,
    details: { before, after: item.toJSON() },
    ipAddress: req.ip,
  });
  return successResponse(res, {
    message: "Référence modifiée avec succès",
    data: item,
  });
};
export const remove = async (req, res) => {
  const item = await Reference.findByPk(req.params.id);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Référence introuvable", errors: [] });
  const before = item.toJSON();
  await item.destroy();
  await createHistory({
    userId: req.user.id,
    action: "DELETE",
    entity: "Reference",
    entityId: item.id,
    details: { before },
    ipAddress: req.ip,
  });
  return successResponse(res, { message: "Référence supprimée avec succès" });
};
export const traceability = async (req, res) =>
  successResponse(res, { data: await getReferenceTraceability(req.params.id) });
