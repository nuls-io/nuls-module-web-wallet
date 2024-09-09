import { ipcRenderer } from 'electron'
// import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import Nuls from "./Nuls";

const getPath = (index) => {
  console.log(`44'/60'/${index || 0}'/0/0`, "==path==");
  return `44'/60'/${index || 0}'/0/0`;
};


// export function registerMainListener(window) {
//   ipcMain.on("WEB_TO_ELECTRON", (event, args) => {
//     console.log('event: ', event)
//     console.log('args: ', args)
//     TransportNodeHid.open().then(transport => {
//       console.log(transport, '333111')
//       window.webContents.send("ELECTRON_TO_WEB", {
//         method: 'connect',
//         channel: transport.channel
//       });
//     });
//   });
// }

export function requestConnect() {
  ipcRenderer.send("WEB_TO_ELECTRON", { method: 'connect' });
}

export function registerWebListener() {
  ipcRenderer.on('ELECTRON_TO_WEB', (event, args) => {
    console.log('event: ', event)
    console.log('args: ', args)
  })
}