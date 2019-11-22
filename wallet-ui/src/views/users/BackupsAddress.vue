<template>
  <div class="new_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('address.address0')"></BackBar>
        <h3 class="title">
          <font>{{$t('newAddress.newAddress1')}} </font>
          <font>:{{newAddressInfo.address}}
            <i class="iconfont iconfuzhi clicks" @click="copy(newAddressInfo.address)"></i>
          </font>
        </h3>
      </div>
    </div>
    <div class="new w1200 mt_20 bg-white">
      <div class="step_tow w630">
        <div class="tip bg-gray">
          <p class="tc" v-if="RUN_PATTERN">{{$t('newAddress.newAddress13')}}</p>
          <p class="tc" v-else>{{$t('newAddress.newAddress131')}}</p>
        </div>
        <div class="btn mb_20">
          <!--<el-button type="success" @click="backKeystore" v-if="RUN_PATTERN">{{$t('newAddress.newAddress16')}}
          </el-button>-->
          <el-button type="success" @click="backKeystore">{{$t('newAddress.newAddress16')}}
          </el-button>
          <el-button type="success" @click="backKey">{{$t('newAddress.newAddress17')}}</el-button>
          <el-button @click="toUrl('home')">{{$t('tab.tab24')}}</el-button>
        </div>

      </div>
    </div>
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
    <el-dialog :title="$t('newAddress.newAddress19')" width="40%"
               :visible.sync="keyDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <span>{{$t('newAddress.newAddress20')}}</span>
      <p class="bg-white">
        {{newAddressInfo.pri}}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="copy(newAddressInfo.pri)">{{$t('newAddress.newAddress21')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'
  import {copys, chainID, passwordVerification} from '@/api/util'
  import {RUN_PATTERN} from '@/config.js'
  import {getPrefixByChainId} from '@/api/requestData'

  export default {
    data() {
      return {
        prefix: '',//地址前缀
        newAddressInfo: {},//备份账户信息
        keyDialog: false, //key弹框
        backType: 0,//备份类型 0：keystore备份 1：明文私钥备份
        RUN_PATTERN: RUN_PATTERN,//运行模式
      };
    },
    created() {
      getPrefixByChainId(chainID()).then((response) => {
        //console.log(response);
        this.prefix = response
      }).catch((err) => {
        console.log(err);
        this.prefix = '';
      });
      this.newAddressInfo = this.$route.query.backAddressInfo;
    },
    mounted() {
    },
    components: {
      Password,
      BackBar
    },
    methods: {

      /**
       * 备份keystore
       **/
      backKeystore() {
        this.backType = 0;
        this.$refs.password.showPassword(true);
      },

      /**
       * 备份私钥
       **/
      backKey() {
        this.backType = 1;
        this.$refs.password.showPassword(true)
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        let isPassword = await passwordVerification(this.newAddressInfo, password,this.prefix);
        if (!isPassword.success) {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 3000});
          return;
        }
        if (this.backType === 0) {
          let FileSaver = require('file-saver');
          let fileInfo = {
            address: isPassword.address,
            encryptedPrivateKey: isPassword.aesPri,
            pubKey: isPassword.pub,
            priKey: null
          };
          let blob = new Blob([JSON.stringify(fileInfo)], {type: "text/plain;charset=utf-8"});
          FileSaver.saveAs(blob, isPassword.address + ".keystore");
        } else {
          this.newAddressInfo.pri = isPassword.pri;
          this.keyDialog = true;
        }
      },

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
        this.keyDialog = false;
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        this.$router.push({
          name: name,
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
      margin-bottom: 100px;
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
          .el-button {
            display: block;
            margin: 0 auto 30px !important;
            width: 400px;
          }
          .mt_20 {
            margin: 100px auto 30px !important;
          }
        }
      }
    }
  }

</style>
