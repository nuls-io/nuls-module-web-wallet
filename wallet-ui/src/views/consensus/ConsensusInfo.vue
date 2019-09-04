<template>
  <div class="consensus_info bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar backTitle="共识"></BackBar>
        <h3 class="title uppercase">{{nodeInfo.agentId}}<i class="el-icon-star-off click"></i></h3>
      </div>
    </div>

    <div class="card_long mt_20 w1200 bg-white">
      <h5 class="card-title font18">
        节点信息
        <i class="iconfont" :class="nodeInfo.status === 0 ? 'icondaigongshi fred' : 'icongongshizhong fCN'"></i>
        <el-button class="fr fred" type="danger" @click="stopNode"
                   v-show="addressInfo.address === nodeInfo.agentAddress">注销节点
        </el-button>
      </h5>
      <ul>
        <li>创建地址 <label>{{nodeInfo.agentAddress}}</label></li>
        <li>保证金 <label>{{nodeInfo.deposits}}<span class="fCN">NULS</span></label></li>
        <li>奖励地址 <label>{{nodeInfo.rewardAddress}}</label></li>
        <li>总委托 <label>{{nodeInfo.totalDeposit}}<span class="fCN">NULS</span></label></li>
        <li>打包地址 <label>{{nodeInfo.packingAddress}}</label></li>
        <li>总奖励 <label>{{nodeInfo.totalReward}}<span class="fCN">NULS</span></label></li>
        <li>创建者别名 <label>{{nodeInfo.agentAlias ? nodeInfo.agentAlias :'--' }}</label></li>
        <li>参与人数 <label>{{nodeInfo.depositCount}}</label></li>
        <li>创建时间 <label>{{nodeInfo.createTime}}</label></li>
        <li>佣金比例
          <label>{{nodeInfo.commissionRate}}%
            <!--<el-tooltip placement="top">
              <div slot="content">该手续费值是根据当前NULS网络预估的，实际消耗可能小于该值，多余部分将会通过共识奖励退回</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>-->
          </label>
        </li>
        <li>节点惩罚 <label><u class="click td">{{nodeInfo.yellowCardCount}}黄牌</u></label></li>
        <li>信用值 <label>{{nodeInfo.creditValue}}</label></li>
        <p class="cb"></p>
      </ul>
    </div>
    <div class="cb"></div>

    <div v-loading="nodeDepositLoading">
      <div class="entrust w1200 bg-white" v-show="jionNode">
        <div class="entrust_add w630">
          <el-form :model="jionNodeForm" status-icon :rules="jionNodeRules" ref="jionNodeForm">
            <el-form-item label="委托金额(NULS):" prop="amount">
              <span class="balance font12 fr">可用余额：{{addressInfo.balance}}</span>
              <el-input v-model="jionNodeForm.amount">
              </el-input>
            </el-form-item>
            <div class="font14">
              手续费：{{fee}} <span class="fCN">NULS</span>
            </div>
            <el-form-item class="form-next">
              <el-button type="success" @click="jionNodeSubmitForm('jionNodeForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="entrust_list w1200 bg-white" v-show="!jionNode">
        <div class="top_total font12">
          总委托量：{{nodeInfo.totalDeposit}} <span class="fCN">NULS</span>
        </div>

        <div class="top_ico">
          <i class="el-icon-plus click" @click="showNodeList"></i>
        </div>
        <el-table :data="nodeDepositData" stripe border>
          <el-table-column prop="blockHeight" label="高度" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="加入时间" align="center">
          </el-table-column>
          <el-table-column prop="amount" label="金额(NULS)" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <label class="click tab_bn" @click="cancelDeposit(scope.row)">退出</label>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <div class="page-total">
            显示 {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
            共 {{pageTotal}}
          </div>
          <el-pagination class="fr" background v-show="pageTotal>pageSize" @current-change="nodeDepositPages"
                         :page-size="pageSize"
                         layout=" prev, pager, next, jumper"
                         :total="pageTotal">
          </el-pagination>
        </div>
      </div>
    </div>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import moment from 'moment'
  import nuls from 'nuls-sdk-js'
  import {getNulsBalance, countFee, inputsOrOutputs, validateAndBroadcast, agentDeposistList} from '@/api/requestData'
  import {timesDecimals, getLocalTime, Minus, Times} from '@/api/util'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      let checkAmount = (rule, value, callback) => {
        let usable = 500000 - Number(this.nodeInfo.totalDeposit);
        let balance = this.balanceInfo.balance - value*100000000;
        let re = /^\d+(?=\.{0,1}\d+$|$)/;
        let res = /^\d{1,8}(\.\d{1,8})?$/;
        if (!value) {
          return callback(new Error('委托金额不能为空'));
        } else if (!re.exec(value) || !res.exec(value)) {
          callback(new Error('请输入有效的委托金额数值'))
        } else if (value < 2000 || value > usable) {
          return callback(new Error('委托金额不小于2000并且总委托额小于500000'));
        } else if (balance < 0.001) {
          return callback(new Error('对不起，账户余额不足'));
        } else {
          callback()
        }
      };

      return {
        addressInfo: {},//账户信息
        balanceInfo: {},//账户余额信息
        nodeInfo: {},//节点详情
        fee: 0.001,//手续费
        outInfo: '',//退出信息
        passwordType: 0,//输入密码后的提交类型 0:加入委托 1:退出委托 2:注销节点
        jionNode: false,//是否显示加入共识
        nodeDepositData: [],//委托列表
        nodeDepositLoading: true,//委托类别加载动画
        pageIndex: 1, //页码
        pageSize: 5, //每页条数
        pageTotal: 0,//总页数
        jionNodeForm: {
          amount: ''
        },
        jionNodeRules: {
          amount: [
            {validator: checkAmount, trigger: ['blur', 'change']}
          ]
        },
      };
    },
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      }, 500);
    },
    mounted() {
      this.getBalanceByAddress(this.addressInfo.address);
      this.getNodeInfoByHash(this.$route.query.hash);
      this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash)
    },
    components: {
      Password,
      BackBar
    },
    methods: {

      /**
       * 根据hash获取节点详情信息
       * @param hash
       **/
      getNodeInfoByHash(hash) {
        this.$post('/', 'getConsensusNode', [hash])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.agentReward = timesDecimals(response.result.agentReward);
              response.result.deposits = timesDecimals(response.result.deposit);
              response.result.totalDeposit = timesDecimals(response.result.totalDeposit);
              response.result.totalReward = timesDecimals(response.result.totalReward);
              response.result.createTime = moment(getLocalTime(response.result.createTime)).format('YYYY-MM-DD HH:mm:ss');
              this.nodeInfo = response.result;
            }
          })
          .catch((error) => {
            console.log("getConsensusNode:" + error);
          });
      },

      /**
       * 根据hash获取节点委托列表
       * @param pageIndex
       * @param pageSize
       * @param address
       * @param hash
       **/
      getNodeDepositByHash(pageIndex, pageSize, address, hash) {
        this.$post('/', 'getAccountDeposit', [pageIndex, pageSize, address, hash])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.amount = timesDecimals(itme.amount);
                itme.fee = timesDecimals(itme.fee);
                itme.createTime = moment(getLocalTime(itme.createTime)).format('YYYY-MM-DD HH:mm:ss');
              }
              this.nodeDepositData = response.result.list;
              if (response.result.totalCount === 0) {
                this.jionNode = true
              } else {
                this.jionNode = false
              }
              this.pageTotal = response.result.totalCount;
              this.nodeDepositLoading = false;
            } else {
              this.nodeDepositLoading = false;
            }
          })
          .catch((error) => {
            console.log("getConsensusDeposit:" + error);
          });
      },

      /**
       * 委托列表分页
       * @param val
       **/
      nodeDepositPages(val) {
        this.pageIndex = val;
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash);
      },

      /**
       * 显示加入共识
       **/
      showNodeList() {
        this.jionNode = true;
        this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.$route.query.hash);
      },

      /**
       * 加入共识
       * @param formName
       **/
      jionNodeSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs.password.showPassword(true);
            this.passwordType = 0;
          } else {
            return false;
          }
        });
      },

      /**
       * 获取账户余额
       * @param address
       **/
      getBalanceByAddress(address){
        getNulsBalance(address).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
          } else {
            this.$message({message: "获取账户余额失败:" + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: "获取账户余额失败：" + error, type: 'error', duration: 1000});
        });
      },

      /**
       *退出共识
       * @param outInfo
       **/
      cancelDeposit(outInfo) {
        this.outInfo = outInfo;
        getNulsBalance(this.addressInfo.address).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
            this.$refs.password.showPassword(true);
            this.passwordType = 1;
          } else {
            this.$message({message: "获取账户余额失败:" + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: "获取账户余额失败：" + error, type: 'error', duration: 1000});
        });
      },

      /**
       *  注销节点
       **/
      stopNode() {
        getNulsBalance(this.addressInfo.address).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
            this.$refs.password.showPassword(true);
            this.passwordType = 2;
          } else {
            this.$message({message: "获取账户余额失败:" + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: "获取账户余额失败：" + error, type: 'error', duration: 1000});
        });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: 2,
          assetsId: 1,
          amount: Number(Times(this.jionNodeForm.amount, 100000000).toString()),
          fee: 100000
        };
        let inOrOutputs = {};
        let txhex = '';
        let pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        let pub = this.addressInfo.pub;
        let remark = '';
        if (this.passwordType === 0) { //加入共识
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 5);
          let depositInfo = {
            address: this.addressInfo.address,
            agentHash: this.$route.query.hash,
            deposit: Number(Times(this.jionNodeForm.amount, 100000000).toString())
          };
          if (inOrOutputs.success) {
            let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 5, depositInfo);
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
            //txhex = await nuls.transactionSerialize(pri, pub, inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 5, depositInfo);
          } else {
            this.$message({message: "input和outputs组装错误：" + inOrOutputs.data, type: 'error', duration: 1000});
          }
        } else if (this.passwordType === 1) { //退出共识
          transferInfo.amount = Number(Times(this.outInfo.amount, 100000000).toString());
          transferInfo.depositHash = this.outInfo.txHash;
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 6);
          if (inOrOutputs.success) {
            let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 6, this.outInfo.txHash);
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          } else {
            this.$message({message: "input和outputs组装错误：" + inOrOutputs.data, type: 'error', duration: 1000});
          }
        } else if (this.passwordType === 2) { //注销节点
          transferInfo.amount = this.nodeInfo.deposit;
          transferInfo.depositHash = this.$route.query.hash;
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 9);
          if (inOrOutputs.success) {
            let newInputs = inOrOutputs.data.inputs;
            let outputs = [];
            const depositList = await agentDeposistList(this.$route.query.hash);
            for (let itme of depositList.list) {
              //console.log(itme.address);
              newInputs.push({
                address: itme.address,
                assetsChainId: 2,
                assetsId: 1,
                amount: itme.amount,
                locked: -1,
                nonce: itme.txHash.substring(itme.txHash.length - 16)//这里是hash的最后16个字符
              });
              outputs.push({
                address: itme.address,
                assetsChainId: 2,
                assetsId: 1,
                amount: itme.amount,
                lockTime: 0
              });
            }
            let addressArr = [];
            let newOutputs = [];
            outputs.forEach(function (item) {
              let i;
              if ((i = addressArr.indexOf(item.address)) > -1) {
                //console.log(result, i);
                newOutputs[i].amount = Number(newOutputs[i].amount) + Number(item.amount);
              } else {
                addressArr.push(item.address);
                newOutputs.push({
                  address: item.address,
                  amount: item.amount,
                  assetsChainId: item.assetsChainId,
                  assetsId: item.assetsId,
                  lockTime: item.lockTime,
                })
              }
            });
            newOutputs.unshift(inOrOutputs.data.outputs[0]);
            let tAssemble = await nuls.transactionAssemble(newInputs, newOutputs, remark, 9, this.$route.query.hash);
            let newFee = countFee(tAssemble, 1);
            if (transferInfo.fee !== newFee) {
              transferInfo.fee = newFee;
              newOutputs[0].amount = Number(Minus(this.nodeInfo.deposit, newFee).toString());
              tAssemble = await nuls.transactionAssemble(newInputs, newOutputs, remark, 9, this.$route.query.hash);
            }
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          }
          else {
            this.$message({message: "input和outputs组装错误：" + inOrOutputs.data, type: 'error', duration: 1000});
          }
        } else {
          console.log("交易类型错误")
        }
        //console.log(txhex);
        await validateAndBroadcast(txhex).then((response) => {
          if (response.success) {
            //console.log(response.hash);
            this.$router.push({
              name: "txList"
            })
          } else {
            this.$message({message: "验证并广播交易错误：" + response.data, type: 'error', duration: 1000});
          }
        }).catch((err) => {
          this.$message({message: "验证并广播交易异常：" + err, type: 'error', duration: 1000});
        });
      }
    },
    watch: {
      addressInfo(val, old) {
        if (val) {
          if (val.address !== old.address && old.address) {
            this.nodeDepositLoading = true;
            this.jionNodeForm.amount = '';
            this.getBalanceByAddress(this.addressInfo.address);
            this.getNodeDepositByHash(this.pageIndex, this.pageSize, this.addressInfo.address, this.$route.query.hash)
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .consensus_info {
    .el-button--danger {
      width: 100px;
      padding: 10px 0 10px 20px;
      text-align: center;
      margin: 8px 20px 0 0;
    }
    .entrust {
      border: @BD1;
      margin: 20px auto 0;
      .entrust_add {
        margin: 30px auto 50px;
        .balance {
          margin: 10px 0 0 0;
        }
      }
    }
    .entrust_list {
      margin: 50px auto 60px;
    }
  }
</style>
