'use strict'
const express = require('express')
const router = express.Router()

router.use('/api/users', require('./users'))

module.exports = router
