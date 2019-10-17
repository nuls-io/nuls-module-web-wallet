<template>
  <div class="home">
    <h3 class="title" v-if="addressInfo">
      {{addressInfo.address}}
      <span v-show="addressInfo.alias"> ({{addressInfo.alias}})</span>
      <i class="iconfont iconfuzhi clicks" @click="copy(addressInfo.address)"></i>
      <i class="iconfont iconerweima clicks" @click="showCode(addressInfo.address)"></i>
    </h3>

    <div class="w1200 overview bg-white" v-loading="overviewLoading">
      <div class="title">
        NULS {{$t('tab.tab26')}}
        <span class="fr click" @click="toUrl('txList',addressNULSAssets)">{{$t('home.home2')}}</span>
      </div>
      <div class="total fl">
        <p>{{$t('tab.tab2')}}</p>
        <h6>{{addressNULSAssets.total}} <span class="font12"> ≈ $ {{NULSUsdt}}</span></h6>
      </div>
      <div class="balance fl">
        <p>{{$t('public.usableBalance')}}</p>
        <h6>
          {{addressNULSAssets.balance}}
          <el-button type="success" @click="toUrl('transfer',addressNULSAssets.account)">{{$t('nav.transfer')}}
          </el-button>
          <el-button @click="showCode(addressInfo.address)">{{$t('tab.tab27')}}</el-button>
        </h6>
      </div>
      <div class="locking fl">
        <p>{{$t('tab.tab3')}}</p>
        <h6>
          {{addressNULSAssets.locking}}
          <span class="font12 click" @click="toUrl('frozenList',addressNULSAssets)">{{$t('tab.tab28')}}</span>
        </h6>
      </div>
    </div>

    <el-tabs v-model="homeActive" @tab-click="handleClick" class="w1200 mb_100">
      <el-tab-pane :label="$t('tab.tab25')" name="homeFirst">
        <el-select v-model="assetsValue" @change="channgeAsesets" v-show="false">
          <el-option v-for="item in assetsOptions" :key="item.value" :label="$t('assetsType.'+item.value)"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-table :data="addressAssetsData" stripe border v-loading="assetsListLoading">
          <el-table-column :label="$t('tab.tab0')" align="center">
            <template slot-scope="scope">
            <span>
              {{ scope.row.account }}
              <span v-if="scope.row.status ===3" class="gray">{{$t('public.unavailable')}}</span>
            </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tab.tab1')" align="center" width="150">
            <template slot-scope="scope"><span>{{ $t('assetsType.'+scope.row.type) }}</span></template>
          </el-table-column>
          <el-table-column prop="balance" :label="$t('tab.tab4')">
          </el-table-column>
          <el-table-column :label="$t('tab.tab3')">
            <template slot-scope="scope">
              <span class="click" @click="toUrl('frozenList',scope.row)"
                    v-show="scope.row.locking !== '--' && scope.row.locking !==0 ">{{scope.row.locking}}</span>
              <span v-show="scope.row.locking === '--' || scope.row.locking ===0">{{scope.row.locking}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total" :label="$t('tab.tab2')">
          </el-table-column>
          <el-table-column fixed="right" :label="$t('public.operation')" align="center" min-width="120">
            <template slot-scope="scope">
              <label class="click tab_bn" @click="toUrl('transfer',scope.row.account)">{{$t('nav.transfer')}}</label>
              <span class="tab_line">|</span>
              <label class="click tab_bn" @click="toUrl('txList',scope.row)">{{$t('home.home2')}}</label>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages" v-show="false">
          <div class="page-total">
            {{pageNumber-1 === 0 ? 1 : (pageNumber-1) *pageSize}}-{{pageNumber*pageSize}}
            of {{addressAssetsData.length}}
          </div>
          <el-pagination v-show="addressAssetsData.length > pageSize" class="fr" background
                         @current-change="addressAssetsListPages"
                         layout=" prev, pager, next, jumper"
                         :total="addressAssetsData.length">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('home.home1')" name="homeSecond">
        <el-table :data="crossLinkData" stripe border v-loading="crossLinkDataLoading">
          <el-table-column prop="symbol" :label="$t('tab.tab0')" align="center">
          </el-table-column>
          <!--  <el-table-column :label="$t('tab.tab1')" align="center" width="150">
              <template slot-scope="scope"><span>{{ scope.row.symbol }}</span></template>
            </el-table-column>-->
          <el-table-column prop="balance" :label="$t('tab.tab4')">
          </el-table-column>
          <el-table-column :label="$t('tab.tab3')">
            <template slot-scope="scope">
              <span class="click" @click="toUrl('frozenList',scope.row)"
                    v-show="scope.row.locking !== '--' && scope.row.locking !==0 ">{{scope.row.locking}}</span>
              <span v-show="scope.row.locking === '--' || scope.row.locking ===0">{{scope.row.locking}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalBalance" :label="$t('tab.tab2')">
          </el-table-column>
          <el-table-column fixed="right" :label="$t('public.operation')" align="center" min-width="120">
            <template slot-scope="scope">
              <label class="click tab_bn" @click="toUrl('transfer',scope.row.symbol)">{{$t('nav.transfer')}}</label>
              <span class="tab_line">|</span>
              <label class="click tab_bn" @click="toUrl('txList',scope.row)">{{$t('home.home2')}}</label>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages" v-show="addressAssetsData.length > 10">
          <div class="page-total">
            {{pageNumber-1 === 0 ? 1 : (pageNumber-1) *pageSize}}-{{pageNumber*pageSize}}
            of {{crossLinkData.length}}
          </div>
          <el-pagination v-show="addressAssetsData.length > pageSize" class="fr" background
                         @current-change="addressAssetsListPages"
                         layout=" prev, pager, next, jumper"
                         :total="addressAssetsData.length">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="$t('tab.tab19')" :visible.sync="qrcodeDialog" width="20rem" center>
      <div class="tc" style="width: 150px;margin: 0 auto;height: 180px">
        <div id="qrcode" class="qrcode"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import QRCode from 'qrcodejs2'
  import {timesDecimals, copys, addressInfo, Times} from '@/api/util'

  export default {
    name: 'home',
    data() {
      return {
        homeActive: 'homeFirst',   //tab默认选中
        addressInfo: {},//默认账户信息
        addressNULSAssets: {},//账户NULS资产信息
        overviewLoading: true,//nuls资产加载动画
        addressAssetsData: [],//账户资产列表
        NULSUsdt: 0,//nuls美元值
        assetsListLoading: true,//账户资产列表加载动画
        //资产类型
        assetsOptions: [
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'}
        ],
        assetsValue: "0",
        txListDataLoading: true,  //资产加载动画
        txListData: [], //交易数据
        pageNumber: 1, //页码
        pageSize: 100,//条数
        pageCount: 0, //总条数
        crossLinkData: [],//跨链资产
        crossLinkDataLoading: true, //资产加载动画
        qrcodeDialog: false,//二维码弹框
      };
    },
    components: {},
    created() {
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);

      //判断是否有账户
      if (this.addressInfo) {
        setTimeout(() => {
          this.getAddressInfoByNode(this.addressInfo.address);
          setTimeout(() => {
            this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
          }, 100);
        }, 600);
      } else {
        this.$router.push({
          name: "newAddress"
        })
      }

    },
    mounted() {
    },
    watch: {
      addressInfo(val, old) {
        if (val) {
          if (val.address !== old.address && old.address) {
            if (this.homeActive === 'homeFirst') {
              this.getAddressInfoByNode(this.addressInfo.address);
              setTimeout(() => {
                this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address);
              }, 200);
            } else {
              this.pageNumber = 1;
              this.pageSize = 10;
              this.pageCount = 0;
              this.getAccountCrossLedgerList(this.addressInfo.address);
            }
          }
        }

      }
    },
    methods: {

      /**
       * @disc: 显示二维码
       * @params:  address
       * @date: 2019-08-27 11:12
       * @author: Wave
       */
      showCode(address) {
        this.qrcodeDialog = true;
        if (document.getElementById('qrcode')) {
          document.getElementById('qrcode').innerHTML = '';
        }
        setTimeout(() => {
          this.qrcode(address);
        }, 200);
      },

      /**
       * @disc: 二维码生成
       * @params: address
       * @date: 2019-08-27 11:12
       * @author: Wave
       */
      qrcode(address) {
        let qrcode = new QRCode('qrcode', {
          width: 150,
          height: 150,
          colorDark: "#000",
          colorLight: "#fff",
        });
        qrcode.makeCode(address) //生成另一个新的二维码
      },

      /**
       * tab 切换
       * @param tab
       **/
      handleClick(tab) {
        if (tab.name === 'homeSecond') {
          this.pageNumber = 1;
          this.pageSize = 10;
          this.pageCount = 0;
          this.getAccountCrossLedgerList(this.addressInfo.address)
        } else {
          this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
        }
      },

      /**
       * 资产下拉框选择
       * * @param e
       **/
      channgeAsesets(e) {
        this.assetsListLoading = true;
        if (e.toString() === "1") {
          this.getAddressInfoByNode(this.addressInfo.address);
        } else if (e.toString() === "2") {
          this.addressAssetsData = [];
          setTimeout(() => {
            this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
          }, 200);
        } else {
          this.getAddressInfoByNode(this.addressInfo.address);
          setTimeout(() => {
            this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
          }, 200);
        }
      },

      /**
       * 获取地址NULS资产信息
       * @param address
       **/
      async getAddressInfoByNode(address) {
        this.overviewLoading = true;
        await this.$post('/', 'getAccountLedgerList', [address], 'Home')
          .then((response) => {
            //console.log(response);
            this.addressAssetsData = [];
            let newAssetsList = {};
            if (response.hasOwnProperty("result")) {
              newAssetsList.account = response.result[0].symbol;
              newAssetsList.chainId = response.result[0].chainId;
              newAssetsList.assetId = response.result[0].assetId;
              newAssetsList.type = 1;
              newAssetsList.total = timesDecimals(response.result[0].totalBalance);
              newAssetsList.locking = timesDecimals(response.result[0].consensusLock + response.result[0].timeLock);
              newAssetsList.balance = timesDecimals(response.result[0].balance);
            } else {
              newAssetsList.account = response.result.symbol;
              newAssetsList.chainId = response.result.chainId;
              newAssetsList.assetId = response.result.assetId;
              newAssetsList.type = 1;
              newAssetsList.total = 0;
              newAssetsList.locking = 0;
              newAssetsList.balance = 0;
            }
            this.addressInfo.balance = newAssetsList.balance;
            this.addressNULSAssets = newAssetsList;
            this.getNULSUSDT(newAssetsList.total);
            this.overviewLoading = false;
            //this.addressAssetsData.push(newAssetsList);
            this.assetsListLoading = false;
          })
      },

      /**
       * @disc: NULS的usdt价格
       * @date: 2019-10-17 14:30
       * @author: Wave
       */
      getNULSUSDT(number) {
        let news = 0.5;
        this.NULSUsdt = Number(Times(news, number)).toFixed(2);
        axios.get("/market-api/nuls-price")
          .then((response) => {
            console.log(response);
            this.NULSUsdt = Number(Times(response.price, number)).toFixed(2)
          })
          .catch((error) => {
            console.log(error);
          })
      },

      /**
       * 获取地址代币资产信息
       * @param pageSize
       * @param pageRows
       * @param address
       **/
      async getTokenListByAddress(pageSize, pageRows, address) {
        this.assetsListLoading = true;
        await this.$post('/', 'getAccountTokens', [pageSize, pageRows, address], 'Home')
          .then((response) => {
            //console.log(response);
            let newAssetsList = {};
            if (response.hasOwnProperty("result")) {
              this.addressAssetsData = [];
              for (let itme of response.result.list) {
                itme.account = itme.tokenSymbol;
                itme.type = 2;
                itme.total = timesDecimals(itme.balance, itme.decimals);
                itme.locking = '--';
                itme.balance = timesDecimals(itme.balance, itme.decimals);
              }
              newAssetsList = response.result.list;
            }
            newAssetsList.splice(newAssetsList.findIndex(item => item.status === 3), 1);//隐藏已经删除合约
            this.addressAssetsData.push(...newAssetsList);
            this.addressInfo.tokens = [];
            this.addressInfo.tokens = this.addressAssetsData;
            //localStorage.setItem(this.addressInfo.address, JSON.stringify(this.addressInfo));
            this.assetsListLoading = false;
          })
      },

      /**
       * 获取地址跨链资产信息
       * @param address
       **/
      async getAccountCrossLedgerList(address) {
        this.txListDataLoading = true;
        await this.$post('/', 'getAccountCrossLedgerList', [address], 'Home')
          .then((response) => {
            //console.log(response);
            this.crossLinkDataLoading = false;
            if (response.hasOwnProperty("result")) {
              for (let item of response.result) {
                item.totalBalance = timesDecimals(item.totalBalance);
                item.balance = timesDecimals(item.balance);
                item.locking = timesDecimals(item.consensusLock + item.timeLock);
              }
              this.crossLinkData = response.result;
              this.txListDataLoading = false;
            }
          })
      },

      /**
       * 资产列表分页功能
       * @param val
       **/
      addressAssetsListPages(val) {
        this.pageNumber = val;
        this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address);
      },

      /**
       * 隐藏共识奖励
       * @param e
       **/
      changeHide(e) {
        this.isHide = e;
        this.pageNumber = 1;
        this.getTxlistByAddress(this.pageNumber, this.pageSize, this.addressInfo.address, this.type, this.isHide)
      },

      /**
       * 交易列表分页功能
       * @param val
       **/
      txListPages(val) {
        this.pageNumber = val;
        this.getTxlistByAddress(this.pageNumber, this.pageSize, this.addressInfo.address, this.type, this.isHide)
      },

      /**
       * 连接跳转
       * @param name
       * @param parms
       */
      toUrl(name, parms) {
        //console.log(name)
        //console.log(parms);
        let newParms = {accountType: parms};
        if (name === 'transfer') {
          this.$router.push({
            name: name,
            query: newParms
          })
        } else if (name === 'frozenList') {
          newParms = {accountInfo: parms};
          this.$router.push({
            name: name,
            query: newParms
          })
        } else {
          if (parms.type === 2) {
            this.$router.push({
              name: 'tokenTxList'
            })
          } else {
            this.$router.push({
              name: name,
            })
          }
        }
      },

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
      },
    }
  }
