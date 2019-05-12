'use strict'

const Web3 = require('web3')
const config = require('config')

const provider = new Web3.providers.HttpProvider(config.get('blockchain.rpc'))
const web3 = new Web3(provider)
let account = this.web3.eth.accounts.privateKeyToAccount('0x' + config.get('privateKey'))
web3.eth.accounts.wallet.add(account)
web3.eth.defaultAccount = account.address

module.exports = web3
