<template>
  <div class="import-address bg-gray">
    <div class="bg-white"></div>
    <div style="">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="new_import w1200">
        <el-tab-pane :label="$t('importAddress.importAddress2')" name="keystoreImport" :disabled="resetAddress !=='0'">
          <div class="tc upload_keystore">
            <el-upload drag class="upload" action="localhost" accept='.keystore' v-if="!isfileReader"
                       :before-upload="handleUpload"
                       :multiple="false"
                       :limit="1">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t('importAddress.importAddress4')}}<em>{{$t('importAddress.importAddress41')}}</em>
              </div>
            </el-upload>
            <div v-else>{{$t('importAddress.importAddress42')}}</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('importAddress.importAddress3')" name="keyImport">

          <div class="tab w1200 mt_30">
            <div class="tc font18 mzt_20" v-if="resetAddress !=='0'">
              {{$t('public.resetAddress')}}: {{resetAddress}}
            </div>
            <el-form :model="importForm" :rules="importRules" ref="importForm" status-icon class="import-form w630">
              <el-form-item :label="$t('importAddress.importAddress5')" prop="keys">
                <el-input type="textarea" v-model.trim="importForm.keys" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$t('newAddress.newAddress6')" prop="pass">
                <el-input v-model="importForm.pass" type="password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$t('newAddress.newAddress7')" prop="checkPass">
                <el-input v-model="importForm.checkPass" type="password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item class="form-bnt">
                <el-button type="success" @click="keyImport('importForm')">{{$t('importAddress.importAddress8')}}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('importAddress.importAddress0')" name="newAddress" :disabled="resetAddress !=='0'">
          <div class="new_address">
            <el-form :model="newAddressForm" status-icon :rules="newAddressRules" ref="newAddressForm"
                     class="w630">
              <el-form-item :label="$t('newAddress.newAddress6')" prop="pass">
                <el-input type="password" v-model="newAddressForm.pass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$t('newAddress.newAddress7')" prop="checkPass">
                <el-input type="password" v-model="newAddressForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="" prop="agreement">
                <el-checkbox-group v-model="newAddressForm.agreement">
                  <el-checkbox :label="$t('newAddress.newAddress8')" name="agreement"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item class="form-bnt">
                <el-button type="success" @click="newAddressSubmitForm('newAddressForm')">
                  {{$t('importAddress.importAddress0')}}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Password ref="password" @passwordSubmit="keystoreImportPassSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {chainID, defaultAddressInfo, localStorageByAddressInfo, passwordVerification} from '@/api/util'
  import {getPrefixByChainId} from '@/api/requestData'
  import Password from '@/components/PasswordBar'

  export default {
    data() {
      let validateKeys = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('importAddress.importAddress9')));
        } else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error(this.$t('newAddress.newAddress22')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('newAddress.newAddress23')));
        } else {
          if (this.importForm.checkPass !== '') {
            this.$refs.importForm.validateField('validateCheckPass');
          }
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('newAddress.newAddress24')));
        } else if (value !== this.importForm.pass) {
          callback(new Error(this.$t('newAddress.newAddress25')));
        } else {
          callback();
        }
      };

      let validateNewPass = (rule, value, callback) => {
        let patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
        if (value === '') {
          callback(new Error(this.$t('newAddress.newAddress22')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('newAddress.newAddress23')));
        } else {
          if (this.newAddressForm.checkPass !== '') {
            this.$refs.newAddressForm.validateField('validateNewCheckPass');
          }
          callback();
        }
      };
      let validateNewCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('newAddress.newAddress24')));
        } else if (value !== this.newAddressForm.pass) {
          callback(new Error(this.$t('newAddress.newAddress25')));
        } else {
          callback();
        }
      };
      return {
        activeName: 'keystoreImport',//tab选中
        prefix: '',//地址前缀
        isfileReader: typeof FileReader === "undefined",//浏览器是否支持FileReader
        keystoreInfo: {},//keystore导入文本信息
        resetAddress: this.$route.query.address ? this.$route.query.address : '0',//重置密码地址
        importForm: {
          keys: '',
          pass: '',
          checkPass: ''
        },
        importRules: {
          keys:
            [
              {validator: validateKeys, trigger: 'blur'}
            ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validateCheckPass, trigger: 'blur'}
          ]
        },
        importAddressInfo: {},//私钥导入地址信息
        newAddressForm: {
          pass: '',
          checkPass: '',
          agreement: ''
        },
        newAddressRules: {
          pass: [
            {validator: validateNewPass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validateNewCheckPass, trigger: 'blur'}
          ]
        },
        newAddressInfo: {},//创建地址信息
      };
    },
    components: {
      Password
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });
      console.log(this.resetAddress);
      this.activeName = this.resetAddress !== '0' ? 'keyImport' : 'keystoreImport'
    },
    methods: {

      /**
       * @disc: tab选择
       * @params: tab
       * @date: 2019-08-31 16:18
       * @author: Wave
       */
      handleClick(tab) {
        if (tab.name === 'keystoreImport') {
          this.importAddressInfo = {};
          this.newAddressInfo = {};
          this.$refs['importForm'].resetFields();
          this.$refs['newAddressForm'].resetFields();
        } else if (tab.name === 'keyImport') {
          this.keystoreInfo = {};
          this.newAddressInfo = {};
          this.$refs['newAddressForm'].resetFields();
        } else {
          this.keystoreInfo = {};
          this.importAddressInfo = {};
          this.$refs['importForm'].resetFields();
        }
      },

      /**
       * @disc: 获取kestore信息
       * @params: file
       * @date: 2019-08-31 16:01
       * @author: Wave
       */
      handleUpload(file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          //console.log(JSON.parse(reader.result));
          this.keystoreInfo = JSON.parse(reader.result);
          this.keystoreInfo.pub = this.keystoreInfo.pubKey;
          this.keystoreInfo.aesPri = this.keystoreInfo.encryptedPrivateKey;
          this.$refs.password.showPassword(true);
        });
        reader.readAsText(file, "utf-8");
      },

      /**
       * @disc: keystore 导入密码框提交
       * @params: password
       * @date: 2019-09-02 10:49
       * @author: Wave
       */
      async keystoreImportPassSubmit(password) {
        let isPassword = passwordVerification(this.keystoreInfo, password);
        if (isPassword.success) {
          let keystoreAddressInfo = defaultAddressInfo;
          keystoreAddressInfo.address = isPassword.address;
          keystoreAddressInfo.aesPri = isPassword.aesPri;
          keystoreAddressInfo.pub = isPassword.pub;
          localStorageByAddressInfo(keystoreAddressInfo);
          this.toUrl('address')
        } else {
          this.$message({message: "密码错误，请输入正确的密码!", type: 'error', duration: 2000});
        }
      },

      /**
       * @disc: 私钥导入账户提交
       * @params: formName
       * @date: 2019-08-31 16:01
       * @author: Wave
       */
      keyImport(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const newAddressInfo = nuls.importByKey(chainID(), this.importForm.keys, this.importForm.pass, this.prefix);
            let keyAddressInfo = defaultAddressInfo;
            keyAddressInfo.address = newAddressInfo.address;
            keyAddressInfo.aesPri = newAddressInfo.aesPri;
            keyAddressInfo.pub = newAddressInfo.pub;
            localStorageByAddressInfo(keyAddressInfo);
            this.toUrl('address')
          } else {
            return false;
          }
        });
      },

      /**
       * @disc: 创建账户提交
       * @params: formName
       * @date: 2019-08-31 16:01
       * @author: Wave
       */
      newAddressSubmitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.newAddressInfo = nuls.newAddress(chainID(), this.newAddressForm.pass, this.prefix);
            let newAddressInfos = defaultAddressInfo;
            newAddressInfos.address = this.newAddressInfo.address;
            newAddressInfos.aesPri = this.newAddressInfo.aesPri;
            newAddressInfos.pub = this.newAddressInfo.pub;
            localStorageByAddressInfo(newAddressInfos);
            this.$router.push({
              name: "backupsAddress",
              query: {'backAddressInfo': newAddressInfos}
            })
          } else {
            return false;
          }
        });
      },

      /**
       * @disc: 连接跳转
       * @params: name
       * @date: 2019-09-02 11:12
       * @author: Wave
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
  .import-address {
    .bg-white {
      height: 130px;
    }
    .new_import {
      margin: -90px auto 100px;
      .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap {
          text-align: center;
          &:after {
            height: 1px;
          }
        }
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            float: none;
            .el-tabs__active-bar {
              height: 0;
            }
            .el-tabs__item {
              text-align: center;
              padding: 0 25px;
              margin: 10px 20px 20px;
              border-radius: 4px;
              &:hover {
                background: linear-gradient(to right, #67C23A, #67C23A);
                color: #FFFFFF;
              }
            }
            .is-active {
              background: linear-gradient(to right, #67C23A, #67C23A);
              color: #FFFFFF;
            }
          }
        }
      }
      .el-tabs__content {
        background-color: #FFFFFF;
        .upload_keystore {
          padding: 100px 0 100px 0;
          border: 1px solid #E4E7ED;
        }

        .form-bnt {
          text-align: center;
          .el-button--success {
            width: 190px;
          }
        }

        .tab {
          border: 1px solid #E4E7ED;
          .import-form {
            margin: 60px auto 100px;
          }
        }
        .new_address {
          border: 1px solid #E4E7ED;
          .w630 {
            margin: 60px auto 100px;
          }
        }
      }
    }
  }
</style>
