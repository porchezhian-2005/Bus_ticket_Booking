import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

export const ticketIdValidator = Joi.object({
  bookingId: Joi.string().required().custom(objectIdValidator, "ObjectId validation")
});
