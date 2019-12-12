const fs = require('fs')
const { logFile } = require('./params')

module.exports = new class {
    writeLog(data) {
        return this.write(this.parseData(data))
    }

    write(str) {
        return new Promise((resolve, reject) => {
            // create file or add to end of file
            const params = { flag: 'a+' }

            fs.writeFile(logFile, str, params, (err, data) => {
                if (!err) {
                    resolve()
                }
                reject()
            })
        })
    }


    parseData(data) {
        // stringify if not string
        data = typeof data === 'string' ? data : JSON.stringify(data)
        // date, data string, new line
        return `${this.getDate()} ${data}\n`
    }


    // create date 2019-12-09 21:41:53
    getDate() {
        let dateObj = new Date(),
            // current date
            // adjust 0 before single digit date
            date = ("0" + dateObj.getDate()).slice(-2),
            // current month
            month = ("0" + (dateObj.getMonth() + 1)).slice(-2),
            // current year
            year = dateObj.getFullYear(),
            // current hours
            hours = dateObj.getHours(),
            // current minutes
            minutes = dateObj.getMinutes(),
            // current seconds
            seconds = dateObj.getSeconds();

        const dateString = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
        return `[${dateString}]`
    }

}