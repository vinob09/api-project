const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

// Log in
router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    // find user based on username or email
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    // if user is not found or passwords do not match, throw error
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.stack = process.env.NODE_ENV !== 'production' ? err.stack : null
        err.errors = { message: 'Invalid credentials' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };
    // call helper func to set token cookie if login attempt successful
    await setTokenCookie(res, safeUser);

    return res.status(200).json({
        user: safeUser
    });
});


// Log out
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});


module.exports = router;
