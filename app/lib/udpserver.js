// udpserver.js
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');
const parentLogger = require('./logger');
const log = parentLogger.logger.child({ module: 'udpsever' });
const { blinkenLedList } = require('./blinkenledlist');
const config = require('config');
const udpServerConfig = config.has('udpserver') ? config.udpserver : { host: '0.0.0.0', port: 2693 };
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    log.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    log.debug(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    if (msg.indexOf('HELO') == 0) {
        blinkenLedList.update(rinfo.address);
    }
});

server.on('listening', () => {
    const address = server.address();
    log.info(`server listening ${address.address}:${address.port}`);
});

server.buildBuffer = function (...theArgs) {
    let argList = [];
    let zBuffer = Buffer.from('/0', 'ASCII');
    for (const arg of theArgs) {
        argList.push(Buffer.from(arg, 'ASCII'));
        argList.push(zBuffer);
    }
    return Buffer.concat(argList);
}

server.sendCommand = function (host, command, ...parameters) {
    log.debug(`sending ${command} to ${host}`);
    const msg = server.buildBuffer(command);
    log.debug(`Message: [${msg}]`);
    server.send(msg, udpServerConfig.port, host );
};

server.bind(udpServerConfig.port, udpServerConfig.host, () => {
    server.setBroadcast(true);
});

module.exports.server = server;