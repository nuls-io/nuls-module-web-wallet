<template>
  <div class="import_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar backTitle="创建地址"></BackBar>
        <h3 class="title">导入钱包</h3>
      </div>
    </div>
    <div class="w1200 mt_20 bg-white">
      <div class="radio">
        <el-radio v-model="importRadio" label="importKeystore" disabled>Keystore 导入</el-radio>
        <el-radio v-model="importRadio" label="importKey">私钥导入</el-radio>
      </div>

      <div class="btn mb_100" v-show="importRadio==='importKeystore'">
        <el-button type="success">选择keystore文件</el-button>
      </div>

      <div class="w630" v-show="importRadio==='importKey'">
        <el-form :model="importKeyForm" status-icon :rules="importKeyRules" ref="importKeyForm" class="mb_100">
          <el-form-item label="请输入你的私钥:" prop="key">
            <el-input type="textarea" v-model.trim="importKeyForm.key"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="importKeyForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="importKeyForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitForm('importKeyForm')">导入钱包</el-button>
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
      let checkKey = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('私钥不能为空'));
        } else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入由字母和数字组合的8-20位密码'));
        } else {
          if (this.importKeyForm.checkPass !== '') {
            this.$refs.importKeyForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.importKeyForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        importRadio: 'importKey',
        importKeyForm: {
          key: '',
          pass: '',
          checkPass: ''
        },
        importKeyRules: {
          pass: [
            {validator: validatePass, trigger: ['blur', 'change']}
          ],
          checkPass: [
            {validator: validateCheckPass, trigger: ['blur', 'change']}
          ],
          key: [
            {validator: checkKey, trigger: ['blur', 'change']}
          ]
        }
      };
    },
    components: {
      BackBar
    },
    methods: {

      /**
       * 私钥导入钱包
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.importWallet()
          } else {
            return false;
          }
        });
      },

      /**
       * 导入
       */
      importWallet() {
        const importAddressInfo = nuls.importByKey(2,this.importKeyForm.key,this.importKeyForm.pass);
        let addressInfo = {
          address: importAddressInfo.address,
          aesPri: importAddressInfo.aesPri,
          pub: importAddressInfo.pub,
          alias: '',
          remark: '',
          selection:false,
        };
        localStorage.setItem(importAddressInfo.address, JSON.stringify(addressInfo));
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
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .import_address {
    .mt_20 {
      border: @BD1;
      .radio {
        width: 300px;
        text-align: center;
        margin: 50px auto;
      }
    }
  }
</style>
