// blinkenLedList.js

const parentLogger = require('./logger');
const log = parentLogger.logger.child({ module: 'bLedList' });
const config = require('config');
const uSConfig = config.has('updateserver') ? config.updateserver : { host: '10.0.0.1', port: 8080 };

function dot2num(dot) {
    var d = dot.split('.');
    return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
}

function num2dot(num) {
    var d = num % 256;
    for (var i = 3; i > 0; i--) {
        num = Math.floor(num / 256);
        d = num % 256 + '.' + d;
    }
    return d;
}

class BlinkenLedList {
    constructor() {
        this.bList = new Map()
    }

    update(bLedIP) {
        const item = {
            ip: bLedIP,
            lastSeen: Date.now()
        }
        this.bList.set(dot2num(item.ip), item);
    }

    getItemsJson() {
        const result = []
        let index = 1
        this.bList.forEach((value, key) => {
            result.push({
                index: index++,
                key: key,
                ip: value.ip,
                lastSeen: `${((Date.now() - value.lastSeen) / 1000)} s`
            })
        });
        return result;
    }

    getItemIp(bLedId) {
        const item = this.bList.get(parseInt(bLedId));
        log.debug(`Key: ${bLedId} Item: ${item}`);
        if (item)
            return item.ip;
        else
            return undefined;
    }

    updateBLed(bLedId) {
        const item = this.bList.get(parseInt(bLedId));
        log.debug(`Key: ${bLedId} Item: ${item}`);
        if (item) {
            const updateUrl = `http://${uSConfig.host}:${uSConfig.port}`;
            fetch(`http://${item.ip}/cmd/UPDT/${uSConfig.host}:${uSConfig.port}`)
            .catch((error) => {log.error(error)});
        }
    }
}

module.exports.blinkenLedList = new BlinkenLedList();