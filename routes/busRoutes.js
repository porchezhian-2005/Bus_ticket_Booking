import express from "express";
import { searchBus } from "../controllers/busController.js";

const busRoutes = express.Router();

busRoutes.get("/search", searchBus);

export default busRoutes;
