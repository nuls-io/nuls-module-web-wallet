import { ipcRenderer } from "electron";

export default {
  data() {
    this.handler = null
    this.requestBody = {}
    return {
      ledgerVisible: false,
      ledgerErrorMsg: ''
    }
  },
  methods: {
    sendMessageToElectron(message, handler) {
      this.ledgerErrorMsg = ''
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
          let message = error.message
          if (message === 'NoDevice' || message === 'DisconnectedDevice') {
            message = this.$t('ledger.ledger12')
          }
          this.ledgerErrorMsg = message
          this.$message({message: message, type: 'error', duration: 2000});
        } else {
          this.ledgerErrorMsg = ''
          this.ledgerVisible = false
        }
        // this.ledgerVisible = false
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
    signByLedger(hex, pathIndex, handler) {
      this.ledgerVisible = true
      this.requestSignTx({ hex, index: pathIndex }, handler)
      /* try {
        
      } catch (e) {
        console.log(e, 33)
        // this.ledgerVisible = false
        this.$message({message: e.message || e, type: 'error', duration: 1000});
      } */
    }
  },
  beforeDestroy() {
    if (this.handler) {
      this._removeListener()
    }
  }
}