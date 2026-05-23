const { AsyncLocalStorage } = require('async_hooks');

// Create a new instance of AsyncLocalStorage
const requestContext = new AsyncLocalStorage();

// Middleware to initialize context per request
const contextMiddleware = (req, res, next) => {
    // Generate a simple request ID (in production, use a UUID library like 'uuid' or 'crypto.randomUUID()')
    const requestId = req.headers['x-request-id'] || Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Initial state to store in the context
    const state = {
        requestId,
        userId: null,   // Can be populated later by auth middleware
        tenantId: req.headers['x-tenant-id'] || 'default', // Example for multi-tenancy
        startTime: Date.now()
    };

    // Run the rest of the request within this context
    requestContext.run(state, () => {
        next();
    });
};

// Helper function to get the current context anywhere in the app
const getContext = () => requestContext.getStore();

module.exports = {
    requestContext,
    contextMiddleware,
    getContext
};
