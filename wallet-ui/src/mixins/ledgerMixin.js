import { ipcRenderer } from "electron";

export default {
  data() {
    this.handler = null
    this.requestBody = {}
    return {
      ledgerVisible: false
    }
  },
  methods: {
    sendMessageToElectron(message, handler) {
      if (this.handler) {
        this._removeListener()
      }
      this.requestBody = message
      this.handler = handler
      this._addListener()
      console.log(message, 34, this.handler)
      ipcRenderer.send('WEB_TO_ELECTRON', {
        method: message.method,
        data: message.data
      })
    },
    _addListener() {
      ipcRenderer.on("ELECTRON_TO_WEB", this._handleMessage);
    },
    _removeListener() {
      console.log(2222)
      ipcRenderer.removeListener('ELECTRON_TO_WEB', this._handleMessage)
      this.handler = null
      this.requestBody = {}
    },
    _handleMessage(event, args) {
      console.log("event: ", event);
      console.log("args: ", args);
      const { method, error } = args;
      const result = args.result || ''
      if (method === this.requestBody.method) {
        if (error) {
          this.$message({message: error.message, type: 'error', duration: 2000});
        }
        this.ledgerVisible = false
        console.log(this.handler, '--=--=')
        this.handler({
          success: !error,
          result
        })
      }
    },
    requestAccount(data, handler) {
      this.sendMessageToElectron({ method: 'requestAccount', data }, handler)
    },
    requestSignTx(data, handler) {
      this.sendMessageToElectron({ method: 'signTransaction', data }, handler)
    },
    async signByLedger(hex, pathIndex, handler) {
      try {
        this.ledgerVisible = true
        this.requestSignTx({
          hex,
          index: pathIndex
          },
        handler)
      } catch (e) {
        console.log(e, 33)
        this.ledgerVisible = false
        this.$message({message: e.message || e, type: 'error', duration: 1000});
      }
    }
  },
  beforeDestroy() {
    if (this.handler) {
      this._removeListener()
    }
  }
}