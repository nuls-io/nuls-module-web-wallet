import { splitPath, foreach, } from "./utils";
var CLA = 0xe0;
var INS_GET_CONF = 0x04;
var INS_GET_PK = 0x05;
var INS_SIGN_TX = 0x06;
var INS_SIGN_MESSAGE = 0x07;
var APDU_MAX_SIZE = 150;
var P2_LAST_APDU = 0x80;
var P2_MORE_APDU = 0x00;
var SW_OK = 0x9000;
var SW_CANCEL = 0x6985;
var SW_UNKNOWN_OP = 0x6c24;
var SW_MULTI_OP = 0x6c25;
var SW_NOT_ALLOWED = 0x6c66;
var SW_UNSUPPORTED = 0x6d00;
var SW_BLIND_SIGN = 0xB009;
var SW_KEEP_ALIVE = 0x6e02;
var TX_MAX_SIZE = 30000;
/**
 * Nuls API
 *
 * @example
 * import Nuls from "@ledgerhq/hw-app-nuls";
 * const nuls = new Nuls(transport)
 */
var Nuls = /** @class */ (function () {
    function Nuls(transport, scrambleKey) {
        if (scrambleKey === void 0) { scrambleKey = "nuls0nuls"; }
        this.transport = transport;
        transport.decorateAppAPIMethods(this, ["getAppConfiguration", "getPublicKey", "signTransaction", "signMessage"], scrambleKey);
    }
    Nuls.prototype.getAppConfiguration = function () {
        return this.transport
            .send(CLA, INS_GET_CONF, 0x00, 0x00)
            .then(function (response) {
            var version = "" + response[1] + "." + response[2] + "." + response[3];
            return {
                version: version
            };
        });
    };
    /**
     * get Nuls address for a given BIP 32 path.
     * @param path a path in BIP 32 format
     * @option boolDisplay optionally enable or not the display
     * @return an object with a publicKey, address
     * @example
     * nuls.getPublicKey("44'/60'/0'/0/0", true).then(o => o.address)
     */
    Nuls.prototype.getPublicKey = function (path, boolDisplay) {
        var paths = splitPath(path);
        var buffer = Buffer.alloc(1 + paths.length * 4);
        buffer[0] = paths.length;
        paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        return this.transport
            .send(CLA, INS_GET_PK, boolDisplay ? 0x01 : 0x00, 0x00, buffer)
            .then(function (response) {
            var status = Buffer.from(response.slice(response.length - 2)).readUInt16BE(0);
            if (status === SW_OK) {
                var _response = Buffer.from(response.slice(0, response.length - 2));
                var publicKeyLength = _response[0];
                var addressLength = _response[1 + publicKeyLength];
                return {
                    publicKey: _response.slice(1, 1 + publicKeyLength).toString("hex"),
                    address: _response
                        .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
                        .toString("utf8")
                };
            }
            else {
                throw new Error("Get PublicKey not allowed.");
            }
        });
    };
    /**
     * sign a Nuls transaction.
     *
     * @param path: the BIP32 path to sign the transaction on
     * @param rawTxHex the raw nuls transaction in hexadecimal to sign
     * @return an object with the signature
     * @example
     * nuls.signTransaction("44'/60'/0'/0/0", rawTxHex).then(o => o.signature)
     */
    Nuls.prototype.signTransaction = function (path, rawTxHex) {
        var _this = this;
        var transaction = Buffer.from(rawTxHex, 'hex');
        if (transaction.length > TX_MAX_SIZE) {
            throw new Error("Transaction too large: max = " +
                TX_MAX_SIZE +
                "; actual = " +
                transaction.length);
        }
        var apdus = [];
        var response;
        var paths = splitPath(path);
        var bufferSize = 1 + paths.length * 4;
        var buffer = Buffer.alloc(bufferSize);
        buffer[0] = paths.length;
        paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        var chunkSize = APDU_MAX_SIZE - bufferSize;
        if (transaction.length <= chunkSize) {
            // it fits in a single apdu
            apdus.push(Buffer.concat([buffer, transaction]));
        }
        else {
            // we need to send multiple apdus to transmit the entire transaction
            var chunk = Buffer.alloc(chunkSize);
            var offset = 0;
            transaction.copy(chunk, 0, offset, chunkSize);
            apdus.push(Buffer.concat([buffer, chunk]));
            offset += chunkSize;
            while (offset < transaction.length) {
                var remaining = transaction.length - offset;
                chunkSize = remaining < APDU_MAX_SIZE ? remaining : APDU_MAX_SIZE;
                chunk = Buffer.alloc(chunkSize);
                transaction.copy(chunk, 0, offset, offset + chunkSize);
                offset += chunkSize;
                apdus.push(chunk);
            }
        }
        var statusWords = [SW_OK, SW_CANCEL, SW_UNKNOWN_OP, SW_MULTI_OP, SW_NOT_ALLOWED, SW_UNSUPPORTED, SW_KEEP_ALIVE];
        return foreach(apdus, function (data, i) {
            return _this.transport
                .send(CLA, INS_SIGN_TX, i, i === apdus.length - 1 ? P2_LAST_APDU : P2_MORE_APDU, data, statusWords)
                .then(function (apduResponse) {
                var status = Buffer.from(apduResponse.slice(apduResponse.length - 2)).readUInt16BE(0);
                if (status === SW_OK) {
                    response = apduResponse;
                }
                else if (status === SW_BLIND_SIGN) {
                    throw new Error("Please enable Blind signing in the NULS app Settings");
                }
                else {
                    throw new Error("Transaction approval request was rejected");
                }
            })["catch"](function (e) {
                if (e && e.statusCode === SW_BLIND_SIGN) {
                    throw new Error("Please enable Blind signing in the NULS app Settings");
                }
                throw e;
            });
        }).then(function () {
            var status = Buffer.from(response.slice(response.length - 2)).readUInt16BE(0);
            if (status === SW_OK) {
                var signature = Buffer.from(response.slice(0, response.length - 2));
                return {
                    signature: signature.toString("hex")
                };
            }
            else if (status === SW_BLIND_SIGN) {
                throw new Error("Please enable Blind signing in the NULS app Settings");
            }
            else {
                throw new Error("Transaction approval request was rejected");
            }
        });
    };
    /**
     * sign a message.
     *
     * @param path: the BIP32 path to sign the transaction on
     * @param messageHex message
     * @return an object with the signature
     * @example
     * nuls.signPersonalMessage("44'/60'/0'/0/0", Buffer.from("test").toString("hex")).then(o => o.signature)
     */
    Nuls.prototype.signPersonalMessage = function (path, messageHex) {
        var _this = this;
        var message = Buffer.from(messageHex, "hex");
        var apdus = [];
        var response;
        var paths = splitPath(path);
        var bufferSize = 1 + paths.length * 4 + 4;
        var buffer = Buffer.alloc(bufferSize);
        buffer[0] = paths.length;
        paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        buffer.writeUInt32BE(message.length, 1 + 4 * paths.length);
        var chunkSize = APDU_MAX_SIZE - bufferSize;
        if (message.length <= chunkSize) {
            // it fits in a single apdu
            apdus.push(Buffer.concat([buffer, message]));
        }
        else {
            // we need to send multiple apdus to transmit the entire transaction
            var chunk = Buffer.alloc(chunkSize);
            var offset = 0;
            message.copy(chunk, 0, offset, chunkSize);
            apdus.push(Buffer.concat([buffer, chunk]));
            offset += chunkSize;
            while (offset < message.length) {
                var remaining = message.length - offset;
                chunkSize = remaining < APDU_MAX_SIZE ? remaining : APDU_MAX_SIZE;
                chunk = Buffer.alloc(chunkSize);
                message.copy(chunk, 0, offset, offset + chunkSize);
                offset += chunkSize;
                apdus.push(chunk);
            }
        }
        var statusWords = [SW_OK, SW_CANCEL, SW_UNKNOWN_OP, SW_MULTI_OP, SW_NOT_ALLOWED, SW_UNSUPPORTED, SW_KEEP_ALIVE];
        return foreach(apdus, function (data, i) {
            return _this.transport
                .send(CLA, INS_SIGN_MESSAGE, i, i === apdus.length - 1 ? P2_LAST_APDU : P2_MORE_APDU, data, statusWords)
                .then(function (apduResponse) {
                var status = Buffer.from(apduResponse.slice(apduResponse.length - 2)).readUInt16BE(0);
                if (status === SW_OK) {
                    response = apduResponse;
                }
                else {
                    throw new Error("Transaction approval request was rejected");
                }
            });
        }).then(function () {
            var status = Buffer.from(response.slice(response.length - 2)).readUInt16BE(0);
            if (status === SW_OK) {
                var signature = Buffer.from(response.slice(0, response.length - 2));
                return {
                    signature: signature.toString("hex")
                };
            }
            else {
                throw new Error("Transaction approval request was rejected");
            }
        });
    };
    return Nuls;
}());
export default Nuls;
//# sourceMappingURL=Nuls.js.map