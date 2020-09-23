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
        <el-tab-pane :label="$t('tips.tips10')" name="scanImport">
          <div class="scan tc">
            <div id="qrcode" class="qrcode"></div>
            <div class="font12" style="margin: 20px 0 0 0">
              {{$t('tips.tips18')}}
              <span class="click td" @click="toUrl('http://nabox.io/',1)">Nabox</span>
              /
              <span class="click td" @click="toUrl('https://www.denglu1.cn/',1)">{{$t('tips.tips11')}}</span>
              {{$t('tips.tips19')}}
            </div>
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
  import QRCode from 'qrcodejs2'
  import {
    chainID,
    defaultAddressInfo,
    localStorageByAddressInfo,
    passwordVerification,
    getRamNumber,
    timesDecimals,
    Plus,
    connectToExplorer
  } from '@/api/util'
  import {getPrefixByChainId} from '@/api/requestData'
  import Password from '@/components/PasswordBar'

  export default {
    data() {
      let validateKeys = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('importAddress.importAddress9')));
        } else if (value.length < 60 || value.length > 66) {
          callback(new Error(this.$t('importAddress.importAddress91')));
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
      let validateAgreement = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('newAddress.newAddress29')));
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
        importRandomString: '',//扫描导入随机字符串

        newAddressForm: {
          pass: '',
          checkPass: '',
          agreement: false
        },
        newAddressRules: {
          pass: [
            {validator: validateNewPass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validateNewCheckPass, trigger: 'blur'}
          ],
          agreement: [
            {validator: validateAgreement, trigger: 'blur'}
          ],
        },
        newAddressInfo: {},//创建地址信息
        scanImportInterval: null,
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
      this.activeName = this.resetAddress !== '0' ? 'keyImport' : 'keystoreImport';
    },
    mounted() {
      this.ramNumber();
    },
    beforeDestroy() {
      clearInterval(this.scanImportInterval);
    },
    methods: {

      /**
       * @disc: 生成扫描登录的二维码
       * @date: 2019-12-02 16:38
       * @author: Wave
       */
      async ramNumber() {
        if (!this.importRandomString) {
          this.importRandomString = await getRamNumber(16);
        }
        let scanInfo = {
          url: localStorage.hasOwnProperty('url') ? JSON.parse(localStorage.getItem('url')).urls : 'https://beta.wallet.nuls.io/api',
          send: this.importRandomString,
        };
        console.log(this.importRandomString);
        let qrcode = new QRCode('qrcode', {
          width: 250,
          height: 250,
          colorDark: "#000000",
          colorLight: "#ffffff",
        });
        qrcode.makeCode(JSON.stringify(scanInfo))
      },

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
        } else if (tab.name === 'scanImport') {
          this.scanImportInterval = setInterval(() => {
            this.getScanImport(this.importRandomString);
          }, 3000);
        } else {
          this.keystoreInfo = {};
          this.importAddressInfo = {};
          this.$refs['importForm'].resetFields();
        }
      },

      /**
       * @disc: 获取扫描导入后的信息
       * @params: importRandomString
       * @date: 2019-12-02 16:39
       * @author: Wave
       */
      async getScanImport(importRandomString) {
        await this.$post('/', 'getMsg', [importRandomString])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              let addressInfo = {address: response.result.address, aesPri: '', pub: ''};
              this.getAddressInfo(addressInfo);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },

      /**
       * 获取地址NULS资产信息
       * @param addressInfo
       **/
      async getAddressInfo(addressInfo) {
        await this.$post('/', 'getAccountLedgerList', [addressInfo.address])
          .then((response) => {
            //console.log(response);
            let newAssetsList = {
              address: addressInfo.address,
              aesPri: addressInfo.aesPri,
              pub: addressInfo.pub,
              remark: ''
            };
            if (response.hasOwnProperty("result")) {
              newAssetsList.account = response.result[0].symbol;
              newAssetsList.chainId = response.result[0].chainId;
              newAssetsList.assetId = response.result[0].assetId;
              newAssetsList.type = 1;
              newAssetsList.balance = Number(timesDecimals(response.result[0].balance)).toFixed(3);
              newAssetsList.locking = Number(timesDecimals(Plus(response.result[0].consensusLock, response.result[0].timeLock))).toFixed(3);
              newAssetsList.total = response.result[0].totalBalance !== 0 ? Number(timesDecimals(response.result[0].totalBalance)).toFixed(3) : 0;
            } else {
              newAssetsList.account = response.result.symbol;
              newAssetsList.chainId = response.result.chainId;
              newAssetsList.assetId = response.result.assetId;
              newAssetsList.type = 1;
              newAssetsList.total = 0;
              newAssetsList.locking = 0;
              newAssetsList.balance = 0;
            }
            localStorageByAddressInfo(newAssetsList);
            this.toUrl('address')
          })
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
        let isPassword = passwordVerification(this.keystoreInfo, password, this.prefix);
        if (isPassword.success) {
          let keystoreAddressInfo = defaultAddressInfo;
          keystoreAddressInfo.address = isPassword.address;
          keystoreAddressInfo.aesPri = isPassword.aesPri;
          keystoreAddressInfo.pub = isPassword.pub;
          localStorageByAddressInfo(keystoreAddressInfo);
          this.toUrl('address')
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 3000});
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
            if (newAddressInfo.hasOwnProperty('success') && !newAddressInfo.success) {
              this.$message({message: newAddressInfo.data, type: 'error', duration: 3000});
              return;
            }
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
      toUrl(name, type = 0) {
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
        .scan {
          width: 100%;
          min-height: 500px;
          margin: 0 auto;
          padding: 80px 0 0 0;
          border: 1px solid #E4E7ED;
          .qrcode {
            width: 250px;
            margin: 0 auto;
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
