const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    keyGenerator: (req, res) => {
        if (req.body.email) return req.body.email;
        return rateLimit.ipKeyGenerator(req);
    },
    handler: (req, res, next, options) => {
        const error = new Error("Anda sudah melakukan reset password hari ini. Silakan coba lagi besok.");
        error.status = 429;
        next(error);
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = limiter