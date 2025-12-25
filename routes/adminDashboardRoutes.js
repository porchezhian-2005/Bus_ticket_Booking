import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";

import {
  createRouteSchema,
  updateRouteSchema,
  idParamSchema,
  paginationSchema,
  addStopSchema
} from "../validator/adminDashboardValidator.js";

import { busSchema } from "../validator/busValidator.js";

import {
  createBus,
  updateBus,
  deleteBus,
  createRoute,
  updateRoute,
  deleteRoute,
  addStopToRoute,
  getBookings,
  getAnalytics
} from "../controllers/adminDashboardController.js";

const adminDashboardrouter = express.Router();

// ---------------- BUS MANAGEMENT ----------------
adminDashboardrouter.post(
  "/bus",
  authMiddleware,
  isAdmin,
  validateRequest(busSchema),
  createBus
);

adminDashboardrouter.put(
  "/bus/:id",
  authMiddleware,
  isAdmin,
  validateRequest(idParamSchema, "params"),
  validateRequest(busSchema),
  updateBus
);

adminDashboardrouter.delete(
  "/bus/:id",
  authMiddleware,
  isAdmin,
  validateRequest(idParamSchema, "params"),
  deleteBus
);

// ---------------- ROUTE MANAGEMENT ----------------
adminDashboardrouter.post(
  "/route",
  authMiddleware,
  isAdmin,
  validateRequest(createRouteSchema),
  createRoute
);

adminDashboardrouter.put(
  "/route/:id",
  authMiddleware,
  isAdmin,
  validateRequest(idParamSchema, "params"),
  validateRequest(updateRouteSchema),
  updateRoute
);

adminDashboardrouter.delete(
  "/route/:id",
  authMiddleware,
  isAdmin,
  validateRequest(idParamSchema, "params"),
  deleteRoute
);

adminDashboardrouter.post(
  "/route/:id/stops",
  authMiddleware,
  isAdmin,
  validateRequest(idParamSchema, "params"),
  validateRequest(addStopSchema),
  addStopToRoute
);

// ---------------- BOOKINGS & ANALYTICS ----------------
adminDashboardrouter.get(
  "/bookings",
  authMiddleware,
  isAdmin,
  validateRequest(paginationSchema, "query"),
  getBookings
);

adminDashboardrouter.get(
  "/analytics",
  authMiddleware,
  isAdmin,
  getAnalytics
);

export default adminDashboardrouter;
