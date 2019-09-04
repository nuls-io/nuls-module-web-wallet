<template>
  <div class="home">
    <h3 class="title" v-if="addressInfo">
      {{addressInfo.address}}
      <span v-show="addressInfo.alias">({{addressInfo.alias}})</span>
      <i class="iconfont iconfuzhi clicks" @click="copy(addressInfo.address)"></i>
    </h3>
    <el-tabs v-model="homeActive" @tab-click="handleClick" class="w1200">
      <el-tab-pane label="主网资产" name="homeFirst" v-loading="assetsListLoading">
        <el-select v-model="assetsValue" @change="channgeAsesets" disabled>
          <el-option v-for="item in assetsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <el-table :data="addressAssetsData" stripe border>
          <el-table-column prop="account" label="资产" align="center">
          </el-table-column>
          <el-table-column label="类型" align="center" width="150">
            <template slot-scope="scope"><span>{{ $t('addressType.'+scope.row.type) }}</span></template>
          </el-table-column>
          <el-table-column prop="total" label="总额">
          </el-table-column>
          <el-table-column label="锁定">
            <template slot-scope="scope">
              <span class="click td" @click="toUrl('frozenList')"
                    v-show="scope.row.locking !== '--' && scope.row.locking !==0 ">{{scope.row.locking}}</span>
              <span v-show="scope.row.locking === '--' || scope.row.locking ===0">{{scope.row.locking}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="可用">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template>
              <label class="click tab_bn" @click="toUrl('transfer')">转账</label>
              <span class="tab_line">|</span>
              <label class="click tab_bn" @click="toUrl('txList')">交易记录</label>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <div class="page-total">
            显示 {{pageNumber-1 === 0 ? 1 : (pageNumber-1) *pageSize}}-{{pageNumber*pageSize}}
            共 {{addressAssetsData.length}}
          </div>
          <el-pagination v-show="addressAssetsData.length > pageSize" class="fr" background
                         @current-change="addressAssetsListPages"
                         layout=" prev, pager, next, jumper"
                         :total="addressAssetsData.length">
          </el-pagination>
        </div>

      </el-tab-pane>
      <el-tab-pane label="跨链资产" name="homeSecond" disabled>
        <div v-loading="txListDataLoading">
          <div class="filter">
            <el-select v-model="assetsValue">
              <el-option v-for="item in assetsOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="typeValue">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="inAndOutValue">
              <el-option v-for="item in inAndOutOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

            <el-switch v-model="isHide" active-text="" inactive-text="隐藏共识奖励" :width="35" @change="changeHide">
            </el-switch>
          </div>
          <el-table :data="txListData" stripe border>
            <el-table-column prop="account" label="资产" align="center" width="100">
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="100">
            </el-table-column>
            <el-table-column label="TxID" align="center">
              <template slot-scope="scope">
                <span class="click " @click="toUrl('transferInfo')">{{scope.row.txid}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" align="center">
            </el-table-column>
            <el-table-column prop="tAddress" label="交易地址" align="center">
            </el-table-column>
            <el-table-column prop="amount" label="金额" align="center">
            </el-table-column>
            <el-table-column prop="balance" label="余额" align="center">
            </el-table-column>
            <el-table-column prop="state" label="状态" align="center" width="100">
            </el-table-column>
          </el-table>
          <div class="pages">
            <div class="page-total">
              显示 {{pageNumber-1 === 0 ? 1 : (pageNumber-1) *pageSize}}-{{pageNumber*pageSize}}
              共 {{pageCount}}
            </div>
            <el-pagination v-show="pageCount > pageSize" @current-change="txListPages" class="fr"
                           :current-page="pageNumber"
                           :page-size="pageSize"
                           background
                           layout=" prev, pager, next, jumper"
                           :total="pageCount">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import moment from 'moment'
  import {timesDecimals, getLocalTime, superLong, copys} from '@/api/util'

  export default {
    name: 'home',
    data() {
      return {
        //tab默认选中
        homeActive: 'homeFirst',
        //默认账户信息
        addressInfo: {},
        //资产加载动画
        assetsListLoading: true,
        //账户资产列表
        addressAssetsData: [],
        //资产类型
        assetsOptions: [
          {value: '0', label: '所有资产'},
          {value: '1', label: '普通资产'},
          {value: '2', label: '合约资产'}
        ],
        assetsValue: "所有资产",
        //资产加载动画
        txListDataLoading: true,
        //交易数据
        txListData: [],
        //页码
        pageNumber: 1,
        //条数
        pageSize: 10,
        //总条数
        pageCount: 0,
        //类型
        type: 0,
        //隐藏共识奖励
        isHide: false,

        //交易类型
        typeOptions: [
          {value: '0', label: '所有交易'},
          {value: '1', label: '共识奖励'},
          {value: '2', label: '转账交易'},
          {value: '3', label: '设置别名'},
          {value: '4', label: '创建节点'},
          {value: '5', label: '加入共识'},
          {value: '6', label: '零钱换整'},
          {value: '7', label: '退出共识'},
          {value: '8', label: '黄牌惩罚'},
          {value: '9', label: '红牌惩罚'},
          {value: '10', label: '注销节点'},
          {value: '11', label: '通用数据'},
          {value: '12', label: '创建合约'},
          {value: '13', label: '调用合约'},
          {value: '14', label: '删除合约'},
          {value: '15', label: '合约转账'},
          {value: '16', label: '合约返还'},
          {value: '17', label: '通证转账'},
        ],
        typeValue: '所有交易',

        //收入/支出
        inAndOutOptions: [
          {value: '0', label: '收入/支出'},
          {value: '1', label: '收入'},
          {value: '2', label: '支出'},
        ],
        inAndOutValue: '收入/支出',

      };
    },
    components: {},
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
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
                this.getTokenListByAddress(this.pageNumber, this.pageSize, this.addressInfo.address)
              }, 200);
            } else {
              this.pageNumber = 1;
              this.pageSize = 10;
              this.pageCount = 0;
              this.getTxlistByAddress(this.pageNumber, this.pageSize, this.addressInfo.address, this.type, this.isHide)
            }
          }
        }

      }
    },
    methods: {

      /**
       * tab 切换
       * @param tab
       **/
      handleClick(tab) {
        if (tab.name === 'homeSecond') {
          this.pageNumber = 1;
          this.pageSize = 10;
          this.pageCount = 0;
          this.getTxlistByAddress(this.pageNumber, this.pageSize, this.addressInfo.address, this.type, this.isHide)
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
       * 获取地址网络信息
       * @param address
       **/
      getAddressInfoByNode(address) {
        this.$post('/', 'getAccount', [address])
          .then((response) => {
            //console.log(response);
            this.addressAssetsData = [];
            let newAssetsList = {};
            if (response.hasOwnProperty("result")) {
              newAssetsList.account = "NULS";
              newAssetsList.type = 1;
              newAssetsList.total = timesDecimals(response.result.totalBalance);
              newAssetsList.locking = timesDecimals(response.result.consensusLock + response.result.timeLock);
              newAssetsList.balance = timesDecimals(response.result.balance);
            } else {
              newAssetsList.account = "NULS";
              newAssetsList.type = 1;
              newAssetsList.total = 0;
              newAssetsList.locking = 0;
              newAssetsList.balance = 0;
            }
            this.addressInfo.balance = newAssetsList.balance;
            localStorage.setItem(this.addressInfo.address,JSON.stringify(this.addressInfo));
            sessionStorage.setItem(this.addressInfo.address,JSON.stringify(this.addressInfo));
            this.addressAssetsData.push(newAssetsList);
            this.assetsListLoading = false;
          })
          .catch((error) => {
            console.log("getAccount:"+error);
            this.assetsListLoading = false;
          });
      },

      /**
       * 获取地址代币列表
       * @param pageSize
       * @param pageRows
       * @param address
       **/
      getTokenListByAddress(pageSize, pageRows, address) {
        this.$post('/', 'getAccountTokens', [pageSize, pageRows, address])
          .then((response) => {
            //console.log(response);
            let newAssetsList = {};
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.account = itme.tokenName;
                itme.type = 2;
                itme.total = timesDecimals(itme.balance, itme.decimals);
                itme.locking = '--';
                itme.balance = timesDecimals(itme.balance, itme.decimals);
              }
              newAssetsList = response.result.list;
            }
            this.addressAssetsData.push(...newAssetsList);
            this.assetsListLoading = false;
          })
          .catch((error) => {
            console.log("getAccountTokens:"+error);
            this.assetsListLoading = false;
          });
      },

      /**
       * 获取地址交易信息
       * @param pageSize
       * @param pageRows
       * @param address
       * @param type
       * @param isHide
       **/
      getTxlistByAddress(pageSize, pageRows, address, type, isHide) {
        this.txListDataLoading = true;
        this.$post('/', 'getAccountTxs', [pageSize, pageRows, address, type, isHide])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                item.txid = superLong(item.txHash, 8);
                item.balance = timesDecimals(item.balance);
              }
              this.txListData = response.result.list;
              this.pageCount = response.result.totalCount;
              this.txListDataLoading = false;
            }
          })
      },

      /**
       * 资产列表分页功能
       * @param val
       **/
      addressAssetsListPages(val) {
        //TODO 资产数据是否会有很多分页功能
        console.log(val);
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
       */
      toUrl(name) {
        //console.log(name)
        this.$router.push({
          name: name
        })
      },

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: "已经复制完成", type: 'success', duration: 1000});
      },
    }
  }
</script>
<style lang="less">
  @import "./../assets/css/style";

  .home {
    background-color: @Bcolour1;
    .title {
      height: 100px;
    }
    .el-tabs {
      margin: 30px auto 0;
      .el-select {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