</script>
<style lang="less">
  @import "./../assets/css/style";

  .home {
    background-color: @Bcolour1;
    .title {
      height: 130px;
    }

    .overview {
      border: @BD1;
      margin: -30px auto 0;
      height: 150px;
      .title {
        text-align: left;
        background-color: #f9fafd;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        padding: 0 30px;
        font-weight: bold;
        span {
          font-size: 12px;
          font-weight: normal;
        }
      }
      p {
        font-size: 14px;
        font-weight: 600;
        padding: 20px 30px 5px;
      }
      h6 {
        font-weight: 600;
        font-size: 16px;
        padding: 0 30px;
      }
      .total {
        width: 32%;
        height: 90px;
        border-right: @BD1;
        margin: 10px auto;
        h6 {
          span {
            font-weight: normal;
          }
        }
      }
      .balance {
        width: 33%;
        p {
          padding-left: 80px;
        }
        h6 {
          padding-left: 80px;
          .el-button {
            padding: 5px 8px;
            border-radius: 2px;
          }
        }
      }
      .locking {
        width: 33%;
        p {
          padding-left: 80px;
        }
        h6 {
          padding-left: 80px;
          span {
            font-weight: normal;
          }
        }
      }

    }

    .el-tabs {
      margin: 30px auto 0;
      .el-select {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
