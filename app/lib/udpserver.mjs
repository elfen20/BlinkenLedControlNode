// udpserver.js


import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';
import parentLogger from './logger.mjs';
const log = parentLogger.child({ module: 'udpserver' });
import blinkenLedList from './blinkenledlist.mjs';
import config from 'config';
const udpServerConfig = config.has('udpserver') ? config.udpserver : { host: '0.0.0.0', port: 2693, membership: '224.0.0.237' };
const udpServer = dgram.createSocket('udp4');

udpServer.buildBuffer = function (...theArgs) {
    let argList = [];
    let zBuffer = Buffer.from('\u0000', 'utf8');
    log.debug("buildBuffer" + JSON.stringify(theArgs));
    for (const arg of theArgs) {
        argList.push(Buffer.from(arg, 'utf8'));
        argList.push(zBuffer);
    }
    return Buffer.concat(argList);
}

udpServer.decodeBuffer = function (buffer) {
    let argList = [];
    let searchPos = -1;
    while ((searchPos = buffer.indexOf('\u0000')) > -1) {
        let buf = buffer.slice(0, searchPos);
        if (buf.length > 0) argList.push(buf.toString('utf8'));
        buffer = buffer.slice(searchPos + 1, buffer.length);
    }
    if (buffer.length > 0) argList.push(buffer.toString());
    return argList;
}

udpServer.on('error', (err) => {
    log.error(`server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message', (buffer, rinfo) => {
    let msg = udpServer.decodeBuffer(buffer);
    log.debug(`server got: ${JSON.stringify(msg)} from ${rinfo.address}:${rinfo.port}`);
    if (msg.indexOf('HELO') == 0) {
        blinkenLedList.update(rinfo.address);
    }
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    log.info(`udp server listening on ${address.address}:${address.port}`);
});

udpServer.sendCommand = async function (host, ...parameters) {
    log.debug(`sending ${JSON.stringify(parameters)} to ${host}`);
    const msg = udpServer.buildBuffer(...parameters);
    log.debug(`Message: [${msg}]`);
    await udpServer.send(msg, udpServerConfig.port, host);
};

udpServer.bind(udpServerConfig.port, udpServerConfig.host, () => {
    udpServer.setBroadcast(true);
    udpServer.addMembership(udpServerConfig.membership);
});

export default udpServer;