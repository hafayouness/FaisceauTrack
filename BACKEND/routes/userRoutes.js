import { Router } from "express";
import * as c from "../controllers/userController.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../validators/validatorUser.js";
const router = Router();
router.use(authMiddleware, authorize("ADMIN"));
router.get("/", c.list);
router.get("/:id", c.getOne);
router.post("/", createUserValidator, validate, c.create);
router.patch("/:id", updateUserValidator, validate, c.update);
router.patch("/:id/deactivate", c.deactivate);
export default router;
