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
          {{$t('bottom.nodeHeight')}}: {{heightInfo.networkHeight}}/{{heightInfo.localHeight}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import axios from 'axios'
  import {defaultData} from '@/config.js'
  import {chainID, chainIdNumber, addressInfo, timesDecimals} from '@/api/util'

  export default {
    name: "bottom-bar",
    data() {
      return {
        heightInfo: [],//高度信息
      }
    },
    created() {
      if (localStorage.hasOwnProperty('urlsData')) {
        let newUrlsData = [];
        let selectionUrl = '';
        for (let item of JSON.parse(localStorage.getItem("urlsData"))) {
          if (item.name !== 'Official') {
            newUrlsData.push(item)
          }
          if (item.selection) {
            selectionUrl = item.urls
          }
        }
        for (let item of defaultData) {
          if (item.urls === selectionUrl) {
            item.selection = true
          }
        }
        let urlsData = [...defaultData, ...newUrlsData];
        for (let item of urlsData) {
          if (item.selection) {
            this.serviceUrls = item;
          }
        }
        localStorage.removeItem('urlsData');
        localStorage.setItem("urlsData", JSON.stringify(urlsData));
      } else {
        localStorage.setItem("urlsData", JSON.stringify(defaultData));
        for (let item of defaultData) {
          if (item.selection) {
            localStorage.setItem("urls", JSON.stringify(item));
            this.serviceUrls = item;
          }
        }
      }
      this.getHeaderInfo();
      setInterval(() => {
        this.serviceUrls = JSON.parse(localStorage.getItem("urls"));
      }, 500);
    },
    mounted() {
      setInterval(() => {
        this.getHeaderInfo();
        this.getAddressInfo();
      }, 10000);
    },
    watch: {},
    methods: {

      /**
       * 获取主网最新高度和本地高度
       */
      getHeaderInfo() {
        const url = localStorage.hasOwnProperty('urls') ? JSON.parse(localStorage.getItem('urls')).urls : 'http://192.168.1.40:18003/';
        const params = {"jsonrpc": "2.0", "method": "getInfo", "params": [chainID()], "id": 5898};
        axios.post(url, params)
          .then((response) => {
            //console.log(response.data);
            if (response.data.hasOwnProperty("result")) {
              this.heightInfo = response.data.result;
              sessionStorage.setItem("info", JSON.stringify(response.data.result))
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
