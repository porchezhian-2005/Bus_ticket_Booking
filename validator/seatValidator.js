import Joi from 'joi';

export const singleSeatSchema = Joi.object({
  busId: Joi.string().length(24).required(),
  seatNumber: Joi.string().max(5).required(),
  seatType: Joi.string().valid('Sleeper - Upper', 'Sleeper - Lower', 'Seater', 'Window').required(),
  basePrice: Joi.number().min(0).required(),
  status: Joi.string().valid('Available', 'Reserved', 'Booked').default('Available'),
  travelDate: Joi.date().iso().required(),
});

export const multipleSeatSchema = Joi.object({
  seats: Joi.array().items(singleSeatSchema).min(1).required(),
}).options({ stripUnknown: true });
