<template>
  <div class="w1200 one_to" v-loading="oneToMoreLoading">
    <div class="title tc">{{$t('oneTo.oneTo1')}}</div>
    <el-form :model="oneToMoreForm" status-icon ref="oneToMoreForm" class="w630 one_to_form">
      <el-form-item :label="$t('transfer.transfer0')">
        <el-input v-model="oneToMoreForm.fromAddress" disabled="disabled">
        </el-input>
      </el-form-item>
      <div class="font12 fr" style="margin-top: 8px">
        <label>{{$t('public.usableBalance')}}：</label>
        {{accontInfo.balance}}
        <span class="fCN"> NULS</span>
      </div>
      <el-form-item :label="$t('transfer.transfer2')">
        <el-input v-model="oneToMoreForm.assetsType" disabled="disabled">
        </el-input>
      </el-form-item>
      <el-form-item v-for="(domain, index) in oneToMoreForm.toList" class="to_list"
                    :label="$t('transfer.transfer1') +'/ '+ $t('tab.tab6') + index"
                    :key="index">
        <el-input v-model.trim="domain.toAddress" class="to_address" @change="toAddressChange(index)">
        </el-input>
        <el-input v-model.trim="domain.amount" class="amount" @change="amountChange(index)">
        </el-input>
        <i class="el-icon-circle-plus-outline click" @click="addDomain"></i>
        <i class="el-icon-remove-outline click" v-show="Number(index) > 0" @click="removeDomain(domain)"></i>

      </el-form-item>
      <div class="cb" style="width: 100%;height: 20px"></div>
      <el-form-item :label="$t('locking.locking8')">
        <el-input type="textarea" v-model="oneToMoreForm.remarks" :rows="3" maxlength="200" show-word-limit>
        </el-input>
      </el-form-item>
      <div class="font14" style="height: 30px">
        <label>{{$t('locking.locking9')}}</label>
        {{oneToMoreForm.fee}}
        <span class="fCN">NULS</span>
      </div>
      <div class="font14 cb" style="height: 30px; margin-top: 5px">
        <label>{{$t('oneTo.oneTo2')}}：</label>
        <span class="fred fW600">{{total}}</span>
        <span class="fCN"> NULS</span>
      </div>
      <el-form-item class="tc">
        <el-button type="success" @click="submitForm('oneToMoreForm')" :disabled="isSubmintForm">
          {{$t('newAddress.newAddress10')}}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="w1200 developers">
      <p>
        {{$t('public.developers')}}
        <span class="click" @click="toUrl('nuls','https://www.linkedin.com/in/wave98688/',1)">wave</span>
      </p>
      <p>
        {{$t('public.sponsoredAddress')}}
        <span class="clicks" @click="copy('NULSd6HgbayXFPacp5zDWiCgs4goxFyy7WAVE')">
          NULSd6HgbayXFPacp5zDWiCgs4goxFyy7WAVE
        </span>
      </p>
    </div>

    <el-dialog :title="$t('oneTo.oneTo3')" :visible.sync="oneToMoreDialog" width="45rem" class="one_to_dialog">
      <div class="dialog_info">
        <ul>
          <li><span>{{$t('transfer.transfer2')}}</span><font>{{oneToMoreForm.fromAddress}}</font></li>
          <li v-for="(item,index) of oneToMoreForm.toList" :key="index" class="to_list">
            <p class="fl to_address"><span>{{$t('transfer.transfer1')}}{{index}}</span><font>{{item.toAddress}}</font>
            </p>
            <p class="fl to_amount"><span>{{$t('tab.tab6')}}</span><font>{{item.amount}} <font
                    class="fCN">NULS</font></font></p>
          </li>
          <li class="cb"><span>{{oneToMoreForm.fee}}</span><font>{{oneToMoreForm.fee}}<font class="fCN">
            NULS</font></font></li>
          <li class="cb"><span>{{$t('oneTo.oneTo2')}}</span><font class="fred fW600">{{total}}<font class="fCN">
            NULS</font></font></li>
          <li><span>{{$t('locking.locking8')}}</span><font class="remark scroll">{{oneToMoreForm.remarks}}</font></li>
        </ul>
      </div>
      <div slot="footer" class="cb">
        <el-button @click="cancelDialog">{{$t('public.cancel')}}</el-button>
        <el-button type="success" @click="confirmDialog">{{$t('public.confirm')}}</el-button>
      </div>
    </el-dialog>

    <Password ref="password" @passwordSubmit="oneToMorePassSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {MAIN_INFO} from '@/config'
  import {
    Plus,
    Minus,
    timesDecimals,
    timesDecimals0,
    connectToExplorer,
    htmlEncode,
    addressInfo,
    passwordVerification,
    copys
  } from '@/api/util'
  import {getNulsBalance, validateAndBroadcast} from '@/api/requestData'
  import Password from '@/components/PasswordBar'

  export default {
    data() {
      return {
        accontInfo: {}, //账户信息
        oneToMoreForm: {
          fromAddress: '',
          assetsType: 'NULS',
          toList: [
            {toAddress: '', amount: ''},
          ],
          remarks: '',
          fee: 0.001
        },
        total: 0,//小计
        isSubmintForm: false,//是否可用提交
        oneToMoreDialog: false,//确认信息弹框
        oneToMoreLoading: false,//加载动画
      };
    },
    created() {
      this.accontInfo = addressInfo(1);
    },
    mounted() {
      this.oneToMoreForm.fromAddress = this.accontInfo.address;
      this.getAccountBalance(MAIN_INFO.chainId, MAIN_INFO.assetId, this.accontInfo.address);
      this.newInterval = setInterval(() => {
        this.accontInfo = addressInfo(1);
      }, 500);
      this.totalMethods();
    },
    destroyed() {
      clearInterval(this.newInterval);
    },
    components: {
      Password
    },
    watch: {
      accontInfo(val, old) {
        //console.log(val, old);
        if (val.address !== old.address && old.address) {
          this.oneToMoreForm.fromAddress = this.accontInfo.address;
          this.getAccountBalance(MAIN_INFO.chainId, MAIN_INFO.assetId, this.accontInfo.address);
        }
      },
    },
    methods: {

      /**
       * @disc: 获取账户余额
       * @params:
       * @date: 2020-07-24 16:04
       * @author: Wave
       */
      async getAccountBalance(chainId, assetId, address) {
        let resData = await getNulsBalance(chainId, assetId, address);
        //console.log(resData)
        if (resData.success) {
          this.accontInfo.balance = Number(timesDecimals(resData.data.balance, 8))
        }
      },

      /**
       * @disc: to 地址验证
       * @params:
       * @date: 2020-07-27 15:36
       * @author: Wave
       */
      async toAddressChange(index) {
        if (20 < this.oneToMoreForm.toList[index].toAddress.length && this.oneToMoreForm.toList[index].toAddress.length < 60) {
          let addressInfo = await nuls.verifyAddress(this.oneToMoreForm.toList[index].toAddress);
          //console.log(addressInfo);
          if (!addressInfo.right) {
            this.$message({
              message: this.$t('transfer.transfer2') + index + this.$t('oneTo.oneTo4'),
              type: 'error',
              duration: 3000
            });
            this.isSubmintForm = true;
            return;
          }
          if (MAIN_INFO.chainId !== addressInfo.chainId || MAIN_INFO.assetId !== addressInfo.type) {
            this.$message({
              message: this.$t('transfer.transfer2') + index + this.$t('oneTo.oneTo5'),
              type: 'error',
              duration: 3000
            });
            this.isSubmintForm = true;
            return;
          }
        } else {
          this.$message({
            message: this.$t('transfer.transfer2') + index + this.$t('oneTo.oneTo6'),
            type: 'error',
            duration: 3000
          });
          this.isSubmintForm = true;
          return;
        }
      },

      /**
       * @disc: 验证金额
       * @params:
       * @date: 2020-07-27 15:57
       * @author: Wave
       */
      amountChange(index) {
        let patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{1,8})?$");
        if (!patrn.exec(this.oneToMoreForm.toList[index].amount)) {
          this.$message({
            message: this.$t('public.amount') + index + this.$t('oneTo.oneTo7'),
            type: 'error',
            duration: 3000
          });
          this.isSubmintForm = true;
          return;
        }
        this.totalMethods();
      },

      /**
       * @disc: 获取小计方法
       * @params:
       * @date: 2020-07-27 15:04
       * @author: Wave
       */
      totalMethods() {
        this.total = 0;
        for (let item of this.oneToMoreForm.toList) {
          this.total = Number(Plus(Number(item.amount), this.total));
        }
        this.total = Number(Plus(this.total, 0.001));
      },

      /**
       * @disc: 减少to
       * @params:
       * @date: 2020-07-27 11:03
       * @author: Wave
       */
      removeDomain(item) {
        let index = this.oneToMoreForm.toList.indexOf(item);
        if (index !== -1) {
          this.oneToMoreForm.toList.splice(index, 1)
        }
        this.totalMethods();
      },

      /**
       * @disc: 增加to
       * @params:
       * @date: 2020-07-27 11:03
       * @author: Wave
       */
      addDomain() {
        this.oneToMoreForm.toList.push({
          toAddress: '',
          amount: ''
        });
      },

      /**
       * @disc: 下一步
       * @params:
       * @date: 2020-07-27 15:05
       * @author: Wave
       */
      submitForm() {
        for (let item in this.oneToMoreForm.toList) {
          if (!this.oneToMoreForm.toList[item].toAddress || !this.oneToMoreForm.toList[item].amount) {
            this.$message({
              message: this.$t('oneTo.oneTo8') + item + this.$t('oneTo.oneTo9'),
              type: 'error',
              duration: 3000
            });
            return;
          }
        }
        if (Number(Minus(this.accontInfo.balance, this.total)) < 0) {
          this.$message({message: this.$t('oneTo.oneTo10'), type: 'error', duration: 3000});
          return;
        }
        this.oneToMoreDialog = true;

      },

      /**
       * @disc: 取消转账 弹框
       * @date: 2020-06-23 14:05
       * @author: Wave
       */
      cancelDialog() {
        this.oneToMoreDialog = false
      },

      /**
       * @disc: 确定转账 弹框
       * @date: 2020-06-23 14:06
       * @author: Wave
       */
      confirmDialog() {
        this.$refs.password.showPassword(true);
      },

      /**
       * @disc: 输入密码开始转账
       * @params: password
       * @date: 2019-09-02 10:49
       * @author: Wave
       */
      async oneToMorePassSubmit(password) {
        let newAccountInfo = await passwordVerification(this.accontInfo, password);
        //console.log(newAccountInfo);

        if (!newAccountInfo.success) {
          this.$message({message: this.$t('tips.tips4'), type: 'error', duration: 3000});
          return;
        }
        this.oneToMoreDialog = false;
        this.oneToMoreLoading = true;

        //交易组装
        let inOrOutputs = await this.inputsOrOutputs(newAccountInfo, this.oneToMoreForm.toList, this.total);
        //console.log(inOrOutputs);

        let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, htmlEncode(this.oneToMoreForm.remarks), 2);
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
            duration: '3000'
          });
        } else {
          this.$refs.oneToMoreForm.resetFields();
          this.oneToMoreForm.remarks = "";
          this.oneToMoreForm.toList = [{toAddress: '', amount: ''}];
          this.total = 0.001;
          this.oneToMoreLoading = false;
          this.$message({
            dangerouslyUseHTMLString: true,
            message: this.$t('tips.tips0') + " txHash:<a class='yellow'>" + validateTxhex.hash + "</a>",
            type: 'success',
            duration: '2000'
          });
        }
      },

      /**
       * @disc: 获取inputs and outputs
       * @params: addressInfo
       * @params: addressList
       * @params: total
       * @date: 2019-09-02 10:49
       * @author: Wave
       **/
      async inputsOrOutputs(addressInfo, addressList, total) {
        let balanceInfo = await getNulsBalance(MAIN_INFO.chainId, MAIN_INFO.assetId, addressInfo.address);
        //console.info(balanceInfo);

        let inputs = [{
          address: addressInfo.address,
          assetsChainId: MAIN_INFO.chainId,
          assetsId: MAIN_INFO.assetId,
          amount: timesDecimals0(total, 8).toString(),
          locked: 0,
          nonce: balanceInfo.data.nonce
        }];
        let outputs = [];

        for (let item of addressList) {
          outputs.push({
            address: item.toAddress,
            assetsChainId: MAIN_INFO.chainId,
            assetsId: MAIN_INFO.assetId,
            amount: timesDecimals0(item.amount, 8).toString(),
            lockTime: 0
          })
        }
        return {success: true, data: {inputs: inputs, outputs: outputs}};
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

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
      },

    }
  }
