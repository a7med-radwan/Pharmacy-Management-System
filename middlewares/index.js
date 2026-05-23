const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { contextMiddleware, getContext } = require('../my_modules/requestContext');

// 1. Advanced Rate Limiting Setup
// Global Rate Limiting by IP
const globalLimiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate Limiting by Tenant or User (using AsyncLocalStorage Context)
const tenantUserLimiter = rateLimit({
    max: 500, // 500 requests per tenant/user per 15 min
    windowMs: 15 * 60 * 1000,
    keyGenerator: (req, res) => {
        // Use AsyncLocalStorage to get tenant or use IP as fallback
        const context = getContext();
        if (context && context.userId) return context.userId.toString();
        if (context && context.tenantId) return context.tenantId;
        return req.ip; 
    },
    message: 'Too many requests for this user or tenant.',
});

// Sensitive Endpoint Limiter (e.g., for /login)
const authLimiter = rateLimit({
    max: 5, // Only 5 requests per IP
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many login attempts, please try again in an hour.'
});


module.exports = {
    global: (app) => {
        // --- 1. Request Context (Must be early to track everything) ---
        app.use(contextMiddleware);

        // --- 2. Security Headers (Helmet) ---
        app.use(helmet()); // Sets various HTTP headers to secure the app

        // --- 3. Cross-Origin Resource Sharing (CORS) ---
        // Allow specific origins or all (default is all)
        app.use(cors());

        // --- 4. Performance: Compression ---
        // Compresses response bodies (gzip/deflate) to decrease size
        app.use(compression());

        // --- 5. Logging Middleware (Morgan) ---
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('dev')); 
        }

        // Custom Context Logger using AsyncLocalStorage
        app.use((req, res, next) => {
            const context = getContext();
            console.log(`[REQ ID: ${context.requestId}] [TENANT: ${context.tenantId}] ${req.method} ${req.originalUrl}`);
            next();
        });

        // --- 6. Rate Limiters ---
        // Apply IP global limiter to all routes
        app.use('/api', globalLimiter); 
        // Apply Tenant/User limiter (can be applied to specific routes, here we apply globally as example)
        app.use('/api', tenantUserLimiter);

        // --- 7. Body Size Limits ---
        // Protects against large payloads (e.g. DoS by sending a huge JSON)
        app.use(express.json({ limit: '10kb' })); 
        app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    },

    authLimiter,
    auth: require('./auth')
};