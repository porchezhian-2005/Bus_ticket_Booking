export const authValidation = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { 
        abortEarly: false, 
        stripUnknown: true 
    });

    if (error) {
        const messages = error.details.map((el) => el.message).join('; ');
        
        return res.status(400).json({ 
            message: 'Validation failed', 
            details: messages 
        });
    }
    
    req.validatedData = req.body; 
    next();
};