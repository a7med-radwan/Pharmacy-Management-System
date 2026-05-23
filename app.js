const express = require('express')
const middlewares = require('./middlewares');
const routes = require('./routes');
const { returnJson } = require('./my_modules/json_response');
const AppError = require('./my_modules/AppError');
global.returnJson = returnJson;

const app = express();

process.on('unhandledRejection', (reason) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(reason);
    process.exit(1);
})

// Middlewares
middlewares.global(app);


// Routes
routes(app);

// Not found Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development vs Production Error Responses could be handled here
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // For production, using the global returnJson to hide stack trace
        const message = err.isOperational ? err.message : 'Something went very wrong!';
        return returnJson(res, err.statusCode, false, message, null);
    }
});


module.exports = app