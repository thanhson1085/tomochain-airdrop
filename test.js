const axios = require('axios')


const wallets = require('./wallet.json')

for (let i = 0; i <= 99; i++) {
    axios.post(`http://localhost:3000/api/users/${wallets[i]}/airdrop`, {})
}
