import { successResponse } from "../utils/apiResponse.js";
import { getDashboard } from "../services/dashboardService.js";
export const dashboard = async (req, res) =>
  successResponse(res, { data: await getDashboard() });
