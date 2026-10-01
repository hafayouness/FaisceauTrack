import { User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";
import { getPaginationMeta } from "../utils/pagination.js";
import { createHistory } from "../utils/audit.js";
import { listUsers, createUser, updateUser } from "../services/userService.js";

const safe = (u) => {
  const x = u.toJSON();
  delete x.password;
  return x;
};
export const list = async (req, res) => {
  const r = await listUsers(req);
  return successResponse(res, {
    data: r.rows,
    pagination: getPaginationMeta(r),
  });
};
export const getOne = async (req, res) => {
  const u = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password"] },
  });
  if (!u)
    return res
      .status(404)
      .json({ success: false, message: "Utilisateur introuvable", errors: [] });
  return successResponse(res, { data: u });
};
export const create = async (req, res) => {
  const u = await createUser(req.body);
  await createHistory({
    userId: req.user.id,
    action: "CREATE",
    entity: "User",
    entityId: u.id,
    details: { after: safe(u) },
    ipAddress: req.ip,
  });
  return successResponse(res, {
    statusCode: 201,
    message: "Utilisateur créé avec succès",
    data: safe(u),
  });
};
export const update = async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u)
    return res
      .status(404)
      .json({ success: false, message: "Utilisateur introuvable", errors: [] });
  const before = safe(u);
  await updateUser(u, req.body);
  await createHistory({
    userId: req.user.id,
    action: "UPDATE",
    entity: "User",
    entityId: u.id,
    details: { before, after: safe(u) },
    ipAddress: req.ip,
  });
  return successResponse(res, {
    message: "Utilisateur modifié avec succès",
    data: safe(u),
  });
};
export const deactivate = async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u)
    return res
      .status(404)
      .json({ success: false, message: "Utilisateur introuvable", errors: [] });
  u.isActive = false;
  await u.save();
  await createHistory({
    userId: req.user.id,
    action: "UPDATE",
    entity: "User",
    entityId: u.id,
    details: { isActive: false },
    ipAddress: req.ip,
  });
  return successResponse(res, { message: "Utilisateur désactivé avec succès" });
};
