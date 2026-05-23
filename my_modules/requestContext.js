const { AsyncLocalStorage } = require('async_hooks');

const requestContext = new AsyncLocalStorage();

// init context for each request
const contextMiddleware = (req, res, next) => {
    // create simple request id
    const requestId = req.headers['x-request-id'] || Date.now().toString(36) + Math.random().toString(36).substring(2);

    // initial state
    const state = {
        requestId,
        userId: null,
        tenantId: req.headers['x-tenant-id'] || 'default',
        startTime: Date.now()
    };

    // run request inside context
    requestContext.run(state, () => {
        next();
    });
};

// get context anywhere
const getContext = () => requestContext.getStore();

module.exports = {
    requestContext,
    contextMiddleware,
    getContext
};
