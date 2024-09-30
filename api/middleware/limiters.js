const rateLimit = require("express-rate-limit");

// limit ip requests for login
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // limit each IP to 5 requests per windowMs
    message: {
        msg: "Too many login attempts from this IP, please try again after 10 minutes",
    },
});

const fileLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // limit each IP to 5 requests per windowMs
    message: {
        msg: "Too many upload attempts from this IP, please try again after 10 minutes",
    },
})

module.exports = {
    loginLimiter,
    fileLimiter
}