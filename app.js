const express = require('express')
const app = express()
const SMSAPI = require('./api');
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.get('/', (req, res) => {
  res.send(`${SMS_API_ID + ' ' + SMS_API_SECRET}`)
})


app.post('/send-sms', async (req, res) => {
  const response = {
    succsess: false,
    message: ''
  }

  try {
    const smsResponse = await (new SMSAPI).sendSMS('Ваш код: 121212', '380955603067');
    if (smsResponse.data.result) {
      response.succsess = true
    }
  } catch (e) {
    response.message = e.message
  }

  res.json(response)
  res.end()
})






app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))