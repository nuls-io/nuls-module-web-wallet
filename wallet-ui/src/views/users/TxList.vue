<template>
  <div class="txlist bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <!--<p class="bread  clicks font14"><i class="el-icon-arrow-left"></i>钱包</p>-->
        <BackBar backTitle="钱包"></BackBar>
        <h3 class="title">交易记录</h3>
      </div>
    </div>

    <div class="w1200">
      <div v-loading="txListDataLoading">
        <div class="filter">
          <el-select v-model="assetsValue" @change="channgeAsesets" disabled>
            <el-option v-for="item in assetsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="typeValue" @change="channgeType">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="inAndOutValue" @change="channgeInAndOut" :disabled="type !==2">
            <el-option v-for="item in inAndOutOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-switch v-model="isHide" active-text="" inactive-text="隐藏共识奖励" :width="35" @change="changeHide"
                     v-show="type===0">
          </el-switch>
        </div>
        <el-table :data="txListData" stripe border>
          <el-table-column label="资产" align="center" width="100">
            <template><span>NULS</span></template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="100">
            <template slot-scope="scope"><span>{{ $t('type.'+scope.row.type) }}</span></template>
          </el-table-column>
          <el-table-column label="TxID" align="center">
            <template slot-scope="scope">
              <span class="click " @click="toUrl('transferInfo',scope.row.txHash)">{{scope.row.txid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" align="center">
          </el-table-column>
          <el-table-column label="金额" align="center">
            <template slot-scope="scope"><span :class="scope.row.transferType === -1 ? 'fred':'fCN'">{{scope.row.amount*scope.row.transferType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="余额" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope"><span>{{ $t('transferStatus.'+scope.row.status) }}</span></template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <div class="page-total">
            显示 {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
            共 {{pageTotal}}
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
  import {timesDecimals, getLocalTime, superLong} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        assetsOptions: [
          {value: '0', label: '所有资产'},
          {value: '1', label: '普通资产'},
          {value: '2', label: '合约资产'}
        ], //资产类型
        assetsValue: "所有资产",
        typeOptions: [
          {value: '0', label: '所有交易'},
          {value: '1', label: '共识奖励'},
          {value: '2', label: '转账交易'},
          {value: '3', label: '设置别名'},
          {value: '4', label: '创建节点'},
          {value: '5', label: '加入共识'},
          {value: '6', label: '退出共识'},
          {value: '7', label: '黄牌惩罚'},
          {value: '8', label: '红牌惩罚'},
          {value: '9', label: '注销节点'},
          {value: '10', label: '通用数据'},
          {value: '15', label: '创建合约'},
          {value: '16', label: '调用合约'},
          {value: '17', label: '删除合约'},
          {value: '18', label: '合约转账'},
          {value: '19', label: '合约返还'},
        ], //交易类型
        typeValue: '所有交易',
        inAndOutOptions: [
          {value: '0', label: '收入/支出'},
          {value: '1', label: '收入'},
          {value: '2', label: '支出'},
        ], //收入/支出
        inAndOutValue: '收入/支出',
        txListDataLoading: true,//资产加载动画
        txListData: [],//交易数据
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        addressInfo: [], //账户信息
        type: 0,//类型
        isHide: true,//隐藏共识奖励
        txListSetInterval: null,//定时器
      };
    },
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      }, 500);
    },
    mounted() {
      this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.type, this.isHide);
      //10秒循环一次数据
      this.txListSetInterval = setInterval(() => {
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.type, this.isHide);
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
      getTxlistByAddress(pageSize, pageRows, address, type, isHide) {
        this.$post('/', 'getAccountTxs', [pageSize, pageRows, address, type, isHide])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                item.txid = superLong(item.txHash, 8);
                item.balance = timesDecimals(item.balance);
                item.amount = timesDecimals(item.values);
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
        this.type = Number(e);
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.type, this.isHide);
      },

      /**
       * 收支类型下拉框选择
       * * @param e
       **/
      channgeInAndOut(e) {
        console.log(e)
      },

      /**
       * 隐藏共识奖励
       * @param e
       **/
      changeHide(e) {
        this.isHide = e;
        this.pageIndex = 1;
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.type, this.isHide)
      },

      /**
       * 交易列表分页功能
       * @param val
       **/
      txListPages(val) {
        this.pageIndex = val;
        this.txListDataLoading = true;
        this.getTxlistByAddress(this.pageIndex, this.pageSize, this.addressInfo.address, this.type, this.isHide)
      },

      /**
       * 连接跳转
       * @param name
       * @param params
       */
      toUrl(name, params) {
        //console.log(name,params);
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
