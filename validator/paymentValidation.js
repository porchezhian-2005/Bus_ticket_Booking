
import Joi from "joi";



export const razorpayOrderSchema = Joi.object({
  bookingId: Joi.string().length(24).required(),
  amount: Joi.number().min(1).required(),
  currency: Joi.string().valid("INR").default("INR"),
}).options({ stripUnknown: true });

export const razorpayVerifySchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
}).options({ stripUnknown: true });


export const paymentSchema = Joi.object({
  bookingId: Joi.string()
    .length(24)
    .required()
    .messages({
      "string.length": "Booking ID must be a valid 24-character ObjectId",
      "any.required": "Booking ID is required"
    }),

  amount: Joi.number()
    .min(1)
    .required()
    .messages({
      "number.min": "Amount must be at least 1",
      "any.required": "Payment amount is required"
    }),

  paymentMethod: Joi.string()
    .valid("UPI", "Card", "NetBanking", "Wallet", "Cash", "Razorpay")
    .required()
    .messages({
      "any.only": "Payment method is invalid",
      "any.required": "Payment method is required"
    }),

  transactionId: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "any.required": "Transaction ID is required"
    }),

  status: Joi.string()
    .valid("Pending", "Success", "Failed")
    .default("Pending"),
}).options({ stripUnknown: true });
