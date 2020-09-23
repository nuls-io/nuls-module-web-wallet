<template>
  <div>
    <div class="bottom">
      <div class="w1200 font14">
        <div class="left fl">
          <p class="fl">
            {{$t('bottom.serviceNode')}}:
            <u class="click" @click="toUrl('nodeService')">{{serviceUrls.urls}}</u>
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
  import {chainID, chainIdNumber, addressInfo, timesDecimals} from '@/api/util'

  export default {
    name: "bottom-bar",
    data() {
      return {
        serviceUrls: {},//服务节点信息
        heightInfo: [],//高度信息
        failedNu: 0,//失败请次数
      }
    },
    created() {
      this.serviceUrls = {};
      let newUrlData = this.$store.getters.getUrlData;
      this.serviceUrls = newUrlData.filter(item => item.selection)[0];
      localStorage.setItem('url', JSON.stringify(this.serviceUrls));
      this.getHeaderInfo();
      setInterval(() => {
        let newUrlData = this.$store.getters.getUrlData;
        this.serviceUrls = newUrlData.filter(item => item.selection)[0];
        localStorage.setItem('url', JSON.stringify(this.serviceUrls));
      }, 500);
    },
    mounted() {
      setInterval(() => {
        this.getHeaderInfo();
        this.getAddressInfo();
      }, 10000);
    },
    watch: {
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

      /**
       * 获取主网最新高度和本地高度
       */
      getHeaderInfo() {
        const url = localStorage.hasOwnProperty("url") && localStorage.getItem('url') !== 'undefined' ? JSON.parse(localStorage.getItem('url')).urls : 'http://192.168.1.40:18003/';
        const params = {
          "jsonrpc": "2.0", "method": "getInfo", "params": [chainID()], "id": Math.floor(Math.random() * 1000)
        };
        //console.log(url);
        //console.log(params);
        axios.post(url, params)
          .then((response) => {
            //console.log(response.data);
            if (response.data.hasOwnProperty("result")) {
              this.heightInfo = response.data.result;
              sessionStorage.setItem("info", JSON.stringify(response.data.result));
              this.$store.commit('setHeight', this.heightInfo.networkHeight);
            } else {
              this.heightInfo = {localHeight: 0, networkHeight: 0};
              sessionStorage.removeItem("info")
            }
          })
          .catch((error) => {
            sessionStorage.removeItem("info");
            this.heightInfo = {localHeight: 0, networkHeight: 0};
            console.log("getInfo:" + error)
          })
      },

      /**
       * 获取地址网络信息
       **/
      async getAddressInfo() {
        let addressInfos = addressInfo(1);
        let addressList = addressInfo(0);
        if (addressInfos) {
          await this.$post('/', 'getAccount', [addressInfos.address], 'BottomBar')
            .then((response) => {
              //console.log(response);
              if (response.hasOwnProperty("result")) {
                for (let item of addressList) {
                  if (item.address === addressInfos.address) {
                    item.alias = response.result.alias;
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
                  }
                }
                localStorage.setItem(chainIdNumber(), JSON.stringify(addressList));
                //this.$store.commit('setAddressInfo', addressList);
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
