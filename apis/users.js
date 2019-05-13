'use strict'
const express = require('express')
const router = express.Router()
const db = require('../models/mongodb')
const config = require('config')
const logger = require('../helpers/logger')
const q = require('../queues')
const { check, validationResult, query } = require('express-validator/check')

router.get('/:address/status', [
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }

    try {
        let address = (req.params.address || '').toLowerCase()
        let user = await db.User.findOne({ address: address })
        return res.json(user || {})
    } catch (e) {
        return next(e)
    }
})

router.post('/:address/airdrop', [
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }

    try {
        let address = (req.params.address || '').toLowerCase()
        q.create('send', {
            to: address
        })
            .priority('high').removeOnComplete(true)
            .attempts(5).backoff({ delay: 2000, type: 'fixed' }).save()
        return res.json({
            status: 'OK',
            message: 'Your request is being processed'
        })
    } catch (e) {
        return next(e)
    }
})

module.exports = router
