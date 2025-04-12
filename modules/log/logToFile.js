var log4js = require('log4js');
var join = require('path').join;

/**
 * объект для логирования данных
 * @type {any}
 */
var logger = null;

if (!logger && process.env.port) {
    log4js.configure({
        appenders: {
            log: {
                type: 'file',
                filename: join(__dirname, '../', '../', 'logs/log-' + process.env.port + '.log'),
                maxLogSize: 1024 * 1024,
                backups: 5,
                compress: true
            }
        },
        categories: {
            default: {
                appenders: ['log'],
                level: process.env.debug ? 'DEBUG' : 'ERROR'
            }
        }
    });

    logger = log4js;
}

/**
 * механизм логирования данных
 * подробнее см. https://www.npmjs.com/package/log4js
 * @todo информация храниться в файловой системе ~/logs/item.log
 * @param {any} options дополнительные опции
 * @returns {any}
 */
module.exports = logger;