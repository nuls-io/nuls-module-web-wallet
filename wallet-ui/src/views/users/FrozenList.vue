<template>
    <div class="frozen_list bg-gray">
        <div class="bg-white">
            <div class="w1200">
                <BackBar backTitle="钱包"></BackBar>
                <h3 class="title">冻结列表</h3>
            </div>
        </div>

        <div class="w1200 mt_20">
            <el-table :data="txListData" stripe border>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope"><span>{{ $t('frozenType.'+scope.row.type) }}</span></template>
                </el-table-column>
                <el-table-column label="txHash" align="center" min-width="150">
                    <template slot-scope="scope">
                        <span class="click" @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txHashs}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="时间" align="center">
                </el-table-column>
                <el-table-column prop="values" label="金额" align="center">
                </el-table-column>
                <el-table-column prop="lockedValue" label="解冻高度/时间" align="center">
                </el-table-column>
                <el-table-column label="冻结原因" align="center">
                    <template slot-scope="scope"><span>{{scope.row.type === 3 ? $t('type.5'):  scope.row.reason}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages">
                <div class="page-total">
                    显示 {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
                    共 {{pageTotal}}
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
  import {timesDecimals, getLocalTime, superLong} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        txListData: [],//冻结列表
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        addressInfo: [], //账户信息
      };
    },
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      }, 500);
    },
    mounted() {
      this.getTxListByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
    },
    components: {
      BackBar
    },
    methods: {
      /**
       * 获取地址的锁定列表
       * @param pageIndex
       * @param pageSize,
       * @param address,
       **/
      getTxListByAddress(pageIndex, pageSize, address) {
        this.$post('/', 'getAccountFreezes', [pageIndex, pageSize, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                item.txHashs = superLong(item.txHash, 16);
                item.balance = timesDecimals(item.amount);
                item.values = timesDecimals(item.amount);
                if (item.type === 2) {
                  item.reason = "注销节点";
                  item.lockedValue = moment(getLocalTime(item.lockedValue)).format('YYYY-MM-DD HH:mm:ss');
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
        this.getTxListByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
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
