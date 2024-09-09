<template>
  <div class="txlist bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.wallet')"></BackBar>
        <h3 class="title">{{$t('home.home2')}}</h3>
      </div>
    </div>

    <div class="w1200">
      <div v-loading="txListDataLoading" class="mb_100">
        <div class="filter">
          <el-select :value="$t('type.'+typeValue)" @change="channgeType">
            <el-option v-for="item in typeOptions" :key="item.value" :label="$t('type.'+item.value)"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-select :value="$t('budgetType.'+inAndOutValue)" @change="channgeInAndOut" :disabled="types !==2"
                     v-if="false">
            <el-option v-for="item in inAndOutOptions" :key="item.value" :label="$t('budgetType.'+item.value)"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-switch v-model="isHide" active-text="" :inactive-text="$t('public.hideReward')" :width="35"
                     @change="changeHide"
                     v-show="false">
          </el-switch>
        </div>
        <el-table :data="txListData" stripe border>
          <el-table-column width="30"></el-table-column>
          <el-table-column prop="symbol" :label="$t('tab.tab0')" width="100">
          </el-table-column>
          <el-table-column :label="$t('tab.tab1')" width="150">
            <template slot-scope="scope"><span>{{ $t('type.'+scope.row.type) }}</span></template>
          </el-table-column>
          <el-table-column label="TxID">
            <template slot-scope="scope">
              <router-link class="click" tag="a" :to="{name:'transferInfo',query:{hash:scope.row.txHash}}">
                {{ scope.row.txid }}
              </router-link>
              <!--<span class="click " @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txid}}</span>-->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('tab.tab5')">
          </el-table-column>
          <el-table-column :label="$t('tab.tab6')">
            <template slot-scope="scope">
              <span :class="scope.row.transferType === -1 ? 'fred':'fCN'">
                {{scope.row.transferType === -1 ? '-' : ''}}{{scope.row.amount}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" :label="$t('tab.tab9')">
          </el-table-column>
          <el-table-column :label="$t('tab.tab10')" width="120">
            <template slot-scope="scope"><span>{{ $t('transferStatus.'+scope.row.status) }}</span></template>
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
  import {divisionDecimals, getLocalTime, superLong} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        typeOptions: [
          {value: '0', label: '0'},
          {value: '2', label: '2'},
          {value: '3', label: '3'},
          {value: '4', label: '4'},
          {value: '5', label: '5'},
          {value: '6', label: '6'},
          {value: '7', label: '7'},
          {value: '8', label: '8'},
          {value: '9', label: '9'},
          {value: '10', label: '10'},
          {value: '11', label: '11'},
          {value: '12', label: '12'},
          {value: '13', label: '13'},
          {value: '14', label: '14'},
          {value: '15', label: '15'},
          {value: '16', label: '16'},
          {value: '17', label: '17'},
          {value: '18', label: '18'},
          {value: '19', label: '19'},
          {value: '20', label: '20'},
          {value: '21', label: '21'},
          {value: '22', label: '22'},
          {value: '23', label: '23'},
          {value: '24', label: '24'},
          {value: '25', label: '25'},
          {value: '26', label: '26'},
        ], //交易类型
        typeValue: '0',
        inAndOutOptions: [
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'},
        ], //收入/支出
        inAndOutValue: '0',
        txListDataLoading: true,//资产加载动画
        txListData: [],//交易数据
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        types: 0,//类型
        isHide: true,//隐藏共识奖励
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
        this.getTxlistByAddress();
      }, 600);
      //10秒循环一次数据
      this.txListSetInterval = setInterval(() => {
        this.getTxlistByAddress();
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
          clearInterval(this.txListSetInterval)
          this.resetList()
          this.getTxlistByAddress();
          this.txListSetInterval = setInterval(() => {
            this.getTxlistByAddress();
          }, 10000);
        }
      }
    },
    components: {
      BackBar
    },
    methods: {
      resetList() {
        this.pageIndex = 1
        this.pageTotal = 0
        this.txListData = []
      },

      /**
       * 根据地址获取交易列表
       * @param pageSize 当前页码
       * @param pageRows 每页条数
       * @param address 地址
       * @param type 交易类型
       * @param startHigh 开始高度  default：-1
       * @param endHigh 结束高度 default：-1
       * @param chainId 链ID default：0
       * @param assetId 资产ID default：0
       **/
      getTxlistByAddress(startHigh = -1, endHigh = -1) {
        //console.log(pageSize, pageRows, address, type, startHigh, endHigh, chainId, assetId);
        const chainId = this.$route.query.chainId || 0
        const assetId = this.$route.query.assetId || 0
        const params = [this.pageIndex, this.pageSize, this.addressInfo.address, this.types, startHigh, endHigh, Number(chainId), Number(assetId)]
        this.$post('/', 'getAccountTxs', params)
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.txid = superLong(item.txHash, 8);
                item.balance = divisionDecimals(item.balance, item.decimals);
                if (item.type === 16) {
                  item.amount = divisionDecimals(item.fee.value, item.decimals);
                } else {
                  item.amount = divisionDecimals(item.values, item.decimals);
                }
              }
              this.txListData = response.result.list;
              this.pageTotal = response.result.totalCount;
              this.txListDataLoading = false;
            }
          })
          .catch((error) => {
            this.getTxlistByAddress();
            console.log("getAccountTxs:" + error);
          })
      },

      /**
       * 交易类型下拉框选择
       * * @param e
       **/
      channgeType(e) {
        this.types = Number(e);
        this.typeValue = Number(e);
        this.getTxlistByAddress();
      },

      /**
       * 收支类型下拉框选择
       * * @param e
       **/
      channgeInAndOut(e) {
        this.inAndOutValue = Number(e);
      },

      /**
       * 隐藏共识奖励
       * @param e
       **/
      changeHide(e) {
        this.isHide = e;
        this.pageIndex = 1;
        this.getTxlistByAddress();
      },

      /**
       * 交易列表分页功能
       * @param val
       **/
      txListPages(val) {
        this.pageIndex = val;
        this.txListDataLoading = true;
        this.getTxlistByAddress();
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
