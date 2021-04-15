/**
 * @file modules/socket/upload-handler.js
 * @project node-service
 * @author Александр
 * @todo загрузка файлов на сервер
 */

var util = require('../catalog-util');
var join = require('path').join;
var packager = require('mobnius-packager');
var fs = require('fs');
var logjs = require('../log');
var socketUtil = require('./utils');

/**
 * обработчик синхронизации для WebSocket
 * @param {any} req - эмулирование request
 * @param {any} res - эмулирование response
 * @param {any} socket
 */
module.exports = function (in_req, in_res, socket) {
    var root = join(__dirname, '../', '../', 'files');

    return function (version, bytes, tid, start, length) {

        var req = Object.assign({}, in_req);
        var res = Object.assign({}, in_res);

        req.socket = socket;

        var result = socketUtil.transfer(tid);
        var dir = join(root, util.getCatalogName(new Date()).toString());
        util.upload(dir, tid, start, bytes, function (err) {
            if (err) {
                result.data.success = false;
                result.data.msg = err.toString();
                logjs.error('UPLOAD_HANDLER Ошибка загрузки байтов в файл. TID=' + tid + '. ' + result.data.msg);

                result.meta.start = start;
                socket.emit('upload', result);
            } else {
                if ((start + bytes.length) >= length) {
                    var file = join(dir, tid + '.bkp');
                    fs.readFile(file, function (err, buffer) {
                        if (err) {
                            result.data.success = false;
                            result.data.msg = err.toString();
                            logjs.error('UPLOAD_HANDLER Ошибка чтения файла. TID=' + tid + '. ' + result.data.msg);
                            socket.emit('upload', result);
                        } else {
                            buffer = packager.updateStatus(buffer, 1);
                            fs.writeFile(file, buffer, function (err) {
                                if (err) {
                                    result.data.success = false;
                                    result.data.msg = err.toString();
                                    logjs.error('UPLOAD_HANDLER Ошибка обновления статуса файла на 1. TID=' + tid + '. ' + result.data.msg);
                                } else {
                                    result.meta.processed = true;
                                }
                                socket.emit('upload', result);
                            });
                        }
                    });
                } else {
                    result.meta.start = start + bytes.length;
                    socket.emit('upload', result);
                }
            }
        });
    }
}