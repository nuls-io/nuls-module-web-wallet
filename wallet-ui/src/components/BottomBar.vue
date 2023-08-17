<template>
  <div>
    <div class="bottom">
      <div class="w1200 font14">
        <div class="left fl">
          <p class="fl">
            {{$t('bottom.serviceNode')}}:
            <u class="click" @click="toUrl('nodeService')">{{currentChain.apiUrl}}</u>
          </p>
        </div>
        <div class="right fr">
          {{$t('bottom.nodeHeight')}}:
          <i v-show="heightInfo.networkHeight ===0 && heightInfo.localHeight===0 " class="el-icon-loading"></i>
          <span v-show="heightInfo.networkHeight !==0 && heightInfo.localHeight !==0 ">
            {{heightInfo.networkHeight}}/{{heightInfo.localHeight}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import axios from 'axios'
  import {addressInfo, timesDecimals} from '@/api/util'
  import storage from '@/api/storage'

  export default {
    name: "bottom-bar",
    data() {
      return {
        serviceUrls: {},//服务节点信息
        heightInfo: [],//高度信息
        failedNu: 0,//失败请次数
        timer: null
      }
    },
    mounted() {
      this.getInfo();
      this.timer = setInterval(() => {
        this.getInfo()
      }, 10000);
    },
    computed: {
      currentChain() {
        return this.$store.state.currentChain
      }
    },
    watch: {
      'currentChain.apiUrl': {
        handler() {
          clearInterval(this.timer)
          this.getInfo()
          this.timer = setInterval(() => {
            this.getInfo()
          }, 10000)
        }
      },
      // currentChain(val) {
      //   console.log(val, 333)
        
      // },
      heightInfo(val) {
        if (this.$route.path !== '/nodeService' && this.failedNu !== 5) {
          if (val.localHeight === 0 && val.networkHeight === 0) {
            this.failedNu = this.failedNu + 1
          } else {
            this.failedNu = 0
          }
          if (this.failedNu === 5) {
            this.$confirm(this.$t('bottom.err0'), {
              confirmButtonText: this.$t('bottom.err1'),
              cancelButtonText: this.$t('bottom.err2'),
              type: 'error',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
            }).then(() => {
              this.toUrl('nodeService');
            }).catch(() => {
              location.reload();
            });
          }
        }
      }
    },
    methods: {

      getInfo() {
        this.getHeaderInfo();
        this.getAddressInfo();
      },
      /**
       * 获取主网最新高度和本地高度
       */
      getHeaderInfo() {
        const { apiUrl, chainId } = this.currentChain
        const params = {
          "jsonrpc": "2.0", "method": "getInfo", "params": [chainId], "id": Math.floor(Math.random() * 1000)
        };
        axios.post(apiUrl, params)
          .then((response) => {
            //console.log(response.data);
            if (response.data.hasOwnProperty("result")) {
              this.heightInfo = response.data.result;
              storage.set("info", response.data.result, 'session');
            } else {
              this.heightInfo = {localHeight: 0, networkHeight: 0};
              storage.remove("info", 'session')
            }
          })
          .catch((error) => {
            storage.remove("info", 'session');
            this.heightInfo = {localHeight: 0, networkHeight: 0};
            console.log("getInfo:" + error)
          })
      },

      /**
       * 获取地址网络信息
       **/
      async getAddressInfo() {
        const accountList = this.$store.state.accountList
        const currentAccount = this.$store.getters.currentAccount
        const address = currentAccount.address
        if (address) {
          await this.$post('/', 'getAccount', [address], 'BottomBar')
            .then((response) => {
              //console.log(response);
              if (response.hasOwnProperty("result")) {
                let newAssetsList = accountList.filter(obj => obj.address === address); //隐藏已经删除合约
                for (let item of accountList) {
                  if (item.address === address) {
                    item.alias = response.result.alias;
                    item.symbol = response.result.symbol;
                    item.totalBalance = timesDecimals(response.result.totalBalance);
                    item.balance = timesDecimals(response.result.balance);
                    item.consensusLock = timesDecimals(response.result.consensusLock);
                    item.totalReward = timesDecimals(response.result.totalReward);
                    if (response.result.lastReward) {
                      item.lastReward = timesDecimals(response.result.lastReward);
                    } else {
                      item.lastReward = 0;
                    }
                    item.tokens = [];
                    item.chainId = nuls.verifyAddress(item.address).chainId;
                    item.nrc20List = newAssetsList[0].nrc20List;
                  }
                }
                this.$store.commit('changeAccouuntList', accountList);
              }
            })
        }
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
    z-index: 99;
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

  .el-message-box__wrapper {
    .el-message-box {
      .el-message-box__btns {
        .el-button--default {
          color: #FFF;
          background-color: #409EFF;
          border-color: #409EFF;
        }
        .el-button--primary {
          background: #FFF;
          border: 1px solid #DCDFE6;
          color: #606266;
        }
      }
    }
  }
</style>
