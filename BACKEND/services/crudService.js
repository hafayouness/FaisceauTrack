import { Op } from "sequelize";
import { getPagination } from "../utils/pagination.js";

export const listEntities = async ({
  model,
  req,
  where = {},
  searchFields = [],
  include = [],
  order = [["createdAt", "DESC"]],
}) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search?.trim();
  if (search && searchFields.length) {
    where[Op.or] = searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${search}%` },
    }));
  }
  const { rows, count } = await model.findAndCountAll({
    where,
    include,
    order,
    limit,
    offset,
    distinct: true,
  });
  return { rows, page, limit, count };
};

export const getEntity = (model, id, options = {}) =>
  model.findByPk(id, options);
export const createEntity = (model, data, options = {}) =>
  model.create(data, options);
export const updateEntity = async (model, id, data, options = {}) => {
  const instance = await model.findByPk(id, {
    transaction: options.transaction,
  });
  if (!instance) return null;
  await instance.update(data, options);
  return instance;
};
export const deleteEntity = async (model, id, options = {}) => {
  const instance = await model.findByPk(id, {
    transaction: options.transaction,
  });
  if (!instance) return null;
  await instance.destroy(options);
  return instance;
};
