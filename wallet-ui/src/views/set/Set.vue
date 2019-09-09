<template>
  <div class="set bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <h3 class="title">
          {{$t('public.about')}}
        </h3>
      </div>
    </div>
    <div class="w1200 mt_20 bg-white set_info">
      <div class="tc mzt_20">
        <h4 class="font24 mb_20">NULS Wallet</h4>
        <!--<p class="font16">{{$t('public.logInfo')}}: <span class="click" @click="seeLog">{{$t('public.see')}}</span></p>-->
        <ul>
          <li v-show="RUN_PATTERN"><span>{{$t('public.operatingSystem')}}:</span>{{system}}</li>
          <li>
            <span>{{$t('public.version')}}:</span>
            <font v-if="RUN_DEV">V {{version}}</font>
            <font v-else>B {{version}}</font>
          </li>
          <li v-show="RUN_PATTERN && system !== 'Darwin'"><span>{{$t('public.logInfo')}}:</span>{{logUrl}}</li>
          <li v-show="system === 'Darwin'">
            <span>{{$t('public.downloadUrl')}}:</span>
            <font >{{FILE_URL}}/NULS-Wallet-{{version}}.dmg</font>
          </li>
        </ul>
        <el-button type="success" @click="checkUpdate" v-show="RUN_PATTERN && system !== 'Darwin'">{{$t('public.checkUpdates')}}</el-button>
      </div>
    </div>
    <el-dialog :title="$t('bottom.updateWallet')" width="35rem"
               :visible.sync="updateDialogVisible"
               :show-close="tips.type===1 || tips.type===4"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <div class="upload">
        <div class="upload-tips">{{$t('bottom.Tips')}}: {{$t('TipsType.'+tips.type) }}</div>
        <div class="upload-percent" v-if="downloadPercent !==0 ">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="downloadPercent" status="success">
          </el-progress>
        </div>
        <div class="upload-bt" v-if="tips.type === 3" v-show="false">
          <el-button type="info" @clcik="afterRun">{{$t('bottom.Backstage')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import packages from './../../../package'
  import {RUN_PATTERN,RUN_DEV,FILE_URL} from '@/config.js'

  export default {
    data() {
      return {
        updateDialogVisible: false,//更新弹框
        tips: {},//提示信息
        downloadPercent: 0,//下载进度
        logUrl: '',
        system: '',
        version: packages.version,//版本号
        RUN_PATTERN:RUN_PATTERN,//运行模式
        RUN_DEV:RUN_DEV,// 运行环境
        FILE_URL:FILE_URL,//桌面程序下载路径
      };
    },
    created() {
      this.seeLog();
    },
    mounted() {

    },
    components: {},
    methods: {

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
          _this.downloadPercent = Number(progressObj.percent.toFixed(2)) || 0;
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
       * 查看日志
       */
      seeLog() {
        const os = require('os');
        this.system = os.type();
        let str = __dirname;
        if (this.system === 'Windows_NT') {
          let ss = str.split("\\");
          let temp = "\\" + ss[ss.length - 2];
          let num = str.lastIndexOf(temp);
          this.logUrl = str.slice(0, num) + '\\wallet_web_log';
        } else if (this.system === 'Darwin') {
          let ss = str.split("/");
          let temp = "/" + ss[ss.length - 2];
          let num = str.lastIndexOf(temp);
          this.logUrl = str.slice(0, num) + '/wallet_web_log';
        }
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .set {
    .set_info {
      border: @BD1;
      min-height: 500px;
      ul {
        li {
          line-height: 1.6rem;
          width: 35rem;
          margin: 0 auto;
          text-align: left;
          font-size: 12px;
          span {
            width: 5rem;
            display: block;
            float: left;
            font-size: 14px;
            text-align: right;
            padding-right: 0.5rem;
          }
        }

      }
      .el-button {
        margin: 1rem 0 0 0;
        padding: 0.5rem;
        width: 15rem;
      }
    }
  }

</style>
