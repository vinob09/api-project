const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Group } = require('../../db/models');

const router = express.Router();

const validateGroup = [
    check('name')
        .isLength({max: 60})
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .isLength({min: 50})
        .withMessage('About must be 50 characters or more'),
    check('type')
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .isBoolean()
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('State is required'),
    handleValidationErrors
];

router.post('/', requireAuth, validateGroup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;

    const newGroup = await Group.create({
        organizerId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    });

    return res.status(201).json(newGroup);
});


module.exports = router;
