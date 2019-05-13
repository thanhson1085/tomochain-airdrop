'use strict'
const express = require('express')
const router = express.Router()
const db = require('../models/mongodb')
const config = require('config')
const logger = require('../helpers/logger')
const q = require('../queues')
const { check, validationResult, query } = require('express-validator/check')
const web3 = require('../models/blockchain/web3')

router.get('/:address/status', [
    check('address', 'Address is invalid')
    .exists()
    .custom((value, { req }) => web3.utils.isAddress(value))
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
    check('address', 'Address is invalid')
    .exists()
    .custom((value, { req }) => web3.utils.isAddress(value))
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
