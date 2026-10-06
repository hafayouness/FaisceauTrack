import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import referenceRoutes from "./referenceRoutes.js";
import destinationRoutes from "./destinationRoutes.js";
import transporterRoutes from "./transporterRoutes.js";
import trailerRoutes from "./trailerRoutes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/references", referenceRoutes);
router.use("/destinations", destinationRoutes);
router.use("/transporters", transporterRoutes);
router.use("/trailers", trailerRoutes);

export default router;
