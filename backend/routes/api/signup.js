const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post('/', async (req, res) => {
    // destructure body
    const { firstName, lastName, email, username, password } = req.body;

    // check for empty fields/body validation errors
    if (!email || !username || !firstName || !lastName) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: {
                email: 'Invalid email',
                username: 'Username is required',
                firstName: 'First Name is required',
                lastName: 'Last Name is required'
            }
        });
    }

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
