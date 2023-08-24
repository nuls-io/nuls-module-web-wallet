<template>
  <div class="nft1155">
    <div class="txlist">
      <div class="fl">
        {{$t('contract.contract2')}}：
        <span class="click" @click="toUrl('contractsInfo',NFTInfo.contractAddress,1)">{{NFTInfo.contractAddress}}</span>
      </div>
      <div class="click fr" @click="toUrl('txList1155')">{{$t('home.home2')}}</div>
    </div>
    <el-form :model="nftForm" status-icon :rules="nftRules" ref="nftForm" class="cb nftForm"
             hide-required-asterisk="false">
      <el-form-item prop="amount" class="send fl">
        <template slot="label">
          <div class="amount-label">
            <span>{{$t('home.home16')}}</span>
            <span>{{$t('consensus.consensus2')}}：{{NFTInfo.value}}</span>
          </div>
        </template>
        <el-input v-model="nftForm.amount">
          </el-input>
      </el-form-item>
      <el-form-item :label="$t('home.home7')" prop="toAddress" class="to fl">
        <el-input v-model.trim="nftForm.toAddress" autocomplete="off">
        </el-input>
      </el-form-item>
      <div class="cb"></div>
      <div class="tokenURL fl">
        <div class="titles">TokenURL</div>
        <div class="text scroll">
          {{tokenURI}}
        </div>
      </div>
      <el-form-item class="cb btn">
        <el-button type="success" @click="submitForm('nftForm')">{{$t('home.home8')}}</el-button>
      </el-form-item>
    </el-form>

    <Password ref="password" @passwordSubmit="passSubmit" />
    <LedgerConfirm :visible="ledgerVisible" @closed="ledgerVisible=false" :errorMsg="ledgerErrorMsg" />
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import Password from '@/components/PasswordBar'
  import LedgerConfirm from '@/components/LedgerConfirm'
  import ledgerMixin from '@/mixins/ledgerMixin'
  import { Times, Plus, passwordVerification, connectToExplorer } from '@/api/util'
  import {
    countFee, inputsOrOutputs, validateAndBroadcast, getNulsBalance, //validateTx
  } from '@/api/requestData'
  import {chainMethodCall} from '@/api/contractCall'

  export default {
    data() {
      const validateAmount = async (rule, value, callback) => {
        let patrn = new RegExp("^[0-9]*$");
        if (value === '' || !Number(value)) {
          callback(new Error(this.$t('home.home17')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('home.home18')))
        } else if (value - this.NFTInfo.value > 0) {
          callback(new Error(this.$t('home.home19') + this.NFTInfo.value))
        } else {
          callback()
        }
      };
      let validateToAddress = (rule, value, callback) => {
        let toAddressInfo = {};
        if (value && value.length > 20) {
          toAddressInfo = nuls.verifyAddress(value);
        }
        //console.log(toAddressInfo);
        if (!value) {
          return callback(new Error(this.$t('tips.tips25')));
        } else if (value.length < 20) {
          return callback(new Error(this.$t('tips.tips25')));
        } else if (!toAddressInfo.right) {
          return callback(new Error(this.$t('tips.tips25')));
        } else if (toAddressInfo.chainId !== this.currentChain.chainId) {
          return callback(new Error(this.$t('tips.tips25')));
        } else {
          callback();
        }
      };
      return {
        nftForm: {
          amount: '',
          toAddress: '',
        },
        nftRules: {
          amount: [{validator: validateAmount, trigger: 'blur'}],
          toAddress: [{validator: validateToAddress, trigger: 'blur'}],
        },
        tokenURI: '',
        contractCallData: {},//调用合约信息
        contractAddress: '',//合约地址
        contractInfo: {},//合约信息
      };
    },
    mixins: [ledgerMixin],
    props: {
      //默认选中内容
      NFTInfo: {
        type: Object,
        default: () => {
        }
      },
    },
    computed: {
      currentChain() {
        return this.$store.state.currentChain
      },
      addressInfo() {
        return this.$store.getters.currentAccount
      }
    },
    mounted() {
      this.init();
    },
    components: {
      Password,
      LedgerConfirm
    },
    destroyed() {
      this.nftForm.id = '';
      this.nftForm.toAddress = '';
    },
    methods: {

      async init() {
        this.getToken1155Id(this.NFTInfo.contractAddress, this.NFTInfo.tokenId);
        this.contractAddress = this.NFTInfo.contractAddress;
        let resData = await this.contractInfoByAddress(this.contractAddress);
        if (resData.success) {
          this.contractInfo = resData.data;
        }
      },

      /**
       * 获取tokenURI信息
       * @param address
       * @param id
       **/
      async getToken1155Id(address, id) {
        await this.$post('/', 'getToken1155Id', [address, id])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              this.tokenURI = response.result.tokenURI
            } else {
              this.tokenURI = '';
            }
          }).catch((err) => {
            console.log(err);
          })
      },

      /**
       * 获取合约详情根据合约地址
       * @param address
       **/
      async contractInfoByAddress(address) {
        return await this.$post('/', 'getContract', [address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              //this.contractInfo = response.result;
              return {success: true, data: response.result}
            } else {
              return {success: false, data: response}
            }
          })
          .catch((error) => {
            return {success: false, data: error}
          });
      },

      /**
       * @disc: 发送
       * @params:
       * @date: 2020-12-14 15:02
       * @author: Wave
       */
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const name = 'safeTransferFrom';
            const methodsInfo = this.contractInfo.methods.filter(obj => obj.name === name);
            methodsInfo[0].params[0].value = this.addressInfo.address;
            methodsInfo[0].params[1].value = this.nftForm.toAddress;
            methodsInfo[0].params[2].value = this.NFTInfo.tokenId;
            methodsInfo[0].params[3].value = this.nftForm.amount;
            methodsInfo[0].params[4].value = '""';
            
            const args = methodsInfo[0].params.map(v => v.value)
            
            let resData = await chainMethodCall(this.addressInfo.address, methodsInfo[0], this.contractAddress, 0, args);
            //console.log(resData);
            if (!resData.success) {
              console.log('验证合约错误：' + resData.data);
              return;
            }
            this.contractCallData = resData.data;
            if (this.addressInfo.isNULSLedger) {
              this.handleSign()
            } else {
              this.$refs.password.showPassword(true);
            }
          } else {
            return false;
          }
        });
      },
      async handleSign() {
        try {
          const tAssemble = await this.getAssemble()
          const unSignedHex = tAssemble.txSerialize().toString('hex')
          this.signByLedger(unSignedHex, this.addressInfo.pathIndex, this.handleMessage)
        } catch (e) {
          this.$message({message: e.message || e, type: 'error', duration: 1000});
        }
      },
      async getAssemble() {
        let amount = Number(Times(this.contractCallData.gasLimit, this.contractCallData.price));
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: this.currentChain.chainId,
          assetsId: 1,
          amount: amount,
          fee: 100000
        };
        amount = Number(Plus(transferInfo.fee, amount));
        let remark = '';
        let resData = await getNulsBalance(this.currentChain.chainId, 1, this.addressInfo.address);
        if (!resData.success) {
          console.log('获取账户nonce错误:' + resData.data);
          return
        }
        let inOrOutputs = await inputsOrOutputs(transferInfo, resData.data, 16);
        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
        
        //获取手续费
        const newFee = countFee(tAssemble, 1);
        //手续费大于0.001的时候重新组装交易及签名
        if (transferInfo.fee !== newFee) {
          transferInfo.fee = newFee;
          inOrOutputs = await inputsOrOutputs(transferInfo, resData.data, 16);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);          
        }
        return tAssemble
      },

      handleMessage(data) {
        if (data.success) {
          this.broadcastTx(data.result)
        }
      },

      async broadcastTx(txHex) {
        //验证并广播交易
        const response = await validateAndBroadcast(txHex)
        if (response.success) {
          this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 1000});
          this.$router.push({
            name: 'txList1155'
          })
        } else {
          if (response.data.code === 'err_0014') {
            this.$message({message: response.data.message, type: 'error', duration: 3000});
          } else {
            this.$message({
              message: this.$t('tips.err') + JSON.stringify(response.data),
              type: 'error',
              duration: 3000
            });
          }
        }
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        let passwordInfo = await passwordVerification(this.addressInfo, password);
        if (!passwordInfo.success) {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 3000});
          return;
        }
        const tAssemble = await this.getAssemble()
        const txHex = await nuls.transactionSerialize(passwordInfo.pri, passwordInfo.pub, tAssemble);
        this.broadcastTx(txHex)
      },

      /**
       * 连接跳转
       * @param name
       * @param parms
       * @param type 0:本网站跳转，1：跳转浏览器
       */
      toUrl(name, parms, type = 0) {
        //console.log(name, parms, type);
        if (type === 1) {
          parms = parms + '&tabName=first';
          connectToExplorer(name, parms);
          return;
        } else {
          let newParms = {accountType: parms};
          this.$router.push({
            name: name,
            query: newParms
          })
        }
      },
    }
  }
