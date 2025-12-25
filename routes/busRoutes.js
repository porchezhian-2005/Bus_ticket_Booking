

import express from "express";
import  validateRequest  from "../middlewares/validationMiddleware.js";


import { createBusSchema } from "../validator/busValidator.js";
import {
  createBus,
  getAllBuses,
  getBusById,
} from "../controllers/busController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/buses", authMiddleware, validateRequest(createBusSchema), createBus);
router.get("/", getAllBuses);
router.get("/:busId", getBusById);

export default router;



