<template>
  <div class="home">
    <h3 class="title" v-if="addressInfo">
      {{addressInfo.address}}
      <span v-show="addressInfo.alias"> ({{addressInfo.alias}})</span>
      <i class="iconfont iconfuzhi clicks" @click="copy(addressInfo.address)"></i>
      <i class="iconfont iconerweima clicks" @click="showCode"></i>
    </h3>

    <div class="w1200 overview bg-white" v-loading="overviewLoading" element-loading-spinner="el-icon-loading">
      <div class="title">
        <img class="logo" src="../../assets/img/logo.svg"/>
        <span class="fr click" @click="toUrl('txList',addressNULSAssets)">{{$t('home.home2')}}</span>
      </div>
      <div class="total fl">
        <p>{{$t('tab.tab2')}}</p>
        <h6>
          {{addressNULSAssets.total}}
          <span class="font16" v-show="symbol.toLocaleUpperCase() ==='NULS'"> ≈ $ {{NULSUsdt}}</span>
        </h6>
      </div>
      <div class="balance fl">
        <p>{{$t('public.usableBalance')}}</p>
        <h6>
          <font>{{addressNULSAssets.balance}}</font>
          <el-button type="success" @click="toUrl('transfer',addressNULSAssets.account)">{{$t('tab.tab31')}}
          </el-button>
          <el-button @click="showCode">{{$t('tab.tab27')}}</el-button>
        </h6>
      </div>
      <div class="locking fl">
        <p>{{$t('tab.tab3')}}</p>
        <h6>
          <font>{{addressNULSAssets.locking}}</font>
          <span class="font14 click" @click="toUrl('frozenList',addressNULSAssets)">{{$t('tab.tab28')}}</span>
        </h6>
      </div>
    </div>
    <div class="cb"></div>
    <div class="w1200 overview bg-white" style="margin: 35px auto 0; height: auto">
      <div class="title">
        <img src="../../assets/img/across-logo.svg" style="width: 20px; margin-top:11px; "/>
        {{$t('home.home3')}}
      </div>
      <div class="home_tabs" style="padding: 0">
        <el-table :data="crossLinkData" stripe border v-loading="txListDataLoading"
                  element-loading-spinner="el-icon-loading">
          <el-table-column :label="$t('tab.tab0')" align="center" width="200">
            <template slot-scope="scope">
              <div style="margin: 0 0 0 30%">
                <img src="../../assets/img/nvt-logo.svg" class="fl" style="width: 25px;margin: 3px 2px 0 0"
                     v-show="scope.row.symbol ==='NVT'"/>
                <img src="../../assets/img/eth-logo.png" class="fl" style="width: 25px;margin: 3px 2px 0 0"
                     v-show="scope.row.symbol ==='ETH'"/>
                <span class="fl">{{scope.row.symbol}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalBalance" :label="$t('tab.tab2')" align="left" width="230">
          </el-table-column>
          <el-table-column :label="$t('tab.tab3')" width="230">
            <template slot-scope="scope">
              <span class="click" @click="toUrl('frozenList',scope.row)"
                    v-show="scope.row.locking !== '--' && scope.row.locking !==0 ">{{scope.row.locking}}</span>
              <span v-show="scope.row.locking === '--' || scope.row.locking ===0">{{scope.row.locking}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" :label="$t('tab.tab4')" width="230">
          </el-table-column>
          <el-table-column fixed="right" :label="$t('public.operation')" align="center" min-width="120">
            <template slot-scope="scope">
              <label class="click tab_bn" @click="toUrl('transfer', {type: 1, tokenSymbol: scope.row})">
                {{$t('nav.transfer')}}
              </label>
              <span class="tab_line">|</span>
              <label class="click tab_bn" @click="toUrl('txList',scope.row)">{{$t('home.home2')}}</label>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="cb"></div>

    <div class="w1200 tabs" style="margin: 35px auto 6rem;">
      <el-tabs v-model="activeContract" @tab-click="handleClick">
        <el-tab-pane :label="$t('home.home4')" name="nrc20">
          <div class="fr">
            <i class="el-icon-circle-plus-outline click" @click="plusToken"></i>
          </div>
          <div class="w1200 cb overview bg-white" style="margin: 12px auto 0; height: auto">
            <div class="home_tabs" style="padding: 0">
              <el-table :data="addressAssetsData" stripe border v-loading="assetsListLoading"
                        element-loading-spinner="el-icon-loading">
                <el-table-column :label="$t('nodeService.nodeService2')" align="center" width="200">
                  <template slot-scope="scope">
                  <span class="click td" @click="toUrl('contractsInfo',scope.row.contractAddress,1)">
                    {{ scope.row.symbol ? scope.row.symbol : scope.row.tokenSymbol }}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column prop="total" :label="$t('tab.tab2')" align="left" width="230">
                </el-table-column>
                <el-table-column prop="balance" :label="$t('tab.tab4')" width="230">
                </el-table-column>
                <el-table-column :label="$t('tab.tab3')" width="230">
                  <template slot-scope="scope">
                    <span>{{scope.row.locking}}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" :label="$t('public.operation')" align="center" min-width="120">
                  <template slot-scope="scope">
                    <label class="click tab_bn" @click="toUrl('transfer',scope.row)">{{$t('nav.transfer')}}</label>
                    <span class="tab_line">|</span>
                    <label class="click tab_bn" @click="toUrl('txList',scope.row)">{{$t('home.home2')}}</label>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('home.home5')" name="nrc721" class="tab_nrc721">
          <el-tabs tab-position="left" v-model="active721" v-if="token721List.length !==0">
            <el-tab-pane v-for="item in token721List" :key="item.contractAddress" :name="item.contractAddress">
              <div slot="label">
                <el-tooltip :content="item.contractAddress" placement="right" effect="light">
                  <el-link :underline="false">{{item.tokenSymbol +' ('+item.tokenSet.length +')'}}</el-link>
                </el-tooltip>
              </div>
              <NFTTransfer :NFTInfo="item" v-if="reFresh">
              </NFTTransfer>
            </el-tab-pane>
          </el-tabs>
          <div class="tc font12" style="line-height: 60px; color: #909399;" v-else>暂无数据</div>
        </el-tab-pane>
        <el-tab-pane :label="$t('home.home15')" name="nrc1155" class="tab_nrc721">
          <el-tabs tab-position="left" v-model="active1155" v-if="nrc1155List.length !==0">
            <el-tab-pane v-for="item in nrc1155List" :key="item.tokenId" :name="item.tokenId">
              <div slot="label">
                <el-link :underline="false">{{item.tokenSymbol +' (ID: '+item.tokenId + ')'}}</el-link>
              </div>
              <NRC1155Transfer :NFTInfo="item" v-if="reFresh" />
            </el-tab-pane>
          </el-tabs>
          <div class="tc font12" style="line-height: 60px; color: #909399;" v-else>暂无数据</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :title="$t('tab.tab27')" :visible.sync="qrcodeDialog" width="23.5rem" center class="token-diolog">
      <div class="code-wrap">
        <div id="qrcode" class="qrcode"></div>
        <div class="address">{{addressInfo.address}}</div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('home.home9')" class="token-diolog" width="37rem"
               :visible.sync="tokenDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="tokenDioloClose">
      <el-input :placeholder="$t('home.home10')" class="token-search" suffix-icon="el-icon-search" v-model="tokenSearch"
                @input="changeToken">
      </el-input>
      <ul class="token-list scroll">
        <li v-for="item in showList" :key="item.contractAddress" class="cb">
          <div class="fl">
            <h5 class="fl">{{$t('home.home12')}}:<span>{{item.symbol}}</span></h5>
            <h5 class="fl">{{$t('home.home13')}}:<span>{{item.total}}</span></h5>
            <h6 class="cb">{{$t('home.home14')}}:<span>{{item.contractAddress}}</span></h6>
          </div>
          <div class="fr">
            <el-checkbox v-model="item.isShow" @change="changeShow(item)">
            </el-checkbox>
          </div>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tokenDialog = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="tokenDialog = false">{{$t('public.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import QRCode from 'qrcodejs2'
  
  import {
    timesDecimals,
    copys,
    Times,
    superLong,
    connectToExplorer,
    Plus,
    Minus,
    divisionDecimals,
    unique,
  } from '@/api/util'
  import NFTTransfer from './NFTTransfer'
  import NRC1155Transfer from './NRC1155Transfer'

  export default {
    name: 'home',
    data() {
      return {
        symbol: 'NULS', //symbol
        homeActive: 'homeFirst',  //tab默认选中
        addressNULSAssets: {},//账户NULS资产信息
        overviewLoading: true,//nuls资产加载动画
        addressAssetsData: [],//nrc20资产列表
        NULSUsdt: 0,//nuls美元值
        assetsListLoading: true,//账户资产列表加载动画
        assetsOptions: [
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'}
        ], //资产类型
        assetsValue: "0",
        txListDataLoading: true,  //资产加载动画
        txListData: [], //交易数据
        pageNumber: 1, //页码
        pageSize: 100,//条数
        crossLinkData: [],//跨链资产
        crossLinkDataLoading: true, //资产加载动画
        qrcodeDialog: false,//二维码弹框
        payeeForm: {
          amount: 100,
          currency: 'NULS',
          decimals: 8
        },
        activeContract: 'nrc20',
        token721List: [],//721数据
        nrc1155List: [],
        active721: '',
        active1155: '',
        homeSetInterval: null,//定时器
        reFresh: true,
        allNRC20List: [],//所有nrc20资产
        showList: [],//显示的nrc20资产
        tokenSearch: '',//搜索内容
        isShowZero: false,//是否隐藏为零的token

      };
    },
    components: {NFTTransfer, NRC1155Transfer},
    computed: {
      accountList() {
        return this.$store.state.accountList
      },
      addressInfo() {
        return this.$store.getters.currentAccount
      }
    },
    created() {
      const address = this.addressInfo.address
      if (address) {
        this.allNRC20List = [];
        this.allList();
        this.getList()
        this.startInterval()
      } else {
        this.$router.push({
          name: "newAddress"
        })
      }
    },
    destroyed() {
      this.clearInterval()
    },
    watch: {
      addressInfo(val, old) {
        if (val) {
          if (val.address !== old.address && old.address) {
            clearInterval(this.homeSetInterval);
            this.token721List = [];
            this.nrc1155List = []
            this.active721 = '';
            this.active1155 = ''
            this.reFresh = false;
            this.getList()
            this.$nextTick(() => {
              this.reFresh = true
            })
          }
        }
      }
    },
    methods: {
      getList() {
        this.getAddressInfoByNode();
        this.getAccountCrossLedgerList();
        this.getTokenListByAddress();
        this.getAccountToken721List();
        this.getNRC1155TokenList()
      },
      startInterval() {
        this.homeSetInterval = setInterval(() => {
          this.getList()
        }, 10000);
      },
      clearInterval() {
        clearInterval(this.homeSetInterval);
      },

      /**
       * @disc: 显示二维码
       * @date: 2019-08-27 11:12
       * @author: Wave
       */
      showCode() {
        this.qrcodeDialog = true;
        if (document.getElementById('qrcode')) {
          document.getElementById('qrcode').innerHTML = ''
        }
        this.$nextTick(() => {
          this.qrcode(this.addressInfo.address);
        })
      },

      /**
       * @disc: 二维码生成
       * @params: address
       * @date: 2019-08-27 11:12
       * @author: Wave
       */
      qrcode(address) {
        let qrcode = new QRCode('qrcode', {
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
        });

        qrcode.makeCode(address)
      },

      /**
       * tab 切换
       * @param tab
       **/
      handleClick(tab) {
        //
      },

      /**
       * 获取地址NULS资产信息
       * @param address
       **/
      async getAddressInfoByNode() {
        await this.$post('/', 'getAccountLedgerList', [this.addressInfo.address], 'Home')
          .then((response) => {
            const assetInfo = {
              type: 1,
              total: 0,
              locking: 0,
              balance: 0,
            }
            if (response.result && response.result[0]) {
              const info = response.result[0]
              assetInfo.account = info.symbol
              assetInfo.chainId = info.chainId
              assetInfo.assetId = info.assetId
              assetInfo.balance = Number(timesDecimals(info.balance)).toFixed(3);
              assetInfo.locking = Number(timesDecimals(Plus(info.consensusLock, info.timeLock))).toFixed(3);
              assetInfo.total = Number(timesDecimals(info.totalBalance)).toFixed(3);
            }
            // this.addressInfo.balance = newAssetsList.balance;
            this.addressNULSAssets = assetInfo;
            this.getNULSUSDT(Number(assetInfo.total));
            this.overviewLoading = false;
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
        axios.defaults.baseURL = '';
        let url = 'http://binanceapi.zhoulijun.top/api/v3/ticker/price?symbol=NULSUSDT';
        if (process.env.NODE_ENV !== 'development') {
          url = "/market-api/nuls-price"
        } else {
          url = "http://binanceapi.zhoulijun.top/api/v3/ticker/price?symbol=NULSUSDT";
        }
        axios.get(url)
          .then((response) => {
            this.NULSUsdt = Number(Times(Number(response.data.price), number)).toFixed(3)
          })
          .catch((error) => {
            console.log(error);
          })
      },

      /**
       * 获取nrc20资产列表
       **/
      async getTokenListByAddress() {
        await this.$post('/', 'getAccountTokens', [this.pageNumber, this.pageSize, this.addressInfo.address], 'Home')
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.key = itme.contractAddress;
                itme.account = itme.tokenSymbol;
                itme.type = 2;
                //锁定
                itme.locking = itme.lockedBalance ? divisionDecimals(itme.lockedBalance, itme.decimals) : 0;
                //总额
                itme.total = divisionDecimals(itme.balance, itme.decimals);
                //可用
                itme.balance = divisionDecimals(Minus(itme.balance, itme.lockedBalance), itme.decimals);
                itme.contractAddresss = superLong(itme.contractAddress, 6);
              }
            }
            const newAssetsList = response.result.list.filter(obj => obj.status !== 3); //隐藏已经删除合约
            this.addressInfo.tokens = [];

            const accountList = [...this.accountList];
            for (let item of accountList) {
              if (this.addressInfo.address === item.address) {
                let nrc20List = [];
                item.nrc20List = item.nrc20List ? item.nrc20List : [];
                for (let k of item.nrc20List) {
                  let newNrc20List = this.allNRC20List.filter(obj => obj.contractAddress === k.contractAddress)[0];
                  if (newNrc20List) {
                    nrc20List.push(newNrc20List)
                  } 
                }

                item.nrc20List = [...newAssetsList, ...nrc20List];
                item.nrc20List = unique(item.nrc20List, 'contractAddress');
                this.addressAssetsData = item.nrc20List;
              }
            }
            this.$store.commit('changeAccouuntList', accountList)
            this.assetsListLoading = false;
          }).catch((error) => {
            console.log(error);
          })
      },

      /**
       * 获取地址跨链资产信息
       * @param address
       **/
      async getAccountCrossLedgerList() {
        await this.$post('/', 'getAccountCrossLedgerList', [this.addressInfo.address], 'Home')
          .then((response) => {
            this.crossLinkDataLoading = false;
            if (response.hasOwnProperty("result")) {
              for (let item of response.result) {
                item.totalBalance = divisionDecimals(item.totalBalance, item.decimals);
                item.balance = divisionDecimals(item.balance, item.decimals);
                item.timeLock = divisionDecimals(item.timeLock, item.decimals);
                item.consensusLock = divisionDecimals(item.consensusLock, item.decimals);
                item.locking = Plus(item.consensusLock, item.timeLock).toString();
              }
              this.crossLinkData = response.result;
              this.txListDataLoading = false;
            }
          }).catch((err) => {
            console.log(err);
          })
      },

      /**
       * 获取地址721资产信息
       * @param address
       **/
      async getAccountToken721List() {
        await this.$post('/', 'getAccountToken721s', [this.pageNumber, this.pageSize, this.addressInfo.address], 'Home')
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              this.token721List = response.result.list.filter(obj => obj.tokenSet.length !== 0); //隐藏数量为零的资产
              if (this.token721List.length !== 0) {
                this.active721 = this.active721 !== '' ? this.active721 : this.token721List[0].contractAddress;
              } else {
                this.active721 = '';
              }
            }
          }).catch((err) => {
            console.log(err);
          })
      },

      async getNRC1155TokenList() {
        this.$post('/', 'getAccountToken1155s', [this.pageNumber, this.pageSize, this.addressInfo.address])
          .then((response) => {
            console.log(response);
            if (response.hasOwnProperty("result")) {
              this.nrc1155List = response.result.list;
              if (this.nrc1155List.length !== 0) {
                this.active1155 = this.active1155 !== '' ? this.active1155 : this.nrc1155List[0].tokenId;
              } else {
                this.active1155 = '';
              }
            }
          }).catch((error) => {
          console.log(error)
        })
      },

      /**
       * @disc: tab 切换
       * @params: tab
       * @date: 2019-12-04 11:38
       * @author: Wave
       */
      payeeHandleClick(tab) {
        if (tab.name === 'payeeScan') {
          if (document.getElementById('qrcode')) {
            document.getElementById('qrcode').innerHTML = '';
          }
          this.qrcode(this.addressInfo.address);
        }
      },

      /**
       * @disc: 获取所有list
       * @params:
       * @date: 2020-12-15 15:53
       * @author: Wave
       */
      async allList(pageIndex = 1, pageSize = 100) {
        let resDatas = await this.getAllNRC20(pageIndex, pageSize);
        if (resDatas.success) {
          let newAssetsList = resDatas.data.list.filter(obj => obj.status !== 3); //隐藏已经删除合约
          this.allNRC20List = [...this.allNRC20List, ...newAssetsList];
          if (resDatas.data.totalCount > pageIndex * pageSize) {
            this.allList(pageIndex + 1, pageSize)
          } else {
            this.getTokenListByAddress();
          }
        }
      },

      /**
       * 获取所有的NRC20合约
       **/
      async getAllNRC20(pageIndex = 1, pageSize = 100) {
        return await this.$post('/', 'getContractList', [pageIndex, pageSize, 1, false])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              //this.contractInfo = response.result;
              for (let item of response.result.list) {
                item.value = item.symbol;
                item.total = 0;
                item.isShow = false;
              }
              return {success: true, data: response.result}
            } else {
              return {success: false, data: response}
            }
          })
          .catch((error) => {
            return {success: false, data: error}
          });
      },

      /**
       * @disc:显示 token管理弹框
       * @params:
       * @date: 2020-12-28 15:26
       * @author: Wave
       */
      plusToken() {
        for (let item of this.addressInfo.nrc20List) {
          let newList = this.allNRC20List.findIndex(k => k.contractAddress === item.contractAddress);
          if (newList !== -1) {
            this.allNRC20List[newList].isShow = true;
            this.allNRC20List[newList].total = item.total
          }
        }
        this.showList = this.allNRC20List;
        this.tokenDialog = true;
      },

      /**
       * @disc: 搜索Token
       * @params:
       * @date: 2020-12-28 17:36
       * @author: Wave
       */
      changeToken(e) {
        this.isShowZero = false;
        let newList = this.allNRC20List.filter(item => item.symbol.toLowerCase().includes(e.toLowerCase()) || item.contractAddress.toLowerCase().includes(e.toLowerCase()));
        this.showList = newList;
      },

      /**
       * @disc: token选中或者隐藏
       * @params:
       * @date: 2020-12-28 17:50
       * @author: Wave
       */
      changeShow(info) {
        if (info.isShow) {
          info.locking = 0;
          this.addressAssetsData.push(info);
        } else {
          let newIndex = this.addressAssetsData.findIndex(k => k.contractAddress === info.contractAddress);
          this.addressAssetsData.splice(newIndex, 1);
        }

        const accountList = [...this.accountList];
        for (let item of accountList) {
          if (item.address === this.addressInfo.address) {
            item.nrc20List = this.addressAssetsData;
          }
        }
        this.$store.commit('changeAccouuntList', accountList)
      },

      /**
       * @disc: token管理弹框关闭
       * @params:
       * @date: 2020-12-28 18:04
       * @author: Wave
       */
      tokenDioloClose() {
        this.tokenSearch = '';
      },

      /**
       * 连接跳转
       * @param name
       * @param parms
       * @param type 0:本网站跳转，1：跳转浏览器
       */
      toUrl(name, parms, type = 0) {
        if (type === 1) {
          connectToExplorer(name, parms)
        } else {
          let newParms = {accountType: parms};
          if (name === 'transfer') {
            let newQuery = {contractAddress: newParms.accountType.contractAddress};
            this.$router.push({
              name: name,
              query: newQuery
            })
          } else if (name === 'frozenList') {
            this.$router.push({
              name: name,
              query: {
                chainId: parms.chainId,
                assetId: parms.assetId
              }
            })
          } else {
            if (parms.type === 2) {
              this.$router.push({
                name: 'tokenTxList',
                query: {contractAddress: parms.contractAddress}
              })
            } else {
              this.$router.push({
                name: name,
                query: {chainId: parms.chainId, assetId: parms.assetId,}
              })
            }
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
  @import "../../assets/css/style";

  .home {
    background-color: @Bcolour1;
    .title {
      height: 130px;
    }
    .overview {
      border: @BD1;
      margin: -30px auto 0;
      height: 158px;
      .title {
        text-align: left;
        background-color: #f9fafd;
        line-height: 40px;
        // color: #9C9CBA;
        height: 40px;
        font-size: 16px;
        padding: 0 20px;
        border-bottom: 1px solid #dfe4ef;
        font-weight: bold;
        img {
          width: 15px;
          margin: 6px 10px 5px 10px;
          float: left;
        }
        .logo {
          width: 76px;
          margin: 3px 0 0;
        }
        span {
          font-size: 14px;
          font-weight: normal;
        }
      }
      p {
        font-size: 16px;
        font-weight: 600;
        color: #9C9CBA;
        padding: 20px 30px 5px;
      }
      h6 {
        font-weight: 600;
        font-size: 24px;
        // color: #475472;
        padding: 0 30px;
        font {
          padding: 0 20px 0 0;
          font-weight: 600;
          font-size: 24px;
          // color: #475472;
        }
      }
      .total {
        width: 441px;
        height: 90px;
        border-right: @BD1;
        margin: 14px auto;
        h6 {
          span {
            font-weight: normal;
          }
        }
      }
      .balance {
        width: 35%;
        p {
          padding: 34px 0 0 70px;
        }
        h6 {
          padding: 4px 0 0 70px;
          font {
            display: block;
            float: left;
          }
          .el-button {
            padding: 5px 15px;
            border-radius: 2px;
            display: block;
            float: left;
            margin-top: 2px;
          }
          .el-button--default {
            margin-left: 12px;
          }
        }
      }
      .locking {
        width: 28%;
        p {
          padding: 34px 0 0 80px;
        }
        h6 {
          padding: 4px 0 0 80px;
          span {
            font-weight: normal;
          }
        }
      }

    }
    .el-icon-circle-plus-outline {
      font-size: 22px;
      margin: 0 10px 10px 0;
    }
    .home_tabs {
      padding-bottom: 100px;
      .el-table td {
        padding: 16px 0 !important;
      }
      .el-table .el-table__body-wrapper .el-table__body tr td {
        border-right: 0;
        padding: 16px 0 !important;
      }
    }
    .el-tabs .el-tabs__header .el-tabs__nav-wrap .is-active {
      color: @Ncolour;
      span {
        color: @Ncolour;
      }
    }
    .tabs {
      .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__active-bar {
        height: 2px;
        background-color: @Ncolour;
      }
      .el-tabs {
        .el-tabs__header {
          .el-tabs__nav-wrap {
          }
        }
      }
    }
    .tab_nrc721 {
      margin: 13px 0 0 0;
      background-color: #ffffff;
      border: 1px solid #EBEEF5;
      .el-tabs {
        margin: 40px 0 0 0;
        .el-tabs__header {
          min-height: 250px;
          border-right: 2px solid #E4E7ED;
          .el-tabs__nav-wrap {
            width: 200px;
            .el-tabs__item {
              padding: 0 40px 0 0;
              height: 25px;
              line-height: 25px;
            }
            .is-right::after {
              width: 1px;
            }
          }
        }
        .el-tabs__active-bar {
          background-color: @Ncolour;
        }

      }
      .el-tabs--left .el-tabs__nav-wrap.is-left::after {
        width: 1px;
      }
    }
    .payee_dialog {
      .el-dialog {
        .el-dialog__header {
          border: 0;
          padding: 0;
        }
        .el-dialog__body {
          padding: 15px 0 30px;
          .el-tabs__header {
            .el-tabs__item {
              padding-left: 20px;
            }
          }
          .el-tabs__content {
            padding: 0 20px;
          }
          .qrcode {
            margin: 0 auto;
            width: 250px;
            height: 250px;
            img {
              text-align: center;
            }
          }
          .font12 {
            height: 20px;
            margin: 10px 0 0 0;
          }
        }
      }
    }
    .payee_form {
      width: 20rem;
      .el-form-item {
        .el-select {
          .el-input {
            .el-input__inner {
              width: 20rem !important;
            }
          }

        }
      }
      .el-button {
        width: 7rem;
      }
      .el-button--success {
        span {
          color: #ffffff;
        }
      }
    }

    .token-diolog {
      .el-dialog__header {
      }
      .el-dialog__body {
        .token-search {
          .el-input__suffix {
            .el-input__icon {
              line-height: 32px;
            }
          }
        }
        .token-list {
          margin: 20px 0 0 0;
          height: 500px;
          padding: 0 10px 0 0;
          overflow-y: auto;
          li {
            height: 60px;
            border-bottom: 1px solid #dfe4ef;
            h5 {
              width: 250px;
              font-size: 12px;
              line-height: 26px;
              padding: 4px 0 0 0;
              color: #5e6983;
              span {
                font-size: 14px;
                color: #5e6983;
                padding: 0 0 0 5px;
              }
            }
            h6 {
              font-size: 12px;
              line-height: 26px;
              color: #5e6983;
              span {
                font-size: 12px;
                color: #5e6983;
              }
            }
            .fr {
              margin: 15px 10px 0 0;
            }
          }
        }
      }
      .el-dialog__footer {
      }
    }
    .code-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .address {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
      }
    }
  }
</style>
