import { Router } from "express";
import * as c from "../controllers/trailerController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { trailerValidator } from "../validators/resourceValidators.js";
const router = Router();
router.use(authMiddleware);
router.get("/", c.list);
router.get("/:id", c.getOne);
router.post(
  "/",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  trailerValidator,
  validate,
  c.create,
);
router.patch(
  "/:id",
  authorize("ADMIN", "LOGISTIC_MANAGER"),
  trailerValidator,
  validate,
  c.update,
);
router.delete("/:id", authorize("ADMIN"), c.remove);
export default router;
