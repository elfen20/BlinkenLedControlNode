// blinkenLedList.js

const parentLogger = require('./logger');
const logger = parentLogger.logger.child({ module: 'bLedList' });

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
        const sort = this.bList.values();
        
        sort.forEach((element, index) => {
            result.push({
                index: index + 1,
                ip: element.ip,
                lastSeen: `${((Date.now() - element.lastSeen) / 1000)} s`
            })
        });
        logger.info(result);
        return result;
    }
}

module.exports.blinkenLedList = new BlinkenLedList();