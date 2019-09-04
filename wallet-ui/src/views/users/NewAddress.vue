<template>
  <div class="new_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar backTitle="账户管理" v-show="ifAddressInfo"></BackBar>
        <h3 class="title"><font v-if="!isBackups">创建钱包</font><font v-else>备份账户</font></h3>
      </div>
    </div>
    <div class="new w1200 mt_20 bg-white">
      <ul class="step" v-show="!isBackups">
        <li>
          <p class="dotted Ndotted"></p>
        </li>
        <li>
          <p class="ico"><i class="el-icon-view Ncolor"></i></p>
          <h6 class="Ncolor">设置密码</h6>
        </li>
        <li>
          <p class="dotted" :class="!isFirst ? 'Ndotted':''"></p>
        </li>
        <li>
          <p class="ico"><i class="el-icon-location-outline" :class="!isFirst ? 'Ncolor':''"></i></p>
          <h6 :class="!isFirst ? 'Ncolor':''">备份</h6>
        </li>
        <li>
          <p class="dotted"></p>
        </li>
      </ul>
      <div class="cb"></div>

      <div class="w630" v-show="isFirst">
        <div class="tip bg-gray">
          <p><i></i>请设置密码用以导入账户、转账、参与共识等重要行为验证</p>
          <p><i></i>请认真保存钱包密码，NULS钱包不存储密码，也无法帮您找回，请务必牢记</p>
        </div>
        <div class="cb"></div>
        <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" class="mb_20">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="passwordForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <div class="font12">点击下一步，你已经同意了<span class="click">用户协议</span></div>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitPasswordForm('passwordForm')">下一步</el-button>
            <el-button type="text" @click="toUrl('importAddress')">导入钱包</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="step_tow w630" v-show="!isFirst">
        <h3 class="title">
          您的账户地址：
          <span>{{newAddressInfo.address}}</span>
          <i class="iconfont iconfuzhi clicks" @click="copy(newAddressInfo.address)"></i>
        </h3>
        <div class="tip bg-gray">
          <p>请勿遗失！ NULS将无法帮助您找回遗失的密钥</p>
          <p>请勿向他人分享！ 如在恶意网站使用此文件，您的资金可能面临被盗窃的风险</p>
          <p>请制作备份！ 以防您的电脑故障</p>
        </div>

        <div class="btn mb_20">
          <el-button type="success" @click="backKeystore" disabled>Keystore备份</el-button>
          <el-button type="text" @click="backKey">明文私钥备份</el-button>
          <el-button type="info" @click="goWallet" v-show="!isBackups">进入钱包</el-button>
        </div>
      </div>

    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
    <el-dialog title="安全警告" width="40%"
               :visible.sync="keyDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <span>私钥未经加密，备份存在风险，请保存到安全的地方，建议使用Keystore进行备份</span>
      <p class="bg-white">
        {{newAddressInfo.pri}}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="copy(newAddressInfo.pri)">复制</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'
  import {copys} from '@/api/util'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入由字母和数字组合的8-20位密码'));
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePassTwo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        isFirst: true,//第一步
        isBackups: false,//备份账户
        keyDialog: false, //弹框
        ifAddressInfo: sessionStorage.hasOwnProperty(sessionStorage.key(0)),//判断是否账户地址
        passwordForm: {
          pass: '',
          checkPass: '',
        },
        passwordRules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePassTwo, trigger: 'blur'}
          ]
        },
        newAddressInfo: {}, //新建的地址信息
      };
    },
    created() {
      if (this.$route.query.address) {
        this.isFirst = false;
        this.isBackups = true;
        this.newAddressInfo.address = this.$route.query.address;
        this.newAddressInfo.aesPri = this.$route.query.aesPri;
      }
    },
    mounted() {
    },
    components: {
      Password,
      BackBar
    },
    methods: {

      /**
       * 创建地址
       * @param formName
       */
      submitPasswordForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newAddressInfo = nuls.newAddress(2, this.passwordForm.pass);
            let addressInfo = {
              address: this.newAddressInfo.address,
              aesPri: this.newAddressInfo.aesPri,
              pub: this.newAddressInfo.pub,
              alias: '',
              remark: '',
              selection: false,
            };
            localStorage.setItem(this.newAddressInfo.address, JSON.stringify(addressInfo));
            this.isFirst = false;
          } else {
            return false;
          }
        });
      },

      /**
       * 备份keystore
       **/
      backKeystore() {
        //TODO 待完善
      },

      /**
       * 备份私钥
       **/
      backKey() {
        this.$refs.password.showPassword(true)
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.newAddressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(2, pri, password);
        if (newAddressInfo.address === this.newAddressInfo.address) {
          this.newAddressInfo.pri = pri;
          this.keyDialog = true;
        } else {
          this.$message({message: "密码错误", type: 'error', duration: 1000});
        }
      },

      /**
       * 进入钱包
       */
      goWallet() {
        this.toUrl('address')
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

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: "已经复制完成", type: 'success', duration: 1000});
        this.keyDialog = false;
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .new_address {
    .new {
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
