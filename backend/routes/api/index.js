const router = require('express').Router();

const loginRouter = require('./login.js');
const signupRouter = require('./signup.js');
const userRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');

// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// const { requireAuth } = require('../../utils/auth.js');

// if curr user session is valid, set req.user to user in db
// otherwise set req.user to null
router.use(restoreUser);

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/users', userRouter);

// test route handler
router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});


// // test setTokenCookie func
// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
// });

// // test restoreUser func
// router.get(
//     '/restore-user',
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

// // test requireAuth func
// router.get(
//     '/require-auth',
//     requireAuth,
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

module.exports = router;
