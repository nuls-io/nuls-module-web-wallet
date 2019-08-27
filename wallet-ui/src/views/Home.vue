<template>
  <div class="home">
    <h3 class="title" v-if="addressInfo">
      {{addressInfo.address}}
      <span v-show="addressInfo.alias"> | {{addressInfo.alias}}</span>
      <i class="iconfont iconfuzhi clicks" @click="copy(addressInfo.address)"></i>
      <i class="iconfont iconerweima clicks" @click="showCode(addressInfo.address)"></i>
    </h3>
    <el-tabs v-model="homeActive" @tab-click="handleClick" class="w1200">
      <el-tab-pane :label="$t('home.home0')" name="homeFirst" v-loading="assetsListLoading">
        <el-select v-model="assetsValue" @change="channgeAsesets">
          <el-option v-for="item in assetsOptions" :key="item.value" :label="$t('assetsType.'+item.value)"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-table :data="addressAssetsData" stripe border>
          <el-table-column prop="account" :label="$t('tab.tab0')" align="center">
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
        <div class="pages">
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
        <div class="pages">
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

    <el-dialog title="地址二维码" :visible.sync="qrcodeDialog" width="20rem" center>
      <div class="tc" style="width: 150px;margin: 0 auto">
        <div id="qrcode" class="qrcode"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import {timesDecimals, copys, addressInfo} from '@/api/util'

  export default {
    name: 'home',
    data() {
      return {
        homeActive: 'homeFirst',   //tab默认选中
        addressInfo: {},//默认账户信息
        addressAssetsData: [],//账户资产列表
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
        pageSize: 10,//条数
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
        this.getAddressInfoByNode(this.addressInfo.address);
        setTimeout(() => {
          this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
        }, 200);
      } else {
        this.$router.push({
          name: "newAddress",
          query: {'address': ''}
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
          this.getAddressInfoByNode(this.addressInfo.address);
          setTimeout(() => {
            this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
          }, 200);
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
       * 获取地址基本资产信息
       * @param address
       **/
      getAddressInfoByNode(address) {
        this.$post('/', 'getAccountLedgerList', [address], 'Home')
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
            this.addressAssetsData.push(newAssetsList);
            this.assetsListLoading = false;
          })
      },

      /**
       * 获取地址代币资产信息
       * @param pageSize
       * @param pageRows
       * @param address
       **/
      getTokenListByAddress(pageSize, pageRows, address) {
        this.$post('/', 'getAccountTokens', [pageSize, pageRows, address], 'Home')
          .then((response) => {
            //console.log(response);
            let newAssetsList = {};
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.account = itme.tokenSymbol;
                itme.type = 2;
                itme.total = timesDecimals(itme.balance, itme.decimals);
                itme.locking = '--';
                itme.balance = timesDecimals(itme.balance, itme.decimals);
              }
              newAssetsList = response.result.list;
            }
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
      getAccountCrossLedgerList(address) {
        //this.txListDataLoading = true;
        this.$post('/', 'getAccountCrossLedgerList', [address], 'Home')
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
    }
    .el-tabs {
      margin: 30px auto 0;
      .el-select {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
