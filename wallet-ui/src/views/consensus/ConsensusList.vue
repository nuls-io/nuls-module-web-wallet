<template>
  <div class="consensus_list bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.consensus')"></BackBar>
        <h3 class="title">{{$t('consensusList.consensusList0')}}</h3>
      </div>
    </div>

    <div class="w1200 mt_20">
      <div class="top_total font12">
        {{$t('public.totalStake')}}：{{this.$route.query.consensusLock}} <span class="fCN">{{agentAsset.agentAsset.symbol}}</span>
      </div>
      <el-table :data="consensusData" stripe border v-loading="consensusDataLoading">
        <el-table-column prop="blockHeight" :label="$t('public.height')" align="center">
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('consensusList.consensusList1')" align="center">
        </el-table-column>
        <el-table-column :label="$t('consensusList.consensusList2')" align="center" min-width="200">
          <template slot-scope="scope">
            <span class="click uppercase"
                  @click="toUrl('consensusInfo',scope.row.agentHash)">{{scope.row.agendID}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('public.amount') + '('+agentAsset.agentAsset.symbol+')'"
                         align="center">
        </el-table-column>
      </el-table>
      <div class="pages">
        <div class="page-total">
          {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
          of {{pageTotal}}
        </div>

        <el-pagination v-show="pageTotal > pageSize" @current-change="consensusPages" class="fr" background
                       :current-page="pageIndex"
                       :page-size="pageSize"
                       layout=" prev, pager, next, jumper"
                       :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {timesDecimals, getLocalTime, addressInfo} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        consensusData: [],//委托列表
        addressInfo: {},//账户信息
        agentAsset: JSON.parse(sessionStorage.getItem('info')),//pocm合约单位等信息
        consensusDataLoading: true,//委托类别加载动画
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
      };
    },
    created() {
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
      setTimeout(() => {
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address)
      },600);
    },
    components: {
      BackBar
    },
    methods: {

      /**
       * 根据hash获取节点委托列表
       * @param pageIndex
       * @param pageSize
       * @param address
       **/
      getNodeDepositByHash(pageIndex, pageSize, address) {
        this.totalAmount = 0;
        this.$post('/', 'getAccountDeposit', [pageIndex, pageSize, address, ''])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.amount = timesDecimals(itme.amount);
                //itme.txHashs = superLong(itme.txHash, 20);
                itme.agendID = itme.agentHash.substr(-8);
                itme.createTime = moment(getLocalTime(itme.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                //this.totalAmount = this.totalAmount + Number(itme.amount);
              }
              this.consensusData = response.result.list;
              this.pageTotal = response.result.totalCount;
              this.consensusDataLoading = false;
            } else {
              this.consensusDataLoading = false;
            }
          })
          .catch((error) => {
            console.log("getConsensusDeposit:" + error);
          });
      },

      /**
       * 分页功能
       * @param val
       **/
      consensusPages(val) {
        this.pageIndex = val;
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address)
      },

      /**
       * 连接跳转
       * @param name
       * @param params
       */
      toUrl(name, params) {
        //console.log(name)
        let newQuery = {hash: params};
        this.$router.push({
          name: name,
          query: newQuery
        });
      },
    }
  }
</script>

<style lang="less">

</style>
