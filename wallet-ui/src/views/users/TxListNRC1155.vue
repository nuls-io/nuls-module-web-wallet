<template>
  <div class="txlist bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.wallet')">
        </BackBar>
        <h3 class="title">{{$t('home.home2')}}</h3>
      </div>
    </div>

    <div class="w1200">
      <div v-loading="txListDataLoading" class="mb_100">
        <el-table :data="txListData" stripe border>
          <el-table-column width="20"></el-table-column>
          <el-table-column :label="$t('public.height')" width="80">
            <template slot-scope="scope">
              <span class="click td" @click="openUrl('height',scope.row.height,1)">{{scope.row.height}}</span>
            </template>
          </el-table-column>
          <el-table-column label="TxID" min-width="200">
            <template slot-scope="scope">
              <router-link class="click" tag="a" :to="{name:'transferInfo',query:{hash:scope.row.txHash}}">
                {{ scope.row.txid }}
              </router-link>
              <!--<span class="click " @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txid}}</span>-->
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.fromAddresss')" width="160">
            <template slot-scope="scope">
              <span class="click td" @click="openUrl('address',scope.row.fromAddress,1)">{{scope.row.fromAddresss}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.toAddresss')" width="160">
            <template slot-scope="scope">
              <span class="click td" @click="openUrl('address',scope.row.toAddress,1)">{{scope.row.toAddresss}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('tab.tab5')" width="160">
          </el-table-column>
          <el-table-column :label="'Token'+$t('nodeService.nodeService2')" width="130">
            <template slot-scope="scope">
              <span>
                {{scope.row.symbol}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Token ID" width="130">
            <template slot-scope="scope">
              <span>
                #{{scope.row.tokenId}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('public.amount')" width="130" ></el-table-column>
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
  import {getLocalTime, superLong, connectToExplorer} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        txListDataLoading: true,//资产加载动画
        txListData: [],//交易数据
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        txListSetInterval: null,//定时器
      };
    },
    computed: {
      addressInfo() {
        return this.$store.getters.currentAccount
      }
    },
    mounted() {
      setTimeout(() => {
        this.getTxList();
      }, 600);
      //10秒循环一次数据
      this.txListSetInterval = setInterval(() => {
        this.getTxList();
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
    destroyed() { //离开当前页面后执行
      clearInterval(this.txListSetInterval);
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.pageIndex = 1
          this.pageTotal = 0
          this.txListData = []
          clearInterval(this.txListSetInterval)
          this.getTxList();
          this.txListSetInterval = setInterval(() => {
            this.getTxList();
          }, 10000);
        }
      }
    },
    components: {
      BackBar
    },
    methods: {

      /**
       * 根据地址获取交易列表
       * @param pageSize 当前页码
       * @param pageRows 每页条数
       * @param address 地址
       **/
      getTxList() {
        this.$post('/', 'getToken1155Transfers', [this.pageIndex, this.pageSize, this.addressInfo.address, '', ''])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.time * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.txid = superLong(item.txHash, 8);
                item.fromAddresss = superLong(item.fromAddress, 6);
                item.toAddresss = superLong(item.toAddress, 6);
              }
              this.txListData = response.result.list;
              this.pageTotal = response.result.totalCount;
              this.txListDataLoading = false;
            }
          })
          .catch((error) => {
            this.getTxList();
            console.log("getAccountTxs:" + error);
          })
      },

      /**
       * 交易列表分页功能
       * @param val
       **/
      txListPages(val) {
        this.pageIndex = val;
        this.txListDataLoading = true;
        this.getTxList();
      },

      /**
       * 连接跳转
       * @param name
       * @param params
       */
      toUrl(name, params) {
        let newQuery = {hash: params};
        this.$router.push({
          name: name,
          query: newQuery
        })
      },
      openUrl(name, params) {
        connectToExplorer(name, params)
      }

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
