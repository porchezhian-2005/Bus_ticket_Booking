import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

export const walletPaySchema = Joi.object({
  bookingId: Joi.string().required().custom(objectIdValidator)
}).options({ stripUnknown: true });

export const walletAddMoneySchema = Joi.object({
  amount: Joi.number().positive().required(),
  paymentReference: Joi.string().optional().allow(null, "")
}).options({ stripUnknown: true });

export const walletConfigUpdateSchema = Joi.object({
  maxWalletUsagePercent: Joi.number().min(0).max(100).required()
}).options({ stripUnknown: true });

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
}).options({ stripUnknown: true });
