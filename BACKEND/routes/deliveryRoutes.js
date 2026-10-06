import { Router } from "express";
import * as c from "../controllers/deliveryController.js";
import { exportDeliveryHistory } from "../controllers/exportController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createDeliveryValidator,
  updateDeliveryValidator,
} from "../validators/deliveryValidators.js";
const router = Router();
router.use(authMiddleware);
router.get("/", c.list);
router.get(
  "/export",
  authorize("ADMIN", "LOGISTIC_MANAGER", "RECEPTION", "VIEWER"),
  exportDeliveryHistory,
);
router.get("/:id", c.getOne);
router.post(
  "/",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  createDeliveryValidator,
  validate,
  c.create,
);
router.patch(
  "/:id",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  updateDeliveryValidator,
  validate,
  c.update,
);
router.delete("/:id", authorize("ADMIN"), c.remove);
export default router;
