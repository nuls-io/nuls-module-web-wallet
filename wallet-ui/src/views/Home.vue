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
        <img src="./../assets/img/nuls-logo.svg"/>{{symbol.toLocaleUpperCase()}}
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
        <img src="./../assets/img/across-logo.svg" style="width: 20px; margin-top:11px; "/>
        {{$t('home.home3')}}
      </div>
      <div class="home_tabs" style="padding: 0">
        <el-table :data="crossLinkData" stripe border v-loading="txListDataLoading"
                  element-loading-spinner="el-icon-loading">
          <el-table-column :label="$t('tab.tab0')" align="center" width="200">
            <template slot-scope="scope">
              <div style="margin: 0 0 0 30%">
                <img src="./../assets/img/nvt-logo.svg" class="fl" style="width: 25px;margin: 3px 2px 0 0"
                     v-show="scope.row.symbol ==='NVT'"/>
                <img src="./../assets/img/eth-logo.png" class="fl" style="width: 25px;margin: 3px 2px 0 0"
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
                    {{ scope.row.account }}
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
      </el-tabs>
    </div>

    <el-dialog title="" :visible.sync="qrcodeDialog" width="22.5rem" center class="token-diolog">
      <el-tabs v-model="activeName" @tab-click="payeeHandleClick">
        <el-tab-pane :label="$t('tips.tips12')" name="payeeInfo">
          <el-form :model="payeeForm" class="payee_form">
            <el-form-item label="">
              <el-input v-model="payeeForm.amount" autocomplete="off" :placeholder="$t('tips.tips13')">
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="payeeForm.currency" :placeholder="$t('tips.tips14')">
                <el-option label="NULS" value="NULS">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="tc ">
              <el-button @click="payeeNext(0)">{{$t('tips.tips15')}}</el-button>
              <el-button type="success" @click="payeeNext(1)">{{$t('public.next')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('tips.tips16')" name="payeeScan">
          <div id="qrcode" class="qrcode"></div>
          <div class="font12 tc" style="margin: 20px 0 0 0">
            {{$t('tips.tips18')}}
            <font class="click td" @click="toUrl('nuls','http://nabox.io/',1)">Nabox</font>
            /
            <font class="click td" @click="toUrl('nuls','https://www.denglu1.cn/',1)">{{$t('tips.tips11')}}</font>
            {{$t('tips.tips21')}}
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog :title="$t('home.home9')" class="token-diolog" width="37rem"
               :visible.sync="tokenDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @close="tokenDioloClose">
      <el-input :placeholder="$t('home.home10')" class="token-search" suffix-icon="el-icon-search" v-model="tokenSearch"
                @input="changeToken">
      </el-input>
      <!--<el-checkbox v-model="isShowZero" @change="changeShowZero">{{$t('home.home11')}}</el-checkbox>-->
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
  import NFTTransfer from '@/components/NFTTransfer'
  import {
    timesDecimals,
    copys,
    addressInfo,
    Times,
    superLong,
    connectToExplorer,
    Plus,
    Minus,
    divisionDecimals,
    chainID,
    unique
  } from '@/api/util'

  export default {
    name: 'home',
    data() {
      return {
        symbol: 'NULS', //symbol
        homeActive: 'homeFirst',  //tab默认选中
        addressInfo: {},//默认账户信息
        addressNULSAssets: {},//账户NULS资产信息
        overviewLoading: true,//nuls资产加载动画
        addressAssetsData: [],//账户资产列表
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
        pageCount: 0, //总条数
        crossLinkData: [],//跨链资产
        crossLinkDataLoading: true, //资产加载动画
        qrcodeDialog: false,//二维码弹框
        activeName: 'payeeInfo', //tab
        payeeForm: {
          amount: 100,
          currency: 'NULS',
          decimals: 8
        },
        activeContract: 'nrc20',
        token721List: [],//724数据
        active721: '',
        homeSetIntervalOne: null,//定时器
        homeSetInterval: null,//定时器
        reFresh: true,
        allNRC20List: [],//所有nrc20资产
        showList: [],//显示的nrc20资产
        tokenSearch: '',//搜索内容
        isShowZero: false,//是否隐藏为零的token

      };
    },
    components: {NFTTransfer},
    created() {
      this.addressInfo = addressInfo(1);
      this.homeSetIntervalOne = setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);

      //判断是否有账户
      if (this.addressInfo) {
        setTimeout(() => {
          this.getAddressInfoByNode(this.addressInfo.address);
          this.allNRC20List = [];
          this.allList();
          setTimeout(() => {
            this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address);
            this.getAccountCrossLedgerList(this.addressInfo.address);
            this.getAccountToken721List(this.addressInfo.address);
          }, 400);
        }, 600);
      } else {
        this.$router.push({
          name: "newAddress"
        })
      }
    },
    mounted() {
      this.symbol = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS';

      this.homeSetInterval = setInterval(() => {
        this.getAccountToken721List(this.addressInfo.address);
      }, 10000);
    },
    destroyed() {
      clearInterval(this.homeSetIntervalOne);
      clearInterval(this.homeSetInterval);
    },
    watch: {
      addressInfo(val, old) {
        if (val) {
          if (val.address !== old.address && old.address) {
            this.token721List = [];
            this.active721 = '';
            this.getAddressInfoByNode(this.addressInfo.address);
            this.reFresh = false;
            this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address);
            this.getAccountCrossLedgerList(this.addressInfo.address);
            this.getAccountToken721List(this.addressInfo.address);
            this.$nextTick(() => {
              this.reFresh = true
            })
          }
        }
      }
    },
    methods: {

      /**
       * @disc: 显示二维码
       * @date: 2019-08-27 11:12
       * @author: Wave
       */
      showCode() {
        this.activeName = 'payeeInfo';
        this.qrcodeDialog = true;
        if (document.getElementById('qrcode')) {
          document.getElementById('qrcode').innerHTML = '';
        }
      },

      /**
       * @disc:
       * @params:
       * @date: 2019-12-11 13:44
       * @author: Wave
       */
      payeeNext() {
        if (document.getElementById('qrcode')) {
          document.getElementById('qrcode').innerHTML = '';
        }
        this.activeName = 'payeeScan';
        this.qrcode(this.addressInfo.address);
      },

      /**
       * @disc: 二维码生成
       * @params: address
       * @date: 2019-08-27 11:12
       * @author: Wave
       */
      qrcode(address) {
        let qrcode = new QRCode('qrcode', {
          width: 250,
          height: 250,
          colorDark: "#000000",
          colorLight: "#ffffff",
        });

        let qrcodeInfo = {
          "address": address,
          "chainId": 1,
          "assetId": 1,
          "contractAddress": "",
          "amount": this.payeeForm.amount,
          "payer": ""
        };
        //console.log(qrcodeInfo);
        qrcode.makeCode(JSON.stringify(qrcodeInfo))
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
          this.addressAssetsData = [];
          this.getAccountCrossLedgerList(this.addressInfo.address)
        } else {
          this.pageNumber = 1;
          this.pageSize = 100;
          this.pageCount = 0;
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
              newAssetsList.balance = Number(timesDecimals(response.result[0].balance)).toFixed(3);
              newAssetsList.locking = Number(timesDecimals(Plus(response.result[0].consensusLock, response.result[0].timeLock))).toFixed(3);
              newAssetsList.total = Number(timesDecimals(response.result[0].totalBalance)).toFixed(3);
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
            //console.log(this.addressNULSAssets);
            this.getNULSUSDT(Number(newAssetsList.total));
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
        axios.defaults.baseURL = '';
        let url = '';
        //console.log(process.env.NODE_ENV ==='development');
        if (process.env.NODE_ENV === 'development') {
          url = "http://binanceapi.zhoulijun.top/api/v3/ticker/price?symbol=NULSUSDT"
        } else {
          url = "/market-api/nuls-price"
        }
        axios.get(url)
          .then((response) => {
            //console.log(response.data);
            this.NULSUsdt = Number(Times(Number(response.data.price), number)).toFixed(3)
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
            if (response.hasOwnProperty("result")) {
              this.addressAssetsData = [];
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
            this.addressInfo.tokens = newAssetsList;

            let newList = [];
            for (let item of this.addressInfo.tokens) {
              //console.log(item);
              newList.push({key: item.contractAddress, symbol: item.tokenSymbol, decimals: item.decimals})
            }
            sessionStorage.removeItem('assetsList');
            sessionStorage.setItem('assetsList', JSON.stringify(newList));

            //浏览器记录显示nrc20合约
            let newShowData = newAssetsList.filter(obj => Number(obj.total) > 0);
            //console.log(newShowData);
            let nrc20Name = 'nrc20List' + chainID();
            //console.log(nrc20Name);
            if (localStorage.hasOwnProperty(nrc20Name)) {
              let newData = [...newShowData, ...JSON.parse(localStorage.getItem(nrc20Name))];
              this.addressAssetsData = newData;
              localStorage.setItem(nrc20Name, JSON.stringify(unique(newData, 'contractAddress')))
            } else {
              this.addressAssetsData = newShowData;
              localStorage.setItem(nrc20Name, JSON.stringify(unique(newShowData, 'contractAddress')));
            }
            this.addressAssetsData = unique(this.addressAssetsData, 'contractAddress');
            //console.log(this.addressAssetsData);
            this.assetsListLoading = false;
          }).catch((error) => {
            console.log(error);
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
            //this.getAccountCrossLedgerList(address);
            console.log(err);
          })
      },

      /**
       * 获取地址721资产信息
       * @param address
       **/
      async getAccountToken721List(address) {
        await this.$post('/', 'getAccountToken721s', [1, 100, address], 'Home')
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.token721List = response.result.list.filter(obj => obj.tokenSet.length !== 0); //隐藏数量为零的资产
              //console.log(this.token721List);
              if (this.token721List.length !== 0) {
                this.active721 = this.active721 !== '' ? this.active721 : this.token721List[0].contractAddress;
              } else {
                this.active721 = '';
              }
              //console.log(this.active721);
            }
          }).catch((err) => {
            console.log(err);
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
        //console.log(resDatas);
        if (resDatas.success) {
          let newAssetsList = resDatas.data.list.filter(obj => obj.status !== 3); //隐藏已经删除合约
          this.allNRC20List = [...this.allNRC20List, ...newAssetsList];
          if (resDatas.data.totalCount > pageIndex * pageSize) {
            this.allList(pageIndex + 1, pageSize)
          }
        }
      },

      /**
       * 获取所有的NRC20合约
       **/
      async getAllNRC20(pageIndex = 1, pageSize = 100) {
        return await this.$post('/', 'getContractList', [pageIndex, pageSize, 1, false])
          .then((response) => {
            //console.log(response);
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
        let nrc20Name = 'nrc20List' + chainID();
        let newData = JSON.parse(localStorage.getItem(nrc20Name));
        for (let item of newData) {
          let newList = this.allNRC20List.findIndex(k => k.contractAddress === item.contractAddress);
          if (newList) {
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
       * @disc: 隐藏为零的 token
       * @params:
       * @date: 2020-12-28 17:38
       * @author: Wave
       */
      changeShowZero() {
        let newList = [];
        if (this.isShowZero) {
          this.tokenSearch = '';
          newList = this.allNRC20List.filter(item => Number(item.total) > 0);
        } else {
          newList = this.allNRC20List
        }
        this.showList = newList;
      },

      /**
       * @disc: token选中或者隐藏
       * @params:
       * @date: 2020-12-28 17:50
       * @author: Wave
       */
      changeShow(info) {
        //console.log(info);
        let nrc20Name = 'nrc20List' + chainID();
        let newData = JSON.parse(localStorage.getItem(nrc20Name));
        if (info.isShow) {
          newData.push(info)
        } else {
          let newIndex = newData.findIndex(k => k.contractAddress === info.contractAddress);
          newData.splice(newIndex, 1);
        }
        localStorage.setItem(nrc20Name, JSON.stringify(newData))
      },

      /**
       * @disc: token管理弹框关闭
       * @params:
       * @date: 2020-12-28 18:04
       * @author: Wave
       */
      tokenDioloClose() {
        let nrc20Name = 'nrc20List' + chainID();
        let newData = JSON.parse(localStorage.getItem(nrc20Name));
        this.addressAssetsData = newData;
      },

      /**
       * 连接跳转
       * @param name
       * @param parms
       * @param type 0:本网站跳转，1：跳转浏览器
       */
      toUrl(name, parms, type = 0) {
        //console.log(name, parms, type);
        if (type === 1) {
          connectToExplorer(name, parms)
        } else {
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
              //console.log(parms);
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
  @import "./../assets/css/style";

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
        color: #475472;
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
        span {
          font-size: 14px;
          font-weight: normal;
        }
      }
      p {
        font-size: 16px;
        font-weight: 600;
        color: #8794b1;
        padding: 20px 30px 5px;
      }
      h6 {
        font-weight: 600;
        font-size: 24px;
        color: #475472;
        padding: 0 30px;
        font {
          padding: 0 20px 0 0;
          font-weight: 600;
          font-size: 24px;
          color: #475472;
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
      color: #6ab71a;
      span {
        color: #6ab71a;
      }
    }
    .tabs {
      .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__active-bar {
        height: 2px;
        background-color: #6ab71a;
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
          background-color: #6ab71a;
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
  }
</style>
