const mcache = require('memory-cache');

const cache = (durationInSeconds) => {
    return (req, res, next) => {
        // only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = '__express__' + req.originalUrl || req.url;
        const cachedBody = mcache.get(key);

        if (cachedBody) {
            // send from cache
            res.send(cachedBody);
            return;
        } else {
            // override send to save cache
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, durationInSeconds * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

module.exports = cache;
