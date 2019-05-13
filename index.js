'use strict'

const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const logger = require('./helpers/logger')
// body parse
const app = express()

app.use(morgan('short', { stream: logger.stream }))

const server = require('http').Server(app)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(validator({}))

// app secret 
app.use((req, res, next) => {
    if (req.headers.authorization !== config.get('appSecret')) {
        return res.status(403).send('Access denied!!!')
    }
    return next()
})

// apis
app.use(require('./apis'))

// error handler
app.use(require('./middlewares/error'))

// start server
server.listen(config.get('server.port'), config.get('server.host'), function () {
    const host = server.address().address
    const port = server.address().port
    console.info('Server start at http://%s:%s', host, port)
})

module.exports = app
