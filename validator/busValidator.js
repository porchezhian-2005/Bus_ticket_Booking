import Joi from "joi";

export const createBusSchema = Joi.object({
  routeId: Joi.string().length(24).required(),
  busType: Joi.string().required(),
  operatorName: Joi.string().optional(),
  departureTime: Joi.date().iso().required(),
  arrivalTime: Joi.date().iso().optional(),
  duration: Joi.number().optional(),
  baseFare: Joi.number().min(0).required(),
  totalSeats: Joi.number().min(1).required(),
}).options({ stripUnknown: true });
export const busSchema = Joi.object({
  busName: Joi.string().required(),
  busNumber: Joi.string().required(),
  source: Joi.string().required(),
  destination: Joi.string().required(),
  totalSeats: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
  busType: Joi.string().valid("AC", "NON-AC", "Sleeper", "Seater").required()
});



