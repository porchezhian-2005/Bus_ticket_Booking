import Joi from 'joi';


export const passengerDetailsSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(1).max(100).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
});

export const seatRequestSchema = Joi.object({
  seatNumber: Joi.string().max(5).required(),
  basePrice: Joi.number().min(0).required(),
});

export const createBookingSchema = Joi.object({
  busId: Joi.string().length(24).required(),
  travelDate: Joi.date().iso().required(),

  seats: Joi.array().items(seatRequestSchema).min(1).required(),

  passengers: Joi.array().items(passengerDetailsSchema)
    .min(1)
    .required()
    .custom((value, helpers) => {
      if (value.length !== helpers.state.ancestors[0].seats.length) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Number of passengers must match number of seats."
    }),

  totalAmount: Joi.number().min(0).optional(),
}).options({ stripUnknown: true });
