<template>
  <div>
    <div class="bottom">
      <div class="w1200 font14">
        <div class="left fl">
          <p class="fl">服务节点: <u class="clicks" @click="toUrl('nodeService')">{{serviceUrls}}</u></p>
          <!--<p class="fr">高度:节点131000000/主网 {{heightInfo.height}}</p>-->
          <p class="fr">主网/服务节点: {{mainHeightInfo.height}}/{{heightInfo.height}}</p>
        </div>
        <div class="right fr">
          <label class="clicks">服务协议</label>
          <label class="clicks">隐私政策</label>
          <!--<label>Alpha 2.0.1</label>-->
          <label class="click" @click="checkUpdate">Alpha 2.0.1</label>
        </div>
      </div>
    </div>
    <el-dialog title="更新钱包" width="35rem"
               :visible.sync="updateDialogVisible"
               :show-close="tips.type===1 || tips.type===4"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <div class="upload">
        <div class="upload-tips">提示信息：{{tips.info}}</div>
        <div class="upload-percent" v-if="downloadPercent !==0 ">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="downloadPercent" status="success">
          </el-progress>
        </div>
        <div class="upload-bt" v-if="tips.type === 3">
          <el-button type="info" @clcik="afterRun">后台运行</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import axios from 'axios'
  export default {
    name: "bottom-bar",
    data() {
      return {
        mainHeightInfo: [],//最新主网高度
        heightInfo: [],//最新高度
        serviceUrls: localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'http://apitn1.nulscan.io/',
        updateDialogVisible: false,//更新弹框
        tips: {},//提示信息
        downloadPercent: 0,//下载进度
      }
    },
    created() {
      this.getBestBlockHeader();
      this.getMainHeader();
      this.serviceUrls = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'http://apitn1.nulscan.io/';
      setInterval(() => {
        this.serviceUrls = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'http://apitn1.nulscan.io/';
      }, 500);
    },
    mounted() {
      setInterval(() => {
        this.getBestBlockHeader();
      }, 10000);
    },
    watch: {
      serviceUrls(val, old) {
        if (val) {
          if (val !== old && old) {
            this.getBestBlockHeader();
          }
        }
      }
    },
    methods: {

      /**
       * 获取主网最新高度（浏览器高度）
       */
      getMainHeader() {
        const params = {"jsonrpc":"2.0", "method":"getBestBlockHeader", "params":[2], "id":5898};
        axios.post('http://apitn1.nulscan.io', params)
          .then((response) => {
            //console.log(response);
            if (response.data.hasOwnProperty("result")) {
              this.mainHeightInfo = response.data.result;
            } else {
              this.mainHeightInfo = {height: 0};
            }
          })
          .catch((error) => {
            this.heightInfo = {height: 0};
            console.log("getBestBlockHeader:" + error)
          })
      },

      /**
       * 获取最新高度
       */
      getBestBlockHeader() {
        this.$post('/', 'getBestBlockHeader', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.heightInfo = response.result;
            } else {
              this.heightInfo = {height: 0};
            }
          })
          .catch((error) => {
            this.heightInfo = {height: 0};
            console.log("getBestBlockHeader:" + error)
          })
      },

      /**
       * 检查更新
       **/
      async checkUpdate() {
        this.updateDialogVisible = true;
        this.tips = {};
        this.downloadPercent = 0;
        const _this = this;
        _this.$electron.ipcRenderer.send("checkForUpdate");
        await _this.$electron.ipcRenderer.on("message", (event, text) => {
          _this.tips = text;
        });
        _this.$electron.ipcRenderer.on("downloadProgress", (event, progressObj) => {
          _this.downloadPercent = progressObj.percent || 0;
        });
        _this.$electron.ipcRenderer.on("isUpdateNow", () => {
          _this.$electron.ipcRenderer.send("isUpdateNow");
        });
      },

      /**
       * 后台运行
       **/
      afterRun() {
        this.updateDialogVisible = false;
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        //console.log(name)
        this.$router.push({
          name: name
        })
      },
    }
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .bottom {
    height: 60px;
    border-top: 1px solid @Dcolour;
    position: fixed;
    line-height: 60px;
    bottom: 0;
    background-color: @Bcolour;
    width: 100%;
    @media screen and (max-width: 1000px) {
      height: 4rem;
      font-size: 0.7rem;
      line-height: 1rem;
    }
    .w1200 {
      .left {
        width: 50%;
        line-height: 60px;
        @media screen and (max-width: 1000px) {
          width: 100%;
          margin: 0.5rem 0 0 0.5rem;
          p {
            margin: 0;
            float: none;
            display: block;
          }
        }
      }
      .right {
        width: 40%;
        line-height: 60px;
        text-align: right;
        @media screen and (max-width: 1000px) {
          width: 100%;
          float: none;
        }
        label {
          padding: 0 10px;
          @media screen and (max-width: 1000px) {
            padding: 0 0.5rem;
            font-size: 0.7rem;
            line-height: 1rem;
          }
        }
      }
    }

  }
</style>
