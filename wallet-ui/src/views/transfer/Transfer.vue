<template>
  <div class="transfer bg-gray">
    <h3 class="title">NULS 转账</h3>
    <div class="w1200 bg-white">
      <el-form :model="transferForm" :rules="transferRules" ref="transferForm">
        <el-form-item label="付款地址:">
          <el-input v-model.trim="transferForm.fromAddress" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="收款地址:" prop="toAddress">
          <el-input v-model.trim="transferForm.toAddress">
            <i class="iconfont iconlianxiren click" slot="suffix" @click="showBook"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="资产类型:">
          <el-select v-model="transferForm.type">
            <el-option label="NULS" value="NULS">
            </el-option>
            <!-- <el-option label="WAVE" value="WAVE">
             </el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="转账金额:" prop="amount">
          <span class="balance font12 fr">可用余额：{{addressInfo.balance}}</span>
          <el-input v-model="transferForm.amount">
          </el-input>
        </el-form-item>
        <el-form-item label.trim="备注:">
          <el-input type="textarea" v-model="transferForm.remarks" @change="countFee">
          </el-input>
        </el-form-item>
        <div class="font14">
          <el-tooltip placement="top">
            <div slot="content">该手续费值是根据当前NULS网络预估的，实际消耗可能小于该值，多余部分将会通过共识奖励退回</div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
          手续费：{{fee}} <span class="fCN">NULS</span>
        </div>
        <el-form-item class="form-next">
          <el-button type="success" @click="submitForm('transferForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
    <el-dialog title="转账确认" :visible.sync="transferVisible" width="40rem" class="confirm-dialog">
      <div class="bg-white">
        <div class="div-data">
          <p>付款地址：</p>
          <label>{{transferForm.fromAddress}}</label>
        </div>
        <div class="div-data">
          <p>收款地址：</p>
          <label>{{transferForm.toAddress}}</label>
        </div>
        <div class="div-data">
          <p>手续费：</p>
          <label>{{fee}} <span class="fCN">NULS</span></label>
        </div>
        <div class="div-data">
          <p>金额：</p>
          <label class="yellow">{{transferForm.amount}} <span class="fCN">NULS</span></label>
        </div>
        <div class="div-data">
          <p>备注：</p>
          <label>{{transferForm.remarks}}</label>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="success" @click="confirmTraanser">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {RightShiftEight, Times} from '@/api/util'
  import {getNulsBalance, countFee, inputsOrOutputs, validateAndBroadcast} from '@/api/requestData'
  import Password from '@/components/PasswordBar'

  export default {

    data() {
      let validateToAddress = (rule, value, callback) => {
        let patrn = /^(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{20,50}$/;
        if (value === '') {
          callback(new Error('请输入收款地址'))
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入正确的收款地址'))
        } else {
          callback()
        }
      };
      let validateAmount = (rule, value, callback) => {
        let patrn = /^([1-9][\d]{0,72}|0)(\.[\d]{1,72})?$/;
        if (value === '') {
          callback(new Error('请输入金额'))
        } else if (!patrn.exec(value)) {
          callback(new Error('金额必须为数字'))
        } else if (parseFloat(value) < 0.001) {
          callback(new Error('金额必须大于0.001'))
        } else {
          setTimeout(() => {
            if (parseInt(RightShiftEight(value).toString()) > parseInt(RightShiftEight(this.addressInfo.balance).toString())) {
              callback(new Error('金额不能大于可用余额'))
            } else {
              callback()
            }
          }, 200);
        }
      };
      return {
        addressInfo: '', //默认账户信息
        balanceInfo: '',//账户余额信息
        //转账数据
        transferForm: {
          fromAddress: '',
          toAddress: '',
          type: 'NULS',
          amount: '',
          remarks: '',
        },
        //验证信息
        transferRules: {
          toAddress: [
            {validator: validateToAddress, trigger: ['blur', 'change']}
          ],
          amount: [
            {validator: validateAmount, trigger: ['blur', 'change']}
          ],
        },
        //手续费
        fee: 0.001,
        //转账确认弹框
        transferVisible: false,
      };
    },
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      }, 500);
      this.transferForm.fromAddress = this.addressInfo.address
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.transferForm.fromAddress = this.addressInfo.address
        }
      }
    },
    components: {
      Password,
    },
    methods: {

      /**
       *计算手续费
       * todo 备注字符大于200 做手续费计算
       **/
      countFee() {
        let str = this.transferForm.remarks;
        let len = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          //单字节加1
          if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
          }
          else {
            len += 2;
          }
        }
        if (len > 200) {
          console.log(len)
        } else {
          console.log("len:" + len)
        }

      },

      //组装交易并获取手续费
      async txAssemble() {
        await getNulsBalance(this.transferForm.fromAddress).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
            let transferInfo = {
              fromAddress: this.transferForm.fromAddress,
              toAddress: this.transferForm.toAddress,
              assetsChainId: 2,
              assetsId: 1,
              amount: Number(Times(this.transferForm.amount, 100000000).toString()),
              fee: 10000
            };
            let inOrOutputs = inputsOrOutputs(transferInfo, this.balanceInfo, 2);
            let tAssemble = [];//交易组装
            if (inOrOutputs.success) {
              tAssemble = nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
              //获取手续费
              let newFee = countFee(tAssemble, 1);
              //手续费大于0.001的时候重新组装交易及签名
              if (transferInfo.fee !== newFee) {
                transferInfo.fee = newFee;
                inOrOutputs = inputsOrOutputs(transferInfo, this.balanceInfo, 2);
                return nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
              } else {
                return tAssemble
              }
            } else {
              this.$message({message: "input和outputs组装错误：" + inOrOutputs.data, type: 'error', duration: 1000});
            }
          } else {
            this.$message({message: "获取账户余额失败:" + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: "获取账户余额失败：" + error, type: 'error', duration: 1000});
        });

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
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 弹框确认提交
       *
       **/
      async confirmTraanser() {
        await getNulsBalance(this.transferForm.fromAddress).then((response) => {
          if (response.success) {
            this.balanceInfo = response.data;
            this.$refs.password.showPassword(true)
          } else {
            this.$message({message: "获取账户余额失败:" + response, type: 'error', duration: 1000});
          }
        }).catch((error) => {
          this.$message({message: "获取账户余额失败：" + error, type: 'error', duration: 1000});
        });
      },

      /**
       * 获取转出账户余额信息
       *  @param assetsId
       *  @param address
       **/
      async getNulsBalance(assetsId = 1, address) {
        await this.$post('/', 'getAccountBalance', [assetsId, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.balanceInfo = {'balance': response.result.balance, 'nonce': response.result.nonce};
              this.$refs.password.showPassword(true);
            } else {
              this.$message({message: "获取账户余额失败:" + response, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: "获取账户余额失败：" + error, type: 'error', duration: 1000});
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
          let transferInfo = {
            fromAddress: this.transferForm.fromAddress,
            toAddress: this.transferForm.toAddress,
            assetsChainId: 2,
            assetsId: 1,
            amount: Number(Times(this.transferForm.amount, 100000000).toString()),
            fee: 10000
          };
          let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 2);
          let tAssemble = [];//交易组装
          let txhex = "";//交易签名
          if (inOrOutputs.success) {
            tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
            //获取手续费
            let newFee = countFee(tAssemble, 1);
            //手续费大于0.001的时候重新组装交易及签名
            if (transferInfo.fee !== newFee) {
              transferInfo.fee = newFee;
              inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 2);
              tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, this.transferForm.remarks, 2);
              txhex = await nuls.transactionSerialize(nuls.decrypteOfAES(this.addressInfo.aesPri, password), this.addressInfo.pub, tAssemble);
            } else {
              txhex = await nuls.transactionSerialize(nuls.decrypteOfAES(this.addressInfo.aesPri, password), this.addressInfo.pub, tAssemble);
            }
          } else {
            this.$message({message: inOrOutputs.data, type: 'error', duration: 1000});
          }
          //console.log(txhex);
          //验证并广播交易
          await validateAndBroadcast(txhex).then((response) => {
            if (response.success) {
              this.toUrl("txList");
            } else {
              this.$message({message: response.data, type: 'error', duration: 1000});
            }
          }).catch((err) => {
            this.$message({message: "验证并广播交易异常：" + err, type: 'error', duration: 1000});
          });
        }else {
          this.$message({message: "对不起，密码错误", type: 'error', duration: 1000});
        }
      },

      /**
       * 通讯录功能
       * TODO 待开发...
       **/
      showBook(){
        this.$message({message: "开发者......" , duration: 1000});
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
        margin: 50px auto;
        .el-form-item {
          .el-form-item__content {
            .el-select {
              width: 100%;
              .el-input__inner {
                width: 100%;
              }
            }
            .balance {
              margin: 10px 0 0 0;
            }
          }
        }
      }
    }
  }

</style>
