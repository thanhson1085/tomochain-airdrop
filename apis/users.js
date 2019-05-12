'use strict'
const express = require('express')
const router = express.Router()
const db = require('../models/mongodb')
const config = require('config')
const logger = require('../helpers/logger')
const { check, validationResult, query } = require('express-validator/check')

router.get('/', [
    query('limit')
        .isInt({ min: 0, max: 200 }).optional().withMessage('limit should greater than 0 and less than 200'),
    query('page').isNumeric({ no_symbols: true }).optional().withMessage('page must be number')
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }

    let limit = (req.query.limit) ? parseInt(req.query.limit) : 200
    let skip
    skip = (req.query.page) ? limit * (req.query.page - 1) : 0
    try {
        return res.json({ })
    } catch (e) {
        return next(e)
    }
})
module.exports = router
