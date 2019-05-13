'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
    address: {
        type: String,
        index: true,
        unique: true
    },
    amount: String,
    amountNumber: { type: Number, index: true },
    tx: { type: String, index: true},
    blockNumber: { type: Number, index: true },
    status: {
        type: String,
        enum: ['SENT', 'ERRORED', 'SENDING'],
        index: true
    }
}, { timestamps: true })

module.exports = mongoose.model('User', User)
