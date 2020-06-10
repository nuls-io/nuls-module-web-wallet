<template>
  <div class="password">
    <div class="scan">
      <el-dialog :title="$t('tips.tips17')" :visible.sync="scanDialog" width="308px" center @close="scanDialogClose">
        <div class="tc">
          <div id="qrcode" class="qrcode tc"></div>
          <div class="font12 tc" style="margin: 20px 0 0 0">
            {{$t('tips.tips18')}}
            <font class="click td" @click="toUrl('http://nabox.io/',1)">Nabox</font>
            /
            <font class="click td" @click="toUrl('https://www.denglu1.cn/',1)">{{$t('tips.tips11')}}</font>
            {{$t('tips.tips17')}}
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="password_visible">
      <el-dialog :title="$t('password.password1')" :visible.sync="passwordVisible" top="30vh" width="30rem"
                 class="password-dialog"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 @open="passwordShow"
                 @close="passwordClose">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" @submit.native.prevent>
          <div v-show="false">{{$t('password.password1')}}</div>
          <el-form-item prop="password">
            <el-input v-model="passwordForm.password" type="password" :maxlength="22" ref="inpus"
                      @keyup.enter.native="enterSubmit('passwordForm')">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="passwordClose">{{$t('password.password2')}}</el-button>
          <el-button type="success" @click="dialogSubmit('passwordForm')" id="passwordInfo">{{$t('password.password3')}}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import QRCode from 'qrcodejs2'
  import nuls from 'nuls-sdk-js'
  import {connectToExplorer} from '@/api/util.js'
  import {validateAndBroadcast, getScanAutograph} from '@/api/requestData'

  export default {
    props: {},
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('password.password1')))
        } else {
          callback()
        }
      };
      return {
        scanDialog: false, //二维码弹框
        scanInterval: null,//二维码定时器

        passwordVisible: false, //密码弹框
        passwordForm: {
          password: '',
        },
        passwordRules: {
          password: [
            {validator: validatePass, trigger: ['blur', 'change']}
          ]
        },
      }
    },
    created() {
    },
    mounted() {
      if (process.env.NODE_ENV !== 'production') {
        this.passwordForm.password = 'nuls123456'
      }
    },
    watch: {
      passwordVisible(val) {
        if (val) {
          setTimeout(() => {
            this.$refs['inpus'].focus()
          }, 200)
        }
      }
    },
    methods: {

      /**
       * @disc: 二维码显示内容
       * @params: txInfo
       * @date: 2019-12-03 14:34
       * @author: Wave
       */
      showScan(txInfo, setAliasHex) {
        this.scanDialog = true;
        setTimeout(() => {
          let qrcode = new QRCode('qrcode', {
            width: 250,
            height: 250,
            colorDark: "#000000",
            colorLight: "#ffffff",
          });
          qrcode.makeCode(JSON.stringify(txInfo))
        }, 500);

        this.scanInterval = setInterval(() => {
          this.scanAutograph(txInfo.signDataKey, setAliasHex);
        }, 3000);
      },

      /**
       * @disc: 关闭二维码弹框
       * @date: 2019-12-03 15:28
       * @author: Wave
       */
      scanDialogClose() {
        document.getElementById('qrcode').innerHTML = '';
        clearInterval(this.scanInterval);
        this.scanInterval = null;
      },

      /**
       * @disc: 获取扫描后签名信息
       * @params: importRandomString
       * @date: 2019-12-02 16:39
       * @author: Wave
       */
      async scanAutograph(randomString, setAliasHex) {
        let scanAutographInfo = await getScanAutograph(randomString);
        //console.log(scanAutographInfo);
        if (scanAutographInfo.success && scanAutographInfo.data.pubkey) {
          setAliasHex.signatures = await nuls.appSplicingPub(scanAutographInfo.data.signData, scanAutographInfo.data.pubkey);
          let txhex = setAliasHex.txSerialize().toString("hex");
          //console.log(txhex);
          let broadcastInfo = await validateAndBroadcast(txhex);
          //console.log(broadcastInfo);
          if (broadcastInfo.success) {
            this.$message({message: this.$t('tips.tips0'), type: 'success', duration: 1000});
            this.scanDialog = false;
            this.scanDialogClose();
            this.toUrl("txList");
          } else {
            this.$message({
              message: this.$t('tips.tips1') + JSON.stringify(broadcastInfo.data),
              type: 'error',
              duration: 3000
            });
            this.scanDialog = false;
            this.scanDialogClose();
          }
        }
      },

      /**
       * 回车提交
       * @param formName
       */
      enterSubmit(formName) {
        if (this.passwordForm.password) {
          this.dialogSubmit(formName);
        }
      },

      //密码框显示执行事件
      passwordShow() {
      },

      /**
       * @disc: 关闭密码弹框
       * @date: 2019-12-03 15:45
       * @author: Wave
       */
      passwordClose() {
        this.$refs['passwordForm'].resetFields();
        this.passwordVisible = false;
      },

      /**
       * @disc: 显示密码弹框
       * @params: boolean
       * @date: 2019-12-03 15:45
       * @author: Wave
       */
      showPassword(boolean) {
        this.passwordVisible = boolean;
      },

      /**
       * @disc: 弹出密码输入框
       * @date: 2019-12-03 13:59
       * @author: Wave
       */
      dialogSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('passwordSubmit', this.passwordForm.password);
            this.passwordVisible = false;
          } else {
            return false
          }
        })
      },

      /**
       * @disc: 连接跳转
       * @params: name
       * @date: 2019-09-02 11:12
       * @author: Wave
       */
      toUrl(name, type = 0) {
        //console.log(name,type);
        if (type === 0) {
          this.$router.push({
            name: name
          })
        } else {
          connectToExplorer('nuls', name);
        }
      },
    }
  }
</script>

<style lang="less">
  .password {
    .password-dialog {
      .el-dialog {
        width: 370px;
        .el-dialog__body {
          background-color: #F5F6F9 !important;
          padding: 30px 20px 30px 20px !important;
          .el-form {
            .el-form-item {
              .el-form-item__label {
                line-height: 0;
                padding: 28px 0 20px 0;
              }
            }
          }
        }
        .el-dialog__footer {
          .dialog-footer {
            padding: 1rem 1rem 0.1rem;
            .el-button {
              width: 9.5rem;
            }
            .el-button--success {
              span {
                color: white;
              }
            }
          }
        }
      }
    }
    .scan {
      text-align: center;
      .el-dialog {
        .el-dialog__body {
          height: 330px;
          .qrcode{
            width: 250px;
          }
        }
      }
    }
  }

</style>
