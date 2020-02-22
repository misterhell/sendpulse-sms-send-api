const axios = require('axios')
const PORT = process.env.PORT

test('Check API work', async done => {
    const resp = await axios.get(`http://127.0.0.1:${PORT}/`)

    expect(resp.data).toMatchObject({ health: true })

    done()
})


test('Check send SMS api func', async done => {
    const resp = await axios.post(`http://127.0.0.1:${PORT}/send-sms`, {
        msg: 'cjjjj',
        num: '9281343448'
    })

    expect(resp.data).toHaveProperty('success', true)

    done()
}, 6000)


test('Validation error num', async (done) => {
    try {
        const resp = await axios.post(`http://127.0.0.1:${PORT}/send-sms`, {
            msg: 'cjjjj'
        })
    }
    catch (e) {
        done()
    }

    // done()
}, 6000)