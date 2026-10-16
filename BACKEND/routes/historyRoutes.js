import { Router } from "express";
import { list } from "../controllers/historyController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
const router = Router();
router.use(
  authMiddleware,
  authorize("ADMIN", "LOGISTIC_MANAGER", "RECEPTION", "VIEWER"),
);
router.get("/", list);
export default router;
