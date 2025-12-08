import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {isAdmin} from "../middlewares/adminMiddleware.js";
import { adminRegisterSchema, adminLoginSchema } from "../validator/adminValidator.js";
import { viewAdminProfile } from "../controllers/adminController.js"

const router = express.Router();


router.post("/register", validateRequest(adminRegisterSchema), registerAdmin);

router.post("/login", validateRequest(adminLoginSchema), loginAdmin);

router.get("/profile", authMiddleware, isAdmin, viewAdminProfile);

export default router;