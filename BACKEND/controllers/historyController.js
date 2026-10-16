import { Op } from "sequelize";
import { History, User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

export const list = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.action) where.action = req.query.action;
  if (req.query.entity) where.entity = req.query.entity;
  if (req.query.userId) where.userId = req.query.userId;
  if (req.query.entityId) where.entityId = req.query.entityId;
  if (req.query.search) where.details = { [Op.iLike]: `%${req.query.search}%` };
  const result = await History.findAndCountAll({
    where,
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return successResponse(res, {
    data: result.rows,
    pagination: getPaginationMeta({ ...result, page, limit }),
  });
};
