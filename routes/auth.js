const router = require('express').Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require('../validation');
const { valid } = require('@hapi/joi');
const jwt = require("jsonwebtoken")


router.post("/register", async (req, res) => {
    // LET VALIDATE THE DATA BEFORE BECOME A USER
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    // Checking user existing in db
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exist');
    // Hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser)
    } catch (error) {
        res.status(400).send(err)
    }
})


router.post("/login", async (req, res) => {
    //LET VALIDATION THE DATA USER BEFORE SEND
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check email exist in db
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or Password is not correct')
    // Check password correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send("Email or Password is not correct")
    }
    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send("Login success")
})

module.exports = router;
