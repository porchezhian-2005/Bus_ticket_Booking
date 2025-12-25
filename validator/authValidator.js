import Joi from 'joi'; 

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    phone_no: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be exactly 10 digits.',
    }),
    password: Joi.string()
        .min(8)
        .pattern(strongPasswordRegex)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.base': 'Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&).',
        }),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match.',
        }),
});

export const adminRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    phone_no: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be exactly 10 digits.',
    }),
    password: Joi.string()
        .min(8)
        .pattern(strongPasswordRegex)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.base': 'Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&).',
        }),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match.',
        }),
    
    isAdmin: Joi.boolean().optional(),
    
}).options({ stripUnknown: true });

export const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().lowercase().optional(),
    phone_no: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.pattern.base': 'Phone number must be exactly 10 digits.',
    }),
    old_password: Joi.string().min(8).optional(),
    new_password: Joi.string().min(8).optional(),
    confirm_new_password: Joi.string().valid(Joi.ref('new_password')).optional(),
}).min(1).messages({
    'object.min': 'Request body must contain at least one field to update.',
});

export const verifyEmailSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otpCode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
        'string.pattern.base': 'OTP must be a 6-digit numeric code.',
    }),
});
export const sendMobileOtpSchema = Joi.object({
    phone_no: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be exactly 10 digits.',
    }),
});

export const verifyMobileOtpSchema = Joi.object({
    phone_no: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be exactly 10 digits.',
    }),
    otpCode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
        'string.pattern.base': 'OTP must be a 6-digit numeric code.',
    }),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Must be a valid email address.',
        'any.required': 'Email is required to reset the password.'
    })
});



export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    OTP: Joi.string().pattern(/^[0-9]{6}$/).required(),
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
        .required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required()
}).messages({
    "any.only": "New passwords do not match.",
    "string.pattern.base": "OTP must be a 6-digit number."
});

export const deleteUserSchema = Joi.object({
  userId: Joi.string()
    .length(24)
    .required()
    .messages({
      "string.length": "User ID must be a valid 24-character ObjectId.",
      "any.required": "User ID is required to delete the user."
    })
}).options({ stripUnknown: true });





