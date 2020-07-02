<template>
  <div class="transfer bg-gray cb" v-loading="transferLoading">
    <h3 class="title">{{changeAssets.account}} {{$t('nav.transfer')}}</h3>
    <div class="w1200 bg-white" v-loading="loading" :element-loading-text="$t('transfer.transfer22')">
      <el-form :model="transferForm" :rules="transferRules" ref="transferForm" status-icon>
        <el-form-item :label="$t('transfer.transfer0')">
          <el-input v-model.trim="transferForm.fromAddress" disabled>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('transfer.transfer1')" prop="toAddress">
          <el-input v-model.trim="transferForm.toAddress" @change="changeParameter">
            <i class="iconfont iconlianxiren click font18" slot="suffix" @click="showBook"></i>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('transfer.transfer2')">
          <el-select v-model="transferForm.type" @change="changeType">
            <el-option
                    v-for="item in assetsList"
                    :key="item.type === 1 ? item.chainId : item.contractAddress"
                    :label="item.symbol"
                    :disabled="isCross && item.type === 2"
                    :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="cross yellow font12" v-show="isCross">{{$t('transfer.transfer15')}}</div>
        <el-form-item :label="$t('transfer.transfer3')" prop="amount">
          <span class="balance font12 fr">{{$t('public.usableBalance')}}: {{Number(changeAssets.balance).toFixed(3)}}</span>
          <el-input v-model="transferForm.amount" @change="changeParameter">
          </el-input>
        </el-form-item>
        <div class="div-senior" v-show="changeAssets.type !== 1">
          <el-form-item :label="$t('call.call3')" class="senior">
            <el-switch v-model="transferForm.senior">
            </el-switch>
          </el-form-item>
          <div class="senior-div" v-if="transferForm.senior">
            <el-form-item label="Gas Limit" prop="gas">
              <el-input v-model="transferForm.gas" @change="changeGas" disabled>
              </el-input>
              <div class="font12 yellow" v-show="gasTips">{{$t('call.call10')}}</div>
            </el-form-item>
            <el-form-item label="Price" prop="price">
              <el-input v-model="transferForm.price" disabled>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="cb"></div>
        <el-form-item :label="$t('transfer.transfer4')">
          <el-input type="textarea" v-model="transferForm.remarks" maxlength="200" show-word-limit>
          </el-input>
        </el-form-item>
        <div class="font14">
          <el-tooltip placement="top">
            <div slot="content">{{$t('transfer.transfer5')}}</div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
          {{$t('public.fee')}}: {{fee}}
          <span class="fCN">{{feeSymbol}}</span>
        </div>
        <el-form-item class="form-next">
          <el-button type="success" @click="submitForm('transferForm')" :disabled="isNext">{{$t('public.next')}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
    <el-dialog :title="$t('transfer.transfer6')" width="46rem" class="confirm-dialog"
               :visible.sync="transferVisible"
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="bg-white">
        <div class="div-data">
          <p>{{$t('transfer.transfer0')}}&nbsp;</p>
          <label>{{transferForm.fromAddress}}</label>
        </div>
        <div class="div-data">
          <p>{{$t('transfer.transfer1')}}&nbsp;</p>
          <label v-if="aliasToAddress">{{aliasToAddress}}({{transferForm.toAddress}})</label>
          <label v-else>{{transferForm.toAddress}}</label>
        </div>
        <div class="div-data">
          <p>{{$t('public.fee')}}: &nbsp;</p>
          <label>{{fee}} <span class="fCN">{{feeSymbol}}</span></label>
        </div>
        <div class="div-data">
          <p>{{$t('tab.tab6')}}:&nbsp;</p>
          <label class="yellow">{{transferForm.amount}} <span class="fCN">{{changeAssets.symbol}}</span></label>
        </div>
        <div class="div-data">
          <p>{{$t('transfer.transfer4')}}&nbsp;</p>
          <label>{{transferForm.remarks}}</label>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">{{$t('transfer.transfer7')}}</el-button>
        <el-button type="success" @click="confirmTraanser">{{$t('transfer.transfer8')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('public.bookList')" width="50rem" class="book-dialog"
               :visible.sync="bookDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-table :data="bookData">
        <el-table-column property="name" :label="$t('transfer.transfer4')" width="100" align="center">
        </el-table-column>
        <el-table-column property="address" :label="$t('tab.tab11')" min-width="300" align="center">
        </el-table-column>
        <el-table-column property="alias" :label="$t('address.address3')" width="100" align="center">
        </el-table-column>
        <el-table-column label="" width="100" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" @click="handleClick(scope.row)" class="click td">{{$t('public.choice')}}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {
    isMainNet,
    countCtxFee,
    getNulsBalance,
    countFee,
    inputsOrOutputs,
    validateAndBroadcast,
    getPrefixByChainId
  } from '@/api/requestData'
  import {MAIN_INFO} from '@/config.js'
  import {Times, Power, Plus, Minus, timesDecimals, timesDecimals0, chainID, addressInfo} from '@/api/util'
  import Password from '@/components/PasswordBar'

  export default {

    data() {
      let validateToAddress = (rule, value, callback) => {
        let patrn = /^(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{20,50}$/;
        if (value === '') {
          callback(new Error(this.$t('transfer.transfer9')))
        } else if (!patrn.exec(value)) {
          this.getAccountByAlias(value);
          setTimeout(() => {
            if (value.length < 20 && this.aliasToAddress) {
              callback()
            } else {
              if (value.length > 20) {
                callback()
              } else {
                callback(new Error(this.$t('transfer.transfer10')))
              }
              this.aliasToAddress = '';
            }
          }, 500);
        } else {
          this.aliasToAddress = '';
          callback()
        }
      };
      let validateAmount = (rule, value, callback) => {
        //console.log(this.changeAssets.decimals);
        let patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,1})?$");
        if (this.changeAssets.decimals === 0) {
          patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0,1})?$");
        } else {
          patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{1," + this.changeAssets.decimals + "})?$");
        }
        if (value === '') {
          callback(new Error(this.$t('transfer.transfer11')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('transfer.transfer12') + ": " + this.changeAssets.decimals))
        } else if (Number(value) < 0.001) {
          callback(new Error(this.$t('transfer.transfer13')))
        } else if (Number(value) > Number(Minus(this.changeAssets.balance, 0.001))) {
          callback(new Error(this.$t('transfer.transfer131') + Number(Minus(this.changeAssets.balance, 0.001))))
        } else {
          setTimeout(() => {
            if (Number(value) > Number(this.changeAssets.balance)) {
              callback(new Error(this.$t('transfer.transfer14')))
            } else if (Number(value) === Number(this.changeAssets.balance)) {
              this.transferForm.amount = Number(Minus(value, this.fee));
            } else {
              callback()
            }
          }, 200);
          //callback();
        }
      };
      let validateGas = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('deploy.deploy8')));
        } else if (value < 1 || value > 10000000) {
          callback(new Error(this.$t('deploy.deploy81')));
        } else {
          callback();
        }
      };
      let validatePrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('deploy.deploy9')));
        } else if (value < 1) {
          callback(new Error(this.$t('deploy.deploy91')));
        } else {
          callback();
        }
      };

      return {
        addressInfo: '', //默认账户信息
        balanceInfo: '',//账户余额信息
        assetsList: [],//账户资产列表
        changeAssets: {},//选择的资产信息
        gasNumber: 0,//消耗的gas
        oldGasNumber: 0,//默认的gas
        gasTips: false,//gas 太小提示信息
        transferForm: {
          fromAddress: '',
          toAddress: 'tNULSeBaMoodYW7AqyJrgYdWiJ6nfwfVHHHyXm',
          type: this.$route.query.accountType ? this.$route.query.accountType.account : 'NULS',
          amount: '0.01',
          senior: false,
          gas: this.gasNumber,
          price: sdk.CONTRACT_MINIMUM_PRICE,
          remarks: 'transfer remarks...',
        },//转账数据
        transferRules: {
          toAddress: [{validator: validateToAddress, trigger: 'change'}],
          amount: [{validator: validateAmount, trigger: ['blur', 'change']}],
          gas: [{validator: validateGas, trigger: ['blur', 'change']}],
          price: [{validator: validatePrice, trigger: 'blur'}],
        }, //验证信息
        fee: 0.001, //手续费
        feeSymbol: "NULS",//手续费显示单位
        contractInfo: {},//向合约地址转账是 合约信息
        transferVisible: false,//转账确认弹框
        isCross: false,//是否跨链交易
        isNext: false,//是否可用点击下一步
        transferLoading: false,//转账后的加载效果
        bookDialog: false,//通讯录弹框
        bookData: [],//通讯录列表
        aliasToAddress: '',//别名对应的地址
        prefix: '',//地址前缀
        loading: true,//验证地址效果
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
        if (this.changeAssets.balance) {
          this.loading = false;
        }
      }, 500);
      this.transferForm.fromAddress = this.addressInfo.address;

      setTimeout(() => {
        this.getCapitalListByAddress(this.transferForm.fromAddress);
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      }, 600);

    },
    mounted() {
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.transferForm.fromAddress = this.addressInfo.address;
          this.getCapitalListByAddress(this.transferForm.fromAddress);
          this.changeParameter();
          this.isNext = false;
          if (this.transferForm.toAddress) {
            this.$refs.transferForm.validateField('toAddress');
          }
          if (this.transferForm.amount) {
            this.$refs.transferForm.validateField('amount');
          }
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
    components: {
      Password,
    },
    methods: {

      /**
       * 查询账户详情根据别名
       * @param alias
       **/
      async getAccountByAlias(alias) {
        await this.$post('/', 'getAccountByAlias', [alias])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.aliasToAddress = response.result.address;
            } else {
              this.aliasToAddress = ''
            }
          }).catch((err) => {
            console.log(err);
            this.aliasToAddress = ''
          })
      },

      /**
       * 延迟执行方法
       * @param millisecond
       **/
      sleep(millisecond) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, millisecond)
        })
      },

      /**
       * 验证参数
       **/
      async changeParameter() {
        //判断转出地址是否为其他链地址 如果有就为跨链交易
        if (this.transferForm.toAddress) { //转入地址有值
          this.contractInfo = {};
          let fromAddress = nuls.verifyAddress(this.transferForm.fromAddress);
          let toAddress = {};
          await this.sleep(500);
          if (this.aliasToAddress) { //是否为别名转账
            toAddress = nuls.verifyAddress(this.aliasToAddress);
          } else {
            toAddress = nuls.verifyAddress(this.transferForm.toAddress);
          }
          //console.log(toAddress);
          if (!toAddress.right) {
            this.$message({message: this.$t('transfer.transfer23'), type: 'error', duration: 3000});
            return;
          }
          //判断toAddress 是什么地址 type 1:普通地址 2：合约地址
          if (toAddress.type === 2) { //向合约地址转账nuls
            //this.changeNuls();
            let methodsList = await this.contractInfoByContractAddress(this.transferForm.toAddress);
            if (methodsList.length !== 0) {
              let ifPayable = false;
              for (let item of methodsList) {
                if (item.name === '_payable') {
                  ifPayable = true
                }
              }
              if (!ifPayable) { //判断是否有_payable 方法
                this.$message({message: this.$t('transfer.transfer18'), type: 'error', duration: 2000});
              } else {
                if (this.transferForm.amount) { //判断是否填入金额
                  this.transferForm.gas = sdk.CONTRACT_MAX_GASLIMIT;
                  this.$refs['transferForm'].validate((valid) => {
                    if (valid) {
                      let gasLimit = sdk.CONTRACT_MAX_GASLIMIT;
                      let price = this.transferForm.price;
                      let contractAddress = this.contractInfo.contractAddress;
                      let methodName = '_payable';
                      let methodDesc = '';
                      let args = [];
                      this.validateContractCall(this.addressInfo.address, Number(Times(this.transferForm.amount, 100000000)), gasLimit, price, contractAddress, methodName, methodDesc, args);
                    } else {
                      return false;
                    }
                  });
                }
              }
              //console.log(this.contractInfo)
            } else {
              this.$message({message: this.$t('transfer.transfer19'), type: 'error', duration: 2000});
            }
          } else { //普通地址转账nuls
            if (fromAddress.chainId === toAddress.chainId) { //不跨链交易
              this.isCross = false;
              this.fee = 0.001;
              this.getSymbol();
              for (let item of this.assetsList) {
                //console.log(item);
                if (item.chainId === chainID() && item.type === 1) {
                  if (Number(item.balance) < 0.001) {
                    this.isNext = true;
                    this.$message({message: this.$t('transfer.transfer17'), type: 'error', duration: 2000});
                  } else {
                    this.isNext = false;
                  }
                }
              }
            } else { //跨链交易
              this.isCross = true;
              this.fee = 0.01;
              this.feeSymbol = "NULS";
              //跨链交易默认选中NULS
              if (this.changeAssets.type === 2) {
                this.changeNuls();
              }
              //跨链交易判断本资产及NULS是否够手续费
              for (let item of this.assetsList) {
                //判断nuls资产是否够手续费
                let isNulsFee = item.symbol === "NULS" && Number(item.balance) < 0.01;
                //判断本链资产是否够手续费
                let isChainFee = chainID() === item.chainId && Number(item.balance) < 0.01;
                if (isNulsFee) {
                  this.isNext = true;
                  this.$message({message: this.$t('transfer.transfer16'), type: 'error', duration: 2000});
                } else if (isChainFee) {
                  this.isNext = true;
                  this.$message({message: this.$t('transfer.transfer17'), type: 'error', duration: 2000});
                } else {
                  //this.isNext = true;
                }
              }
            }
          }
        }
        //合约地址转账交易
        if (this.changeAssets.type !== 1) {
          this.transferForm.gas = sdk.CONTRACT_MAX_GASLIMIT;
          this.$refs['transferForm'].validate((valid) => {
            if (valid) {
              this.contractInfoByContractAddress(this.changeAssets.contractAddress, 1);
              let gasLimit = sdk.CONTRACT_MAX_GASLIMIT;
              let price = this.transferForm.price;
              let contractAddress = this.changeAssets.contractAddress;
              let methodName = 'transfer';
              let methodDesc = '';
              let args = [this.transferForm.toAddress, Number(Times(this.transferForm.amount, Number(Power(this.changeAssets.decimals))))];
              this.validateContractCall(this.addressInfo.address, 0, gasLimit, price, contractAddress, methodName, methodDesc, args);
            } else {
              return false;
            }
          });
        } else {
          this.$refs['transferForm'].validate();
        }
      },

      /**
       * 合约信息根据合约地址
       * @param contractAddress
       * @param type 0: 验证合约是否有_payable方法 1:验证合约是否已经注销
       **/
      async contractInfoByContractAddress(contractAddress, type = 0) {
        this.loading = true;
        return await this.$post('/', 'getContract', [contractAddress])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              if (type === 1) {
                if (response.result.status === 3) { //判断合约资产是否被注销
                  this.isNext = true;
                  this.$message({
                    message: response.result.tokenName + this.$t('transfer.transfer21'),
                    type: 'error',
                    duration: 1000
                  });
                } else {
                  this.contractInfo = response.result;
                  return response.result.methods;
                }
              } else {
                if (response.result.status !== 3) {
                  this.contractInfo = response.result;
                  return response.result.methods;
                }
              }
              //console.log(this.contractInfo);
            } else {
              return []
            }
          })
          .catch((err) => {
            console.log(err);
            return []
          })
      },

      /**
       * 获取收付费单位
       **/
      getSymbol() {
        for (let item of this.assetsList) {
          if (item.chainId === chainID() && item.type === 1) {
            this.feeSymbol = item.symbol;
          }
        }
      },

      /**
       * 资产类型选择
       * @param type
       **/
      changeType(type) {
        console.log(type);
        this.changeParameter();
        if (type.type === 1) {
          this.transferForm.gas = 5000;
          this.transferForm.price = 25;
        } else {
          this.transferForm.gas = 0;
          this.transferForm.price = sdk.CONTRACT_MINIMUM_PRICE;
        }
        this.changeAssets = type;
        this.transferForm.type = type.symbol;
      },

      /**
       *  默认资产类型
       * @param type 0：首次进入加载 1：填写地址以后判断默认为nuls
       **/
      changeNuls(type = 1) {
        let defaultType = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS';
        if (type === 0) {
          if (this.$route.query.accountType) {
            defaultType = this.$route.query.accountType.contractAddress
          }
        }
        for (let item of this.assetsList) {
          if (defaultType === 'NULS') {
            if (item.symbol === defaultType) {
              this.changeAssets = item;
              this.transferForm.type = item.symbol;
            }
          } else {
            if (item.symbol === defaultType) {
              this.changeAssets = item;
              this.transferForm.type = item.symbol;
            }
          }
        }
      },

      /**
       * 转账功能下一步
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.transferVisible = true
          } else {
            return false;
          }
        });
      },

      /**
       * 弹框确认提交
       **/
      async confirmTraanser() {
        this.getNulsBalance(this.changeAssets.chainId, 1, this.transferForm.fromAddress);
        this.$refs.password.showPassword(true);
      },

      /**
       * 获取转出地址余额信息
       *  @param assetChainId
       *  @param assetId
       *  @param address
       **/
      async getNulsBalance(assetChainId, assetId, address) {
        await getNulsBalance(assetChainId, assetId, address).then((response) => {
          //console.log(response);
          if (response.success) {
            this.balanceInfo = response.data;
          } else {
            this.$message({message: this.$t('public.err') + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: this.$t('public.err0') + error, type: 'error', duration: 1000});
        });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(this.addressInfo.chainId, pri, password, this.prefix);
        let crossTxHex = '';
        if (newAddressInfo.address === this.addressInfo.address) {
          this.transferVisible = false;
          this.transferLoading = true;
          let transferInfo = {
            fromAddress: this.transferForm.fromAddress,
            assetsChainId: this.changeAssets.chainId,
            assetsId: this.changeAssets.assetId,
            fee: 100000
          };
          let inOrOutputs = {};
          let tAssemble = [];
          //console.log(this.contractInfo.success);
          if (this.contractInfo.success) { //合约转账
            this.contractCallData.chainId = MAIN_INFO.chainId;
            transferInfo['amount'] = Number(Plus(transferInfo.fee, Number(Times(this.transferForm.gas, this.transferForm.price))));
            //transferInfo['fee'] = transferInfo.fee;
            //transferInfo.toAddress = this.contractInfo.contractAddress;
            transferInfo.value = Number(timesDecimals0(this.transferForm.amount, this.changeAssets.decimals));
            //console.log(transferInfo);
            inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
            //console.log(inOrOutputs);
            //console.log(this.contractCallData);
            tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 16, this.contractCallData);
          } else {
            if (this.changeAssets.type === 1 && !this.isCross) { //NULS普通转账交易
              transferInfo['toAddress'] = this.aliasToAddress ? this.aliasToAddress : this.transferForm.toAddress;
              transferInfo['amount'] = Number(Times(this.transferForm.amount, 100000000).toString());
              //console.log(transferInfo);
              inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 2);
              //交易组装
              tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
            } else if (this.changeAssets.type === 1 && this.isCross) { //跨链转账交易
              //console.log("跨链交易");
              transferInfo['toAddress'] = this.transferForm.toAddress;
              transferInfo['amount'] = Number(Times(this.transferForm.amount, 100000000).toString());
              transferInfo['remark'] = this.transferForm.remarks;
              transferInfo.fee = 1000000;
              //console.log(transferInfo);
              crossTxHex = await this.crossTxhexs(pri, this.addressInfo.pub, this.addressInfo.chainId, transferInfo);
              //console.log(crossTxHex);
            } else {
              transferInfo['amount'] = Number(Plus(0, Number(Times(this.transferForm.gas, this.transferForm.price))));
              inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
              tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 16, this.contractCallData);
            }
          }
          //交易签名
          let txhex = "";
          if (this.changeAssets.type === 1 && this.isCross) {
            txhex = crossTxHex;
          } else {
            //获取手续费
            let newFee = countFee(tAssemble, 1);
            //手续费大于0.001的时候重新组装交易及签名
            if (transferInfo.fee !== newFee) {
              transferInfo.fee = newFee;
              if (this.contractInfo.success) {
                inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
                tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 16, this.contractCallData);
              } else {
                if (this.changeAssets.type === 1) {
                  inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 2);
                  tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
                } else {
                  inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
                  tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 16, this.contractCallData);
                }
              }
              txhex = await nuls.transactionSerialize(nuls.decrypteOfAES(this.addressInfo.aesPri, password), this.addressInfo.pub, tAssemble);
            } else {
              txhex = await nuls.transactionSerialize(nuls.decrypteOfAES(this.addressInfo.aesPri, password), this.addressInfo.pub, tAssemble);
            }
          }
          //console.log(txhex);
          if (this.isCross) { //跨链交易
            //console.log("跨链交易");
            await this.$post('/', 'sendCrossTx', [txhex])
              .then((response) => {
                //console.log(response);
                this.transferLoading = false;
                if (response.hasOwnProperty("result")) {
                  this.toUrl("txList");
                } else {
                  this.$message({
                    message: this.$t('public.err4') + 'code:' + response.error.message + ' ' + response.error.message,
                    type: 'error',
                    duration: 3000
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                this.transferLoading = false;
                this.$message({message: this.$t('public.err4') + error, type: 'error', duration: 5000});
              });
          } else { //其他交易验证并广播交易
            //console.log("其他交易");
            await validateAndBroadcast(txhex).then((response) => {
              //console.log(response);
              this.transferLoading = false;
              if (response.success) {
                this.toUrl("txList");
              } else {
                this.$message({message: this.$t('error.' + response.data.code), type: 'error', duration: 3000});
              }
            }).catch((err) => {
              this.transferLoading = false;
              this.$message({message: this.$t('public.err1') + err, type: 'error', duration: 1000});
            });
          }
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 3000});
        }
      },

      /**
       *  跨链交易签名
       * @param pri
       * @param pub
       * @param chainId
       * @param transferInfo
       **/
      async crossTxhexs(pri, pub, chainId, transferInfo) {
        //账户转出资产余额
        const balanceInfo = await getNulsBalance(transferInfo.assetsChainId, transferInfo.assetsId, transferInfo.fromAddress);
        let inputs = [];
        let outputs = [{
          address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
          assetsChainId: transferInfo.assetsChainId,
          assetsId: transferInfo.assetsId,
          amount: transferInfo.amount,
          lockTime: 0
        }];
        let mainNetBalanceInfo = await getNulsBalance(MAIN_INFO.chainId, MAIN_INFO.assetId, transferInfo.fromAddress);
        let localBalanceInfo;
        //如果不是主网需要收取NULS手续费
        if (!isMainNet(chainId)) {
          if (mainNetBalanceInfo.data.balance < transferInfo.fee) {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
            return;
          }
        }
        //如果转出资产为本链主资产，则直接将手续费加到转出金额上
        if (chainId === transferInfo.assetsChainId && transferInfo.assetsId === 1) {
          let newAmount = transferInfo.amount + transferInfo.fee;
          if (balanceInfo.data.balance < transferInfo.amount + transferInfo.fee) {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
            return;
          }
          //转出的本链资产 = 转出资产amount + 本链手续费
          inputs.push({
            address: transferInfo.fromAddress,
            assetsChainId: transferInfo.assetsChainId,
            assetsId: transferInfo.assetsId,
            amount: newAmount,
            locked: 0,
            nonce: balanceInfo.data.nonce
          });
          //如果不是主网需收取主网NULS手续费
          if (!isMainNet(chainId)) {
            inputs.push({
              address: transferInfo.fromAddress,
              assetsChainId: MAIN_INFO.chainId,
              assetsId: MAIN_INFO.assetId,
              amount: transferInfo.fee,
              locked: 0,
              nonce: mainNetBalanceInfo.data.nonce
            });
          }
        } else {
          localBalanceInfo = await getNulsBalance(chainId, 1, transferInfo.fromAddress);
          if (localBalanceInfo.data.balance < transferInfo.fee) {
            this.$message({message: this.$t('transfer.transfer20'), type: 'error', duration: 1000});
            return;
          }
          //如果转出的是NULS，则需要把NULS手续费添加到转出金额上
          if (transferInfo.assetsChainId === MAIN_INFO.chainId && transferInfo.assetsId === 1) {
            let newAmount = transferInfo.amount + transferInfo.fee;
            if (mainNetBalanceInfo.data.balance < newAmount) {
              this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
              return;
            }
            inputs.push({
              address: transferInfo.fromAddress,
              assetsChainId: transferInfo.assetsChainId,
              assetsId: transferInfo.assetsId,
              amount: newAmount,
              locked: 0,
              nonce: mainNetBalanceInfo.data.nonce
            });
          } else {
            inputs.push({
              address: transferInfo.fromAddress,
              assetsChainId: transferInfo.assetsChainId,
              assetsId: transferInfo.assetsId,
              amount: transferInfo.amount,
              locked: 0,
              nonce: balanceInfo.data.nonce
            });
            inputs.push({
              address: transferInfo.fromAddress,
              assetsChainId: MAIN_INFO.chainId,
              assetsId: MAIN_INFO.assetId,
              amount: transferInfo.fee,
              locked: 0,
              nonce: mainNetBalanceInfo.data.nonce
            });
          }
          //本链主资产手续费
          if (!isMainNet(chainId)) {
            inputs.push({
              address: transferInfo.fromAddress,
              assetsChainId: chainId,
              assetsId: 1,
              amount: transferInfo.fee,
              locked: 0,
              nonce: localBalanceInfo.data.nonce
            });
          }
        }
        //console.log(inputs);
        //console.log(outputs);
        let tAssemble = await nuls.transactionAssemble(inputs, outputs, transferInfo.remark, 10);//交易组装
        let ctxSign = "";//本链协议交易签名
        let mainCtxSign = "";//主网协议交易签名
        const txs = require('nuls-sdk-js/lib/model/txs');
        const Serializers = require("nuls-sdk-js/lib/api/serializers");
        let bw = new Serializers();
        let mainCtx = new txs.CrossChainTransaction();
        let pubHex = Buffer.from(pub, 'hex');
        let newFee = 0;
        //console.log(isMainNet(chainId));
        if (isMainNet(chainId)) {
          await countCtxFee(tAssemble, 1).then((result) => {
            newFee = result;
          }).catch((err) => {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 2000});
            console.log(err);
            return;
          });
        } else {
          await countCtxFee(tAssemble, 2).then((result) => {
            newFee = result;
          }).catch((err) => {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
            console.log(err);
            return;
          });
          mainCtx.time = tAssemble.time;
          mainCtx.remark = tAssemble.remark;
          let mainNetInputs = [];
          //console.log(transferInfo);
          if (transferInfo.assetsChainId === MAIN_INFO.chainId && transferInfo.assetsId === 1) {
            mainNetInputs.push({
              address: transferInfo.fromAddress,
              assetsChainId: transferInfo.assetsChainId,
              assetsId: transferInfo.assetsId,
              amount: transferInfo.amount + newFee,
              locked: 0,
              nonce: mainNetBalanceInfo.data.nonce
            });
          } else {
            mainNetInputs = [{
              address: transferInfo.fromAddress,
              assetsChainId: transferInfo.assetsChainId,
              assetsId: transferInfo.assetsId,
              amount: transferInfo.amount,
              locked: 0,
              nonce: balanceInfo.data.nonce
            }, {
              address: transferInfo.fromAddress,
              assetsChainId: MAIN_INFO.chainId,
              assetsId: MAIN_INFO.assetId,
              amount: newFee,
              locked: 0,
              nonce: mainNetBalanceInfo.data.nonce
            }];
          }
          mainCtx.setCoinData(mainNetInputs, outputs);
        }
        //console.log(transferInfo.fee !== newFee);
        //如果手续费发生改变，重新组装CoinData
        if (transferInfo.fee !== newFee) {
          if (chainId === transferInfo.assetsChainId && transferInfo.assetsId === 1) {
            if (balanceInfo.data.balance < transferInfo.amount + newFee) {
              this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
              return;
            }
            inputs[0].amount = transferInfo.amount + newFee;
            if (!isMainNet(chainId)) {
              inputs[1].amount = newFee;
            }
          } else {
            if (localBalanceInfo.data.balance < transferInfo.fee) {
              this.$message({message: this.$t('transfer.transfer20'), type: 'error', duration: 1000});
              return;
            }
            if (transferInfo.assetsChainId === MAIN_INFO.chainId && transferInfo.assetsId === 1) {
              if (mainNetBalanceInfo.data.balance < transferInfo.amount + newFee) {
                this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
                return;
              }
              inputs[0].amount = transferInfo.amount + newFee;
              inputs[1].amount = newFee;
            } else {
              inputs[1].amount = newFee;
              inputs[2].amount = newFee;
            }
          }
          tAssemble = await nuls.transactionAssemble(inputs, outputs, transferInfo.remark, 10);
          ctxSign = nuls.transactionSignature(pri, tAssemble);
        } else {
          ctxSign = nuls.transactionSignature(pri, tAssemble);
        }
        bw.writeBytesWithLength(pubHex);
        bw.writeBytesWithLength(ctxSign);
        if (!isMainNet(chainId)) {
          // mainCtx.txData = tAssemble.getHash();
          //console.log(mainCtx);
          mainCtxSign = nuls.transactionSignature(pri, mainCtx);
          bw.writeBytesWithLength(pubHex);
          bw.writeBytesWithLength(mainCtxSign);
        }
        tAssemble.signatures = bw.getBufWriter().toBuffer();
        return tAssemble.txSerialize().toString('hex');
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
              this.$message({message: this.$t('call.call6'), type: 'error', duration: 1000});
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
              this.gasNumber = response.result.gasLimit;
              this.oldGasNumber = response.result.gasLimit;
              this.transferForm.gas = response.result.gasLimit;
              let contractConstructorArgsTypes = this.getContractMethodArgsTypes(contractAddress, methodName);
              let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes);
              this.contractCallData = {
                chainId: MAIN_INFO.chainId,
                sender: sender,
                contractAddress: contractAddress,
                value: value,
                gasLimit: this.transferForm.gas,
                price: this.transferForm.price,
                methodName: methodName,
                methodDesc: methodDesc,
                args: newArgs
              };
            } else {
              this.$message({message: this.$t('call.call4'), type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call5') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 获取合约指定函数的参数类型
       * @param contractAddress
       * @param methodName
       * @returns
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
       * gas 值改变
       **/
      changeGas(e) {
        this.gasNumber = Number(e);
      },

      /**
       * 通讯录功能
       **/
      showBook() {
        let defaultAddressInfo = addressInfo(1);
        this.bookData = defaultAddressInfo.hasOwnProperty('contactList') ? defaultAddressInfo.contactList : [];
        this.bookDialog = true;
      },

      /**
       * 通讯录选中
       * @param row
       **/
      handleClick(row) {
        this.transferForm.toAddress = row.address;
        this.bookDialog = false;
        this.changeParameter();
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
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .transfer {
    .w1200 {
      border: @BD1;
      margin: -20px auto 0;
      border-radius: 2px;
      .el-form {
        width: 600px;
        margin: 50px auto 100px;
        .el-form-item {
          .el-form-item__content {
            .iconlianxiren {
              position: absolute;
              right: -28px;
              top: 10px;
            }
            .el-select {
              width: 100%;
              .el-input__inner {
                width: 100%;
              }
            }
            .balance {
              margin: 10px 0 0 0;
            }
            .el-textarea {
              .el-input__count {
                background: transparent;
                bottom: -10px;
              }
            }
          }
        }
        .div-senior {
          margin: -15px 0 0 0;
          .senior {
            margin: 0 0 0 0;
            .el-form-item__label {
              line-height: 40px;
              position: relative;
              left: 500px;
              float: left;
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
            margin: 0 0 25px 0;
            .el-form-item {
              margin: 0 0 5px 0;
              .el-form-item__label {
                line-height: 24px;
              }
            }
          }
        }
        .cross {
          margin: -14px 0 8px 0;
        }
      }
    }
    .book-dialog {
      .el-dialog__body {
        padding: 10px 5px 20px 5px;
        background-color: white;
        span {
          color: #608FFF;
        }
      }
    }
  }

</style>
