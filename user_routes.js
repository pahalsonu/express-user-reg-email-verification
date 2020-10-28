const express = require("express");
const app = express();
const { body, validationResult } = require('express-validator');
const config = require('./config/index.json')
const bcrypt = require("bcrypt");
// const { body, validationResult } = require('express-validator');
const randomString = require('randomString')
const router = express.Router();
const nodemailer = require("nodemailer");
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

router.post('/', [
    body('firstName', "First Name is Required").notEmpty(),
    body('lastName', "Last Name is required").isString(),
    body('email', "Enter Valid Email").isEmail(),
    body('password', "Enter Password").isLength({ min: 6 }),
    body('password2', "Password Do Not Match").custom((value, { req }) => {
        if (value === req.body.password) {
            return true;
        } else {
            return false;
        }
    }),
],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let { firstName, lastName, email, password } = req.body;
            console.log(req.body.email)
            const user = await User.findOne({ email: email });
            console.log(user)
            if (user) {
                return res.status(401).json({ "Error": "User account is already existed" });

            }
            //salting password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            password = await bcrypt.hash(password, salt);
            const token = randomString.generate();

            const userData = {
                email, password, lastName, firstName, token
            };

            const newUser = new User(userData);
            await newUser.save();

            res.status(200).json({ "Success": "User Registered" });

            let transporter = nodemailer.createTransport({

                host: "mail.pahalsonu.com",
                port: 465,
                secure: true,
                auth: {
                    user: config.EMAIL_USERNAME,
                    pass: config.EMAIL_PASSWORD,
                }
            });
            transporter.sendMail({
                from: '"pahal" <pahal@pahalsonu.com>', // sender address
                to: `pahalsonu@gmail.com, ${email}`, // list of receivers
                subject: `User Verification at pahalsonu.com`, // Subject line
                html: `
                <p> Thank You creating account with us , copy following link and paste in your borwser -  'localhost:5000/users/verify/${token}'
                </p> <b><a href='localhost:5000/users/verify/${token}'> Click Here to Verify </a>  </b>
              `,
            }).then((info) => {
                console.log("Message sent: %s", info.messageId);
                res.redirect('/');
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ "error": err });
        }

    });

    router.all('/verify/:token', async (req, res) => {
        try {
          // console.log()
          await User.findOneAndUpdate(
            { token: req.params.token },
            { $set: { verified: true } }
          );
          res.send(`<h1> You have successfully verify your account, Enjoy 300 $ credit for upcoming three months, commmon man just kidding</h1>`)
      
        } catch (err) {
          res.status(500).json({ "Error": "Server Error" });
        }
      })
      


module.exports = router;