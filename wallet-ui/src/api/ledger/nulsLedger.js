import Nuls from "./Nuls";
import Serializers from "nuls-sdk-js/lib/api/serializers";
// import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
const TransportNodeHid = {};
import { ipcRenderer } from "electron";

const NULS_LEDGER_PATH = "44'/60'/0'/0/";

export function requestConnect() {
  console.log(333)
  ipcRenderer.send("requestConnectLedger");
}


const getPath = (index) => {
  console.log(`44'/60'/${index || 0}'/0/0`, "==path==");
  return `44'/60'/${index || 0}'/0/0`;
};

export default class NulsLedger {
  constructor() {
    this.provider = null;
    this.listenConnect()
  }

  listenConnect() {
    ipcRenderer.on("transportInfo", (event, arg) => {
      console.log(event, arg, 3333)
    });
  }

  async getDevice() {
    return await TransportNodeHid.list();
  }

  requestConnect() {
    // ipcRenderer.send("requestBitcoinInfo");
  }

  async connect() {
    const devices = await this.getDevice();
    console.log(devices, "==devices==");
    let transport;
    if (devices && devices.length) {
      const device = devices[0];
      if (!device.opened) {
        await device.open();
      }
      transport = new TransportNodeHid(device);
    } else {
      transport = await TransportNodeHid.open();
    }
    console.log(transport, "--===--transport--===--");
    const provider = new Nuls(transport);
    this.provider = provider;
    return provider;
  }

  async getPublicKey(index, boolDisplay = false) {
    const nulsLedger = await this.connect();
    const path = getPath();
    return await nulsLedger.getPublicKey(path, boolDisplay);
  }

  async getAccounts(pageIndex, pageSize = 5) {
    const from = (pageIndex - 1) * pageSize;
    const to = pageIndex * pageSize;
    const accounts = [];
    for (let i = from; i < to; i++) {
      const path = getPath(i);
      const account = await this.provider.getPublicKey(path);
      accounts.push(account);
    }
    return accounts;
  }

  async getTxHex(tAssemble, i) {
    const nulsLedger = await this.connect();
    let txHex = tAssemble.txSerialize().toString("hex");
    tAssemble.calcHash();
    txHex = txHex.substring(0, txHex.length - 2);
    const { signature } = await nulsLedger.signTransaction(getPath(i), txHex);
    let bw = new Serializers();
    bw.writeBytesWithLength(Buffer.from(signature, "hex"));
    txHex += bw
      .getBufWriter()
      .toBuffer()
      .toString("hex");
    return txHex;
  }

  async signTransaction(tempTxHex, i) {
    const nulsLedger = await this.connect();
    let txHex = tempTxHex.substring(0, tempTxHex.length - 2);
    const { signature } = await nulsLedger.signTransaction(getPath(i), txHex);
    let bw = new Serializers();
    bw.writeBytesWithLength(Buffer.from(signature, "hex"));
    txHex += bw
      .getBufWriter()
      .toBuffer()
      .toString("hex");
    return txHex;
  }

  async signMessage(messageHex, i) {
    const nulsLedger = await this.connect();
    return await nulsLedger.signPersonalMessage(getPath(i), messageHex);
  }
}
