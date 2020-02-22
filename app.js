const express = require('express')
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


app.post('/send-sms', (req, res) => {
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

  const { num, msg } = req.body;

  (new SMSAPI).sendSMS(msg, num)
    .then(resp => {
      if (resp.data.result) {
        log.writeLog(`SUCCESS SMS SEND TO: ${num}, ${JSON.stringify(resp.data)}`)
        response.success = true
        response.message = `sended to ${num}`
      }
    })
    .catch(e => {
      log.writeLog(`ERROR! SMS SEND TO: ${num}, ${e.message}`)
      response.message = e ? e.message : null
    })

  res.json(response)
  res.end()
})







app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))