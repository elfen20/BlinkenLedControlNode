// blinkenleddefs.mjs

const blMode = {
    Undefined: 0,
    Off: 1,
    NoConfig: 2,
    Static: 3,
    Anim: 4
}

const blAnimation = {
    Pulse: 0,
    Rainbow: 1
}

const blinkenLedDefs = {
    modes : blMode,
    animations : blAnimation
}

export default blinkenLedDefs;