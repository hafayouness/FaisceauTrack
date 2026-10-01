import { successResponse } from "../utils/apiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";
import {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../services/crudService.js";
import { createHistory } from "../utils/audit.js";

export const buildCrudController = ({
  model,
  entity,
  searchFields = [],
  include = [],
  order,
  createMap = (body) => body,
  updateMap = (body) => body,
  roleGuard = null,
}) => ({
  list: async (req, res) => {
    const result = await listEntities({
      model,
      req,
      searchFields,
      include,
      order,
    });
    return successResponse(res, {
      data: result.rows,
      pagination: getPaginationMeta(result),
    });
  },
  getOne: async (req, res) => {
    const item = await getEntity(model, req.params.id, { include });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: `${entity} introuvable`, errors: [] });
    return successResponse(res, { data: item });
  },
  create: async (req, res) => {
    const item = await createEntity(model, createMap(req.body, req));
    await createHistory({
      userId: req.user.id,
      action: "CREATE",
      entity,
      entityId: item.id,
      details: { after: item.toJSON() },
      ipAddress: req.ip,
    });
    return successResponse(res, {
      statusCode: 201,
      message: `${entity} créé avec succès`,
      data: item,
    });
  },
  update: async (req, res) => {
    const before = await getEntity(model, req.params.id);
    if (!before)
      return res
        .status(404)
        .json({ success: false, message: `${entity} introuvable`, errors: [] });
    const item = await updateEntity(
      model,
      req.params.id,
      updateMap(req.body, req),
    );
    await createHistory({
      userId: req.user.id,
      action: "UPDATE",
      entity,
      entityId: item.id,
      details: { before: before.toJSON(), after: item.toJSON() },
      ipAddress: req.ip,
    });
    return successResponse(res, {
      message: `${entity} modifié avec succès`,
      data: item,
    });
  },
  remove: async (req, res) => {
    const item = await deleteEntity(model, req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: `${entity} introuvable`, errors: [] });
    await createHistory({
      userId: req.user.id,
      action: "DELETE",
      entity,
      entityId: item.id,
      details: { before: item.toJSON() },
      ipAddress: req.ip,
    });
    return successResponse(res, {
      message: `${entity} supprimé avec succès`,
      data: null,
    });
  },
});
