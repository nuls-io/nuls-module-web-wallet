<template>
  <div class="txlist bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.wallet')"></BackBar>
        <h3 class="title">Token{{$t('home.home2')}}</h3>
      </div>
    </div>

    <div class="w1200">
      <div v-loading="txListDataLoading">
        <div class="filter">
          <el-select :value="tokenValue==='0' ? $t('public.allToke') : tokenValue" @change="channgeType">
            <el-option v-for="item in tokenOptions" :key="item.key" :label="item.tokenSymbol"
                       :value="item">
            </el-option>
          </el-select>
        </div>
        <el-table :data="txListData" stripe border>
          <el-table-column :label="$t('public.height')" align="center" width="80">
            <template slot-scope="scope">
              <span class="click td" @click="toUrl('height',scope.row.height,1)">{{scope.row.height}}</span>
            </template>
          </el-table-column>
          <el-table-column label="TxID" align="center" width="210">
            <template slot-scope="scope">
              <router-link class="click" tag="a" :to="{name:'transferInfo',query:{hash:scope.row.txHash}}">
                {{ scope.row.txid }}
              </router-link>
              <!--<span class="click " @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txid}}</span>-->
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.fromAddresss')" align="center" width="160">
            <template slot-scope="scope">
              <span class="click td" @click="toUrl('address',scope.row.fromAddress,1)">{{scope.row.fromAddresss}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.toAddresss')" align="center" width="160">
            <template slot-scope="scope">
              <span class="click td" @click="toUrl('address',scope.row.toAddress,1)">{{scope.row.toAddresss}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('tab.tab5')" align="center">
          </el-table-column>
          <el-table-column :label="$t('public.amount')" align="center">
            <template slot-scope="scope">
              <span :class="scope.row.fromAddress === addressInfo.address ? 'fred':'fCN'">
                {{scope.row.fromAddress === addressInfo.address ? -1*scope.row.amount:scope.row.amount}}({{scope.row.symbol}})
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.balance')" align="center">
            <template slot-scope="scope">
              <span>
                {{scope.row.balance}}({{scope.row.symbol}})
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <div class="page-total">
            {{pageIndex-1 === 0 ? 1 : (pageIndex-1) * pageSize}}-{{pageIndex * pageSize}}
            of {{pageTotal}}
          </div>
          <el-pagination v-show="pageTotal > pageSize" @current-change="txListPages" class="fr"
                         :current-page="pageIndex"
                         :page-size="pageSize"
                         background
                         layout=" prev, pager, next, jumper"
                         :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {timesDecimals, getLocalTime, superLong, addressInfo,connectToExplorer} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        tokenOptions: [],//token类型
        tokenValue: '0',
        contractAddress: '',//合约地址
        txListDataLoading: true,//资产加载动画
        txListData: [],//交易数据
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        addressInfo: [], //账户信息
        txListSetInterval: null,//定时器
      };
    },
    created() {
      this.contractAddress = this.$route.query.contractAddress;
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
    },
    mounted() {
      setTimeout(() => {
        this.getTokenListByAddress(1, 100, this.addressInfo.address);
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.contractAddress);
      }, 600);
      //10秒循环一次数据
      this.txListSetInterval = setInterval(() => {
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.contractAddress);
      }, 10000);
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'transferInfo') {
        from.meta.keepAlive = true
      } else {
        from.meta.keepAlive = false
      }
      next();
    },
    destroyed() {
      clearInterval(this.txListSetInterval);
    },
    components: {
      BackBar
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.contractAddress);
        }
      }
    },
    methods: {

      /**
       * 获取地址代币资产信息
       * @param pageSize
       * @param pageRows
       * @param address
       **/
      getTokenListByAddress(pageSize, pageRows, address) {
        this.$post('/', 'getAccountTokens', [pageSize, pageRows, address], 'TokenTxList')
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.tokenOptions = response.result.list;
              let newArr = {
                contractAddress: "",
                key: "EtDfvZuukDf2mVy",
                tokenSymbol: this.$t('public.allToke')
              };
              this.tokenOptions.unshift(newArr)
            }
          })
      },

      /**
       * 根据地址获取交易列表
       * @param pageSize
       * @param pageRows
       * @param address
       * @param contractAddress
       **/
      getTxlistByAddress(pageSize, pageRows, address, contractAddress) {
        this.$post('/', 'getTokenTransfers', [pageSize, pageRows, address, contractAddress])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.time * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.txid = superLong(item.txHash, 10);
                item.fromAddresss = superLong(item.fromAddress, 6);
                item.toAddresss = superLong(item.toAddress, 6);
                item.balance = timesDecimals(item.fromAddress === this.addressInfo.address ? item.fromBalance : item.toBalance, item.decimals);
                item.amount = timesDecimals(item.value, item.decimals);
              }
              this.txListData = response.result.list;
              this.pageTotal = response.result.totalCount;
              this.txListDataLoading = false;
            }
          })
          .catch((error) => {
            console.log("getAccountTxs:" + error)
          })
      },

      /**
       * token类型下拉框选择
       * * @param e
       **/
      channgeType(e) {
        //console.log(e);
        this.tokenValue = e.tokenSymbol;
        this.contractAddress = e.contractAddress;
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.contractAddress);
      },

      /**
       * 交易列表分页功能
       * @param val
       **/
      txListPages(val) {
        this.pageIndex = val;
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.contractAddress);
      },

      /**
       * 连接跳转
       * @param name
       * @param params
       */
      toUrl(name, params, type = 0) {
        if (type === 1) {
          connectToExplorer(name,params)
        } else {
          let newQuery = {hash: params};
          this.$router.push({
            name: name,
            query: newQuery
          })
        }

      },
    }
  }
</script>

<style lang="less">
  .txlist {
    .title {
      height: 50px;
      line-height: 20px;
    }
  }
</style>
