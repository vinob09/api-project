const router = require('express').Router();

// test route handler
router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});


module.exports = router;
