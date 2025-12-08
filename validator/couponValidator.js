import Joi from "joi";

export const createCouponSchema = Joi.object({
  discountType: Joi.string().valid("flat", "percentage").required(),
  discountValue: Joi.number().positive().required(),

  maxDiscountAmount: Joi.number().positive().optional(),
  minBookingAmount: Joi.number().min(0).optional(),

  maxUsagePerUser: Joi.number().min(1).required(),

  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),

  isActive: Joi.boolean().optional(),
}).options({ stripUnknown: true });

export const applyCouponSchema = Joi.object({
  couponCode: Joi.string().required(),
  bookingAmount: Joi.number().positive().required(),
}).options({ stripUnknown: true });
