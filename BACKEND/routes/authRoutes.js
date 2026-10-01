import { Router } from "express";
import {
  loginController,
  meController,
  registerController,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidators.js";
const router = Router();
router.post("/register", registerValidator, validate, registerController);
router.post("/login", loginValidator, validate, loginController);
router.get("/me", authMiddleware, meController);
export default router;