</script>

<style lang="less">
  .nft1155 {
    .el-form-item__label {
      width: 100%;
      text-align: left;
      padding-right: 0;
    }
    .amount-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: #8794b1;
      }
    }
    .txlist {
      margin: 0 40px 0 100px;
      height: 50px;
      line-height: 40px;
      font-size: 14px;
      .fl {
        color: #8794b1;
      }
    }

    .nftForm {
      margin: 0 0 0 100px;
      .send, .to {
        width: 350px;
        .el-form-item__label {
          color: #8794b1;
        }
        .el-form-item__content {
          .el-input__inner {
            padding-right: 30px;
          }
        }
      }
      .send {
        margin: 0 30px 0 0;
      }

      .tokenURL {
        .titles {
          font-size: 14px;
          color: #8794b1;
        }
        .text {
          margin: 0 0 0 0;
          text-align: left;
          line-height: 22px;
          width: 830px;
          font-size: 13px;
          padding: 8px;
          height: 60px;
          overflow-y: auto;
          word-wrap:break-word;
        }
      }

      .btn {
        margin: 0 0 40px 0;
        .el-form-item__content {
          text-align: right;
          width: 730px;
        }
        .el-button--success {
          width: auto;
          padding: 8px 20px;
          border-radius: 2px;
        }
      }
    }
  }
</style>
