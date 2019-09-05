<template>
  <div class="txlist bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.wallet')"></BackBar>
        <h3 class="title">{{$t('home.home2')}}</h3>
      </div>
    </div>

    <div class="w1200">
      <div v-loading="txListDataLoading">
        <div class="filter">
          <el-select v-model="assetsValue" @change="channgeAsesets" v-show="false">
            <el-option v-for="item in assetsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

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
          <el-table-column prop="symbol" :label="$t('tab.tab0')" align="center" width="100">
          </el-table-column>
          <el-table-column :label="$t('tab.tab1')" align="center" width="150">
            <template slot-scope="scope"><span>{{ $t('type.'+scope.row.type) }}</span></template>
          </el-table-column>
          <el-table-column label="TxID" align="center">
            <template slot-scope="scope">
              <span class="click " @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('tab.tab5')" align="center">
          </el-table-column>
          <el-table-column :label="$t('tab.tab6')" align="center">
            <template slot-scope="scope">
              <span :class="scope.row.transferType === -1 ? 'fred':'fCN'">
                {{scope.row.amount*scope.row.transferType}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" :label="$t('tab.tab9')" align="center">
          </el-table-column>
          <el-table-column :label="$t('tab.tab10')" align="center" width="120">
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
  import {timesDecimals, getLocalTime, superLong, addressInfo} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        assetsOptions: [
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'}
        ], //资产类型
        assetsValue: "0",
        typeOptions: [
          {value: '0', label: '0'},
          /* {value: '1', label: '1'},*/
          {value: '2', label: '2'},
          {value: '3', label: '3'},
          {value: '4', label: '4'},
          {value: '5', label: '5'},
          {value: '6', label: '6'},
          {value: '7', label: '7'},
          {value: '8', label: '8'},
          {value: '9', label: '9'},
          {value: '10', label: '10'},
          {value: '15', label: '15'},
          {value: '16', label: '16'},
          {value: '17', label: '17'},
          {value: '18', label: '18'},
          {value: '19', label: '19'},
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
        addressInfo: [], //账户信息
        types: 0,//类型
        isHide: true,//隐藏共识奖励
        txListSetInterval: null,//定时器
      };
    },
    created() {
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.types);
        }
      }
    },
    mounted() {
      this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.types);
      //10秒循环一次数据
      this.txListSetInterval = setInterval(() => {
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.types);
      }, 10000);

    },
    //离开当前页面后执行
    destroyed() {
      clearInterval(this.txListSetInterval);
    },
    components: {
      BackBar
    },
    methods: {

      /**
       * 根据地址获取交易列表
       * @param pageSize
       * @param pageRows
       * @param address
       * @param type
       * @param isHide
       **/
      getTxlistByAddress(pageSize, pageRows, address, type) {
        this.$post('/', 'getAccountTxs', [pageSize, pageRows, address, type, -1, -1])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                item.txid = superLong(item.txHash, 8);
                item.balance = timesDecimals(item.balance);
                if(item.type ===16){
                  item.amount = timesDecimals(item.fee.value);
                }else {
                  item.amount = timesDecimals(item.values);
                }

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
       * 资产下拉框选择
       * * @param e
       **/
      channgeAsesets(e) {
        console.log(e)
      },

      /**
       * 交易类型下拉框选择
       * * @param e
       **/
      channgeType(e) {
        this.types = Number(e);
        this.typeValue = Number(e);
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.types);
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
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.types)
      },

      /**
       * 交易列表分页功能
       * @param val
       **/
      txListPages(val) {
        this.pageIndex = val;
        this.txListDataLoading = true;
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.types)
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
