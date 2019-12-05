<template>
  <div class="contact bg-gray cb">
    <h3 class="title">{{$t('tab.tab12')}}</h3>
    <div class="w1200 mt_20">
      <div class="top_ico">
        <i class="el-icon-plus click" @click="addOrEditContact()"></i>
      </div>
      <el-table :data="contactList" stripe border>
        <el-table-column prop="name" :label="$t('transfer.transfer4')" align="center">
        </el-table-column>
        <el-table-column prop="address" :label="$t('tab.tab11')" align="center" min-width="200">
        </el-table-column>
        <el-table-column prop="alias" :label="$t('address.address3')" align="center">
        </el-table-column>
        <el-table-column :label="$t('address.address5')" align="center" width="350">
          <template slot-scope="scope">
            <label class="click tab_bn" @click="addOrEditContact(scope.row)">{{ $t('tab.tab13')}}</label>
            <span class="tab_line">|</span>
            <label class="click tab_bn" @click="deleteContact(scope.row)">{{ $t('tab.tab14')}}</label>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <div class="page-total">{{$t('public.total')}} {{contactList.length}}</div>
      </div>
    </div>

    <el-dialog :title="$t('tab.tab15')" width="35rem" :visible.sync="contactDialog" class="contact-dialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form :model="contacForm" status-icon :rules="contacRules" ref="contacForm" class="contac-form bg-white">
        <el-form-item :label="$t('transfer.transfer4')" prop="name">
          <el-input v-model.trim="contacForm.name" maxlength="20" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('tab.tab11')" prop="address">
          <el-input v-model.trim="contacForm.address">
          </el-input>
        </el-form-item>
        <div v-show="contacForm.alias">{{$t('address.address3')}}: {{contacForm.alias}}</div>
        <el-form-item class="btn-next">
          <el-button @click="resetForm('contacForm')">{{$t('address.address10')}}</el-button>
          <el-button type="success" @click="submitForm('contacForm')">{{$t('address.address11')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {chainIdNumber, addressInfo} from '@/api/util'

  export default {
    data() {
      let validateName = (rule, value, callback) => {

        if (!value) {
          return callback(new Error(this.$t('tab.tab16')));
        } else {
          callback();
        }
      };
      let validateAddress = (rule, value, callback) => {
        let verify =  nuls.verifyAddress(value);
        if (!value) {
          return callback(new Error(this.$t('tab.tab17')));
        } else if (this.isAdd === 0 && this.isAddressExist(value)) {
          return callback(new Error(this.$t('tab.tab18')));
        } else if(!verify.right){
          return callback(new Error(this.$t('tab.tab18')));
        }else {
          this.getAddressInfo(value);
          callback();
        }
      };
      return {
        contactList: [],//地址列表
        selectContactInfo: '', //操作的地址信息
        contactDialog: false,//备注弹框
        contacForm: {
          name: '',
          address: '',
          alias: '',
        },
        contacRules: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          address: [
            {validator: validateAddress, trigger: 'blur'}
          ]
        },
        isAdd: 0,//添加或编辑 0:添加，1:编辑 2:删除

      };
    },
    created() {
      this.getContactList();
    },
    mounted() {

    },
    methods: {

      /**
       * 判断地址是否已经存在
       * @param address
       **/
      isAddressExist(address) {
        for (let item of this.contactList) {
          if (item.address === address) {
            return true;
          }
        }
        return false;
      },

      /**
       * 获取联系人列表
       */
      getContactList() {
        let defaultAddressInfo = addressInfo(1);
        this.contactList = defaultAddressInfo.hasOwnProperty('contactList') ? defaultAddressInfo.contactList : [];
      },

      /**
       *  移除账户
       * @param rowInfo
       **/
      deleteContact(rowInfo) {
        this.contactList.splice(this.contactList.findIndex(v => v.address === rowInfo.address), 1);
        this.isAdd = 2;
        this.addOrEditMethod();
      },

      /**
       *  编辑账户备注弹框
       * @param rowInfo
       */
      addOrEditContact(rowInfo) {
        this.contactDialog = true;
        if (rowInfo) {
          this.contacForm = rowInfo;
          this.isAdd = 1;
        } else {
          this.isAdd = 0;
        }
      },

      /**
       * 获取地址网络信息
       **/
      async getAddressInfo(address) {
        await this.$post('/', 'getAccount', [address], 'BottomBar')
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.contacForm.alias = response.result.alias
            } else {
              this.contacForm.alias = ''
            }
          }).catch((err) => {
            console.log(err);
            this.contacForm.alias = ''
          })
      },

      /**
       * 联系人表单提交
       **/
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.addOrEditMethod();
            setTimeout(() => {
              this.contacForm.alias = '';
              this.resetForm(formName);
            }, 200)
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      /**
       * 添加或编辑方法
       **/
      addOrEditMethod() {
        let newArr = [];
        newArr.push(this.contacForm);
        let newContacList = [];
        if (this.isAdd === 0) {
          newContacList = [...this.contactList, ...newArr]
        } else {
          newContacList = [...this.contactList];
        }
        //console.log(newContacList);
        let defaultAddressInfo = addressInfo(1);
        let defaultAddressList = addressInfo(0);
        for (let item of defaultAddressList) {
          if (item.address === defaultAddressInfo.address) {
            item.contactList = [];
            item.contactList = [...newContacList];
          }
        }
        localStorage.setItem(chainIdNumber(), JSON.stringify(defaultAddressList));
        setTimeout(() => {
          this.contactDialog = false;
          this.getContactList();
        }, 500);
      },

      /**
       * 连接跳转
       * @param name
       * @param param
       */
      toUrl(name, param) {
        //console.log(name)
        this.$router.push({
          name: name,
          query: {'address': param}
        })
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .contact {
    .el-dialog__body {
      background-color: @Bcolour;
      padding: 30px 20px 50px 20px;
      .contac-form {
        margin: 0 auto 0;
        .el-input__suffix {
          height: 30px;
          line-height: 20px;
          top: 5px;
          .el-input__icon{
            line-height: 20px;
          }
        }
        .btn-next {
          margin: 40px auto 0;
          text-align: center;
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
