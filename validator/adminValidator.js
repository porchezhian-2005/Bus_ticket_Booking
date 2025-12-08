import Joi from "joi";


export const adminRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string()
    .email()
    .lowercase()   
    .required(),

  phone_no: Joi.string()
    .pattern(/^[0-9]{10}$/)  
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits"
    }),

  password: Joi.string()
    .min(8) 
    .pattern(/[A-Z]/)   
    .pattern(/[a-z]/)   
    .pattern(/[0-9]/)   
    .pattern(/[!@#$%^&*(),.?":{}|<>]/) 
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
}).options({ stripUnknown: true });


export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}).options({ stripUnknown: true });
