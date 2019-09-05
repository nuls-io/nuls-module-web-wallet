<template>
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
</template>

<script>
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
        passwordVisible: false,
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
      passwordClose() {
        this.$refs['passwordForm'].resetFields();
        this.passwordVisible = false;
      },
      showPassword(boolean) {
        this.passwordVisible = boolean;
      },
      //弹出密码输入框
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
    }
  }
</script>

<style lang="less">
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
</style>
