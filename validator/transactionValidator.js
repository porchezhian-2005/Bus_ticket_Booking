
import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

export const transactionFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  userId: Joi.string().optional().custom(objectIdValidator),
  bookingId: Joi.string().optional().custom(objectIdValidator),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
  paymentMethod: Joi.string().valid("wallet", "gateway", "mixed", "cash").optional(),
  paymentStatus: Joi.string().valid("pending", "paid", "failed", "refunded", "partial").optional(),
}).options({ stripUnknown: true });

export const walletTransactionFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  userId: Joi.string().optional().custom(objectIdValidator),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
  type: Joi.string().valid("credit", "debit", "refund").optional(),
}).options({ stripUnknown: true });

export const reportFilterSchema = Joi.object({
  from: Joi.date().iso().required(),
  to: Joi.date().iso().required(),
}).options({ stripUnknown: true });
