import { Router } from "express";
import * as c from "../controllers/receptionControllers.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { receptionValidator } from "../validators/receptionValidator.js";
const router = Router();
router.use(authMiddleware);
router.get("/", c.list);
router.post(
  "/",
  authorize("ADMIN", "RECEPTION"),
  receptionValidator,
  validate,
  c.create,
);
export default router;
