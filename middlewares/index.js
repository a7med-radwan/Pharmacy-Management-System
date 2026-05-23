const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// 1. Rate Limiting Setup
const limiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per windowMs
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
    global: (app) => {
        // 2. Logging Middleware (Morgan)
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('dev')); // Standard format logging for development
        }

        // 3. Custom Middleware (e.g., Request Timestamp Logger)
        app.use((req, res, next) => {
            req.requestTime = new Date().toISOString();
            console.log(`[CUSTOM MIDDLEWARE] Request to ${req.method} ${req.originalUrl} at ${req.requestTime}`);
            next();
        });

        // Apply rate limiting to all requests
        app.use('/api', limiter); 

        // Built-in express body parser
        app.use(express.json());
    },

    auth: require('./auth')
};