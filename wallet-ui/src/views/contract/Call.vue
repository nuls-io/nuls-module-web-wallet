<template>
  <div class="call">
    <el-form :model="callForm" :rules="callRules" ref="callForm" class="call-form">
      <el-form-item label="" prop="region" class="search-model">
        <el-select v-model="callForm.modelValue" :placeholder="$t('call.call1')" @change="changeModel">
          <el-option v-for="item in callForm.modelData" :key="item.name" :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(domain, index) in callForm.parameterList" :label="domain.name" :key="domain.name"
                    :prop="'parameterList.' + index + '.value'"
                    :rules="{required: domain.required,message:domain.name+$t('call.call2'), trigger: 'blur'}"
      >
        <el-input v-model="domain.value" @change="changeParameter"></el-input>
      </el-form-item>

      <div class="div-senior" v-if="!selectionData.view">
        <el-form-item :label="$t('call.call3')" class="senior">
          <el-switch v-model="callForm.senior"></el-switch>
        </el-form-item>
        <div class="senior-div" v-if="callForm.senior">
          <el-form-item label="Gas Limit" prop="gas">
            <el-input v-model="callForm.gas"></el-input>
          </el-form-item>
          <el-form-item label="Price" prop="price">
            <el-input v-model="callForm.price"></el-input>
          </el-form-item>
          <el-form-item label="Value" prop="values" v-show="selectionData.payable">
            <el-input v-model="callForm.values"></el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item class="search-submit">
        <el-button type="success" @click="submitForm('callForm')">{{$t('contract.contract4')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="cb"></div>
    <div class="w630 bg-gray result" v-if="callResult">
      {{callResult}}
    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {getNulsBalance, countFee, inputsOrOutputs, validateAndBroadcast} from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import {getArgs, Times, Plus, addressInfo, chainID} from '@/api/util'

  export default {
    data() {

      let validateGas = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('deploy.deploy8')));
        } else if (value < 1) {
          this.callForm.gas = 1;
          callback();
        } else if (value > 10000000) {
          this.callForm.gas = 10000000;
          callback();
        } else {
          callback();
        }
      };
      let validatePrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('deploy.deploy9')));
        } else if (value < 1) {
          this.callForm.price = 1;
        } else {
          callback();
        }
      };
      let validateValues = (rule, value, callback) => {
        if (value < 0) {
          this.callForm.values = 0;
        } else {
          callback();
        }
      };

      return {
        addressInfo: {},//地址信息
        balanceInfo: {},//账户余额信息
        //调用接口form
        callForm: {
          modelData: [],
          modelValue: '',
          parameterList: [],
          senior: false,
          gas: 0,
          price: 0,
          values: 0,
        },
        callRules: {
          gas: [
            {validator: validateGas, trigger: ['blur', 'change']}
          ],
          price: [
            {validator: validatePrice, trigger: 'blur'}
          ],
          values: [
            {validator: validateValues, trigger: 'blur'}
          ]
        },
        //选中的方法
        selectionData: {
          view: true,
          payable:false,
        },
        contractCallData: {},//调用合约data
        callResult: '',//调用合约结果
      };
    },
    props: {
      modelList: Array,
      contractAddress: String,
      decimals: Number,
    },
    components: {
      Password,
    },
    created() {
      this.callForm.modelData = this.modelList;
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
      this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
    },
    mounted() {

    },
    watch: {
      modelList(val) {
        this.callForm.modelData = val;
      },
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
        }
      }
    },
    methods: {

      /**
       *  方法选择
       **/
      changeModel(val) {
        this.callResult = '';
        this.callForm.parameterList=[];
        for (let itme of this.callForm.modelData) {
          if (itme.name === val) {
            this.selectionData = itme;
            this.callForm.parameterList = itme.params;
            if(itme.params.length === 0){
              this.chainMethodCall();
            }
            if (!itme.view) {
              this.callForm.gas = 0;
              //this.callForm.price = 0;
              this.callForm.values = 0;
            }
          }
        }
      },

      /**
       * 判断所有必填参数是否有值
       **/
      changeParameter() {
        this.chainMethodCall();
      },

      /**
       * 调用方法
       * @param formName
       **/
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.selectionData.view) {  //不上链方法
              let newArgs = [];
              if (this.selectionData.params.length > 0) { //有参数
                newArgs = getArgs(this.callForm.parameterList, this.decimals);
                if (newArgs.allParameter) {
                  this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args)
                }
              } else { //没参数
                this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs)
              }
            } else { //上链方法
              this.chainMethodCall();
              this.$refs.password.showPassword(true);
            }
          } else {
            return false;
          }
        });
      },

      /**
       * 不上链方法调用
       * @param contractAddress
       * @param methodName
       * @param methodDesc
       * @param args
       */
      async methodCall(contractAddress, methodName, methodDesc, args) {
        await this.$post('/', 'invokeView', [contractAddress, methodName, methodDesc, args])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.callResult = response.result.result;
            } else {
              this.$message({message: this.$t('call.call8') + response.error, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call9') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 上链方法调用
       */
      chainMethodCall() {
        let newArgs = [];
        this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        if (this.selectionData.params.length > 0) { //有参数
          newArgs = getArgs(this.callForm.parameterList, this.decimals);
          if (newArgs.allParameter) {
            this.validateContractCall(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args);
          }
        } else { //没参数
          this.validateContractCall(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs);
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
        return await this.$post('/', 'validateContractCall', [sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              //return {success: true, data: response.result};
              this.imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args)
            } else {
              this.$message({message: this.$t('call.call6') + response, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call7') + error, type: 'error', duration: 1000});
          });
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
        return await this.$post('/', 'imputedContractCallGas', [sender, value, contractAddress, methodName, methodDesc, args])
          .then((response) => {
            if (response.hasOwnProperty("result")) {
              this.callForm.gas = response.result.gasLimit;
              let contractConstructorArgsTypes = this.getContractMethodArgsTypes(contractAddress, methodName);
              let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes);
              this.contractCallData = {
                chainId: chainID(),
                sender: sender,
                contractAddress: contractAddress,
                value: value,
                gasLimit: this.callForm.gas,
                price: this.callForm.price,
                methodName: methodName,
                methodDesc: methodDesc,
                args: newArgs
              };
            } else {
              this.$message({message: this.$t('call.call4') + response, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call5') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 获取合约指定函数的参数类型
       * @param contractAddress
       * @param  methodName
       */
      async getContractMethodArgsTypes(contractAddress, methodName) {
        return await this.$post('/', 'getContractMethodArgsTypes', [contractAddress, methodName])
          .then((response) => {
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
       * 获取账户余额
       * @param assetChainId
       * @param assetId
       * @param address
       **/
      getBalanceByAddress(assetChainId, assetId, address) {
        getNulsBalance(assetChainId, assetId, address).then((response) => {
          //console.log(response);
          if (response.success) {
            this.balanceInfo = response.data;
          } else {
            this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          console.log(error);
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(2, pri, password);
        if (newAddressInfo.address === this.addressInfo.address) {
          //console.log(this.contractCallData);
          let pub = this.addressInfo.pub;
          let amount = Number(Times(this.callForm.gas, this.callForm.price));
          amount = Number(Plus(this.callForm.values, amount));
          let transferInfo = {
            fromAddress: this.addressInfo.address,
            assetsChainId: chainID(),
            assetsId: 1,
            amount: amount,
            fee: 100000
          };
          if (this.callForm.values > 0) {
            transferInfo.toAddress = this.contractAddress;
            transferInfo.value = Number(Times(this.callForm.values, 100000000));
            transferInfo.amount = Number(Plus(transferInfo.value,amount))
          }
          let remark = '';
          let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
          let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
          let txhex = '';
          //获取手续费
          let newFee = countFee(tAssemble, 1);
          //console.log(this.balanceInfo);
          //手续费大于0.001的时候重新组装交易及签名
          if (transferInfo.fee !== newFee) {
            transferInfo.fee = newFee;
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
            tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          } else {
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          }
          //console.log(txhex);
          //验证并广播交易
          await validateAndBroadcast(txhex).then((response) => {
            //console.log(response);
            if (response.success) {
              this.callResult = response
            } else {
              if (response.data.code === 'err_0014') {
                this.$message({message: response.data.message, type: 'error', duration: 3000});
              } else {
                this.$message({message: this.$t('error.' + response.data.code), type: 'error', duration: 3000});
              }
            }
          }).catch((err) => {
            this.$message({message: this.$t('public.err1') + err, type: 'error', duration: 1000});
          });
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
        }
      }

    }
  }
</script>

<style lang="less">
  .call {
    .call-form {
      .el-form-item {
        margin: 0 0 20px 70px;
        width: 500px;
      }
      .search-model {
        margin: 10px 0 10px 70px;
        .el-form-item__label {
          width: 500px;
          text-align: left;
          float: none;
          padding: 0;
          line-height: 17px;
        }
        .el-form-item__content {
          .el-select {
            width: 500px;
            .el-input__inner {
              width: 500px;
            }
          }
        }
      }
      .div-senior {
        margin: 0 0 0 70px;
        .senior {
          margin: 0 0 0 0;
          .el-form-item__label {
            line-height: 40px;
            position: absolute;
            right: 380px;
          }
          .el-form-item__content {
            text-align: right;
            .el-switch {
              .el-switch__core {
              }
            }
          }
        }
        .senior-div {
          .el-form-item {
            margin: 0 0 5px 0;
            .el-form-item__label {
              line-height: 24px;
            }
          }
        }
      }
      .search-submit {
        text-align: center;
        margin: 15px 0 15px 70px;
        .el-button {
          width: 150px;
          padding: 9px;
        }
      }
    }
    .result {
      width: 500px;
      margin: 0 auto;
      border-top: 0 solid #ffffff;
      padding: 20px;
    }
  }

</style>
