const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Username is required and must be 4 characters or more'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    // destructure body
    const { firstName, lastName, email, username, password } = req.body;

    // check for user with email that exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
        return res.status(500).json({
            message: 'User already exists',
            errors: {
                email: 'User with that email already exists'
            }
        });
    }

    // check for user with email that exists
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
        return res.status(500).json({
            message: 'User already exists',
            errors: {
                username: 'User with that username already exists'
            }
        });
    }

    // hash user provided password
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };
    // call helper fun to set token cookie and login new user session
    await setTokenCookie(res, safeUser);

    return res.status(200).json({
        user: safeUser
    });
});


module.exports = router;
