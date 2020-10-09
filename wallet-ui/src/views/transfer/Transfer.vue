<template>
  <div class="bg-gray transfer" v-loading="transferLoading" element-loading-spinner="el-icon-loading">
    <div class="title">{{$t('nav.transfer')}}</div>
    <div class="w1200 transfer_info">
      <el-form :model="transferForm" status-icon :rules="transferRules" ref="transferForm" class=" w630 transfer_form">
        <el-form-item :label="$t('transfer.transfer0')">
          <el-input v-model="transferForm.fromAddress" autocomplete="off" disabled>
          </el-input>
        </el-form-item>
        <div class="fr book"><i class="iconfont iconlianxiren click font16" slot="suffix" @click="showBook"></i></div>
        <el-form-item :label="$t('transfer.transfer1')" prop="toAddress">
          <el-input v-model.trim="transferForm.toAddress" autocomplete="off">
          </el-input>
        </el-form-item>
        <!--<div class="cb yellow font12" style="margin: -15px 0 10px 0"
             v-if="toAddressInfo.transferType===5 || toAddressInfo.transferType===6">
          Tips：该笔转账为跨链交易，到账时间根据两边的区块确定时间来确定
        </div>-->
        <el-form-item :label="$t('transfer.transfer2')" prop="assetType">
          <el-select v-model="transferForm.assetType" class="asset_type" @change="changeType">
            <el-option v-for="(item,index) in assetsList"
                       :key="index"
                       :label="item.symbol"
                       :value="item">
              <!--:disabled="toAddressInfo.transferType ===5 && item.type === 2">-->
            </el-option>
          </el-select>
        </el-form-item>
        <div class="font12 fr balance">{{$t('consensus.consensus2')}}：{{assetsInfo.balance}}
          <span>{{assetsInfo.symbol}}</span></div>
        <el-form-item :label="$t('transfer.transfer3')" prop="amount">
          <el-input v-model="transferForm.amount" autocomplete="off">
          </el-input>
        </el-form-item>
        <div class="fr click all" @click="allAvailable">{{$t('transfer.transfer24')}}</div>
        <el-switch v-show="assetsInfo.type !==1" v-model="seniorValue" :inactive-text="$t('call.call3')" width="35"
                   class="senior_value fr">
        </el-switch>
        <div v-show="seniorValue" class="senior_list cb">
          <el-form-item label="Gas Limit" prop="gas">
            <el-input v-model="transferForm.gas" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="Price" prop="price">
            <el-input v-model="transferForm.price" autocomplete="off">
            </el-input>
          </el-form-item>
        </div>
        <el-form-item :label="$t('transfer.transfer4')" class="remarks">
          <el-input type="textarea" :rows="2" v-model="transferForm.remarks" maxlength="200" show-word-limit>
          </el-input>
        </el-form-item>
        <div class="font14 mb_20">
          <el-tooltip placement="top">
            <div slot="content">{{$t('transfer.transfer5')}}</div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
          {{$t('public.fee')}}: {{transferForm.fee}}
          <span class="fCN">{{defaultInfo.defaultAsset.symbol}}</span>
        </div>
        <el-form-item class="tc">
          <el-button type="success" @click="submitTransferForm('transferForm')">{{$t('public.next')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

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
            <el-link :underline="false" @click="selectBook(scope.row)" class="click td">{{$t('public.choice')}}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="$t('transfer.transfer6')" width="46rem" class="confirm-dialog"
               :visible.sync="transferDiolog"
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
          <p>{{$t('public.fee')}}&nbsp;</p>
          <label>{{transferForm.fee}} <span class="fCN">{{defaultInfo.defaultAsset.symbol}}</span></label>
        </div>
        <div class="div-data cb">
          <p>{{$t('tab.tab6')}}&nbsp;</p>
          <label class="yellow">{{transferForm.amount}} <span class="fCN">{{assetsInfo.symbol}}</span></label>
        </div>
        <div class="div-data remark">
          <p>{{$t('transfer.transfer4')}}&nbsp;</p>
          <label class="scroll">{{transferForm.remarks}}</label>
        </div>
      </div>
      <div slot="footer" class="dialog-footer cb">
        <el-button @click="transferDiolog = false">{{$t('transfer.transfer7')}}</el-button>
        <el-button type="success" @click="confirmTransfer">{{$t('transfer.transfer8')}}</el-button>
      </div>
    </el-dialog>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import sdk from 'nuls-sdk-js/lib/api/sdk'
  import utils from 'nuls-sdk-js/lib/utils/utils'
  import {
    isMainNet,
    countCtxFee,
    getNulsBalance,
    inputsOrOutputs,
    validateAndBroadcast,
    commitData
  } from '@/api/requestData'
  import {MAIN_INFO} from '@/config.js'
  import {
    Times,
    Plus,
    Division,
    Minus,
    timesDecimals,
    timesDecimals0,
    timesDecimalsBig,
    addressInfo,
    passwordVerification,
    htmlEncode,
    getRamNumber,
    divisionDecimals
  } from '@/api/util'
  import Password from '@/components/PasswordBar'

  export default {

    data() {
      let validateToAddress = async (rule, value, callback) => {
        //根据长度验证地址或者别名验证
        let aliasRes = {};
        if (value.length > 30) {
          this.toAddressInfo = nuls.verifyAddress(value);
          if (this.toAddressInfo.type === 1) { //主链地址
            let verifyToAddress = await this.verifyToAddress();
            //console.log(verifyToAddress);
            if (!verifyToAddress) {
              this.toAddressInfo.transferType = 0;
              callback(new Error(verifyToAddress.data))
            }
          }
        } else {
          aliasRes = await this.getAccountByAlias(value);
        }
        //console.log(value);
        if (!value) {
          this.toAddressInfo.transferType = 0;
          //console.log(this.toAddressInfo.transferType);
          callback(new Error(this.$t('transfer.transfer9')))
        } else if (value.length < 20 && !aliasRes.success) {
          this.toAddressInfo.transferType = 0;
          callback(new Error(this.$t('transfer.transfer23')))
        } else {
          if (this.transferForm.amount !== '') {
            this.$refs.transferForm.validateField('amount');
          }
          callback()
        }
      };
      let validateAmount = async (rule, value, callback) => {
        let patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{1," + this.assetsInfo.decimals + "})?$");
        this.available = Number(this.assetsInfo.balance);
        if (this.assetsInfo.type === 1 && this.assetsInfo.symbol === 'NULS') {
          this.available = Number(Minus(this.assetsInfo.balance, this.transferForm.fee))
        }
        if (value === '') {
          callback(new Error(this.$t('transfer.transfer11')))
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('transfer.transfer12') + ": " + this.assetsInfo.decimals))
        } else if (value < 0.001 && this.assetsInfo.symbol === 'NULS') {
          callback(new Error(this.$t('transfer.transfer13')))
        } else if (value > this.available) {
          callback(new Error(this.$t('transfer.transfer131') + ": " + this.available))
        } else {
          if (this.transferForm.toAddress) {
            let fromAddressInfo = nuls.verifyAddress(this.transferForm.fromAddress);
            let toAddressInfo = nuls.verifyAddress(this.transferForm.toAddress);
            if (fromAddressInfo.chainId !== toAddressInfo.chainId && this.assetsInfo.type === 2) {
              //console.log(this.assetsInfo);
              let contractInfo = await this.contractInfoByContractAddress(this.assetsInfo.contractAddress);
              //console.log(contractInfo);
              if (!contractInfo.nrc20 || !contractInfo.crossAsset) {
                this.$message({message: this.$t('tips.tips22'), type: 'warning', duration: 3000});
                this.transferForm.amount = '';
                return;
              }

              let isCrossChain = contractInfo.methods.findIndex((value) => value.name === 'transferCrossChain');
              //console.log(isCrossChain);
              if (isCrossChain === -1) {
                this.$message({message: this.$t('tips.tips23'), type: 'error', duration: 3000});
                this.transferForm.amount = '';
                return;
              }
            }
            this.parameterValidation();
            callback()
          } else {
            this.$refs.transferForm.validateField('toAddress');
          }
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
        defaultInfo: {},//默认链信息
        assetsList: '',//资产列表
        assetsInfo: {},//选中的资产信息
        balanceInfo: {},//balance信息
        available: 0,//可用余额
        contractInfo: {},//合约信息
        transferForm: {
          fromAddress: '',
          toAddress: '',
          assetType: '',
          amount: '',
          gas: 1,
          price: 25,
          remarks: '',
          fee: 0.001
        },
        transferRules: {
          toAddress: [{validator: validateToAddress, trigger: ['blur']}],
          amount: [{validator: validateAmount, trigger: ['blur']}],
          gas: [{validator: validateGas, trigger: ['blur', 'change']}],
          price: [{validator: validatePrice, trigger: ['blur', 'change']}],
        },
        seniorValue: false,//高级选项
        toAddressInfo: {},//收款地址信息（transferType 1:NULS转账 2：token转账 3：向合约转NULS 4：向合约转token 5：跨链交易 6:NRC20跨链）
        aliasToAddress: '',//别名地址
        contractCallData: {},//合约信息
        gasInfo: {number: 0, oldNumber: 0},//gas信息
        contractFee: 0,//调用合约手续费
        bookDialog: false,//通讯录弹框
        bookData: [],//通讯录数据
        transferDiolog: false,//确认弹框
        transferLoading: false,//加载动画
      };
    },
    created() {
      this.addressInfo = addressInfo(1);
      this.transferForm.fromAddress = this.addressInfo.address;
      this.defaultInfo = JSON.parse(sessionStorage.getItem('info'))
    },
    mounted() {
      this.getCapitalListByAddress(this.addressInfo.address);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.transferForm.fromAddress = this.addressInfo.address;
          this.getCapitalListByAddress(this.addressInfo.address);
          if (this.transferForm.toAddress) {
            this.$refs.transferForm.validateField('toAddress');
          }
        }
      },
    },
    components: {
      Password,
    },
    methods: {

      /**
       * 获取地址的资金列表
       * @param address
       **/
      async getCapitalListByAddress(address) {
        this.transferLoading = true;
        //获取本连的基本资产
        let basicAssets = [];
        let chainId = MAIN_INFO.chainId; //记录主链id
        await this.$post('/', 'getAccountLedgerList', [address])
          .then((response) => {
            //console.log(response.result);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result) {
                basicAssets.push({
                  type: 1,
                  symbol: item.symbol,
                  chainId: item.chainId,
                  assetId: item.assetId,
                  balance: timesDecimals(item.balance),
                  decimals: item.decimals,
                });
                chainId = item.chainId;
              }
            }
          })
          .catch((error) => {
            console.log("getAccountLedgerList:" + error);
            this.assetsListLoading = false;
            /*setTimeout(() => {
              this.getCapitalListByAddress(address)
            }, 800);*/
            return;
          });
        ///console.log(basicAssets);

        //获取本连的合约资产
        let contractAssets = [];
        await this.$post('/', 'getAccountTokens', [1, 100, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                contractAssets.push({
                  type: 2,
                  symbol: itme.tokenSymbol,
                  chainId: chainId,
                  assetId: 1,
                  status: itme.status,
                  balance: divisionDecimals(Minus(itme.balance, itme.lockedBalance), itme.decimals),
                  contractAddress: itme.contractAddress,
                  decimals: itme.decimals
                })
              }
            }
          })
          .catch((error) => {
            console.log("getAccountTokens:" + error);
            /*setTimeout(() => {
              this.getCapitalListByAddress(address)
            }, 800);*/
            return;
          });

        const newContractAssets = contractAssets.filter(obj => obj.status !== 3); //隐藏已经删除合约
        //console.log(contractAssets);

        //获取跨链的基本资产
        let crossAssets = [];
        await this.$post('/', 'getAccountCrossLedgerList', [address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result) {
                crossAssets.push({
                  type: 1,
                  symbol: item.symbol,
                  chainId: item.chainId,
                  assetId: item.assetId,
                  balance: timesDecimals(item.balance, item.decimals),
                  decimals: item.decimals
                })
              }
            }
          })
          .catch((err) => {
            console.log("getAccountCrossLedgerList:" + err);
            /*setTimeout(() => {
              this.getCapitalListByAddress(address)
            }, 800);*/
            return;
          });
        //console.log(crossAssets);

        this.assetsList = [...basicAssets, ...newContractAssets, ...crossAssets];
        //console.log(this.assetsList);

        //console.log(this.$route.query.accountType);
        let newInfo = this.$route.query.accountType ? this.$route.query.accountType : {type: 1, tokenSymbol: MAIN_INFO};
        if (this.$route.query.accountType === 'NULS') {
          newInfo = {type: 1, tokenSymbol: MAIN_INFO};
          newInfo.tokenSymbol.symbol = 'NULS';
        }
        if (!newInfo.contractAddress && !newInfo.tokenSymbol.symbol) {
          newInfo.tokenSymbol.symbol = 'NULS';
        }
        if (newInfo.contractAddress) {
          newInfo.symbol = newInfo.tokenSymbol;
          newInfo.tokenSymbol = newInfo;
        }
        //console.log(newInfo);

        for (let item of this.assetsList) {
          //console.log(item);
          if (item.type === 1) {
            if (item.assetId === newInfo.tokenSymbol.assetId && item.chainId === newInfo.tokenSymbol.chainId) {
              this.changeType(item);
              this.transferLoading = false;
              return
            }
          } else {
            if (item.contractAddress && item.contractAddress === newInfo.contractAddress) {
              this.changeType(item);
              this.transferLoading = false;
              return;
            }
          }
        }
        this.transferLoading = false;
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
      selectBook(row) {
        this.transferForm.toAddress = row.address;
        this.bookDialog = false;
        this.parameterValidation();
      },

      /**
       * 查询账户详情根据别名
       * @param alias
       **/
      async getAccountByAlias(alias) {
        try {
          let resData = await this.$post('/', 'getAccountByAlias', [alias]);
          //console.log(resData);
          if (resData.hasOwnProperty("result")) {
            this.aliasToAddress = resData.result.address;
            this.toAddressInfo = nuls.verifyAddress(this.aliasToAddress);
            if (this.toAddressInfo.type === 1) { //主链地址
              await this.verifyToAddress();
            }
            return {success: true}
          } else {
            this.aliasToAddress = '';
            return {success: false}
          }
        } catch (err) {
          console.log(err);
          return {success: false}
        }
      },

      /**
       * @disc: 验证to地址
       * @params:
       * @date: 2020-07-02 9:41
       * @author: Wave
       */
      async verifyToAddress() {
        if (this.toAddressInfo.chainId === MAIN_INFO.chainId) { // 本链交易
          this.toAddressInfo.transferType = 1;
          this.transferForm.fee = 0.001;
          return {success: true}
        } else { //跨链交易
          this.toAddressInfo.transferType = 5;
          this.transferForm.fee = 0.1;
          return {success: true}
        }
      },

      /**
       * 资产类型选择
       * @param type
       **/
      async changeType(type) {
        //console.log(type);
        this.assetsInfo = type;
        this.transferForm.assetType = type.symbol;
        this.parameterValidation();
        if (this.transferForm.amount !== '') {
          this.$refs.transferForm.validateField('amount');
        }
      },

      /**
       * @disc: 参数验证
       * @params:
       * @date: 2020-07-02 14:21
       * @author: Wave
       */
      parameterValidation() {
        if (this.transferForm.toAddress && this.transferForm.amount) {
          if (this.assetsInfo.type === 1) { //主链资产
            if (this.toAddressInfo.type === 2) { //合约地址
              if (this.assetsInfo.chainId === MAIN_INFO.chainId && this.assetsInfo.assetId === MAIN_INFO.assetId) {
                this.toAddressInfo.transferType = 3; //3：向合约地址转NULS
                this.transferPayable();
              } else {
                this.toAddressInfo.amount = '';
                this.$message({message: this.$t('transfer.transfer25'), type: 'error', duration: 3000});
              }
            }
          } else { //合约资产
            if (this.toAddressInfo.type === 1) { //普通地址
              //console.log(this.transferForm);
              let fromAddressInfo = nuls.verifyAddress(this.transferForm.fromAddress);
              let toAddressInfo = nuls.verifyAddress(this.transferForm.toAddress);
              //console.log(fromAddressInfo.chainId === toAddressInfo.chainId);
              if (fromAddressInfo.chainId === toAddressInfo.chainId) {
                this.toAddressInfo.transferType = 2; // 2：token转账
                this.transferTransfer();
              } else {
                this.toAddressInfo.transferType = 6; // NRC20跨链
                this.transferCrossChain();
              }
            } else { //合约地址
              this.toAddressInfo.transferType = 4; // 4：向合约地址转token
              this.transferTransfer();
            }
          }
        }
      },

      /**
       * @disc: 合约 transfer
       * @params:
       * @date: 2020-07-02 11:45
       * @author: Wave
       */
      transferTransfer() {
        this.contractInfoByContractAddress(this.assetsInfo.contractAddress, 1);
        let gasLimit = sdk.CONTRACT_MAX_GASLIMIT;
        let price = Number(this.transferForm.price);
        let contractAddress = this.assetsInfo.contractAddress;
        let methodName = 'transfer';
        let methodDesc = '';
        let args = [this.aliasToAddress ? this.aliasToAddress : this.transferForm.toAddress, timesDecimalsBig(this.transferForm.amount, this.assetsInfo.decimals).toString()];
        this.validateContractCall(this.addressInfo.address, 0, gasLimit, price, contractAddress, methodName, methodDesc, args);
      },

      /**
       * @disc: 合约 payable
       * @params:
       * @date: 2020-07-01 19:05
       * @author: Wave
       */
      transferPayable() {
        let gasLimit = sdk.CONTRACT_MAX_GASLIMIT;
        let price = this.transferForm.price;
        let contractAddress = this.aliasToAddress ? this.aliasToAddress : this.transferForm.toAddress;
        let methodName = '_payable';
        let methodDesc = '';
        let args = [];
        this.validateContractCall(this.addressInfo.address, Number(Times(this.transferForm.amount, 100000000)), gasLimit, price, contractAddress, methodName, methodDesc, args);
      },

      /**
       * @disc: 合约 transferCrossChain (NRC20 跨链交易)
       * @params:
       * @date: 2020-09-14 16:36
       * @author: Wave
       */
      transferCrossChain() {
        let gasLimit = sdk.CONTRACT_MAX_GASLIMIT;
        let price = this.transferForm.price;
        let contractAddress = this.assetsInfo.contractAddress;
        let methodName = 'transferCrossChain';
        let methodDesc = '';
        let args = [this.transferForm.toAddress,this.assetsInfo.decimals <= 9 ? Number(timesDecimals0(this.transferForm.amount, this.assetsInfo.decimals)) : timesDecimalsBig(this.transferForm.amount, this.assetsInfo.decimals)];
        let newValue = Number(timesDecimals0(0.1, 8));
        this.validateContractCall(this.addressInfo.address, newValue, gasLimit, price, contractAddress, methodName, methodDesc, args);
      },

      /**
       * @disc:所有
       * @params:
       * @date: 2020-07-02 11:03
       * @author: Wave
       */
      allAvailable() {
        this.$refs.transferForm.validateField('amount');
        this.transferForm.amount = this.available.toString()
      },

      /**
       * 下一步
       * @params: formName
       * @date: 2020-06-29 20:17
       * @author: Wave
       */
      submitTransferForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.toAddressInfo.transferType === 2) {
              this.transferForm.fee = this.contractFee;
            }
            this.transferDiolog = true;

          } else {
            return false;
          }
        });
      },

      /**
       * @disc: 确认提交
       * @params:
       * @date: 2020-06-30 14:35
       * @author: Wave
       */
      async confirmTransfer() {
        if (this.addressInfo.aesPri) {
          this.$refs.password.showPassword(true);
        } else {
          this.balanceInfo = await this.getNulsBalance(this.assetsInfo.chainId, 1, this.transferForm.fromAddress);
          //console.log(this.toAddressInfo);
          if (this.toAddressInfo.transferType !== 1) {
            this.$message({message: this.$t('tips.tips2'), type: 'warning', duration: 3000});
            return;
          }
          let txHexKey = await getRamNumber(16);
          let signDataKey = await getRamNumber(16);
          let assembleHex = await this.transferAssemble();
          //console.log(assembleHex);
          if (!assembleHex.success) {
            this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
            return;
          }
          let commitDatas = await commitData(txHexKey, signDataKey, this.addressInfo.address, assembleHex.data);
          //console.log(commitDatas);
          if (!commitDatas.success) {
            this.$message({
              message: this.$t('tips.tips4') + JSON.stringify(commitDatas.data),
              type: 'error',
              duration: 3000
            });
            return;
          }
          this.$refs.password.showScan(commitDatas.data.txInfo, commitDatas.data.assembleHex);
        }

      },

      /**
       * @disc: 普通转账交易组装
       * @date: 2019-12-04 17:27
       * @author: Wave
       */
      async transferAssemble() {
        let transferInfo = {
          fromAddress: this.transferForm.fromAddress,
          assetsChainId: this.assetsInfo.chainId,
          assetsId: this.assetsInfo.assetId,
          fee: 100000
        };
        transferInfo['toAddress'] = this.aliasToAddress ? this.aliasToAddress : this.transferForm.toAddress;
        transferInfo['amount'] = Number(Times(this.transferForm.amount, 100000000).toString());
        //console.log(transferInfo);
        let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 2);
        //console.log(inOrOutputs);
        if (!inOrOutputs.success) {
          this.$message({
            message: this.$t('public.err1') + JSON.stringify(inOrOutputs.data),
            type: 'error',
            duration: 3000
          });
          return {success: false}
        }
        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
        return {
          success: true,
          data: tAssemble
        };
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

        this.transferDiolog = false;
        this.transferLoading = true;
        this.balanceInfo = await this.getNulsBalance(this.assetsInfo.chainId, this.assetsInfo.assetId, this.transferForm.fromAddress);
        //console.log(this.balanceInfo);

        let transferInfo = {
          fromAddress: this.transferForm.fromAddress,
          toAddress: this.aliasToAddress ? this.aliasToAddress : this.transferForm.toAddress,
          assetType: this.transferForm.assetType,
          amount: Number(timesDecimals0(this.transferForm.amount, this.assetsInfo.decimals)),
          gas: this.transferForm.gas,
          price: this.transferForm.price,
          remarks: this.transferForm.remarks,
          fee: Number(timesDecimals0(this.transferForm.fee, this.defaultInfo.defaultAsset.decimals)),
          assetsChainId: this.assetsInfo.chainId,
          assetsId: this.assetsInfo.assetId,
        };
        //console.log(transferInfo);

        let inOrOutputs = {};
        let tAssemble = [];
        let txHex = "";//交易签名
        /*console.log(transferInfo);
        console.log(this.toAddressInfo.transferType);*/
        if (this.toAddressInfo.transferType === 1) { //1:NULS转账
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 2);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 2);
        } else if (this.toAddressInfo.transferType === 2) { //2：token转账
          transferInfo.amount = Number(Plus(0, Number(Times(this.transferForm.gas, this.transferForm.price)))).toString();
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
          //console.log(this.contractCallData);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 16, this.contractCallData);
        } else if (this.toAddressInfo.transferType === 3) { //3：向合约转NULS
          this.contractCallData.chainId = MAIN_INFO.chainId;
          transferInfo.value = Number(transferInfo.amount);
          transferInfo.amount = Number(Plus(transferInfo.fee, Number(Times(this.transferForm.gas, this.transferForm.price)))).toString();
          transferInfo.amount = Number(Plus(transferInfo.amount, transferInfo.value)).toString();
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 16, this.contractCallData);
        } else if (this.toAddressInfo.transferType === 4) { //4：向合约转token
          transferInfo.amount = Number(Plus(0, Number(Times(this.transferForm.gas, this.transferForm.price)))).toString();
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 16, this.contractCallData);
        } else if (this.toAddressInfo.transferType === 5) { //5：跨链交易
          transferInfo.amount = Number(transferInfo.amount).toString();
          transferInfo.fee = Number(transferInfo.fee);
          let crossTxHex = await this.crossTxhexs(passwordInfo.pri, passwordInfo.pub, this.addressInfo.chainId, transferInfo);
          //console.log(crossTxHex);
          try {
            let resData = await this.$post('/', 'sendCrossTx', [crossTxHex]);
            //console.log(resData);
            if (!resData.result.success) {
              this.$message({message: this.$t('tips.tips14') + JSON.stringify(resData), type: 'error', duration: 3000});
            } else {
              this.toUrl("txList");
              this.transferLoading = false;
            }
          } catch (err) {
            this.$message({message: this.$t('tips.tips14') + JSON.stringify(err), type: 'error', duration: 3000});
          }
          return;
        } else if (this.toAddressInfo.transferType === 6) { //5：NRC20跨链交易
          //参数: to(跨链地址) value(token数量, 要乘以10的n次方，n是token的精度)
          transferInfo.amount = Number(Plus(20000000, Number(Times(this.transferForm.gas, this.transferForm.price)))).toString();
          transferInfo.value = 10000000;
          transferInfo.toAddress = this.assetsInfo.contractAddress;
          //console.log(transferInfo);
          inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 16);
          //console.log(this.contractCallData);
          tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.transferForm.remarks), 16, this.contractCallData);
        }
        //console.log(inOrOutputs);
        txHex = await nuls.transactionSerialize(passwordInfo.pri, passwordInfo.pub, tAssemble);
        //console.log(txHex);
        let broadcastResult = await validateAndBroadcast(txHex);
        //console.log(broadcastResult);
        if (!broadcastResult.success) {
          this.$message({
            message: this.$t('tips.tips14') + JSON.stringify(broadcastResult.data),
            type: 'error',
            duration: 3000
          });
          this.transferLoading = false;
        } else {
          this.toUrl("txList");
          this.transferLoading = false;
        }
      },

      /**
       * 获取转出地址余额信息
       *  @param assetChainId
       *  @param assetId
       *  @param address
       **/
      async getNulsBalance(assetChainId, assetId, address) {
        try {
          let resData = await getNulsBalance(assetChainId, assetId, address);
          //console.log(resData);
          if (resData.success) {
            return resData.data
          } else {
            return {}
          }
        } catch (error) {
          console.log(error);
          return {}
        }
      },

      /**
       * 合约信息根据合约地址
       * @param contractAddress
       **/
      async contractInfoByContractAddress(contractAddress) {
        return await this.$post('/', 'getContract', [contractAddress])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              return response.result;
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
        //console.log(sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args);
        return await this.$post('/', 'validateContractCall', [sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              //return {success: true, data: response.result};
              this.imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args)
            } else {
              this.$message({
                message: this.$t('call.call6') + JSON.stringify(response.error),
                type: 'error',
                duration: 3000
              });
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('call.call7') + error, type: 'error', duration: 3000});
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
          .then(async (response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.gasInfo.number = response.result.gasLimit;
              this.gasInfo.oldNumber = response.result.gasLimit;
              this.transferForm.gas = response.result.gasLimit;
              this.transferForm.fee = Number(Plus(Number(Division(Number(Times(this.transferForm.gas, this.transferForm.price)), 10000000)), 0.001));
              this.contractFee = this.transferForm.fee;
              let contractConstructorArgsTypes = await this.getContractMethodArgsTypes(contractAddress, methodName);
              if (!contractConstructorArgsTypes.success) {
                console.log(JSON.stringify(contractConstructorArgsTypes.data));
                return;
              }
              let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes.data);
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
       *  跨链交易签名
       * @param pri
       * @param pub
       * @param chainId
       * @param transferInfo
       **/
      async crossTxhexs(pri, pub, chainId, transferInfo) {
        //账户转出资产余额
        const balanceInfo = await getNulsBalance(transferInfo.assetsChainId, transferInfo.assetsId, transferInfo.fromAddress);
        //console.log(balanceInfo);
        let inputs = [];
        let outputs = [{
          address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
          assetsChainId: transferInfo.assetsChainId,
          assetsId: transferInfo.assetsId,
          amount: transferInfo.amount,
          lockTime: 0
        }];
        let mainNetBalanceInfo = await getNulsBalance(MAIN_INFO.chainId, MAIN_INFO.assetId, transferInfo.fromAddress);
        //console.log(mainNetBalanceInfo);
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
          let newAmount = Number(Plus(transferInfo.amount, transferInfo.fee));
          //console.log(newAmount);
          if (balanceInfo.data.balance < newAmount) {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
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
          //console.log(localBalanceInfo);
          if (localBalanceInfo.data.balance < transferInfo.fee) {
            this.$message({message: this.$t('transfer.transfer20'), type: 'error', duration: 3000});
            return;
          }
          //如果转出的是NULS，则需要把NULS手续费添加到转出金额上
          if (transferInfo.assetsChainId === MAIN_INFO.chainId && transferInfo.assetsId === 1) {
            let newAmount = transferInfo.amount + transferInfo.fee;
            if (mainNetBalanceInfo.data.balance < newAmount) {
              this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
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
            ///console.log(result);
            newFee = result;
          }).catch((err) => {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
            console.log(err);
            return;
          });
        } else {
          await countCtxFee(tAssemble, 2).then((result) => {
            newFee = result;
          }).catch((err) => {
            this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
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
          //console.log(transferInfo);
          //console.log(chainId === transferInfo.assetsChainId && transferInfo.assetsId === 1);
          if (chainId === transferInfo.assetsChainId && transferInfo.assetsId === 1) {
            if (balanceInfo.data.balance < Number(Plus(transferInfo.amount, newFee))) {
              this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
              return;
            }
            inputs[0].amount = Number(Plus(transferInfo.amount, newFee));
            if (!isMainNet(chainId)) {
              inputs[1].amount = newFee;
            }
          } else {
            //console.log(localBalanceInfo.data.balance < transferInfo.fee);
            if (localBalanceInfo.data.balance < transferInfo.fee) {
              this.$message({message: this.$t('transfer.transfer20'), type: 'error', duration: 3000});
              return;
            }
            //console.log(transferInfo.assetsChainId === MAIN_INFO.chainId && transferInfo.assetsId === 1);
            if (transferInfo.assetsChainId === MAIN_INFO.chainId && transferInfo.assetsId === 1) {
              if (mainNetBalanceInfo.data.balance < Number(Plus(transferInfo.amount, newFee))) {
                this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 3000});
                return;
              }
              inputs[0].amount = Number(Plus(transferInfo.amount, newFee));
              inputs[1].amount = newFee;
            } else {
              //console.log(inputs);
              inputs[0].amount = Number(transferInfo.amount);
              inputs[1].amount = newFee;
            }
          }
          //console.log(inputs);
          //console.log(outputs);
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
        //console.log(tAssemble.txSerialize().toString('hex'));
        return tAssemble.txSerialize().toString('hex');
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
    .title {
      line-height: 80px;
      height: 100px;
    }
    .transfer_info {
      min-height: 600px;
      border: 1px solid #c1c1c1;
      background-color: #ffffff;
      margin: -20px auto 0;
      .transfer_form {
        margin: 40px auto 0;
        .el-form-item {
          margin: 0 0 20px 0;
          .el-form-item__label {
            line-height: 20px;
          }
          .el-form-item__content {
            line-height: 30px;
            .el-input {
              .el-input__suffix {
                .el-input__icon {
                  line-height: 30px;
                }
              }
            }

            .el-form-item__error {
              font-size: 10px;
              padding: 1px 0 0 0;
            }
            .asset_type {
              width: 630px;
              .el-input {
                .el-input__inner {
                  width: 100%;
                }
              }
            }
            .el-button--success {
              width: 300px;
            }
          }
        }
        .book {
          width: 20px;
          height: 20px;
          z-index: 88;
          margin: 23px -23px 0 0;
        }
        .remarks {
          .el-form-item__label {
            line-height: 18px;
          }
        }
        .balance {
          margin: 5px 0 0 0;
        }
        .all {
          margin: -45px -26px 0 0;
          line-height: 20px;
          z-index: 88;
          position: relative;
          font-size: 10px;
        }
        .senior_value {
          height: 20px;
          margin: -10px 0 0 0;
          .el-switch__label {
            font-size: 12px;
          }
          .el-switch__core {
            width: 30px;
            height: 18px;
            &:after {
              height: 14px;
            }
          }
        }
        .senior_list {
        }
      }
    }

    .confirm-dialog {
      .remark {
        label {
          display: block;
          width: 490px !important;
          float: right;
          height: 40px;
          overflow-y: auto;
          line-height: 20px;
          font-size: 12px;
        }
      }
    }
  }

</style>
