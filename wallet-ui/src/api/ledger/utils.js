
const sha_js_1 = require("sha.js");

// TODO use bip32-path library
export function splitPath(path) {
    var result = [];
    var components = path.split("/");
    components.forEach(function (element) {
        var number = parseInt(element, 10);
        if (isNaN(number)) {
            return; // FIXME shouldn't it throws instead?
        }
        if (element.length > 1 && element[element.length - 1] === "'") {
            number += 0x80000000;
        }
        result.push(number);
    });
    return result;
}

export function hexBuffer(str) {
    return Buffer.from(str.startsWith("0x") ? str.slice(2) : str, "hex");
}


export function maybeHexBuffer(str) {
    if (!str)
        return null;
    return hexBuffer(str);
}
/**
 * @ignore for the README
 *
 * Helper to convert an integer as a hexadecimal string with the right amount of digits
 * to respect the number of bytes given as parameter
 *
 * @param int Integer
 * @param bytes Number of bytes it should be represented as (1 byte = 2 caraters)
 * @returns The given integer as an hexa string padded with the right number of 0
 */
export function intAsHexBytes(int, bytes) {
    return int.toString(16).padStart(2 * bytes, "0");
}

export function foreach(arr, callback) {
    function iterate(index, array, result) {
        if (index >= array.length) {
            return result;
        }
        else {
            return callback(array[index], index).then(function (res) {
                result.push(res);
                return iterate(index + 1, array, result);
            });
        }
    }
    return Promise.resolve().then(function () { return iterate(0, arr, []); });
}

export function hash(data) {
    var hasher = new sha_js_1.sha256();
    hasher.update(data, "utf8");
    return hasher.digest();
}