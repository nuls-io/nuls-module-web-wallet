<template>
  <div class="transfer_info bg-gray" v-loading="txInfoLoading">
    <div class="bg-white">
      <div class="w1200">
        <BackBar backTitle="交易记录"></BackBar>
        <h3 class="title">{{hash}}
          <i class="iconfont icon-fuzhi clicks" @click="copy(hash)"></i></h3>
      </div>
    </div>

    <div class="card_long mt_20 w1200">
      <h5 class="card-title font18">基础信息</h5>
      <ul>
        <li>时间 <label>{{txInfo.createTime}}</label></li>
        <li>金额 <label>{{txInfo.value}}<span class="fCN">NULS</span></label></li>
        <li>高度 <label class="click"><u class="td">{{txInfo.height}}</u></label></li>
        <li>手续费 <label>{{txInfo.fee}}<span class="fCN">NULS</span></label></li>
        <li>类型 <label>{{$t('type.'+txInfo.type)}}</label></li>
        <li>状态 <label>{{txInfo.status === 0 ? '已确认':'未确认'}}</label></li>
        <li v-if="txInfo.type ===1">
          节点ID
          <label><u class="click td uppercase">{{txInfo.txData.agentId}}</u></label>
        </li>
        <li v-if="txInfo.type ===1">
          轮次信息
          <label>轮次
            <u class=" click cd">{{txInfo.txData.roundIndex}}</u>
            编号 {{txInfo.txData.packageIndex}}
          </label>
        </li>
        <li v-if="txInfo.type ===3">别名 <label>{{txInfo.txData.alias}}</label></li>
        <li v-if="txInfo.type ===4 || txInfo.type ===5 || txInfo.type ===9">
          创建地址
          <label><u class="click td">{{txInfo.txData.agentAddress}}</u></label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===5 || txInfo.type ===6 || txInfo.type ===9">
          节点ID
          <label><u class="click td uppercase">{{txInfo.txData.agentId}}</u></label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===9">
          打包地址
          <label><u class="click td">{{txInfo.txData.packingAddress}}</u></label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===9">佣金比例 <label>{{txInfo.txData.commissionRate}}%</label></li>
        <li v-if="txInfo.type ===4 || txInfo.type ===9">
          奖励地址
          <label><u class="click td">{{txInfo.txData.rewardAddress}}</u></label>
        </li>
        <li v-if="txInfo.type ===9">保证金 <label>{{txInfo.txData.deposit/100000000}}<span class="fCN">NULS</span></label>
        </li>
        <li v-if="txInfo.type ===9">信用值 <label>{{txInfo.txData.creditValue}}</label></li>
        <li v-if="txInfo.type !==3">
          备注
          <label class="remark overflow tr" :title="txInfo.remark">{{txInfo.remark}}</label>
        </li>
        <li v-if="txInfo.type !==4 && txInfo.type !==6 && txInfo.type !==9"></li>
        <p class="cb"></p>
      </ul>
    </div>
    <div class="cb"></div>

    <div class="card w1200">
      <div class="card-info left fl">
        <h5 class="card-title font18">Input</h5>
        <ul>
          <li v-for="itme of inputData" :key="itme.address"><font class="click td">{{itme.address}}</font><label>{{itme.amount}}<span
                  class="fCN">NULS</span></label></li>
        </ul>
      </div>
      <div class="card-info right fr">
        <h5 class="card-title font18">Output</h5>
        <ul>
          <li v-for="itme of outputData" :key="itme.address"><font class="click td">{{itme.address}}</font><label>{{itme.amount}}<span
                  class="fCN">NULS</span></label></li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import {timesDecimals, getLocalTime, copys} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        txInfoLoading: false,//交易详情动画加载
        hash: this.$route.query.hash,//hash
        txInfo: [],//交易信息
        inputData: [],//输入
        outputData: [],//输出
      };
    },
    created() {

    },
    mounted() {
      this.getTxInfoByHash(this.hash);
    },
    components: {
      BackBar
    },
    methods: {

      /**
       * 根据hash获取交易详情
       * @param hash
       **/
      getTxInfoByHash(hash) {
        this.txInfoLoading = true;
        this.$post('/', 'getTx', [hash])
          .then((response) => {
            console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.createTime = moment(getLocalTime(response.result.createTime)).format('YYYY-MM-DD HH:mm:ss');
              response.result.fee = timesDecimals(response.result.fee);
              response.result.value = timesDecimals(response.result.value);

              //输入
              if (response.result.coinFroms) {
                for (let itme of response.result.coinFroms) {
                  itme.amount = timesDecimals(itme.amount);
                }
                this.inputData = response.result.coinFroms
              }

              //输出
              if (response.result.coinTos) {
                for (let itme of response.result.coinTos) {
                  itme.amount = timesDecimals(itme.amount);
                }
                this.outputData = response.result.coinTos
              }

              this.txInfo = response.result;
              this.txInfoLoading = false;
            }
          })
          .catch((error) => {
            console.log("getTx:" + error)
          })
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
  @import "./../../assets/css/style";

  .transfer_info {
    .title {
      text-align: left;
    }
    .card {
      margin: 40px auto 0;
      height: 200px;
      .left, .right {
        width: 590px;
        ul {
          li {
            border: 0;
            line-height: 30px;
            height: 30px;
          }
        }
      }
    }

  }

</style>
