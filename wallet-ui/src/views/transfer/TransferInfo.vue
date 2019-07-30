<template>
  <div class="transfer_info bg-gray" v-loading="txInfoLoading">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('home.home2')"></BackBar>
        <h3 class="title">{{hash}}
          <i class="iconfont iconfuzhi clicks" @click="copy(hash)"></i></h3>
      </div>
    </div>

    <div class="card_long mt_20 w1200">
      <h5 class="card-title font18">{{$t('public.basicData')}}</h5>
      <ul>
        <li>{{$t('public.time')}} <label>{{txInfo.createTime}}</label></li>
        <li>{{$t('public.amount')}} <label>{{txInfo.value}}</label></li>
        <li>
          {{$t('public.height')}}
          <label class="click"><u class="td" @click="toUrl('height',txInfo.height)">{{txInfo.height}}</u></label>
        </li>
        <li>{{$t('public.fee')}} <label>{{txInfo.fees}}<span class="fCN">{{symbol}}</span></label></li>
        <li>{{$t('public.type')}} <label>{{$t('type.'+txInfo.type)}}</label></li>
        <li>
          {{$t('public.status')}}
          <label>{{txInfo.status === 0 ? $t('transferStatus.0'):$t('transferStatus.1')}}</label>
        </li>
        <li v-if="txInfo.type ===1">
          {{$t('public.nodeID')}}
          <label>
            <u class="click td uppercase" @click="toUrl('hash',txInfo.txData.txHash)">{{txInfo.txData.agentId}}</u>
          </label>
        </li>
        <li v-if="txInfo.type ===1">
          {{$t('public.roundInfo')}}
          <label>{{$t('public.rotation')}}
            <u class=" click cd" @click="toUrl('rotation',txInfo.txData.roundIndex)">{{txInfo.txData.roundIndex}}</u>
            {{$t('public.number')}} {{txInfo.txData.packageIndex}}
          </label>
        </li>
        <li v-if="txInfo.type ===3">{{$t('public.alias')}} <label>{{txInfo.txData.alias}}</label></li>
        <li v-if="txInfo.type ===4 || txInfo.type ===5 || txInfo.type ===9">
          {{$t('public.createAddress')}}
          <label><u class="click td"
                    @click="toUrl('address',txInfo.txData.agentAddress)">{{txInfo.txData.agentAddress}}</u></label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===5 || txInfo.type ===6 || txInfo.type ===9">
          {{$t('public.nodeID')}}
          <label>
            <u class="click td uppercase" @click="toUrl('hash',txInfo.txData.txHash)">{{txInfo.txData.agentId}}</u>
          </label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===9">
          {{$t('public.packingAddress')}}
          <label>
            <u class="click td" @click="toUrl('address',txInfo.txData.packingAddress)">
              {{txInfo.txData.packingAddress}}
            </u>
          </label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===9">
          {{$t('public.commission')}}
          <label>{{txInfo.txData.commissionRate}}%</label>
        </li>
        <li v-if="txInfo.type ===4 || txInfo.type ===9">
          {{$t('public.rewardAddress')}}
          <label>
            <u class="click td" @click="toUrl('address',txInfo.txData.rewardAddress)">
              {{txInfo.txData.rewardAddress}}
            </u>
          </label>
        </li>
        <li v-if="txInfo.type ===9">
          {{$t('public.deposit')}}
          <label>{{txInfo.txData.deposit/100000000}}<span class="fCN">NULS</span></label>
        </li>
        <li v-if="txInfo.type ===9">{{$t('public.credit')}} <label>{{txInfo.txData.creditValue}}</label></li>

        <li v-if="txInfo.type ===15 || txInfo.type ===16 || txInfo.type ===17">{{$t('contract.contract2')}}
          <label>
            <u class="click td" @click="toUrl('contractsInfo',txInfo.txData.resultInfo.contractAddress)">
              {{txInfo.txData.resultInfo.contractAddress}}
            </u>
          </label>
        </li>
        <li v-if="txInfo.type ===15 || txInfo.type ===16">Price<label>{{txInfo.txData.resultInfo.price}}<span
                class="fCN">NULS</span> / GAS</label></li>
        <li v-if="txInfo.type ===15 || txInfo.type ===16">Gas Used<label>{{txInfo.txData.resultInfo.gasUsed}}</label>
        </li>
        <li v-if="txInfo.type ===15 || txInfo.type ===16">Gas Limit<label>{{txInfo.txData.resultInfo.gasLimit}}
          GAS</label></li>

        <li v-if="txInfo.type ===16">{{$t('public.method')}}<label>{{txInfo.txData.methodName}}</label></li>
        <li v-if="txInfo.type ===16">{{$t('public.results')}}
          <label>{{txInfo.txData.resultInfo.success ? $t('public.success'):$t('public.fail')}}
            <span class="click" @click="dataDialog=true">View</span>
          </label>
        </li>
        <li v-if="txInfo.type !==3">
          {{$t('public.remarks')}}
          <label class="remark overflow tr" :title="txInfo.remark">{{txInfo.remark}}</label>
        </li>
        <li v-if="txInfo.type !==4 && txInfo.type !==6 && txInfo.type !==9 && txInfo.type !==17"></li>
        <p class="cb"></p>
      </ul>
    </div>
    <div class="cb"></div>

    <div class="card_long mzt_20 w1200 inorouput" v-if="tokenTransfersData.length !==0">
      <h5 class="card-title font18">{{$t('public.tokenTransfer')}}</h5>
      <div class="inorou-info bg-white">
        <div class="card-info left fl">
          <ul>
            <li v-for="item of tokenTransfersData" :key="item.address">
              <font class="click td" @click="toUrl('address',item.fromAddress)">{{item.fromAddress}}</font>
              <label>{{item.value}}<span class="fCN">{{item.name}}</span></label>
            </li>
          </ul>
        </div>
        <div class="card-info right fr">
          <ul>
            <li v-for="item of tokenTransfersData" :key="item.address">
              <font class="click td" @click="toUrl('address',item.toAddress)">{{item.toAddress}}</font>
              <label>{{item.value}}<span class="fCN">{{item.name}}</span></label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="cb"></div>

    <div class="card_long mzt_20 w1200 inorouput" v-if="nulsTransfersData.length !==0">
      <h5 class="card-title font18">NULS {{$t('nav.transfer')}}</h5>
      <div class="inorou-info bg-white">
        <div class="card-info left fl">
          <ul>
            <li v-for="item of nulsTransfersData" :key="item.address">
              <font class="click td" @click="toUrl('address',item.from)">{{item.from}}</font>
              <label>{{item.value}}<span class="fCN">NULS</span></label>
            </li>
          </ul>
        </div>
        <div class="card-info right fr">
          <ul>
            <li v-for="item of nulsTransfersData" :key="item.to">
              <p v-for="k of item.outputs" :key="k.to">
                <font class="click td" @click="toUrl('address',k.to)">{{k.to}}</font>
                <label>{{k.value}}<span class="fCN">NULS</span></label>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="cb"></div>

    <div class="card_long mzt_20 w1200 inorouput">
      <h5 class="card-title font18">{{$t('public.input')}} & {{$t('public.output')}}</h5>
      <div class="inorou-info bg-white">
        <div class="card-info left fl">
          <ul>
            <li v-for="itme of inputData" :key="itme.nonce">
              <font class="click td" @click="toUrl('address',itme.address)">{{itme.address}}</font>
              <label>{{itme.amount}}<span class="fCN">{{itme.symbol}}</span></label>
            </li>
            <li v-if="inputData.length ===0"></li>
          </ul>
        </div>
        <div class="card-info right fr">
          <ul>
            <li v-for="itme of outputData" :key="itme.nonce">
              <font class="click td" @click="toUrl('address',itme.address)">{{itme.address}}</font>
              <label>
                {{itme.amount}}
                <span class="fCN">{{itme.symbol}}</span>&nbsp;
                <el-tooltip :content="$t('lockType.'+txInfo.type)" placement="top" v-if="itme.lockTime !==0">
                  <i class="iconfont iconmima yellow"></i>
                </el-tooltip>
              </label>
            </li>
            <li v-if="outputData.length ===0"></li>
          </ul>
        </div>
      </div>
    </div>

    <el-dialog title="Data" width="40%" :visible.sync="dataDialog" class="userDiolog">
      <div class="bg-white userInfo" v-if="txInfo.type ===15 || txInfo.type ===16 || txInfo.type ===17">
        <pre>{{txInfo.txData.resultInfo}}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import {timesDecimals, getLocalTime, copys, connectToExplorer} from '@/api/util'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      return {
        txInfoLoading: false,//交易详情动画加载
        hash: this.$route.query.hash,//hash
        txInfo: [],//交易信息
        inputData: [],//输入
        outputData: [],//输出
        tokenTransfersData: [],//代币转账data
        nulsTransfersData: [],//nuls转账data
        dataDialog: false,//data 弹框
        symbol: 'NULS',
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
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.createTime = moment(getLocalTime(response.result.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
              response.result.fees = timesDecimals(response.result.fee.value);
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

              if (response.result.type === 16 && response.result.txData.methodName === 'transfer') {
                this.tokenTransfersData = response.result.txData.resultInfo.tokenTransfers
              }

              if (response.result.type === 16 && response.result.txData.resultInfo.nulsTransfers.length !== 0) {
                for (let item of response.result.txData.resultInfo.nulsTransfers) {
                  console.log(item);
                  item.value = timesDecimals(item.value);
                  for (let k of item.outputs) {
                    k.value = timesDecimals(k.value);
                  }
                  //TODO 循环待完成
                }
                this.nulsTransfersData = response.result.txData.resultInfo.nulsTransfers;
              }

              this.txInfo = response.result;
              this.symbol = this.txInfo.fee.symbol;
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
       * @param parameter
       */
      toUrl(name, parameter) {
        connectToExplorer(name, parameter);
      },

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
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

    .inorouput {
      border-bottom: 0;
      border-right: 0;
      border-left: 0;
      .card-title {
        border-bottom: 0;
        border-right: 1px solid #dfe4ef;
        border-left: 1px solid #dfe4ef;
      }
      .inorou-info {
        border: 1px solid #dfe4ef;
        min-height: 100px;
        .card-info {
          width: 50%;
          ul {
            li {
              width: 100%;
              border: 0;
              font {
              }
              label {
              }
            }
          }
        }
      }

    }

  }

</style>
