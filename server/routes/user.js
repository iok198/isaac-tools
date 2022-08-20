const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { User } = require("../models");
const config = require("../config/auth.config");
const { includeUser, requireUser } = require("../middleware/auth");

router.use(includeUser);

router.post("/signup", async (req, res) => {
    const username = req.body.username;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ 
        username: username,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.password = null;
    res.json(user);
});

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const errorMessage = "Incorrect username or password";
    const user = await User.findOne({ where: { username } });

    if (!user) {
        return res.status(400).json({ message: errorMessage });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
        return res.status(400).json({ message: errorMessage });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    res.cookie("token", token, { maxAge: 86400 * 1000, httpOnly: true });
    res.json({ message: "Login successful" });
});


router.get("/me", requireUser, (req, res) => {
    res.json(req.user);
});

module.exports = router;
