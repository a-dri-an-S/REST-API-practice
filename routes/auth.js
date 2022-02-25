const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email', 'Please enter a valid email!')
        .isEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists!')
                    }
                })
        })
        .normalizeEmail(),
    body('password', 'Password must be 5 characters minimum.')
        .trim()
        .isLength({ min: 5 }),
    body('name', 'Please enter a name.')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

module.exports = router;