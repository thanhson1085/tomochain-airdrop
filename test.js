const axios = require('axios')
const config = require('config')
const logger = require('./helpers/logger')

const wallets = require('./wallet.json')

for (let i = 0; i <= 99; i++) {
    axios.post(`http://localhost:3000/api/users/${wallets[i]}/airdrop`, {}, {
        headers: {
            Authorization: config.get('appSecret')
        }
    }).then().catch((e) => logger.error(e))
}
