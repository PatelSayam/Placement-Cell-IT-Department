import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 30,                   // limit each IP to 30 requests per windowMs
    message: {
        success: false,
        message: 'Too many API requests. Please try again later.'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});
