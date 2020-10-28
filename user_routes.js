const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
// const { body, validationResult } = require('express-validator');

const router = express.Router();

//Import Models 
const User = require('./user_schems');

router.get('/', async (req, res) => {
    try {
        const userData = await User.find({}, '-password -_id');
        res.status(200).json(userData);
    } catch (err) {
        console.error(err)
        res.status(500).json({ "error": err });
    }
    
});

router.post('/', async (req, res) => {
    try {
        // const userData = await User.find({}, '-password -_id');

        console.log("yes")
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json({ "error": err });
    }
    
});


module.exports = router;