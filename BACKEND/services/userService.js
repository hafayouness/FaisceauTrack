import { User } from "../models/index.js";
import { hashPassword } from "../utils/password.js";
import { getPagination } from "../utils/pagination.js";
import { Op } from "sequelize";

export const listUsers = async (req) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.role) where.role = req.query.role;
  if (req.query.isActive !== undefined)
    where.isActive = req.query.isActive === "true";
  if (req.query.search)
    where[Op.or] = [
      { name: { [Op.iLike]: `%${req.query.search}%` } },
      { email: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  const result = await User.findAndCountAll({
    where,
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return { ...result, page, limit };
};

export const createUser = async (data) =>
  User.create({
    ...data,
    email: data.email.toLowerCase(),
    password: await hashPassword(data.password),
  });
export const updateUser = async (user, data) => {
  const payload = { ...data };
  if (payload.email) payload.email = payload.email.toLowerCase();
  if (payload.password) payload.password = await hashPassword(payload.password);
  await user.update(payload);
  return user;
};
