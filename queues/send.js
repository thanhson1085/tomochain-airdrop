const logger = require('../helpers/logger')
const db = require('../models/mongodb')
const web3 = require('../models/blockchain/web3')
const config = require('config')

var nonce = 0
const consumer = {}
consumer.name = 'send'
consumer.processNumber = 1
consumer.task = async function (job, done) {
    try {
        let { to } = job.data
		nonce = (nonce) ? nonce + 1 : await web3.eth.getTransactionCount(web3.eth.defaultAccount)
        let user = await db.User.findOne({ address: to })
        if (!user) {
            await send({
                nonce,
                to,
                from: web3.eth.defaultAccount,
                value: config.get('airdrop'),
                gasLimit: 21000,
                gasPrice: 250000000,
                chainId: config.get('blockchain.networkId')
            })
        } else {
            logger.info('User %s already processed airdrop', to)
        }
        return done()
    } catch (e) {
        logger.error('Send TOMO error %s', e)
        return done(e)
    }
}

const send = function (obj) {
    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction(obj, function (err, hash) {
            if (err) {
                logger.error(`Send error ${obj.to} nonce ${obj.nonce}`)
                logger.error(String(err))
                logger.error('Sleep 2 seconds and resend until done')
                return sleep(2000).then(() => {
                    return resolve(send(obj))
                })
            } else {
                logger.info('Done %s %s %s %s %s', obj.to, obj.value, hash, 'nonce', obj.nonce)
                return db.User.create({
                    address: obj.to,
                    tx: hash,
                    status: 'SENT'
                }).then(() => {
                    return resolve()
                })
            }
        }).catch(e => { logger.error(e) })
    })
}

module.exports = consumer
