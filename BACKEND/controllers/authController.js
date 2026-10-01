import { login, me, register } from "../services/authService.js";
import { successResponse } from "../utils/apiResponse.js";
import { createHistory } from "../utils/audit.js";

export const registerController = async (req, res) => {
  const result = await register(req.body, req.user || null);

  await createHistory({
    userId: result.user.id,
    action: "CREATE",
    entity: "User",
    entityId: result.user.id,
    details: {
      email: result.user.email,
      role: result.user.role,
    },
    ipAddress: req.ip,
  });

  return successResponse(res, {
    statusCode: 201,
    message: "Utilisateur créé avec succès",
    data: result,
  });
};

export const loginController = async (req, res) => {
  const result = await login(req.body);

  await createHistory({
    userId: result.user.id,
    action: "LOGIN",
    entity: "User",
    entityId: result.user.id,
    details: {
      email: result.user.email,
    },
    ipAddress: req.ip,
  });

  return successResponse(res, {
    message: "Connexion réussie",
    data: result,
  });
};

export const meController = async (req, res) =>
  successResponse(res, {
    data: me(req.user),
  });
