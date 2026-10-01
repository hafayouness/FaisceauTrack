import { History } from "../models/index.js";

export const createHistory = async ({
  userId = null,
  action,
  entity,
  entityId = null,
  details = {},
  ipAddress = null,
  transaction = null,
}) =>
  History.create(
    { userId, action, entity, entityId, details, ipAddress },
    { transaction },
  );
