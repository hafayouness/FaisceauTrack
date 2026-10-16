import { Router } from "express";
import { dashboard } from "../controllers/dashboardControllers.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
const router = Router();
router.use(
  authMiddleware,
  authorize("ADMIN", "LOGISTIC_MANAGER", "RECEPTION", "VIEWER"),
);
router.get("/", dashboard);
export default router;
