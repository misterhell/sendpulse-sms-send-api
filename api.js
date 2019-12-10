const axios = require('axios')
const fs = require('fs').promises
const log = require('./log.js')
const { tokenFile } = require('./params')

const {
    SENDPULSE_SMS_API_ID,
    SENDPULSE_SMS_API_SECRET,
    SENDPULSE_SMS_API_AUTH,
    SENDPULSE_SMS_API_SEND_SMS,
    SENDPULSE_SENDER,
    SENDPULSE_TRANSLITERATION,
    SENDPULSE_EMULATION
} = process.env

class SmsAPI {

    token = null

    async sendSMS(text, number) {
        const res = await this.getBearerToken()

        return axios.post(
            SENDPULSE_SMS_API_SEND_SMS,
            {
                phones: [
                    number
                ],
                body: text,
                sender: SENDPULSE_SENDER,
                transliterate: SENDPULSE_TRANSLITERATION,
                emulate: SENDPULSE_EMULATION
            },
            this.createRequestHeaders()
        )
    }


    // take token from tmp file or load new from auth server if old token is expired
    // then save loaded token to tmp file
    async getBearerToken() {
        try {
            const tokenFileData = await fs.readFile(tokenFile)

            if (tokenFileData.toString()) {
                const tokenData = JSON.parse(tokenFileData.toString())
                const dateNow = Date.now()
                if (tokenData.expires > dateNow) {
                    this.token = tokenData
                    return this.token
                }
            }
            const r = await axios.post(SENDPULSE_SMS_API_AUTH, {
                client_id: SENDPULSE_SMS_API_ID,
                client_secret: SENDPULSE_SMS_API_SECRET,
                grant_type: 'client_credentials',
            })

            const token = r.data
            token.expires = Date.now() + (+token.expires_in || 0) * 1000
            this.token = token
            await this.saveTokenToFile(this.token)

            return this.token = token
        } catch (e) {
            await log.writeLog(`Error: ${e.message}`)
        }
    }

    // save new token to file
    async saveTokenToFile(token) {
        try {
            await fs.writeFile(tokenFile, JSON.stringify(token))
            await log.writeLog('api token requests successfully')
        }
        catch (e) {
            await log.writeLog(`Error: ${e.message}`)
        }
    }


    createRequestHeaders() {
        return {
            headers: { 'Authorization': `${this.token.token_type} ${this.token.access_token}` }
        }
    }
}

module.exports = SmsAPI