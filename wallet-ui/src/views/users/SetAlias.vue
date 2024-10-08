<template>
  <div class="new_address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <BackBar :backTitle="$t('address.address0')"></BackBar>
        <h3 class="title">{{$t('setAlias.setAlias0')}}</h3>
      </div>
    </div>
    <div class="new w1200 mt_20 bg-white">
      <div class="w630">
        <h3 class="tc mzt_20">{{this.$route.query.address}}</h3>
        <div class="tip bg-gray">
          <p>• {{$t('setAlias.setAlias1')}}{{symbol}}{{$t('setAlias.setAlias11')}}</p>
          <p>• {{$t('setAlias.setAlias2')}}{{symbol}}</p>
        </div>
        <el-form :model="aliasForm" status-icon :rules="aliasRules" ref="aliasForm" class="mb_20">
          <el-form-item :label="$t('public.alias')" prop="alias">
            <span class="balance font12 fr">{{$t('public.usableBalance')}}：{{addressInfo.balance}} <font class="fCN">{{symbol}}</font></span>
            <el-input type="text" v-model="aliasForm.alias" maxlength="20" autocomplete="off"></el-input>
          </el-form-item>
          <div class="div-data font14">
            {{$t('public.fee')}}: <label>0.001 <span class="fCN">{{symbol}}</span></label>
          </div>
          <el-form-item class="form-next">
            <el-button type="success" @click="submitAliasForm('aliasForm')"> {{$t('public.next')}}</el-button>
          </el-form-item>
          <div class="tc font18 mzt_20">
            {{$t('setAlias.setAlias3')}}: 1.001 <span class="fCN">{{symbol}}</span>
          </div>
        </el-form>
      </div>
    </div>
    <Password ref="password" @passwordSubmit="passSubmit" />
    <LedgerConfirm :visible="ledgerVisible" @closed="ledgerVisible=false" :errorMsg="ledgerErrorMsg" />
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {inputsOrOutputs, validateAndBroadcast} from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'
  import ledgerMixin from '@/mixins/ledgerMixin'
  import LedgerConfirm from '@/components/LedgerConfirm'
  import { black_address } from '@/config/index'

  export default {
    data() {
      let validateAlias = (rule, value, callback) => {
        let patrn = /^(?!_)(?!.*?_$)[a-z0-9_]+$/;
        if (value === '') {
          callback(new Error(this.$t('setAlias.setAlias4')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('setAlias.setAlias5')));
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
        addressInfo: {},
        balanceInfo: '',//账户余额信息
        symbol: sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS', //symbol
        getSetAliasRandomString: '',
        sendSetAliasRandomString: '',
      };
    },
    mixins: [ledgerMixin],
    mounted() {
      if (!this.accountList.length) {
        return;
      }
      const address = this.$route.query.address
      this.addressInfo = this.accountList.find(v => v.address === address)
      this.getNulsBalance(this.currentChain.chainId, 1, address);
    },
    computed: {
      accountList() {
        return this.$store.state.accountList
      },
      currentChain() {
        return this.$store.state.currentChain
      },
      blackAddress() {
        const currentChain = this.currentChain
        return black_address[currentChain.chainId]
      }
    },
    components: {
      Password,
      BackBar,
      LedgerConfirm
    },
    methods: {

      /**
       * 设置别名
       * @param formName
       */
      submitAliasForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.balanceInfo.balance > 100100000) {
              if (this.addressInfo.isNULSLedger) {
                this.handleSign()
              } else {
                this.$refs.password.showPassword(true);
              }
            } else {
              this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
            }
          } else {
            return false;
          }
        });
      },

      async handleSign() {
        try {
          const tAssemble = await this.getAssemble()
          const unSignedHex = tAssemble.txSerialize().toString('hex')
          this.signByLedger(unSignedHex, this.addressInfo.pathIndex, this.handleMessage)
        } catch (e) {
          this.$message({message: e.message || e, type: 'error', duration: 1000});
        }
      },

      async getAssemble() {
        const transferInfo = {
          fromAddress: this.addressInfo.address,
          toAddress: this.blackAddress,
          assetsChainId: this.currentChain.chainId,
          assetsId: 1,
          amount: 100000000,
          fee: 100000
        };
        const inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 3);
        const aliasInfo = {
          fromAddress: this.addressInfo.address,
          alias: this.aliasForm.alias
        };
        const tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, '', 3, aliasInfo);
        return tAssemble
      },

      handleMessage(data) {
        if (data.success) {
          this.broadcastTx(data.result)
        }
      },

      async broadcastTx(txHex) {
        //验证并广播交易
        const response = await validateAndBroadcast(txHex)
        if (response.success) {
          this.toUrl("address");
        } else {
          this.$message({message: this.$t('error.' + response.data.code), type: 'error', duration: 3000});
        }
      },

      /**
       * 获取转出账户余额信息
       *  @param chainId
       *  @param assetsId
       *  @param address
       **/
      async getNulsBalance(chainId, assetsId, address) {
        await this.$post('/', 'getAccountBalance', [chainId, assetsId, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.balanceInfo = {'balance': response.result.balance, 'nonce': response.result.nonce};
              //this.$refs.password.showPassword(true);
            } else {
              this.$message({message: this.$t('public.err2') + response, type: 'error', duration: 1000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
          });
      },

      /**
       *  获取密码框的密码
       * @param password
       **/
      async passSubmit(password) {
        const pri = nuls.decrypteOfAES(this.addressInfo.aesPri, password);
        const newAddressInfo = nuls.importByKey(this.currentChain.chainId, pri, password, this.$store.state.prefix);
        if (newAddressInfo.address === this.addressInfo.address) {
          const tAssemble = await this.getAssemble()
          const txHex = await nuls.transactionSerialize(pri, this.addressInfo.pub, tAssemble);
          this.broadcastTx(txHex)
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
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
