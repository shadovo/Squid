'use strict';

function generateHSLFromString(name = 'deafult') {
    const hash = [...name].reduce((hash, char) => {
        hash = char.charCodeAt() + ((hash << 5) - hash);
        hash &= hash;
        return hash;
    }, 0);

    return {
        hue: hash % 360,
        saturation: 60,
        light: 52
    };
}

function createHSLString(hsl) {
    return `hsl(${hsl.hue},${hsl.saturation}%,${hsl.light}%)`;
}

function createGradientString(hsl = {}, angle = 170, hueDiff = -35) {
    const hsl2 = Object.assign({}, hsl, { hue: (hsl.hue - hueDiff) % 360 });
    return `linear-gradient(${angle}deg,${createHSLString(hsl)} 0%,${createHSLString(hsl2)} 100%)`;
}

function generateColorFromString(name = 'default') {
    return createHSLString(generateHSLFromString(name));
}

function generateGradientFromString(name = 'default', angle, hueDiff) {
    return createGradientString(generateHSLFromString(name), angle, hueDiff);
}

module.exports = {
    generateColorFromString,
    generateGradientFromString
};
