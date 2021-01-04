<template>
  <div class="nft">
    <div class="txlist">
      <div class="fl">
        {{$t('contract.contract2')}}：
        <span class="click" @click="toUrl('contractsInfo',NFTInfo.contractAddress,1)">{{NFTInfo.contractAddress}}</span>
      </div>
      <div class="click fr" @click="toUrl('txLis721')">{{$t('home.home2')}}</div>
    </div>
    <el-form :model="nftForm" status-icon :rules="nftRules" ref="nftForm" class="cb nftForm"
             hide-required-asterisk="false">
      <el-form-item :label="$t('home.home6') + NFTInfo.tokenSymbol " prop="id" class="send fl">
        <el-select v-model="nftForm.id" filterable placeholder="" @change="changeId">
          <el-option v-for="item in sendList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import Password from '@/components/PasswordBar'
  import {MAIN_INFO} from '@/config.js'
  import {addressInfo, getArgs, Times, Plus, passwordVerification, connectToExplorer} from '@/api/util'
  import {
    countFee, inputsOrOutputs, validateAndBroadcast, getNulsBalance, //validateTx
  } from '@/api/requestData'
  import {chainMethodCall} from '@/api/contractCall'

  export default {
    data() {
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
        } else if (toAddressInfo.chainId !== MAIN_INFO.chainId) {
          return callback(new Error(this.$t('tips.tips25')));
        } else {
          callback();
        }
      };
      return {
        addressInfo: {},
        sendList: [],//下拉框数据
        nftForm: {
          id: '',
          toAddress: '',
        },
        nftRules: {
          id: [
            {required: true, message: this.$t('tips.tips26'), trigger: 'change'}
          ],
          toAddress: [
            {validator: validateToAddress, trigger: 'blur'}
          ],
        },
        tokenURI: '',
        contractCallData: {},//调用合约信息
        contractAddress: '',//合约地址
        contractInfo: {},//合约信息
      };
    },
    props: {
      //默认选中内容
      NFTInfo: {
        type: Object,
        default: () => {
        }
      },
    },
    watch: {},
    created() {
      this.addressInfo = addressInfo(1);
    },
    mounted() {
      this.init();
    },
    components: {
      Password,
    },
    destroyed() {
      this.sendList = [];
      this.nftForm.id = '';
      this.nftForm.toAddress = '';
    },
    methods: {

      async init() {
        for (let item of  this.NFTInfo.tokenSet) {
          let newArr = {value: item, label: '#' + item};
          this.sendList.push(newArr);
        }
        //console.log(this.sendList);
        this.nftForm.id = this.sendList[0].value;
        this.getToken721Id(this.NFTInfo.contractAddress, this.nftForm.id);
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
      async getToken721Id(address, id) {
        await this.$post('/', 'getToken721Id', [address, id])
          .then((response) => {
            //console.log(response);
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
       * @disc: 选择资产
       * @params:
       * @date: 2020-12-14 14:22
       * @author: Wave
       */
      changeId() {
        this.getToken721Id(this.NFTInfo.contractAddress, this.nftForm.id);
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
            let name = 'safeTransferFrom';
            let desc = '(Address from, Address to, BigInteger tokenId) return void';
            let methodsInfo = this.contractInfo.methods.filter(obj => obj.name === name && obj.desc === desc);
            methodsInfo[0].params[0].value = this.addressInfo.address;
            methodsInfo[0].params[1].value = this.nftForm.toAddress;
            methodsInfo[0].params[2].value = this.nftForm.id;
            let newArgs = getArgs(methodsInfo[0].params);
            if (!newArgs.allParameter) {
              console.log('arges 错误：' + newArgs.allParameter);
              return;
            }
            let resData = await chainMethodCall(this.addressInfo.address, methodsInfo[0], this.contractAddress, 0, newArgs.args);
            //console.log(resData);
            if (!resData.success) {
              console.log('验证合约错误：' + resData.data);
              return;
            }
            this.contractCallData = resData.data;
            this.$refs.password.showPassword(true);
          } else {
            return false;
          }
        });
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

        //console.log(this.contractCallData);
        let amount = Number(Times(this.contractCallData.gasLimit, this.contractCallData.price));
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: MAIN_INFO.chainId,
          assetsId: 1,
          amount: amount,
          fee: 100000
        };
        //console.log(transferInfo);
        amount = Number(Plus(transferInfo.fee, amount));
        let remark = '';
        //console.log(this.balanceInfo);
        let resData = await getNulsBalance(MAIN_INFO.chainId, 1, this.addressInfo.address);
        //console.log(resData);
        if (!resData.success) {
          console.log('获取账户nonce错误:' + resData.data);
          return
        }
        let inOrOutputs = await inputsOrOutputs(transferInfo, resData.data, 16);
        //console.log(inOrOutputs);
        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
        let txhex = '';
        //获取手续费
        let newFee = countFee(tAssemble, 1);
        //手续费大于0.001的时候重新组装交易及签名
        if (transferInfo.fee !== newFee) {
          transferInfo.fee = newFee;
          inOrOutputs = await inputsOrOutputs(transferInfo, resData.data, 16);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
          txhex = await nuls.transactionSerialize(passwordInfo.pri, passwordInfo.pub, tAssemble);
        } else {
          txhex = await nuls.transactionSerialize(passwordInfo.pri, passwordInfo.pub, tAssemble);
        }
        //console.log(txhex);

        //验证交易
        /*let validateTxRes = await validateTx(txhex);
        console.log(validateTxRes);*/

        //验证并广播交易
        await validateAndBroadcast(txhex).then((response) => {
          //console.log(response);
          if (response.success) {
            this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 1000});
            this.sendList.splice(this.sendList.findIndex(item => item.value === this.nftForm.id), 1);
            this.nftForm.id = this.sendList.length !== 0 ? this.sendList[0].value : ''
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
        }).catch((err) => {
          this.$message({message: this.$t('public.err0') + err, type: 'error', duration: 3000});
        });
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
  .nft {
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
          .el-select {
            width: 100%;
            .el-input__inner {
              width: 100%;
            }
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
