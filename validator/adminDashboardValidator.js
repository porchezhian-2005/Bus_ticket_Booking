import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) return helpers.message("Invalid ObjectId");
  return value;
};

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(200).optional(),
  search: Joi.string().optional(),
  userId: Joi.string().optional().custom(objectIdValidator),
  busId: Joi.string().optional().custom(objectIdValidator),
  routeId: Joi.string().optional().custom(objectIdValidator),
  status: Joi.string().optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional()
}).options({ stripUnknown: true });

export const idParamSchema = Joi.object({
  id: Joi.string().required().custom(objectIdValidator)
});

export const createBusSchema = Joi.object({
  busName: Joi.string().required(),
  busNumber: Joi.string().required(),
  source: Joi.string().required(),
  destination: Joi.string().required(),
  travelDate: Joi.date().iso().required(),
  totalSeats: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  busType: Joi.string().required(),
  seatsLayout: Joi.array().items(
    Joi.object({ seatNumber: Joi.string().required(), seatType: Joi.string().optional(), basePrice: Joi.number().min(0).required() })
  ).optional()
}).options({ stripUnknown: true });

export const updateBusSchema = Joi.object({
  busName: Joi.string().optional(),
  source: Joi.string().optional(),
  destination: Joi.string().optional(),
  travelDate: Joi.date().iso().optional(),
  totalSeats: Joi.number().integer().min(1).optional(),
  price: Joi.number().min(0).optional(),
  busType: Joi.string().optional(),
  seatsLayout: Joi.array().items(
    Joi.object({ seatNumber: Joi.string().required(), seatType: Joi.string().optional(), basePrice: Joi.number().min(0).required() })
  ).optional()
}).options({ stripUnknown: true });

export const createRouteSchema = Joi.object({
  source: Joi.string().required(),
  destination: Joi.string().required(),
  stops: Joi.array().items(Joi.string()).optional(),
  durationMinutes: Joi.number().integer().optional(),
  distanceKm: Joi.number().optional()
}).options({ stripUnknown: true });

export const updateRouteSchema = Joi.object({
  source: Joi.string().optional(),
  destination: Joi.string().optional(),
  stops: Joi.array().items(Joi.string()).optional(),
  durationMinutes: Joi.number().integer().optional(),
  distanceKm: Joi.number().optional()
}).options({ stripUnknown: true });

export const addStopSchema = Joi.object({
  stop: Joi.string().required()
}).options({ stripUnknown: true });
