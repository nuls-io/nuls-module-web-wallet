<template>
  <div class="frozen_list bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.wallet')"></BackBar>
        <h3 class="title">{{$t('frozenList.frozenList0')}}</h3>
      </div>
    </div>

    <div class="w1200 mt_20">
      <el-table :data="txListData" stripe border>
        <el-table-column width="30"></el-table-column>
        <el-table-column :label="$t('tab.tab1')">
          <template slot-scope="scope"><span>{{ $t('frozenType.'+scope.row.type) }}</span></template>
        </el-table-column>
        <el-table-column label="txHash" min-width="150">
          <template slot-scope="scope">
            <span class="click" @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txHashs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('tab.tab5')">
        </el-table-column>
        <el-table-column prop="values" :label="$t('tab.tab6')">
        </el-table-column>
        <el-table-column :label=" $t('tab.tab7')">
          <template slot-scope="scope">
            <span>{{scope.row.lockedValue === -1 ? '--': scope.row.lockedTime}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tab.tab8')">
          <template slot-scope="scope">
            <span>{{scope.row.type === 3 ? $t('type.5'):  $t('frozenType.'+scope.row.type)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <div class="page-total">
          {{$t('public.display')}} {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
          {{$t('public.total')}} {{pageTotal}}
        </div>
        <el-pagination @current-change="frozenListPages" class="fr" background
                       v-show="pageTotal>pageSize"
                       :page-size=pageSize
                       layout=" prev, pager, next, jumper"
                       :total=pageTotal>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {divisionDecimals, divisionAndFix, getLocalTime, superLong} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        txListData: [],//冻结列表
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数

      };
    },
    computed: {
      addressInfo() {
        return this.$store.getters.currentAccount
      },
      currentChain() {
        return this.$store.state.currentChain
      },
    },
    watch: {
      'addressInfo.address': {
        handler(val) {
          if (val) {
            this.pageTotal = 0
            this.pageIndex =  1
            this.txListData = []
            this.getTxListByAddress()
          }
        },
        immediate: true
      }
    },
    components: {
      BackBar
    },
    methods: {

      /**
       * 获取地址的锁定列表
       * @param chainId
       * @param assetId
       * @param address
       * @param pageIndex
       * @param pageSize
       **/
      getTxListByAddress() {
        console.log(this.$route.query)
        const {chainId, assetId} = this.$route.query
        this.$post('/', 'getAccountFreezes', [chainId, assetId, this.addressInfo.address, this.pageIndex, this.pageSize])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              //let long = 1000000000; 4294967295
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.time * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.txHashs = superLong(item.txHash, 16);
                item.balance = divisionDecimals(item.amount);
                item.values = divisionAndFix(item.amount, 8, 3);
                item.lockedTime = moment(getLocalTime(item.lockedValue*1000)).format('YYYY-MM-DD HH:mm:ss');
                if (item.type === 2) {
                  item.reason = "注销节点";
                  item.lockedValue = moment(getLocalTime(item.lockedValue*1000)).format('YYYY-MM-DD HH:mm:ss');
                } else if (item.type === 3) {
                  if (item.lockedValue === -1) {
                    item.lockedValue = '--'
                  }
                }
              }
              this.pageTotal = response.result.totalCount;
              this.txListData = response.result.list;
            }
          })
          .catch((error) => {
            console.log("getAccountTxs:" + error);
          });

      },

      /**
       * 分页功能
       * @param val
       */
      frozenListPages(val) {
        this.pageIndex = val;
        this.getTxListByAddress();
      },

      /**
       * 连接跳转
       * @param name
       * @param param
       */
      toUrl(name, param) {
        //console.log(name)
        this.$router.push({
          name: name,
          query: {'hash': param}
        })
      },

    }
  }
</script>

<style scoped>

</style>
