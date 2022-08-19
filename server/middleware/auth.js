const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const includeUser = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        req.user = null;
        next();
        return;
    }
    const decoded = jwt.verify(token, config.secret);

    const user = await User.findByPk(decoded.userID);
    req.user = user;
    next();

};

const requireUser = (req, res, next) => {
    if (req.user) {
        req.user.password = null;
        next();
    } else {
        res.json({ status: 401, message: "Unauthorized" });
    }
};

module.exports = {
    includeUser, requireUser
};