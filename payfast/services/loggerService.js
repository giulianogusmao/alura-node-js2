const winston = require('winston');
const fs = require('fs');
const path = 'logs';

if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}

module.exports = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: `${path}/payfast.log`,
            maxsize: 1048576,
            maxFiles: 10,
            colorize: false
        })
    ]
});
