import { Router } from "express";
import * as c from "../controllers/destinationController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { destinationValidator } from "../validators/resourceValidators.js";
const router = Router();
router.use(authMiddleware);
router.get("/", c.list);
router.get("/:id", c.getOne);
router.post(
  "/",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  destinationValidator,
  validate,
  c.create,
);
router.patch(
  "/:id",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  destinationValidator,
  validate,
  c.update,
);
router.delete("/:id", authorize("ADMIN"), c.remove);
export default router;
