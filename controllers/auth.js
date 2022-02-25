const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email,
                password: hashedPw,
                name
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                userId: result._id
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.login = (req, res, next) => {
    const email = rew.body.email;
    const password = req.body.password;
    let loadedUser;
    User.fondOne({ email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email was not found!');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Password is incorrect');
                error.statusCode = 401;
                throw error;
            }
            
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}