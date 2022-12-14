const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;

const includeUser = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        req.user = null;
        next();
        return;
    }
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findByPk(decoded.id);
    req.user = user;
    req.usre.password = null;
    next();
};

const requireUser = (req, res, next) => {
    if (req.user) {
        req.user.password = null;
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = {
    includeUser, requireUser
};