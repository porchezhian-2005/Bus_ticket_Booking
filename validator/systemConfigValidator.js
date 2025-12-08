import Joi from "joi";

export const updateWalletConfigSchema = Joi.object({
  maxWalletUse: Joi.number().min(0).max(100).required()
});

export const updateReferralConfigSchema = Joi.object({
  referralReward: Joi.number().min(0).required()
});
