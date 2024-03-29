'use strict'

const kue = require('kue')
const config = require('config')
const fs = require('fs')
const path = require('path')

// fix warning max listener
process.setMaxListeners(1000)

const q = kue.createQueue({
    prefix: config.get('redis.prefix'),
	redis: {
		port: config.get('redis.port'),
		host: config.get('redis.host'),
		auth: config.get('redis.password'),
	}
})
q.setMaxListeners(1000)

fs.readdirSync(path.join(__dirname))
	.filter(function (file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.indexOf('.map') < 0)
	})
	.forEach(function (file) {
		let consumer = require(path.join(__dirname, file))
		q.process(consumer.name, consumer.processNumber || 1, consumer.task)
	})

module.exports = q
