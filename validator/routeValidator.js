import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

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

export const stopSchema = Joi.object({
  stop: Joi.string().required()
}).options({ stripUnknown: true });

export const routeIdSchema = Joi.object({
  id: Joi.string().required().custom(objectIdValidator)
});
