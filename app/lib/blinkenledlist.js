// blinkenLedList.js

const parentLogger = require('./logger');
const log = parentLogger.logger.child({ module: 'bLedList' });

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
}

module.exports.blinkenLedList = new BlinkenLedList();