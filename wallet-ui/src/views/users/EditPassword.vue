<template>
  <div class="new_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar backTitle="账户管理"></BackBar>
        <h3 class="title">修改密码</h3>
      </div>
    </div>
    <div class="new w1200 mt_20 bg-white">
      <div class="w630">
        <h3 class="tc mzt_20">{{this.$route.query.address}}</h3>
        <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" class="mb_20">
          <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="passwordForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="passwordForm.newPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitPasswordForm('passwordForm')">提交</el-button>
            <div>如果你忘记密码可以使用私钥重新导入</div>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import BackBar from '@/components/BackBar'

  export default {
    data() {
      let validateOldPass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error('请旧输入密码'));
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入由字母和数字组合的8-20位密码'));
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('newPass');
          }
          callback();
        }
      };
      let validateNewPass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入由字母和数字组合的8-20位密码'));
        } else if (this.passwordForm.oldPass === this.passwordForm.newPass) {
          callback(new Error('新密码不能和旧密码相同'));
        } else {
          if (this.passwordForm.checkPass !== '') {
            this.$refs.passwordForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validateChechPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (this.passwordForm.checkPass !== this.passwordForm.newPass) {
          callback(new Error('新密码与确认新密码不一样，请重新输入'));
        } else {
          callback();
        }
      };
      return {
        addressInfo: {},//默认账户信息
        passwordForm: {
          oldPass: '',
          newPass: '',
          checkPass: '',
        },
        passwordRules: {
          oldPass: [
            {validator: validateOldPass, trigger: 'blur'}
          ],
          newPass: [
            {validator: validateNewPass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validateChechPass, trigger: 'blur'}
          ]
        },
        editAddressInfo: '',//新建的地址信息
      };
    },
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      }, 500);
    },
    mounted() {},
    components: {
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
            const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, this.passwordForm.oldPass);
            const newAddressInfo = nuls.importByKey(2, pri, this.passwordForm.oldPass);
            if (newAddressInfo.address === this.addressInfo.address) {
              const importAddressInfo = nuls.importByKey(2, pri, this.passwordForm.newPass);
              newAddressInfo.aesPri = importAddressInfo.aesPri;
              newAddressInfo.pub = importAddressInfo.pub;
              localStorage.setItem(importAddressInfo.address, JSON.stringify(importAddressInfo));
              sessionStorage.setItem(importAddressInfo.address, JSON.stringify(importAddressInfo));
              this.$message({message: "密码修改完成", type: 'success', duration: 1000});
              this.toUrl("address");
            } else {
              this.$message({message: "旧密码错误", type: 'error', duration: 1000});
            }
          } else {
            return false;
          }
        });
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
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
