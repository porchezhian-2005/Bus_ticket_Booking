
import Joi from "joi";

export const applyReferralSchema = Joi.object({
  referralCode: Joi.string().trim().required()
});

export const referralIdSchema = Joi.object({
  id: Joi.string().required()
});
