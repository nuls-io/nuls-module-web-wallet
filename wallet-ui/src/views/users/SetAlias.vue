<template>
  <div class="new_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar backTitle="地址管理"></BackBar>
        <h3 class="title">设置别名</h3>
      </div>
    </div>
    <div class="new w1200 mt_20 bg-white">
      <div class="w630">
        <h3 class="tc mzt_20">{{this.$route.query.address}}</h3>
        <div class="tip bg-gray">
          <p>• 别名可作为NULS转账的收款人，为了账户安全，别名设置确定后，将无法修改，请谨慎操作。</p>
          <p>• 设置别名需要花费1个NULS</p>
        </div>
        <el-form :model="aliasForm" status-icon :rules="aliasRules" ref="aliasForm" class="mb_20">
          <el-form-item label="别名" prop="alias">
            <span class="balance font12 fr">可用余额：{{addressInfo.balance}}</span>
            <el-input type="text" v-model="aliasForm.alias" maxlength="20" autocomplete="off"></el-input>
          </el-form-item>
          <div class="div-data font14">
            手续费: <label>0.001 <span class="fCN">NULS</span></label>
          </div>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitAliasForm('aliasForm')">下一步</el-button>
          </el-form-item>
          <div class="tc font18 mzt_20">
            总花费: 1.001
          </div>
        </el-form>
      </div>
    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {inputsOrOutputs, validateAndBroadcast} from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      let validateAlias = (rule, value, callback) => {
        let patrn = /^(?!_)(?!.*?_$)[a-z0-9_]+$/;
        if (value === '') {
          callback(new Error('请输入别名'));
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入别名(只允许使用小写字母、数字、下划线（下划线不能在两端）)'));
        } else {
          callback();
        }
      };
      return {
        aliasForm: {
          alias: '',
        },
        aliasRules: {
          alias: [
            {validator: validateAlias, trigger: 'blur'}
          ]
        },
        addressInfo: '', //默认账户信息
        balanceInfo: '',//账户余额信息
      };
    },
    created() {
      this.addressInfo = JSON.parse(localStorage.getItem(this.$route.query.address));
      this.getNulsBalance(1, this.$route.query.address);
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
      BackBar,
    },
    methods: {

      /**
       * 设置别名
       * @param formName
       */
      submitAliasForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //console.log(this.balanceInfo.balance);
            if(this.balanceInfo.balance > 100100000){
              this.$refs.password.showPassword(true);
            }else {
              this.$message({message: "对不起，获取账户余额不足!", type: 'error', duration: 1000});
            }
          } else {
            return false;
          }
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
              //this.$refs.password.showPassword(true);
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
            fromAddress: this.addressInfo.address,
            toAddress: 'tNULSeBaMkqeHbTxwKqyquFcbewVTUDHPkF11o',
            assetsChainId: 2,
            assetsId: 1,
            amount: 100000000,
            fee: 100000
          };
          let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 3);
          let aliasInfo = {
            fromAddress: this.addressInfo.address,
            alias: this.aliasForm.alias
          };
          let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, '', 3, aliasInfo);
          let txhex = await nuls.transactionSerialize(nuls.decrypteOfAES(this.addressInfo.aesPri, password), this.addressInfo.pub, tAssemble);
          //console.log(txhex);
          //验证并广播交易
          await validateAndBroadcast(txhex).then((response) => {
            if (response.success) {
              this.toUrl("txList");
            } else {
              this.$message({message: "验证并广播交易错误：" + response.data, type: 'error', duration: 1000});
            }
          }).catch((err) => {
            this.$message({message: "验证并广播交易异常：" + err, type: 'error', duration: 1000});
          });
        }else {
          this.$message({message: "对不起，密码错误", type: 'error', duration: 1000});
        }
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
  .new_address {
    .new {
      min-height: 600px;
      border: @BD1;
      .step {
        height: 50px;
        margin: 100px 140px 0 140px;
        li {
          float: left;
          width: 20%;
          height: 50px;
          text-align: center;
          .dotted {
            margin: 20px 0 0 0;
            border-bottom: 2px dotted @Dcolour;
          }
          .Ndotted {
            border-bottom-color: @Ncolour;
          }
          .Ncolor {
            color: @Ncolour;
          }
          .ico {
            i {
              font-size: 30px;
            }
          }
        }

      }
      .tip {
        margin: 40px auto;
        padding: 20px 30px;
        p {
          i {
            width: 5px;
            height: 5px;
            display: block;
            float: left;
            margin: 9px 10px 0 0;
            border-radius: 5px;
            background: #000000;
          }
        }
      }
      .step_tow {
        .title {
          height: 30px;
          line-height: 30px;
          margin: 40px auto 0;
        }
        .tip {
          margin: 40px auto;
        }
        .btn {
          .el-button--info {
            margin: 50px 0 20px 0 !important;
          }
        }
      }
    }
  }

</style>
