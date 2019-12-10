const axios = require('axios')
const PORT = process.env.PORT

test('Check API work', async done => {
    const resp = await axios.get(`http://127.0.0.1:${PORT}/`)

    expect(resp.data).toMatchObject({ health: true })

    done()
})