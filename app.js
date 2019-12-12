const express = require('express')
const { check, validationResult } = require('express-validator');
const SMSAPI = require('./api');
const log = require('./log.js')
const PORT = process.env.PORT


const app = express()


app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.get('/', (req, res) => {
  res.json({
    health: true
  })
})


app.post('/send-sms', async (req, res) => {
  const validate = ['msg', 'num']

  const errors = validate
    .filter(k => !req.body.hasOwnProperty(k))
    .map(k => `${k} is rquired`)

  if (errors.length) {
    return res.status(422).json({ errors: errors });
  }


  const response = {
    success: false,
    message: ''
  }

  try {
    const { num, msg } = req.body
    const smsResponse = await (new SMSAPI).sendSMS(msg, num)

    if (smsResponse.data.result) {
      await log.writeLog(`SUCCESS SMS SEND TO: ${num}`)
      response.success = true
      response.message = `sended to ${num}`
    }
  } catch (e) {
    response.message = e ? e.message : null
  }

  res.json(response)
  res.end()
})






app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))