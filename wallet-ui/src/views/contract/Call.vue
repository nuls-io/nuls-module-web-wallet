<template>
  <div class="call">
    <el-form :model="callForm" :rules="callRules" ref="callForm" class="call-form">
      <el-form-item label="" prop="region" class="search-model">
        <el-select v-model="callForm.modelValue" :placeholder="$t('call.call1')" @change="changeModel">
          <el-option v-for="(item,index) in callForm.modelData" :key="index" :label="item.name"
                     :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(domain, index) in callForm.parameterList" :label="domain.name" :key="index"
                    :prop="'parameterList.' + index + '.value'"
                    :rules="{required: domain.required,message:domain.name+$t('call.call2'), trigger: 'blur'}"
      >
        <el-input v-model.trim="domain.value" @change="changeParameter">
        </el-input>
      </el-form-item>

      <div class="div-senior" v-if="!selectionData.view">
        <el-form-item :label="$t('call.call3')" class="senior">
          <el-switch v-model="callForm.senior"></el-switch>
        </el-form-item>
        <div class="senior-div" v-if="callForm.senior">
          <el-form-item label="Gas Limit">
            <el-input v-model="callForm.gas" @change="changeGas" disabled></el-input>
            <div class="font12 yellow" v-show="gasTips">{{$t('call.call10')}}</div>
          </el-form-item>
          <el-form-item label="Price">
            <el-input v-model="callForm.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="Value(NULS)" prop="values" v-if="selectionData.payable">
            <el-input v-model="callForm.values"></el-input>
          </el-form-item>
          <div
              class="transfer-multiple-asset"
              v-if="selectionData.payableMultyAsset"
              style="background-color: #fff;width: 500px;padding: 10px 0 15px"
          >
            <el-form-item label="Other Assets" prop="region" class="search-model">
              <el-select v-model="callForm.assetInfo" :placeholder="$t('call.call11')" @change="changeAsset">
                <el-option v-for="(item,index) in multipleAsset" :key="index" :label="item.symbol"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Value" prop="otherValue">
              <el-input v-model="callForm.otherValue"></el-input>
            </el-form-item>
          </div>
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
    <Password ref="password" @passwordSubmit="passSubmit" />
    <LedgerConfirm :visible="ledgerVisible" @closed="ledgerVisible=false" />
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {
    getNulsBalance,
    countFee,
    inputsOrOutputs,
    validateAndBroadcast
  } from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import LedgerConfirm from '@/components/LedgerConfirm'
  import ledgerMixin from '@/mixins/ledgerMixin'
  import {getArgs, timesDecimals0, Times, Plus, chainID, timesDecimalsBig} from '@/api/util'

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
        if (!value) {
          callback(new Error(this.$t('deploy.deploy22')));
        } else if (value < 0 || value === 0) {
          this.callForm.values = 0;
          this.callForm.otherValue = 0;
          callback(new Error(this.$t('deploy.deploy22')));
        } else {
          callback();
        }
      };

      return {
        balanceInfo: {},//账户余额信息
        assetInfo: null, // 往合约转的其他资产资产信息
        //调用接口form
        callForm: {
          modelData: [],
          modelValue: '',
          parameterList: [],
          senior: false,
          gas: 0,
          price: 25,
          values: 0,
          assetInfo: "",
          otherValue: ""
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
          ],
          otherValue: [
            {validator: validateValues, trigger: 'blur'}
          ]
        },
        gasNumber: 0,//消耗的gas
        oldGasNumber: 0,//默认的gas
        gasTips: false,//gas 太小提示信息
        //选中的方法
        selectionData: {
          view: true,
          payable: false, // 是否可向该合约转nuls
          payableMultyAsset: false // 是否可向该合约转其他资产
        },
        contractCallData: {},//调用合约data
        callResult: '',//调用合约结果
        newArgs: [],//合约参数
        txHexRandom: '',
        signDataKeyRandom: '',
        multipleAsset: [], // 可转入合约的平行链资产列表
      };
    },
    props: {
      modelList: Array,
      contractAddress: String,
      decimals: Number,
    },
    mixins: [ledgerMixin],
    components: {
      Password,
      LedgerConfirm
    },
    computed: {
      MAIN_INFO() {
        const currentChain = this.$store.state.currentChain
        return {
          chainId: currentChain.chainId,
          assetId: currentChain.assetId
        }
      },
      addressInfo() {
        return this.$store.getters.currentAccount
      }
    },
    created() {
      let newData = this.modelList.filter(obj => !obj.event);
      this.callForm.modelData = newData.filter(obj => obj.name !== '<init>');
    },
    mounted() {
      setTimeout(() => {
        this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
        this.getAccountCrossLedgerList(this.addressInfo.address);
      }, 600);
    },
    watch: {
      modelList(val) {
        //this.callForm.modelData = val;
        let newData = val.filter(obj => !obj.event);
        this.callForm.modelData = newData.filter(obj => obj.name !== '<init>');
      },
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
          this.getAccountCrossLedgerList(this.addressInfo.address);
        }
      },
      gasNumber(val, old) {
        if (old && this.oldGasNumber > val) {
          this.gasTips = true
        } else {
          this.gasTips = false
        }
      }
    },
    methods: {

      /**
       *  方法选择
       * @param val
       **/
      changeModel(val) {
        //console.log(val);
        this.oldGasNumber = 0;
        this.callResult = '';
        this.callForm.parameterList = [];
        this.assetInfo = null;
        this.callForm.assetInfo = "";
        let newData = this.callForm.modelData[val];
        console.log(newData);
        this.selectionData = newData;
        this.callForm.parameterList = [...newData.params];
        if (newData.payable || newData.payableMultyAsset) {
          this.callForm.senior = true;
        }
        if (!newData.view) { //上链方法
          this.callForm.gas = 1;
          this.callForm.values = 0;
          this.callForm.otherValue = 0;
        }
        //清除已有的参数
        for (let itme of this.callForm.parameterList) {
          if (itme.value) {
            itme.value = ''
          }
        }
        this.newArgs = [];
        this.callForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        //console.log(this.selectionData);
        if (!this.selectionData.view) { //上链方法
          if (this.selectionData.params.length === 0) { //没有参数
            if (this.selectionData.payable) {
              this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs)
            } else {
              //
            }
          } else { //有参数
            this.newArgs = getArgs(this.callForm.parameterList);
            //console.log(this.newArgs);
            if (this.newArgs.allParameter) {
              this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs.args)
            }
          }
        }
      },

      /**
       * 判断所有必填参数是否有值
       **/
      changeParameter() {
        if (!this.selectionData.view && !this.selectionData.payable && !this.selectionData.payableMultyAsset) {
          this.chainMethodCall();
        }
      },

      /**
       * gas改变提示
       * */
      changeGas() {
        this.gasNumber = Number(this.callForm.gas)
      },

      /**
       * 调用方法
       * @param formName
       **/
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //console.log(this.selectionData);
            if (!this.selectionData.view) { //上链方法调用
              if (this.selectionData.params.length !== 0) {
                this.newArgs = getArgs(this.callForm.parameterList);
                if (this.newArgs.allParameter) {
                  this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs.args)
                }
              } else {

                if (this.selectionData.payableMultyAsset && !this.assetInfo) return false;
                const nulsValue = Number(Times(this.callForm.values, 100000000))
                let multyAssets = [], value;
                if (this.assetInfo) {
                  const { chainId: assetChainId, assetId, decimals } = this.assetInfo;
                  value = timesDecimalsBig(this.callForm.otherValue, decimals);
                  multyAssets = [
                    { value, assetChainId, assetId }
                  ]
                }
                this.imputedContractCallGas(this.addressInfo.address, nulsValue, this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs, multyAssets);
                /*if (this.selectionData.payable && this.selectionData.payableMultyAsset) {
                  // 同时转nuls和其他资产
                  if (!this.assetInfo) return false
                  // 往合约转其他资产
                  const { chainId: assetChainId, assetId, decimals } = this.assetInfo;
                  const value = timesDecimals0(this.callForm.otherValue, decimals);
                  const nulsValue = Number(Times(this.callForm.values, 100000000))
                  const multyAssets = [
                    { value, assetChainId, assetId }
                  ];
                  this.imputedContractCallGas(this.addressInfo.address, nulsValue, this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs, multyAssets);
                } else if (this.selectionData.payable) {
                  // 往合约转nuls
                  this.imputedContractCallGas(this.addressInfo.address, Number(Times(this.callForm.values, 100000000)), this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs);
                } else {
                  if (!this.assetInfo) return false
                  // 往合约转其他资产
                  const { chainId: assetChainId, assetId, decimals } = this.assetInfo;
                  const value = timesDecimals0(this.callForm.otherValue, decimals);
                  const multyAssets = [
                    { value, assetChainId, assetId }
                  ];
                  this.imputedContractCallGas(this.addressInfo.address, 0, this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs, multyAssets);
                }*/
              }
              this.getBalanceByAddress(chainID(), 1, this.addressInfo.address);
              if (this.addressInfo.isNULSLedger) {
                this.handleSign()
              } else {
                this.$refs.password.showPassword(true);
              }
            } else { //不上链方法，直接调用
              let newArgs = [];
              if (this.selectionData.params.length !== 0) { //有参数
                newArgs = getArgs(this.callForm.parameterList, this.decimals);
                if (newArgs.allParameter) {
                  this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs.args)
                }
              } else { //没参数
                this.methodCall(this.contractAddress, this.selectionData.name, this.selectionData.desc, newArgs)
              }
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
        let amount = Number(Times(this.callForm.gas, this.callForm.price));
        const transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: chainID(),
          assetsId: 1,
          amount: amount,
          fee: 100000
        };
        amount = Number(Plus(transferInfo.fee, amount));
        if (this.callForm.values > 0) {
          transferInfo.toAddress = this.contractAddress;
          transferInfo.value = Number(timesDecimals0(this.callForm.values));
          transferInfo.amount = Number(Plus(transferInfo.value, amount))
        }
        let multyAssets = []
        if (this.assetInfo) {
          const { chainId: assetChainId, assetId, decimals } = this.assetInfo
          multyAssets = [
            {
              value: timesDecimalsBig(this.callForm.otherValue, decimals),
              assetChainId,
              assetId
            }
          ];
          transferInfo.value = Number(timesDecimals0(this.callForm.values));
          transferInfo.amount = Number(Plus(transferInfo.value, amount))
          transferInfo.assetsChainId = this.MAIN_INFO.chainId;
          transferInfo.assetsId = this.MAIN_INFO.assetId;
          transferInfo.toAddress = this.contractAddress;
        }
        let remark = '';
        let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16, multyAssets);
        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
        //获取手续费
        let newFee = countFee(tAssemble, 1);
        //手续费大于0.001的时候重新组装交易及签名
        if (transferInfo.fee !== newFee) {
          transferInfo.fee = newFee;
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 16, this.contractCallData);
        }
        return tAssemble
      },
      handleMessage(data) {
        if (data.success) {
          this.broadcastTx(data.result)
        }
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
              if (response.error.code === 'err_0014') {
                this.$message({message: this.$t('call.call8') + response.error.data, type: 'error', duration: 1000});
              } else {
                this.$message({message: this.$t('call.call8') + response.error.message, type: 'error', duration: 1000});
              }
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
        if (this.selectionData.params.length !== 0) { //有参数
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
            if (response.result.success) {
              //return {success: true, data: response.result};
              this.imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args)
            } else {
              this.$message({message: this.$t('call.call6') + response.result.msg, type: 'error', duration: 2000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call7') + error, type: 'error', duration: 2000});
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
      async imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args, multyAssets) {
        let multyAssetArray = [];
        if (multyAssets && multyAssets.length) {
          let length = multyAssets.length;
          multyAssetArray = new Array(length);
          for (let i = 0; i < length; i++) {
            let multyAsset = multyAssets[i];
            multyAssetArray[i] = [multyAsset.value, multyAsset.assetChainId, multyAsset.assetId];
          }
        }
        return await this.$post('/', 'imputedContractCallGas', [sender, value, contractAddress, methodName, methodDesc, args, multyAssetArray])
          .then(async (response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.gasNumber = response.result.gasLimit;
              this.oldGasNumber = response.result.gasLimit;
              this.callForm.gas = response.result.gasLimit;
              let contractConstructorArgsTypes = await this.getContractMethodArgsTypes(contractAddress, methodName, methodDesc);
              if (!contractConstructorArgsTypes.success) {
                this.$message({message: this.$t('call.call4') + response, type: 'error', duration: 3000});
                return;
              }
              let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes.data);
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
              this.$message({message: this.$t('call.call4') + response, type: 'error', duration: 3000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call5') + JSON.stringify(error), type: 'error', duration: 3000});
          });
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
            this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 3000});
          }
        }).catch((error) => {
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 3000});
        });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(chainID(), pri, password, this.$store.state.prefix);
        if (newAddressInfo.address === this.addressInfo.address) {
          const tAssemble = await this.getAssemble()
          const txHex = await nuls.transactionSerialize(pri, this.addressInfo.pub, tAssemble);
          this.broadcastTx(txHex)
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 3000});
        }
      },

      async broadcastTx(txHex) {
        const response = await validateAndBroadcast(txHex)
        if (response.success) {
          this.callResult = response
        } else {
          if (response.data.code === 'err_0014') {
            this.$message({message: response.data.message, type: 'error', duration: 3000});
          } else {
            this.$message({message: this.$t('error.' + response.data.code), type: 'error', duration: 3000});
          }
        }
      },
      async getAccountCrossLedgerList(address) {
        const res = await this.$post('/', 'getAccountCrossLedgerList', [address])
        if (res.result) {
          this.multipleAsset = res.result
        }
      },
      changeAsset(asset) {
        this.assetInfo = asset;
        this.callForm.assetInfo = asset.symbol;
        const { chainId: assetChainId, assetId, decimals } = this.assetInfo;
        const value = timesDecimalsBig(this.callForm.otherValue, decimals);
        const multyAssets = [
          { value, assetChainId, assetId }
        ];
        this.imputedContractCallGas(this.addressInfo.address, 0, this.contractAddress, this.selectionData.name, this.selectionData.desc, this.newArgs, multyAssets);
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
      overflow: auto;
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        border-radius: 2px;
      }

      &::-webkit-scrollbar {
        width: 2px;
        background-color: #dfe4ed;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        width: 2px;
        background-image: -webkit-gradient(linear, 20% 0%, 20% 0%, from(#d1dbe5), to(#d1dbe5), color-stop(.2, #ffffff))
      }
    }
  }

</style>
