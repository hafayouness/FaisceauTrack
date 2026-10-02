import { Router } from "express";
import * as c from "../controllers/referenceController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { referenceValidator } from "../validators/referenceValidators.js";
const router = Router();
router.use(authMiddleware);
router.get("/", c.list);
router.get("/:id/traceability", c.traceability);
router.get("/:id", c.getOne);
router.post(
  "/",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  referenceValidator,
  validate,
  c.create,
);
router.patch(
  "/:id",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  referenceValidator,
  validate,
  c.update,
);
router.delete("/:id", authorize("ADMIN"), c.remove);
export default router;
