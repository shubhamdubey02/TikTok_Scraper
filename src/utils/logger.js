const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const getLogger = (scraperName) => {
    return createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => `${timestamp} [${scraperName}] [${level}]: ${message}`)
        ),
        transports: [
            new transports.File({
                filename: path.join(logDirectory, `${new Date().toISOString().split('T')[0]}_${scraperName}.log`),
                maxsize: 5 * 1024 * 1024, // 5MB per file
                maxFiles: 3,
                tailable: true
            }),
            new transports.Console()
        ]
    });
};

module.exports = getLogger;
