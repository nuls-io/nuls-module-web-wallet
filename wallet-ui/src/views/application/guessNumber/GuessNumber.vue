<template>
  <div class="guess_number w1200">
    <div class="top">
      <div class="fl guess" v-loading="loading"
           :element-loading-text=loadingText
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <h2>NULS {{$t('guessNum.guessNum0')}}{{gameCurrentInfo.id}}{{$t('guessNum.guessNum1')}}</h2>
        <div class="explain">
          <p>1、{{$t('guessNum.guessNum2')}}
            <el-tooltip placement="bottom" style="padding: 0">
              <div slot="content" class="portion">
                <ul>
                  <li>{{$t('guessNum.guessNum3')}} &lt; 10 {{$t('guessNum.guessNum4')}} 20%</li>
                  <li>{{$t('guessNum.guessNum3')}} &lt; 50 {{$t('guessNum.guessNum4')}} 25%</li>
                  <li>{{$t('guessNum.guessNum3')}} &lt; 100 {{$t('guessNum.guessNum4')}} 30%</li>
                  <li>{{$t('guessNum.guessNum3')}} &lt; 200 {{$t('guessNum.guessNum4')}} 35%</li>
                  <li>{{$t('guessNum.guessNum3')}} &lt; 500 {{$t('guessNum.guessNum4')}} 40%</li>
                  <li>{{$t('guessNum.guessNum3')}} &lt; 1000 {{$t('guessNum.guessNum4')}} 45%</li>
                  <li>{{$t('guessNum.guessNum3')}} &gt; 1000 {{$t('guessNum.guessNum4')}} 50%</li>
                </ul>
              </div>
              <el-button type="text">{{$t('guessNum.guessNum5')}}</el-button>
            </el-tooltip>
            {{$t('guessNum.guessNum6')}}
          </p>
          <p>2、{{$t('guessNum.guessNum7')}} <span class="fred fW600">2.1</span>+{{$t('guessNum.guessNum35')}} NULS</p>
          <p>
            3、{{$t('guessNum.guessNum8')}}
            <span class="fyellow fW600"> 20 </span>
            {{$t('guessNum.guessNum9')}}
            <span class="fyellow fW600"> 5 </span>
            {{$t('guessNum.guessNum10')}}
          </p>
          <p>
            4、{{$t('guessNum.guessNum11')}}
            <span class="click">{{$t('guessNum.guessNum12')}}</span>
            {{$t('guessNum.guessNum13')}}
          </p>
        </div>
        <div class="number">
          <el-button circle v-for="item in valueList" :key="item.value" @click="clickNumber(item.value)"
                     :class="item.value.toString() ===numberValue.toString() ? 'is_number':''">
            {{item.label}}
          </el-button>
        </div>
        <div class="submit tc">
          <el-button type="success" @click="guessStart">
            {{this.numberValue ==='' ? $t('guessNum.guessNum14'):$t('guessNum.guessNum15')}}
            {{this.numberValue}}
          </el-button>
        </div>
        <div class="jackpot font14">
          {{$t('guessNum.guessNum3')}}
          <span class="font12">({{jackpotInfo.address}})</span>:
          <font class="fCN fW600">{{jackpotInfo.balance}}</font> NULS
        </div>
        <div class="font14" v-if="gameCurrentInfo.endHeight">
          <div class="fl">
            {{$t('guessNum.guessNum16')}}:
            <span class="fred fW600">{{gameCurrentInfo.endHeight}}</span>
          </div>
          <div class="fl">&nbsp;
            {{$t('guessNum.guessNum17')}}:
            <span class="fred fW600">{{gameCurrentInfo.endHeight + gameCurrentInfo.gameLotteryDelay}}</span>
          </div>
        </div>
        <div class="font14 fyellow" v-else>{{$t('guessNum.guessNum18')}}</div>
      </div>
      <div class="fr party">
        <h3>{{$t('guessNum.guessNum19')}}</h3>
        <el-table :data="gameDetailInfo.participants" style="width: 100%">
          <el-table-column :label="$t('tab.tab11')" align="center" width="108">
            <template slot-scope="scope">
              <span class="click" @click="toUrl('address',scope.row.address,1)">{{scope.row.addresss}}</span>
            </template>
          </el-table-column>
          <el-table-column label="txHash" align="center" min-width="90">
            <template slot-scope="scope">
              <span class="click" @click="toUrl('hash',scope.row.txHash,1)">{{scope.row.txHashs}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="txTimes" :label="$t('public.time')" align="center" width="90">
          </el-table-column>
          <el-table-column prop="number" :label="$t('guessNum.guessNum20')" align="center" width="90">
          </el-table-column>
          <el-table-column :label="$t('public.status')" align="center" width="100">
            <template slot-scope="scope">
              <span :class="scope.row.status === 0 ? 'fCN':''">{{$t('status.status'+ scope.row.status)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer cb">
      <el-tabs v-model="activeHistory" @tab-click="handleClick">
        <el-tab-pane :label="$t('guessNum.guessNum21')" name="first">
          <el-table :data="participantData" stripe style="width: 100%" border>
            <el-table-column prop="gameId" :label="$t('guessNum.guessNum22')" width="120" align="center">
            </el-table-column>
            <el-table-column :label="$t('guessNum.guessNum23')" width="380" align="center">
              <template slot-scope="scope">
                <span class="click" @click="toUrl('address',scope.row.winner,1)">{{scope.row.winner}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="perPrize" :label="$t('guessNum.guessNum24')" width="120" align="center">
            </el-table-column>
            <el-table-column prop="number" :label="$t('guessNum.guessNum25')" width="130" align="center">
            </el-table-column>
            <el-table-column prop="txTime" :label="$t('guessNum.guessNum26')" width="160" align="center">
            </el-table-column>
            <el-table-column label="txHash" min-width="160" align="center">
              <template slot-scope="scope">
                <span class="click" @click="toUrl('hash',scope.row.txHash,1)">{{scope.row.txHashs}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('guessNum.guessNum27')" name="second">
          <el-table :data="participantHistoryData" stripe style="width: 100%" border>
            <el-table-column prop="gameId" :label="$t('guessNum.guessNum22')" width="120" align="center">
            </el-table-column>
            <el-table-column :label="$t('guessNum.guessNum23')" width="380" align="center">
              <template slot-scope="scope">
                <span class="click" @click="toUrl('address',scope.row.address,1)">{{scope.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="number" :label="$t('guessNum.guessNum25')" width="160" align="center">
            </el-table-column>
            <el-table-column prop="txTime" :label="$t('guessNum.guessNum26')" width="160" align="center">
            </el-table-column>
            <el-table-column label="txHash" min-width="180" align="center">
              <template slot-scope="scope">
                <span class="click" @click="toUrl('hash',scope.row.txHash,1)">{{scope.row.txHashs}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('guessNum.guessNum28')" name="third">
          <el-collapse v-model="activeName" accordion @change="changeColapse()">
            <el-collapse-item v-for="(item,index) in historyData" :key="index"
                              :title="$t('guessNum.guessNum0') +item.gameId+$t('guessNum.guessNum29')+$t('guessNum.guessNum30')+':'+item.number+ $t('guessNum.guessNum31')+': '+item.perPrize"
                              :name=item.gameId>
              <div class="footer_table">
                <div>{{$t('guessNum.guessNum32')}}</div>
                <div class="div_list">
                  <div class="fl tc" style="width: 350px">
                    <div class="div_title">{{$t('tab.tab11')}}</div>
                  </div>
                  <div class="fl tc" style="width: 500px">
                    <div class="div_title">txHash</div>
                  </div>
                  <div class="fl tc" style="width: 200px">
                    <div class="div_title">{{$t('public.time')}}</div>
                  </div>
                  <div class="fl tc" style="width: 150px">
                    <div class="div_title">{{$t('guessNum.guessNum20')}}</div>
                  </div>
                  <div class="cb"></div>
                </div>
                <div v-for="item of historyDataIn" :key="item.txTime" style="border-bottom: 1px solid #c0c4cc">
                  <div class="fl tc" style="width: 350px">
                    <div class="click" @click="toUrl('address',item.address,1)">{{item.address}}</div>
                  </div>
                  <div class="fl tc" style="width: 500px">
                    <div class="click" @click="toUrl('hash',item.txHash,1)">{{item.txHashs}}</div>
                  </div>
                  <div class="fl tc" style="width: 200px">
                    <div>{{item.txTimes}}</div>
                  </div>
                  <div class="fl tc" style="width: 150px">
                    <div>{{item.number}}</div>
                  </div>
                  <div class="cb"></div>
                </div>
                <div>{{$t('guessNum.guessNum33')}}</div>
                <div class="div_list">
                  <div class="fl tc" style="width: 300px">
                    <div class="div_title">{{$t('tab.tab11')}}</div>
                  </div>
                  <div class="fl tc" style="width: 400px">
                    <div class="div_title">txHash</div>
                  </div>
                  <div class="fl tc" style="width: 200px">
                    <div class="div_title">{{$t('public.time')}}</div>
                  </div>
                  <div class="fl tc" style="width: 150px">
                    <div class="div_title">{{$t('guessNum.guessNum20')}}</div>
                  </div>
                  <div class="fl tc" style="width: 150px">
                    <div class="div_title">{{$t('guessNum.guessNum31')}}</div>
                  </div>
                  <div class="cb"></div>
                </div>
                <div v-for="item of historyDataOut" :key="item.txTime" style="border-bottom: 1px solid #c0c4cc">
                  <div class="fl tc" style="width: 300px">
                    <div class="click" @click="toUrl('address',item.address,1)">{{item.address}}</div>
                  </div>
                  <div class="fl tc" style="width: 400px">
                    <div class="click" @click="toUrl('hash',item.txHash,1)">{{item.txHashs}}</div>
                  </div>
                  <div class="fl tc" style="width: 200px">
                    <div>{{item.txTime}}</div>
                  </div>
                  <div class="fl tc" style="width: 150px">
                    <div>{{item.number}}</div>
                  </div>
                  <div class="fl tc" style="width: 150px">
                    <div>{{item.perPrize}}</div>
                  </div>
                  <div class="cb"></div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>

      <div class="page" v-show="pageTotal > pageSize">
        <el-pagination layout="total, prev, pager, next, jumper"
                       @current-change="pageChange"
                       :current-page=pageIndex
                       :page-size=pageSize
                       :total="pageTotal">
        </el-pagination>
      </div>

    </div>
    <Password ref="password" @passwordSubmit="guessPassSubmit">
    </Password>
  </div>
</template>

<script>
  import moment from 'moment'
  import axios from 'axios'
  import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {API_URL, MAIN_INFO} from '@/config'
  import {
    connectToExplorer,
    timesDecimals,
    getLocalTime,
    IsPC,
    Plus,
    superLong,
    Times,
    passwordVerification,
    addressInfo
  } from '@/api/util'
  import {
    getNulsBalance,
    inputsOrOutputs,
    validateAndBroadcast
  } from '@/api/requestData'
  import Password from '@/components/PasswordBar'

  export default {
    data() {
      return {
        accontInfo: {}, //账户信息
        config: {
          url: process.env.NODE_ENV !== 'production' ? 'http://192.168.1.40:81/' : 'http://111.229.189.176/',
        },//配置信息
        jackpotInfo: {
          address: '',//合约地址
          balance: 0,
        },//奖池信息
        gameCurrentInfo: {},//当前游戏信息
        loading: true,
        loadingText: '',//加载提示语
        gameDetailInfo: {},//当前游戏信息
        statusList: [],//确认中 data
        valueList: [
          {value: 0, label: 0},
          {value: 1, label: 1},
          {value: 2, label: 2},
          {value: 3, label: 3},
          {value: 4, label: 4},
          {value: 5, label: 5},
          {value: 6, label: 6},
          {value: 7, label: 7},
          {value: 8, label: 8},
          {value: 9, label: 9},
        ],//数字列表
        numberValue: '',//选中数字
        partyData: [],
        activeHistory: 'first',//tab选中了
        activeName: '1', //手风琴选中
        participantData: [],//中奖历史
        participantHistoryData: [],//参与历史
        historyData: [],//开奖历史
        historyDataIn: [],//开奖历史参与
        historyDataOut: [],//开奖历史中奖
        pageSize: 10, //每页显示条数
        pageIndex: 1,  //当前页
        pageTotal: 0,//总页数
        guessNumberInterval: null,//定时器
      }
    },
    created() {
      this.getGameContract();
      this.accontInfo = addressInfo(1);
      setTimeout(() => {
        if (this.jackpotInfo.address) {
          this.gameCurrent();
          this.getPrizePool();
        }
      }, 800);

      //this.getJackpotAmount(this.jackpotInfo.address)
    },
    mounted() {

      if (this.activeHistory === 'first') {
        this.userLotteryHistory(this.accontInfo.address)
      } else if (this.activeHistory === 'second') {
        this.gameParticipantHistory(this.accontInfo.address);
      } else {
        this.gameHistory();
      }

      this.guessNumberInterval = setInterval(() => {
        this.getPrizePool();
        this.gameCurrent();
      }, 5000);

    },
    destroyed() {
      clearInterval(this.guessNumberInterval);
    },
    watch: {},
    components: {
      Password
    },
    methods: {

      /**
       * @disc: 获取合约地址
       * @date: 2020-04-20 18:08
       * @author: Wave
       */
      async getGameContract() {
        let url = this.config.url + 'game/contract';
        try {
          axios.defaults.baseURL = '';
          let resData = await axios.get(url);
          //console.log(resData);
          if (resData.data.success) {
            this.jackpotInfo.address = resData.data.data;
          }
        } catch (err) {
          console.log(err)
        }
      },

      /**
       * @disc: 获取当前游戏信息
       * @date: 2020-04-20 18:08
       * @author: Wave
       */
      async gameCurrent() {
        let url = this.config.url + 'game/current';
        try {
          axios.defaults.baseURL = '';
          let resData = await axios.get(url);
          //console.log(resData);
          if (resData.data.success) {
            if (resData.data.data) {
              this.gameCurrentInfo = resData.data.data;
              this.gameDetail(this.gameCurrentInfo.id);
              if (this.gameCurrentInfo.endHeight && this.gameCurrentInfo.endHeight <= this.$store.getters.getHeight) {
                this.loadingText = this.$t('tips.tips17');
                this.loading = true;
                sessionStorage.removeItem(this.gameCurrentInfo.id.toString())
              } else {
                this.loading = false;
              }
            } else {
              this.gameCurrentInfo = {
                id: 0,
                startHeight: 0,
                endHeight: 0,
                gameLotteryDelay: 0,
                txHash: "0",
                txTime: 0,
              };
              this.loading = true;
              this.loadingText = this.$t('tips.tips18');
              this.userLotteryHistory(this.accontInfo.address);
            }
          }
        } catch (err) {
          console.log(err)
        }
      },

      /**
       * @disc: 根据gameId获取当前游戏信息
       * @params: gameId
       * @params: type
       * @date: 2020-04-20 18:08
       * @author: Wave
       */
      async gameDetail(gameId, type = 0) {
        let url = this.config.url + 'game/detail/' + gameId;
        //console.log(url);
        try {
          axios.defaults.baseURL = '';
          let resData = await axios.get(url);
          //console.log(resData);
          if (resData.data.success) {
            let newData = this.statusList.filter(k => k.id === resData.data.data.id);
            for (let item of resData.data.data.participants) {
              if (newData) {
                newData.splice(newData.indexOf(newData.find((k) => {
                  return k.txHash === item.txHash;
                })), 1);
              }
              item.addresss = superLong(item.address, 4);
              item.txHashs = superLong(item.txHash, IsPC() ? 6: 3);
              item.txTimes = moment(getLocalTime(item.txTime * 1000)).format('HH:mm:ss');
              item.status = 1;
            }
            if (type === 0) {
              resData.data.data.participants = [...resData.data.data.participants, ...newData];
              this.gameDetailInfo = resData.data.data;
            } else {
              for (let item of resData.data.data.participants) {
                item.txHashs = superLong(item.txHash, 10);
                item.txTimes = moment(getLocalTime(item.txTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
              }


              this.historyDataIn = resData.data.data.participants;
              for (let item of resData.data.data.lottery.winners) {
                item.perPrize = timesDecimals(resData.data.data.lottery.perPrize, 8);
                item.address = item.winner;
                item.addresss = superLong(item.address, 4);
                item.number = resData.data.data.lottery.number;
                item.txHash = resData.data.data.lottery.txHash;
                item.txHashs = superLong(item.txHash, 10);
                item.txTime = moment(getLocalTime(resData.data.data.lottery.txTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
              }
              this.historyDataOut = resData.data.data.lottery.winners;
              //console.log(this.historyDataIn);
              //console.log(this.historyDataOut);
            }
          }
        } catch (err) {
          console.log(err)
        }
      },

      /**
       * @disc: 选择数字
       * @params: number
       * @date: 2020-04-16 9:44
       * @author: Wave
       */
      clickNumber(number) {
        this.numberValue = number.toString();
      },

      /**
       * @disc: 猜数字开始
       * @params:
       * @date: 2020-04-17 17:27
       * @author: Wave
       */
      async guessStart() {
        let contractInfo = {
          value: 211000000,
          address: this.jackpotInfo.address,
          methodName: 'join',
          methodDesc: '(Long gameId, Integer number) return void',
          args: [this.gameCurrentInfo.id, Number(this.numberValue)], //[gameId,number]
        };
        let validateContractCallRes = await this.validateContractCall(this.accontInfo.address, contractInfo.value, sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, contractInfo.address, contractInfo.methodName, contractInfo.methodDesc, contractInfo.args);
        //console.log(validateContractCallRes);
        if (validateContractCallRes.success) {
          this.$refs.password.showPassword(true);
        }
      },

      /**
       * 验证调用合约交易
       * @param sender
       * @param value
       * @param gasLimit
       * @param price
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async validateContractCall(sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args) {
        try {
          let resData = await this.$post('/', 'validateContractCall', [sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args]);
          //console.log(resData);
          if (resData.hasOwnProperty('result')) {
            return {success: true, data: resData.result};
          } else {
            return {success: false, data: resData.result};
          }
        } catch (error) {
          return {success: false, data: error};
        }
      },

      /**
       * @disc: 输入密码开始抽奖
       * @params: password
       * @date: 2019-09-02 10:49
       * @author: Wave
       */
      async guessPassSubmit(password) {
        let accountInfo = this.accontInfo;
        let newAccountInfo = await passwordVerification(accountInfo, password);
        //console.log(newAccountInfo);
        if (!newAccountInfo.success) {
          this.$message({message: this.$t('tips.tips4'), type: 'error', duration: 3000});
          return;
        }
        let contractInfo = {
          value: 210000000,
          address: this.jackpotInfo.address,
          methodName: 'join',
          methodDesc: '(Long gameId, Integer number) return void',
          args: [this.gameCurrentInfo.id, Number(this.numberValue)], //[gameId,number]
        };
        //console.log(contractInfo);
        let contractCallDataInfo = await this.imputedContractCallGas(accountInfo.address, contractInfo.value, contractInfo.address, contractInfo.methodName, contractInfo.methodDesc, contractInfo.args);
        //console.log(contractCallDataInfo);
        let contractCallFee = Number(Times(contractCallDataInfo.data.gasLimit, contractCallDataInfo.data.price));
        let transferInfo = {
          fromAddress: accountInfo.address,
          toAddress: contractInfo.address,
          assetsChainId: MAIN_INFO.chainId,
          assetsId: MAIN_INFO.assetId,
          amount: contractInfo.value,
          fee: Number(Plus(100000, contractCallFee)),
          value: contractInfo.value
        };
        //transferInfo.value = Number(Plus(transferInfo.fee, contractInfo.value));
        //console.log(transferInfo);
        let remark = '';
        let balanceInfo = await getNulsBalance(MAIN_INFO.chainId, MAIN_INFO.assetId, accountInfo.address);
        //console.log(balanceInfo);
        if (balanceInfo.success && balanceInfo.data.balance < 10000) {
          this.$message({message: this.$t('tips.tips20'), type: 'error', duration: 3000});
          return {success: false}
        }
        //交易组装
        let inOrOutputs = await inputsOrOutputs(transferInfo, balanceInfo.data, 16);
        inOrOutputs.data.inputs[0].amount = Number(Plus(transferInfo.fee, contractInfo.value));

        //console.log(inOrOutputs);
        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, contractCallDataInfo.data);
        //console.log(tAssemble);
        let txhex = await nuls.transactionSerialize(newAccountInfo.pri, newAccountInfo.pub, tAssemble);
        //console.log(txhex);
        //验证并广播交易
        let validateTxhex = await validateAndBroadcast(txhex);
        //console.log(validateTxhex);
        if (!validateTxhex.success) {
          this.$message({
            message: this.$t('tips.tips14') + JSON.stringify(validateTxhex.data),
            type: 'error',
            duration: 3000
          });
        } else {
          let newList = {
            id: this.gameCurrentInfo.id,
            address: accountInfo.address,
            addresss: superLong(accountInfo.address, 4),
            txHash: validateTxhex.hash,
            txHashs: superLong(validateTxhex.hash, IsPC() ? 6 : 3),
            txTime: moment(getLocalTime(Math.round(new Date().getTime()))).format('HH:mm:ss'),
            status: 0,
            number: this.numberValue,
          };
          //console.log(newList);
          this.statusList.push(newList);
          //console.log(this.statusList);
          this.gameDetailInfo.participants.push(newList);
          this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 2000});
        }
      },

      /**
       * @disc: 获取奖池金额 getPrizePool()
       * @params: address
       * @date: 2020-04-17 16:30
       * @author: Wave
       */
      async getPrizePool() {
        let jackpotAmount = await this.methodCall(this.jackpotInfo.address, 'getPrizePool', '() return String', []);
        //console.log(jackpotAmount);
        if (!jackpotAmount.success) {
          console.log('获取奖池金额失败！')
        }
        jackpotAmount.data.balance = timesDecimals(jackpotAmount.data.result, 8);
        this.jackpotInfo.balance = jackpotAmount.data.balance;
      },

      /**
       * 不上链方法调用
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async methodCall(contractAddress, methodName, methodDesc, args) {
        let url = API_URL;
        let data = {
          "jsonrpc": "2.0",
          "method": "invokeView",
          "params": [MAIN_INFO.chainId, contractAddress, methodName, methodDesc, args],
          "id": Math.floor(Math.random() * 1000)
        };
        //console.log(data);
        try {
          let resData = await axios.post(url, data);
          //console.log(resData);
          if (resData.data.hasOwnProperty('result')) {
            return {success: true, data: resData.data.result}
          } else {
            return {success: false, data: resData.data}
          }
        } catch (err) {
          return {success: true, data: err}
        }
      },

      /**
       * 预估调用合约交易的gas
       * @param sender
       * @param value
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args) {
        //console.log(sender, value, contractAddress, methodName, methodDesc, args);
        let resData = await this.$post('/', 'imputedContractCallGas', [sender, value, contractAddress, methodName, methodDesc, args]);
        //console.log(resData);
        if (!resData.hasOwnProperty('result')) {
          console.log("预估调用合约交易的gas错误");
          return {success: false, data: resData}
        }

        let contractConstructorArgsTypes = await this.getContractMethodArgsTypes(contractAddress, methodName, methodDesc);
        //console.log(contractConstructorArgsTypes);
        if (!contractConstructorArgsTypes.success) {
          console.log("获取合约指定函数的参数类型错误");
          return {success: false, data: contractConstructorArgsTypes}
        }

        let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes.data);
        //console.log(newArgs);
        let contractCallData = {
          chainId: MAIN_INFO.chainId,
          sender: sender,
          contractAddress: contractAddress,
          value: value,
          gasLimit: resData.result.gasLimit,
          price: sdk.CONTRACT_MINIMUM_PRICE,
          methodName: methodName,
          methodDesc: methodDesc,
          args: newArgs
        };
        return {success: true, data: contractCallData};
      },

      /**
       * 获取合约指定函数的参数类型
       * @param contractAddress
       * @param  methodName
       * @param  methodDesc
       */
      async getContractMethodArgsTypes(contractAddress, methodName, methodDesc) {
        return await this.$post('/', 'getContractMethodArgsTypes', [contractAddress, methodName, methodDesc])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              return {success: true, data: response.result};
            } else {
              return {success: false, data: response.error};
            }
          })
          .catch((error) => {
            return {success: false, data: error};
          });
      },

      /**
       * @disc: tab 切换
       * @params: tab
       * @date: 2020-04-17 10:31
       * @author: Wave
       */
      handleClick(tab) {
        //console.log(tab.name);
        this.activeHistory = tab.name;
        this.pageIndex = 1;
        this.pageTotal = 0;
        this.pageSize = 10;

        if (this.activeHistory === 'first') {
          this.userLotteryHistory(this.accontInfo.address)
        } else if (this.activeHistory === 'second') {
          this.gameParticipantHistory(this.accontInfo.address);
        } else {
          this.gameHistory();
        }

      },

      /**
       * @disc: 中奖列表
       * @params: address
       * @date: 2020-04-17 9:53
       * @author: Wave
       */
      async userLotteryHistory(address) {
        let url = this.config.url + 'game/user/lottery/' + address + '/' + this.pageIndex;
        axios.defaults.baseURL = '';
        let resData = await axios.get(url);
        //console.log(resData);
        if (resData.data.success) {
          this.pageTotal = resData.data.data.total;
          for (let item of resData.data.data.list) {
            item.perPrize = timesDecimals(item.perPrize, 8);
            item.txHashs = superLong(item.txHash, 15);
            item.txTime = moment(getLocalTime(item.txTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
          }
          this.participantData = resData.data.data.list;
        }
      },

      /**
       * @disc: 参与列表
       * @params: address
       * @date: 2020-04-17 9:53
       * @author: Wave
       */
      async gameParticipantHistory(address) {
        let url = this.config.url + 'game/user/participation/' + address + '/' + this.pageIndex;
        axios.defaults.baseURL = '';
        let resData = await axios.get(url);
        //console.log(resData);
        if (resData.data.success) {
          this.pageTotal = resData.data.data.total;
          for (let item of resData.data.data.list) {
            item.txHashs = superLong(item.txHash, 15);
            item.txTime = moment(getLocalTime(item.txTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
          }
          this.participantHistoryData = resData.data.data.list;
        }
      },

      /**
       * @disc: 开奖历史
       * @date: 2020-04-17 9:53
       * @author: Wave
       */
      async gameHistory() {
        let url = this.config.url + 'game/history/' + this.pageIndex;
        axios.defaults.baseURL = '';
        let historyData = await axios.get(url);
        //console.log(historyData);
        if (historyData.data.success) {
          this.pageTotal = historyData.data.data.total;
          for (let item of historyData.data.data.list) {
            if (item.number || item.number === 0) {
              item.perPrize = !item.perPrize ? this.$t('public.flow') : timesDecimals(item.perPrize, 8);
            } else {
              item.number = this.$t('public.flow');
              item.perPrize = this.$t('public.flow');
            }
            item.txTime = moment(getLocalTime(item.txTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
          }
          this.historyData = historyData.data.data.list;
          console.log(this.historyData)
        }
      },

      /**
       * @disc: 手风琴切换
       * @params:
       * @date: 2020-04-21 17:11
       * @author: Wave
       */
      changeColapse() {
        //console.log(this.activeName);
        this.gameDetail(this.activeName, 1)
      },

      /**
       * @disc: 分页功能
       * @params:val
       * @date: 2020-04-17 16:03
       * @author: Wave
       */
      pageChange(val) {
        this.pageIndex = val;
        if (this.activeHistory === 'first') {
          this.userLotteryHistory(this.accontInfo.address)
        } else if (this.activeHistory === 'second') {
          this.gameParticipantHistory(this.accontInfo.address);
        } else {
          this.gameHistory();
        }
      },

      /**
       * @disc: 连接跳转
       * @param urlName
       * @param parameter
       * @param type  0:路由跳转 1：外部链接
       */
      toUrl(urlName, parameter, type) {
        if (type === 0) {
          this.$router.push({
            name: urlName
          })
        } else {
          let newUrl = connectToExplorer(urlName, parameter);
          window.open(newUrl)
        }
      },
    }
  }
</script>

<style lang="less">
  .guess_number {
    .top {
      min-height: 480px;
      @media screen and (max-width: 1000px) {
        min-height: auto;
      }
      .guess {
        width: 600px;
        @media screen and (max-width: 1000px) {
          width: 100%;
          min-height: 28.5rem;
          clear: none;
        }
        h2 {
          text-align: center;
          margin: 40px 0;
          @media screen and (max-width: 1000px) {
            margin: 1rem 0;
          }
        }
        .explain {
          background-color: #c1c1c1;
          padding: 10px;
          p {
            font-size: 12px;
            line-height: 22px;
          }
        }
        .number {
          margin: 40px auto 0;
          text-align: center;
          height: 50px;
          .is-circle {
            width: 40px;
            height: 40px;
            @media screen and (max-width: 1000px) {
              width: 1.8rem;
              height: 1.8rem;
              line-height: 0.9rem;
              padding: 0.45rem;
            }
          }
          .is_number {
            //background-color: #0ede94;
            background: linear-gradient(to right, #4ef16a, #0ede94) !important;
            color: #FFFFFF;
          }
        }
        .submit {
          margin: 20px 0 0 0;
        }
        .jackpot {
          margin: 50px 0 0 0;
          height: 30px;
        }
      }
      .party {
        width: 550px;
        @media screen and (max-width: 1000px) {
          margin: 0 auto;
          float: none;
          clear: none;
          width: 98%;
        }
        h3 {
          text-align: left;
          margin: 20px 0 0 0;
          border-bottom: 1px solid #c1c1c1;
          padding: 0 0 5px 10px;
          font-size: 16px;
          font-weight: bold;
          @media screen and (max-width: 1000px) {
            margin: 0 0 0 0 ;
            padding: 0.5rem 1rem;
          }
        }
        .el-table {
          margin: 10px 0 0 0;
          @media screen and (max-width: 1000px) {
            margin: 0.5rem auto 0;
            width: 98%;
          }
          th {
            background-color: #c1c1c1;
          }
          td, th {
            padding: 2px 0;
            .cell {
              padding: 0 5px;
            }
          }
        }
      }
    }
    .footer {
      margin: 20px auto 80px;
      @media screen and (max-width: 1000px) {
        margin: 1rem auto 3rem;
        width: 98%;
      }
      .footer_table {
        .div_list {
          width: 100%;
          .div_title {
            background-color: #c0c4cc;
          }
        }
        .el-table {
          margin: 10px 0 0 0;
          th {
            background-color: #c1c1c1;
          }
          td, th {
            padding: 2px 0;
          }
        }
      }
      .el-collapse-item__header {
        height: 35px;
        line-height: 35px;
      }
      .el-table td, .el-table th {
        padding: 5px 0 !important;
      }
      .page {
        margin: 20px auto 80px;
        text-align: center;
      }
    }
  }

  .is-dark {
    background-color: #FFFFFF !important;
    border: 1px solid #c1c1c1;
  }
</style>
