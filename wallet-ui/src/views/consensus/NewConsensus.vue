<template>
  <div class="new_consensus bg-gray">

    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('nav.consensus')"></BackBar>
        <h3 class="title">{{$t('newConsensus.newConsensus0')}}</h3>
      </div>
    </div>

    <div class="w1200 bg-white mt_20">
      <el-form :model="createrForm" :rules="createrRules" ref="createrForm">
        <el-form-item :label="$t('public.createAddress')">
          <el-input v-model.trim="addressInfo.address" disabled>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('public.rewardAddress')" prop="rewardAddress">
          <el-input v-model.trim="createrForm.rewardAddress" maxlength="50">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('public.packingAddress')" prop="blockAddress">
          <el-input v-model.trim="createrForm.blockAddress" maxlength="50">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('public.deposit') + '('+agentAsset.agentAsset.symbol+')'" prop="amount">
          <span class="balance font12 fr">{{$t('consensus.consensus2')}}: {{balanceInfo.balance/100000000}}</span>
          <el-input v-model.trim="createrForm.amount">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('public.commission') + '(%)'" prop="rate">
          <el-input v-model.trim="createrForm.rate">
          </el-input>
        </el-form-item>
        <div class="font14">
          <el-tooltip placement="top">
            <div slot="content">{{$t('transfer.transfer5')}}</div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
          {{$t('public.fee')}}: 0.001 <span class="fCN">{{agentAsset.agentAsset.symbol}}</span>
        </div>
        <el-form-item class="form-next">
          <el-button type="success" @click="submitForm('createrForm')" :disabled="isRed">{{$t('password.password3')}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
    <el-dialog :title="$t('newConsensus.newConsensus1')" :visible.sync="newConsensusVisible" width="40rem"
               class="confirm-dialog">
      <div class="bg-white">
        <div class="div-data">
          <p>{{$t('public.createAddress')}}:&nbsp;</p>
          <label>{{addressInfo.address}}</label>
        </div>
        <div class="div-data">
          <p>{{$t('public.rewardAddress')}}:&nbsp;</p>
          <label>{{createrForm.rewardAddress}}</label>
        </div>
        <div class="div-data">
          <p>{{$t('public.packingAddress')}}:&nbsp;</p>
          <label>{{createrForm.blockAddress}}</label>
        </div>
        <div class="div-data">
          <p>{{$t('public.commission')}}:&nbsp;</p>
          <label class="yellow">{{createrForm.rate}}% </label>
        </div>
        <div class="div-data">
          <p>{{$t('public.deposit')}}:&nbsp;</p>
          <label class="yellow">{{createrForm.amount}} <span
                  class="fCN">{{agentAsset.agentAsset.symbol}}</span></label>
        </div>
        <div class="div-data">
          <p>{{$t('public.fee')}}:&nbsp;</p>
          <label>0.001 <span class="fCN">{{agentAsset.agentAsset.symbol}}</span></label>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newConsensusVisible = false">{{$t('password.password2')}}</el-button>
        <el-button type="success" @click="confiremSubmit">{{$t('transfer.transfer8')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {
    getNulsBalance,
    inputsOrOutputs,
    validateAndBroadcast,
    getPrefixByChainId,
    commitData
  } from '@/api/requestData'
  import {Times, addressInfo, chainID, getRamNumber} from '@/api/util'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      let checkRewardAddress = (rule, value, callback) => {
        let patrn = {};
        if (value && value.length > 5) {
          patrn = nuls.verifyAddress(value);
        }
        if (!value) {
          return callback(new Error(this.$t('newConsensus.newConsensus2')));
        } else if (!patrn.right) {
          return callback(new Error(this.$t('newConsensus.newConsensus21')))
        } else {
          this.$refs.createrForm.validateField('blockAddress');
          callback();
        }
      };
      let checkBlockAddress = (rule, value, callback) => {
        let patrn = {};
        if (value && value.length > 5) {
          patrn = nuls.verifyAddress(value);
        }
        if (!value) {
          return callback(new Error(this.$t('newConsensus.newConsensus3')));
        } else if (value === this.addressInfo.address) {
          return callback(new Error(this.$t('newConsensus.newConsensus4')));
        } else if (!patrn.right) {
          return callback(new Error(this.$t('newConsensus.newConsensus31')))
        } else {
          callback();
        }
      };
      let checkAmount = (rule, value, callback) => {
        let re = /^\d+(?=\.{0,1}\d+$|$)/;
        let res = /^\d{1,8}(\.\d{1,8})?$/;
        let balance = this.balanceInfo.balance - value * 100000000;
        if (!value) {
          return callback(new Error(this.$t('newConsensus.newConsensus5')));
        } else if (!re.exec(value) || !res.exec(value)) {
          callback(new Error(this.$t('newConsensus.newConsensus6')));
        } else if (balance < 0.001) {
          callback(new Error(this.$t('newConsensus.newConsensus7')));
        } else if (value < 20000 || value > 200000) {
          callback(new Error(this.$t('newConsensus.newConsensus8')));
        } else {
          callback();
        }
      };
      let checkRate = (rule, value, callback) => {
        let res = /^([1]?\d{1,2})$/;
        if (!value) {
          return callback(new Error(this.$t('newConsensus.newConsensus9')));
        } else if (!res.exec(value)) {
          callback(new Error(this.$t('newConsensus.newConsensus10')));
        } else if (value < 10 || value > 100) {
          callback(new Error(this.$t('newConsensus.newConsensus11')));
        } else {
          callback();
        }
      };
      return {
        addressInfo: {},//账户信息
        balanceInfo: {},//账户余额信息
        agentAsset: JSON.parse(sessionStorage.getItem('info')),//pocm合约单位等信息
        isRed: false,//创建地址是否有红牌惩罚
        //创建节点表单
        createrForm: {
          rewardAddress: '',
          blockAddress: '',
          amount: '',
          rate: '',
        },
        createrRules: {
          rewardAddress: [
            {validator: checkRewardAddress, trigger: ['blur', 'change']},
          ],
          blockAddress: [
            {validator: checkBlockAddress, trigger: ['blur', 'change']},
          ],
          amount: [
            {validator: checkAmount, trigger: ['blur', 'change']}
          ],
          rate: [
            {validator: checkRate, trigger: ['blur', 'change']}
          ],
        },
        newConsensusVisible: false,//创建节点确认弹框
        prefix: '',//地址前缀
        getNewConsensusRandomString: '',
        sendNewConsensusRandomString: '',
      };
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        //console.log(response);
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
    },
    mounted() {
      setTimeout(() => {
        this.getPunishByAddress(this.addressInfo.address);
        this.getBalanceByAddress(this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address);
      }, 600);
    },
    watch: {
      addressInfo(val, old) {
        if (val) {
          if (val.address !== old.address && old.address) {
            this.getPunishByAddress(this.addressInfo.address);
            this.getBalanceByAddress(this.agentAsset.agentAsset.chainId, this.agentAsset.agentAsset.assetId, this.addressInfo.address);
          }
        }
      }
    },
    components: {
      Password,
      BackBar,
    },
    methods: {

      /**
       * 创建节点提交
       * @param formName
       **/
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newConsensusVisible = true;
          } else {
            return false;
          }
        });
      },

      /**
       * 获取账户余额
       * @param assetChainId
       * @param assetId
       * @param address
       **/
      getBalanceByAddress(assetChainId, assetId, address) {
        getNulsBalance(assetChainId, assetId, address).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
          } else {
            this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      /**
       * 查询创建地址是否有红牌
       * @param address
       **/
      getPunishByAddress(address) {
        this.$post('/', 'getPunishList', [1, 10, 2, address])
          .then((response) => {
            //console.log(response);
            if (response.result.list.length !== 0) {
              this.isRed = true;
              this.$message({message: this.$t('newConsensus.newConsensus12'), type: 'error', duration: 3000});
            } else {
              this.isRed = false;
            }
          }).catch((error) => {
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      /**
       *  确定框确定提交
       **/
      async confiremSubmit() {
        if (this.addressInfo.aesPri === '') {
          this.getNewConsensusRandomString = await getRamNumber(16);
          this.sendNewConsensusRandomString = await getRamNumber(16);
          let assembleHex = await this.newConsensusAssemble();
          if (!assembleHex.success) {
            this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
            return;
          }
          let commitDatas = await commitData(this.getNewConsensusRandomString, this.sendNewConsensusRandomString,this.addressInfo.address,assembleHex.data);
          if (!commitDatas.success) {
            this.$message({
              message: this.$t('tips.tips4') + JSON.stringify(commitDatas.data),
              type: 'error',
              duration: 3000
            });
            return;
          }
          this.$refs.password.showScan(commitDatas.data.txInfo, commitDatas.data.assembleHex);
        } else {
          this.$refs.password.showPassword(true);
        }
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        let tAssemble = await this.newConsensusAssemble();
        if (!tAssemble.success) {
          return;
        }

        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(this.addressInfo.chainId, pri, password, this.prefix);
        if (newAddressInfo.address === this.addressInfo.address) {
          let txhex = await nuls.transactionSerialize(pri, this.addressInfo.pub, tAssemble.data);
          //console.log(txhex);
          //验证并广播交易
          await validateAndBroadcast(txhex).then((response) => {
            //console.log(response);
            if (response.success) {
              this.$router.push({
                name: "txList"
              })
            } else {
              this.$message({message: this.$t('error.' + response.data.code), type: 'error', duration: 3000});
            }
          }).catch((err) => {
            this.$message({message: this.$t('public.err0') + err, type: 'error', duration: 1000});
          });
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
        }
      },

      /**
       * @disc: 创建节点组装交易
       * @date: 2019-12-04 14:17
       * @author: Wave
       */
      async newConsensusAssemble() {
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: this.agentAsset.agentAsset.chainId,
          assetsId: this.agentAsset.agentAsset.assetId,
          amount: Number(Times(this.createrForm.amount, 100000000).toString()),
          fee: 100000
        };
        let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 4);
        //console.log(inOrOutputs);
        if (!inOrOutputs.success) {
          this.$message({
            message: this.$t('public.err1') + JSON.stringify(inOrOutputs.data),
            type: 'error',
            duration: 3000
          });
          return {success: false}
        }
        let agent = {
          agentAddress: this.addressInfo.address,
          packingAddress: this.createrForm.blockAddress,
          rewardAddress: this.createrForm.rewardAddress,
          commissionRate: Number(this.createrForm.rate),
          deposit: Number(Times(this.createrForm.amount, 100000000).toString())
        };
        let data = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, '', 4, agent);
        //console.log(data);
        return {
          success: true,
          data: data
        };
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .new_consensus {
    .mt_20 {
      border: @BD1;
      .el-form {
        width: 600px;
        margin: 50px auto;
        .el-form-item {
          .el-form-item__content {
            .el-select {
              width: 100%;
              .el-input__inner {
                width: 100%;
              }
            }
          }
        }
      }
    }

  }
</style>