</script>

<style lang="less">
  .one_to {
    .one_to_form {
      margin: 0 auto 80px;
      .to_list {
        margin: 0 0 0 0;
        .el-form-item__label {
          display: block;
          width: 100%;
          text-align: left;
        }
        .el-form-item__content {
          .to_address {
            width: 70%;
            display: block;
            float: left;
          }
          .amount {
            width: 21%;
            display: block;
            float: left;
            margin: 0 0 0 1%;
          }
          i {
            font-size: 18px;
            margin: 0 0 0 1%;
          }
        }
      }
      .el-button--success {
        width: 12rem;
        margin: 2rem 0;
      }
    }
    .one_to_dialog {
      .el-dialog {
        .el-dialog__body {
          .dialog_info {
            ul {
              li {
                line-height: 30px;
                span {
                  width: 120px;
                  display: block;
                  float: left;
                  text-align: right;
                }
                p {
                  margin: 0;
                  padding: 0;
                  line-height: 30px;
                  min-height: 20px;
                }
                .to_address {
                  width: 470px;
                }
                .to_amount {
                  width: 200px;
                  span {
                    width: auto;
                    padding: 0 0 0 5px;
                  }
                }
                .remark {
                  max-width: 550px;
                  max-height: 60px;
                  display: block;
                  float: left;
                  line-height: 20px;
                  overflow-x: auto;
                }
              }
              .to_list {
                height: 30px;
                border-bottom: 1px solid #c1c1c1;
              }
            }
          }
        }
        .el-dialog__footer {
          clear: both;
          padding: 30px 0;
          .el-button {
            width: 13rem;
          }
        }
      }
    }
  }
</style>
