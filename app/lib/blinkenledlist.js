// blinkenLedList.js

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
        return Array.from(this.bList.values());
    }
}

module.exports.blinkenLedList = new BlinkenLedList();