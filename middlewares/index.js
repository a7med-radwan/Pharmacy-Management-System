const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { contextMiddleware, getContext } = require('../my_modules/requestContext');

// global ip limit
const globalLimiter = rateLimit({
    max: 100, // max 100 request
    windowMs: 15 * 60 * 1000, // 15 mins
    message: 'Too many requests, try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// limit by user or tenant
const tenantUserLimiter = rateLimit({
    max: 500, 
    windowMs: 15 * 60 * 1000,
    keyGenerator: (req, res) => {
        const context = getContext();
        if (context && context.userId) return context.userId.toString();
        if (context && context.tenantId) return context.tenantId;
        return req.ip; // fallback to ip
    },
    message: 'Too many requests for this user.',
});

// login limit
const authLimiter = rateLimit({
    max: 5, 
    windowMs: 60 * 60 * 1000, 
    message: 'Too many login attempts.'
});

module.exports = {
    global: (app) => {
        // init context
        app.use(contextMiddleware);

        // security headers
        app.use(helmet()); 

        // cors
        app.use(cors());

        // compress responses
        app.use(compression());

        // logging
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('dev')); 
        }

        // log with context
        app.use((req, res, next) => {
            const context = getContext();
            console.log(`[ID: ${context.requestId}] ${req.method} ${req.originalUrl}`);
            next();
        });

        // apply limiters
        app.use('/api', globalLimiter); 
        app.use('/api', tenantUserLimiter);

        // body size limit
        app.use(express.json({ limit: '10kb' })); 
        app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    },

    authLimiter,
    auth: require('./auth')
};