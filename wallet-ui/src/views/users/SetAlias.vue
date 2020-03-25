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
    <Password ref="password" @passwordSubmit="passSubmit">
    </Password>
  </div>
</template>

<script>
  import nuls from 'nuls-sdk-js'
  import {inputsOrOutputs, validateAndBroadcast, getPrefixByChainId, commitData} from '@/api/requestData'
  import Password from '@/components/PasswordBar'
  import BackBar from '@/components/BackBar'
  import * as config from '@/config.js'
  import {addressInfo, chainID, getRamNumber} from '@/api/util'

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
        addressInfo: '', //默认账户信息
        balanceInfo: '',//账户余额信息
        prefix: '',//地址前缀
        symbol: sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS', //symbol
        getSetAliasRandomString: '',
        sendSetAliasRandomString: '',
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

      for (let item of addressInfo(0)) {
        if (item.address === this.$route.query.address) {
          this.addressInfo = item;
          //console.log(this.addressInfo)
        }
      }

    },
    mounted() {
      setTimeout(() => {
        this.getNulsBalance(chainID(), 1, this.$route.query.address);
      }, 600);
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.transferForm.fromAddress = this.addressInfo.address
        }
      }
    },
    components: {
      Password,
      BackBar,
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
              let address = this.$route.query.address;
              let addressList = addressInfo(0);
              for (let item of addressList) {
                if (item.address === address) {
                  if (item.aesPri === '') {
                    this.getSetAliasRandomString = await getRamNumber(16);
                    this.sendSetAliasRandomString = await getRamNumber(16);
                    let setAliasHex = await this.setAliasAssemble();
                    if (!setAliasHex.success) {
                      this.$message({message: this.$t('tips.tips3'), type: 'error', duration: 3000});
                      return;
                    }
                    let commitDatas = await commitData(this.getSetAliasRandomString, this.sendSetAliasRandomString, item.address, setAliasHex.data);
                    if (!commitDatas.success) {
                      this.$message({
                        message: this.$t('tips.tips4') + JSON.stringify(commitDatas.data),
                        type: 'error',
                        duration: 3000
                      });
                      return;
                    }
                    this.$refs.password.showScan(commitDatas.data.txInfo, commitDatas.data.assembleHex);
                  } else {
                    this.$refs.password.showPassword(true);
                  }
                }
              }
            } else {
              this.$message({message: this.$t('newConsensus.newConsensus7'), type: 'error', duration: 1000});
            }
          } else {
            return false;
          }
        });
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
        const newAddressInfo = nuls.importByKey(chainID(), pri, password, this.prefix);
        if (newAddressInfo.address === this.addressInfo.address) {
          //根据公钥获取地址
          let burningAddress = nuls.getAddressByPub(chainID(), 1, config.API_BURNING_ADDRESS_PUB, this.prefix);
          //console.log(burningAddress);
          let transferInfo = {
            fromAddress: this.addressInfo.address,
            toAddress: burningAddress,
            assetsChainId: chainID(),
            assetsId: 1,
            amount: 100000000,
            fee: 100000
          };
          let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 3);
          let aliasInfo = {
            fromAddress: this.addressInfo.address,
            alias: this.aliasForm.alias
          };
          let tAssemble = await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, '', 3, aliasInfo);
          let txhex = await nuls.transactionSerialize(nuls.decrypteOfAES(this.addressInfo.aesPri, password), this.addressInfo.pub, tAssemble);
          //console.log(txhex);
          //验证并广播交易
          await validateAndBroadcast(txhex).then((response) => {
            //console.log(response);
            if (response.success) {
              this.toUrl("txList");
            } else {
              this.$message({message: this.$t('error.' + response.data.code), type: 'error', duration: 3000});
            }
          }).catch((err) => {
            this.$message({message: this.$t('public.err0') + err, type: 'error', duration: 1000});
          });
        } else {
          this.$message({message: this.$t('address.address13'), type: 'error', duration: 1000});
        }
      },

      /**
       * @disc: 设置别名交易组装
       * @params:
       * @date: 2019-12-03 14:52
       * @author: Wave
       */
      async setAliasAssemble() {
        //根据燃烧地址公钥获取地址
        let burningAddress = nuls.getAddressByPub(chainID(), 1, config.API_BURNING_ADDRESS_PUB, this.prefix);
        //console.log(burningAddress);
        let transferInfo = {
          fromAddress: this.addressInfo.address,
          toAddress: burningAddress,
          assetsChainId: chainID(),
          assetsId: 1,
          amount: 100000000,
          fee: 100000
        };
        let inOrOutputs = await inputsOrOutputs(transferInfo, this.balanceInfo, 3);
        let aliasInfo = {
          fromAddress: this.addressInfo.address,
          alias: this.aliasForm.alias
        };
        return await nuls.transactionAssemble(inOrOutputs.data.inputs, inOrOutputs.data.outputs, '', 3, aliasInfo);
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
