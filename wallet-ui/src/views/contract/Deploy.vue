<template>
  <div class="deploy" v-loading="deployLoading">
    <div class="select_resource">
      <el-radio-group v-model="resource" @change="changeRadio">
        <el-radio label="1">{{$t('deploy.deploy2')}}</el-radio>
        <el-radio label="0">{{$t('deploy.deploy1')}}</el-radio>
      </el-radio-group>
    </div>

    <el-form :model="deployForm" :rules="deployRules" ref="deployForm" status-icon @submit.native.prevent>
      <div class="modes bg-white w1200">
        <div class="parameter" style="padding-top: 1rem">
          <el-form-item :label="$t('deploy.deploy21')" prop="alias">
            <el-input v-model="deployForm.alias" autocomplete="off" @change="changeAlias">
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="HEX" prop="hex" v-show="resource ==='0'" class="hex">
          <el-input type="textarea" :rows="10" v-model.trim="deployForm.hex" @change="getParameter"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <div class="upload_jar" v-show="resource==='1'">
          <input type="file" id="fileId" class="hidden">
          <div class="click upload tc" @click="uploadJar">
            <i class="el-icon-upload2 font30"></i>
            <p class="font14">{{$t('deploy.deploy3')}}</p>
            <p class="font12" v-show="fileName">{{$t('deploy.deploy4')}}:{{fileName}}</p>
          </div>
        </div>
        <div class="parameter" v-if="deployForm.parameterList">
          <el-form-item v-for="(domain, index) in deployForm.parameterList" :label="domain.name" :key="domain.name"
                        :prop="'parameterList.' + index + '.value'"
                        :rules="{required: domain.required,message:domain.name+$t('call.call2'), trigger: 'blur'}"
          >
            <el-input v-model.trim="domain.value" @change="changeParameter">
            </el-input>
          </el-form-item>
        </div>
        <div class="w500" v-show="deployForm.hex" style="padding-bottom: 2rem">
          <el-form-item :label="$t('call.call3')" class="senior">
            <el-switch v-model="deployForm.senior">
            </el-switch>
          </el-form-item>
          <div v-if="deployForm.senior" class="senior-div bg-white">
            <el-form-item label="Gas Limit" prop="gas">
              <el-input v-model="deployForm.gas" disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="Price" prop="price">
              <el-input v-model="deployForm.price" disabled>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('public.contractInfo')" prop="addtion">
              <el-input type="textarea" :rows="3" maxlength="200" show-word-limit v-model="deployForm.addtion">
              </el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item class="form-next">
        <el-button type="success" @click="testSubmitForm('deployForm')">
          {{$t('deploy.deploy5')}}
        </el-button>
        <br/>
        <div class="mb_20"></div>
        <el-button @click="submitForm('deployForm')">{{$t('deploy.deploy6')}}</el-button>
      </el-form-item>
    </el-form>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
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
    getContractConstructor,
    validateTx,
    broadcastTx,
    getPrefixByChainId,
    commitData
  } from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import {getArgs, chainID, getRamNumber} from '@/api/util'

  export default {
    name: "deploy",
    data() {
      let validateAlias = (rule, value, callback) => {
        let patrn = /^(?!_)(?!.*?_$)[a-z0-9_]+$/;
        if (value === '') {
          callback(new Error(this.$t('deploy.deploy19')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('deploy.deploy20')));
        } else {
          callback();
        }
      };
      return {
        //选择部署
        resource: '1',
        //部署表单
        deployForm: {
          alias: '',
          hex: '',
          parameterList: [],
          senior: false,
          gas: '',
          price: '',
          addtion: '',
        },
        deployRules: {
          alias: [
            {validator: validateAlias, trigger: 'blur'}
          ],
          hex: [
            {required: true, message: this.$t('deploy.deploy7'), trigger: 'blur'},
          ],
          gas: [
            {type: 'number', required: true, message: this.$t('deploy.deploy8'), trigger: 'blur'},
          ],
          price: [
            {type: 'number', required: true, message: this.$t('deploy.deploy9'), trigger: 'blur'},
          ]
        },
        createAddress: '',//创建合约地址
        contractCreateTxData: {},//组装创建合约交易
        balanceInfo: {},//账户余额信息
        isTestSubmit: false,//测试合约
        fileName: '',//jar文件名
        deployLoading: false,//获取参数加载动画
        prefix: '',//地址前缀
        txHexRandom: '',
        signDataKeyRandom: ''
      };
    },
    props: {
      addressInfo: Object
    },
    components: {
      Password,
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        //console.log(response);
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });
      this.createAddress = this.addressInfo.address;
    },
    mounted() {
      setTimeout(() => {
        this.getBalanceByAddress(this.addressInfo.chainId, 1, this.createAddress);
      }, 600);
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.createAddress = val.address;
          this.getBalanceByAddress(this.addressInfo.chainId, 1, this.createAddress);
        }
      },
      fileName(val, old) {
        if (val !== old && old) {
          this.deployForm.parameterList = [];
          this.deployForm.gas = '';
          this.deployForm.price = '';
        }
      }
    },
    methods: {

      /**
       * 选择部署智能合约方式
       * @param e
       */
      changeRadio(e) {
        this.resource = e;
        this.fileName = '';
        this.deployForm = {
          alias: '',
          hex: '',
          parameterList: [],
          senior: false,
          gas: 1,
          price: 25,
          addtion: '',
        };
      },

      /**
       * 合约名称 重新调取方法
       **/
      changeAlias() {
        if (this.deployForm.hex) {
          this.changeParameter();
        }
      },

      /**
       * hex码 有值获取参数
       */
      async getParameter() {
        if (this.deployForm.hex.length > 500) {
          this.deployLoading = true;
          let parameter = await getContractConstructor(this.deployForm.hex);
          if (parameter.success) {
            this.deployLoading = false;
            if (parameter.data.args.length !== 0) {
              this.deployForm.parameterList = parameter.data.args
            } else {
              this.changeParameter();
            }
          } else {
            this.$message({message: this.$t('deploy.deploy10') + parameter.data.error, type: 'error', duration: 1000});
          }
        }
      },

      /**
       * 判断所有必填参数是否有值
       **/
      changeParameter() {
        let newArgs = getArgs(this.deployForm.parameterList);
        //console.log(newArgs);
        if (newArgs.allParameter) {
          this.validateContractCreate(this.createAddress, sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, this.deployForm.hex, newArgs.args);
          this.deployForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        }
      },

      /**
       * 验证创建合约交易
       * @param createAddress
       * @param gasLimit
       * @param price
       * @param contractCode
       * @param args
       */
      async validateContractCreate(createAddress, gasLimit, price, contractCode, args) {
        return await this.$post('/', 'validateContractCreate', [createAddress, gasLimit, price, contractCode, args])
          .then((response) => {
            //console.log(response.result);
            if (response.result.success) {
              this.imputedContractCreateGas(createAddress, contractCode, args);
            } else {
              this.$message({message: this.$t('deploy.deploy11') + response.error, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('deploy.deploy12') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 预估创建合约交易的gas
       * @param createAddress
       * @param contractCode
       * @param args
       */
      async imputedContractCreateGas(createAddress, contractCode, args) {
        return await this.$post('/', 'imputedContractCreateGas', [createAddress, contractCode, args])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.deployForm.gas = response.result.gasLimit;
              this.makeCreateData(response.result.gasLimit, createAddress, contractCode, args, this.deployForm.alias);
            } else {
              this.deployForm.gas = 1;
              this.$message({message: this.$t('deploy.deploy13') + response.error, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.deployForm.gas = 1;
            this.$message({message: this.$t('deploy.deploy14') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 组装构造函数的参数类型
       * @param constructor
       */
      async makeContractConstructorArgsTypes(constructor) {
        let newArr = [];
        for(let item of constructor){
          newArr.push(item.value)
        }
        return newArr
      },

      /**
       * 组装创建合约交易的txData
       * @param createAddress
       * @param gasLimit
       * @param contractCode
       * @param args
       * @param alias
       */
      async makeCreateData(gasLimit, createAddress, contractCode, args, alias) {
        let contractCreate = {};
        contractCreate.chainId = chainID();
        contractCreate.sender = createAddress;
        contractCreate.gasLimit = gasLimit;
        contractCreate.price = sdk.CONTRACT_MINIMUM_PRICE;
        contractCreate.contractCode = contractCode;
        contractCreate.alias = alias;
        let constructor = this.deployForm.parameterList;
        //console.log(constructor);
        let contractConstructorArgsTypes = await this.makeContractConstructorArgsTypes(constructor);
        if (args.length !== 0) {
          contractCreate.args = await utils.twoDimensionalArray(args, contractConstructorArgsTypes);
        } else {
          contractCreate.args = null;
        }
        contractCreate.contractAddress = sdk.getStringContractAddress(chainID());
        if (!contractCreate.chainId || !contractCreate.contractAddress || !contractCreate.contractCode || !contractCreate.gasLimit || !contractCreate.price || !contractCreate.sender) {
          this.$message({message: this.$t('deploy.deploy15'), type: 'error', duration: 3000});
        } else {
          this.contractCreateTxData = contractCreate;
          //console.log(this.contractCreateTxData);
        }
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
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      /**
       * 测试部署合约
       * @param formName
       **/
      testSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let newArgs = getArgs(this.deployForm.parameterList);
            if (newArgs.allParameter) {
              this.testDeploy(this.createAddress, this.deployForm.gas, sdk.CONTRACT_MINIMUM_PRICE, this.deployForm.hex, newArgs.args);
            }
          } else {
            return false;
          }
        });
      },

      //测试部署合约
      async testDeploy(createAddress, gasLimit, price, contractCode, args) {
        await this.$post('/', 'validateContractCreate', [createAddress, gasLimit, price, contractCode, args])
          .then((response) => {
            //console.log(response.result);
            if (response.result.success) {
              this.$message({message: this.$t('deploy.deploy16'), type: 'success', duration: 1000});
            } else {
              this.$message({message: this.$t('deploy.deploy11') + response.error, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('deploy.deploy12') + error, type: 'error', duration: 1000});
          });

      },

      /**
       * 部署合约
       * @param formName
       **/
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.isTestSubmit = false;
            if (this.addressInfo.aesPri === '') {
              this.txHexRandom = await getRamNumber(16);
              this.signDataKeyRandom = await getRamNumber(16);
              let assembleHex = await this.getAssemble();
              if (!assembleHex.success) {
                this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
                return;
              }
              let commitDatas = await commitData(this.txHexRandom, this.signDataKeyRandom,this.addressInfo.address, assembleHex.data);
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
              this.$refs.password.showPassword(true)
            }
          } else {
            return false;
          }
        });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(this.addressInfo.chainId, pri, password, this.prefix);
        let amount = this.contractCreateTxData.gasLimit * this.contractCreateTxData.price;
        //console.log(this.contractCreateTxData);
        if (newAddressInfo.address === this.addressInfo.address) {
          let transferInfo = {
            fromAddress: this.addressInfo.address,
            assetsChainId: chainID(),
            assetsId: 1,
            amount: amount,
            fee: 100000
          };
          let pub = this.addressInfo.pub;
          let remark = this.deployForm.addtion;
          //console.log(transferInfo);
          //console.log(this.balanceInfo);
          let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 15);
          if (!inOrOutputs.success) {
            this.$message({message: inOrOutputs.data, type: 'error', duration: 1000});
          }
          //console.log(inOrOutputs);
          let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 15, this.contractCreateTxData);
          //console.log(tAssemble);
          let txhex = '';
          //获取手续费
          let newFee = countFee(tAssemble, 1);
          //手续费大于0.001的时候重新组装交易及签名
          if (transferInfo.fee !== newFee) {
            transferInfo.fee = newFee;
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 15);
            tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 15, this.contractCreateTxData);
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          } else {
            txhex = await nuls.transactionSerialize(pri, pub, tAssemble);
          }
          //console.log(txhex);
          await validateTx(txhex).then((response) => {
            //console.log(response);
            if (response.success) {
              broadcastTx(txhex).then((response) => {
                //console.log(response);
                if (response.success) {
                  this.$router.push({
                    name: "txList"
                  })
                } else {
                  this.$message({
                    message: this.$t('public.err') + JSON.stringify(response.data),
                    type: 'error',
                    duration: 2000
                  });
                }
              }).catch((err) => {
                this.$message({message: this.$t('public.err0') + JSON.stringify(err), type: 'error', duration: 2000});
              });
            } else {
              this.$message({
                message: this.$t('public.err') + JSON.stringify(response.data),
                type: 'error',
                duration: 2000
              });
            }
          }).catch((err) => {
            this.$message({message: this.$t('public.err0') + JSON.stringify(err), type: 'error', duration: 2000});
          });
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 2000});
        }
      },

      async getAssemble() {
        let amount = this.contractCreateTxData.gasLimit * this.contractCreateTxData.price;
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          assetsChainId: chainID(),
          assetsId: 1,
          amount: amount,
          fee: 100000
        };
        let remark = this.deployForm.addtion;
        let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 15);
        if (!inOrOutputs.success) {
          this.$message({message: inOrOutputs.data, type: 'error', duration: 3000});
          return {success: false}
        }
        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 15, this.contractCreateTxData);
        //获取手续费
        let newFee = countFee(tAssemble, 1);
        //手续费大于0.001的时候重新组装交易及签名
        if (transferInfo.fee !== newFee) {
          transferInfo.fee = newFee;
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 15);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, remark, 15, this.contractCreateTxData);
        }
        return {success: true, data: tAssemble}
      },

      /**
       * jar 上传包
       * @returns {Promise<void>}
       */
      async uploadJar() {
        let _this = this;
        let obj = document.getElementById("fileId");
        obj.click();
        obj.onchange = function () {
          if (this.value !== '') {
            let file = obj.files[0];
            _this.fileName = file.name;
            //获取文件流
            let reader = new FileReader();
            reader.readAsDataURL(file);
            _this.deployLoading = true;
            reader.onload = (() => {
              _this.$post('/', 'uploadContractJar', [reader.result])
                .then((response) => {
                  //console.log(response);
                  if (response.hasOwnProperty("result")) {
                    _this.deployForm.hex = response.result.code;
                    _this.getParameter();
                  } else {
                    _this.$message({message: _this.$t('deploy.deploy17'), type: 'error', duration: 1000});
                  }
                }).catch((err) => {
                _this.$message({message: _this.$t('deploy.deploy18') + err, type: 'error', duration: 1000});
              })
            });
          }
        }
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .deploy {
    margin: 20px auto 100px;
    .modes {
      margin: 10px auto 0;
      .hex {
        margin: 0 20px -10px 20px;
      }
      .upload_jar {
        padding: 5px 0;
        .upload {
          width: 200px;
          height: 200px;
          margin: 0 auto 0;
          padding: 50px 0 0 0;
          border: @BD1;
          i {

          }
          p {
            line-height: 30px;
          }
        }
      }
      .parameter {
        width: 500px;
        margin: 20px auto 0;
        padding: 0 0 10px 0;
      }
    }

    .senior {
      margin: 0 0 0 0;
      .el-form-item__label {
        line-height: 40px;
        position: absolute;
        right: 390px;
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
        margin: 0 0 15px 0;
        .el-form-item__label {
          line-height: 24px;
        }
      }
    }
  }
</style>
