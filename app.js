const express = require('express')
const createError = require('http-errors');
const middlewares = require('./middlewares');
const routes = require('./routes');
const { returnJson } = require('./my_modules/json_response')
global.returnJson = returnJson;

const app = express();

process.on('unhandledRejection', (reason) => {
    console.log(reason);
    process.exit(1);
})

// Middlewares
middlewares.global(app);


// Routes
routes(app);

//Not found Handler
app.use((req, res, next) => {
    const error = createError(404);
    next(error)
});

// // Error Handler
app.use((error, req, res, next) => {
    // res.status(error.statusCode).json({
    //     status: false,
    //     message: error.message
    // });
    return returnJson(res, error.statusCode, false, error.message, null)

});


module.exports = app