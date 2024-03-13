const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post('/', async (req, res) => {
    // destructure body
    const { firstName, lastName, email, password, username } = req.body;
    // hash user provided password
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    // call helper fun to set token cookie and login new user session
    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});


module.exports = router;
