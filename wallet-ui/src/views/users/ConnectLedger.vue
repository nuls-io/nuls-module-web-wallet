<template>
  <div class="new_address connect-ledger">
    <div
      class="w630"
      v-loading="loading && !accounts.length"
      element-loading-spinner="el-icon-loading"
    >
      <template v-if="!accounts.length">
        <div class="connect-wrap">
          <h3 class="tc">{{ $t("ledger.ledger2") }}</h3>
          <div class="ledger-logo">
            <img src="../../assets/img/ledger.svg" alt="" />
          </div>
          <h4>{{ $t("ledger.ledger3") }}</h4>
          <p class="before-connect">{{ $t("ledger.ledger4") }}</p>
          <div class="next tc">
            <el-button type="success" @click="getAccounts">{{
              $t("public.next")
            }}</el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="connect-wrap">
          <p class="choose-account">{{ $t('ledger.ledger7') }}</p>
          <div class="address-wrap" v-infinite-scroll="next">
            <template v-for="item in accounts">
              <div class="address-item" :key="item.address" :class="{disabled: item.disabled}" @click="changeSelect(item)">
                <div class="icon-wrap" :class="{selected : item.selected, disabled: item.disabled}">
                  <div class="dot" v-if="item.selected"></div>
                </div>
                <!-- <el-checkbox size="medium" v-if="item.disabled" :value="true" :disabled="item.disabled" /> -->
                <!-- <el-checkbox size="medium" v-else v-model="item.selected" @change="(status) => changeSelect(status, item)" /> -->
                <span class="account-index">{{ item.index + 1 }}</span>
                <span>{{item.address}}</span>
              </div>
            </template>
            <p class="tc" style="margin-top: 10px">
              <span class="el-icon-loading" v-if="loading"></span>
            </p>
          </div>
          <!-- <div class="pagination">
            <span :class="['click', { disabled: pageIndex === 1 }]" @click="previous">{{ $t('ledger.ledger8') }}</span>
            <span class="click" @click="next">{{ $t('ledger.ledger9') }}</span>
          </div> -->
          <div class="tc">
            <el-button :disabled="!selectedAccounts.length" @click="confirmConnect" type="success">{{ $t('public.confirm') }}</el-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import NULSLedger from "@/api/ledger/nulsLedger";
import { superLong, defaultAddressInfo } from "@/api/util";
import sdk from 'nuls-sdk-js/lib/api/sdk'
import ledgerMixin from '@/mixins/ledgerMixin'

export default {
  props: {
    active: Boolean
  },
  mixins: [ledgerMixin],
  data() {
    return {
      step: 1, // 1 选择连接，2 选择账户，3 未找到设备
      ledger: null,
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      accounts: [], // 当前获取的账户
      selectedAccounts: [], // 已选择连接账户
      address: "",
    };
  },
  computed: {
    accountList() {
      return this.$store.state.accountList;
    },
    currentChain() {
      return this.$store.state.currentChain
    }
  },
  watch: {
    active(val){
      if (!val) {
        this.loading = false
        this.pageIndex = 1
        this.accounts = []
        this.selectedAccounts = []
      }
    }
  },
  created() {
    this.ledger = new NULSLedger();
  },
  methods: {
    async handleMessage(data) {
      const { success, result } = data
      if (success) {
        const { chainId, prefix } = this.currentChain
        const accounts = result.map((account, i) => {
          const address = sdk.getStringAddress(chainId, '', account.publicKey, prefix)
          return {
            address,
            pub: account.publicKey,
            selected: this.checkIsSelected(address),
            disabled: this.checkIsAlreadyConnect(address),
            index: i + (this.pageIndex - 1) * this.pageSize,
          }
        });
        this.accounts = this.accounts.concat(accounts)
      }
      this.loading = false;
    },
    async getAccounts() {
      this.loading = true;
      this.requestAccount({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }, this.handleMessage)
    },
    checkIsAlreadyConnect(address) {
      return !!this.accountList.find((v) => v.address === address);
    },
    checkIsSelected(address) {
      return !!this.accountList.find((v) => v.address === address);
    },
    changeSelect(account) {
      if (account.disabled) {
        return;
      }
      account.selected = !account.selected
      // console.log(this.accounts, 33)
      const status = account.selected
      if (status) {
        this.selectedAccounts.push(account);
      } else {
        const list = [...this.selectedAccounts];
        const index = list.findIndex((v) => v.address === account.address);
        list.splice(index, 1);
        this.selectedAccounts = list;
      }
    },
    previous() {
      if (this.pageIndex === 1) {
        return;
      }
      this.pageIndex--;
      this.getAccounts();
    },
    next() {
      if (this.loading) {
        return;
      }
      this.pageIndex++;
      this.getAccounts();
    },
    async confirmConnect() {
      this.loading = true;
      const accountList = [...this.accountList];
      accountList.map((v) => (v.selection = false));
      const newAccounts = this.selectedAccounts.map((v, i) => {
        const account = {...defaultAddressInfo}
        account.address = v.address;
        account.aesPri = "";
        account.pub = v.pub;
        account.isNULSLedger = true;
        account.selection = i + 1 === this.selectedAccounts.length;
        account.pathIndex = v.index
        return account
      });
      accountList.push(...newAccounts);
      // console.log(accountList, 33322, this.selectedAccounts, newAccounts)
      this.$store.commit("changeAccouuntList", accountList);
      this.loading = false;
      this.$router.push({
        name: "address",
      });
    },
    superLong(str, len = 8) {
      return superLong(str, len);
    },
  },
};
</script>

<style lang="less">
@import "../../assets/css/style.less";
.connect-ledger {
  * {
    color: @subText;
    font-size: 16px;
  }
  .connect-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h4 {
    margin-bottom: 10px;
  }
  .ledger-logo {
    width: 400px;
    height: 150px;
    background-color: #F9FBFF;
    margin: 35px 0;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 228px;
      height: 77px;
    }
  }
  .before-connect {
    color: @labelColor;
  }
  .el-button {
    margin-top: 50px;
    width: 390px;
    span {
      color: #fff !important;
    }
  }
  .choose-account {
    font-size: 16px;
    margin-bottom: 35px;
  }
  .address-wrap {
    height: 380px;
    overflow-y: auto;
  }
  .address-item {
    display: flex;
    align-items: center;
    width: 520px;
    height: 48px;
    background: #F9FBFF;
    border: 1px solid @Dcolour;
    margin-bottom: 12px;
    padding: 0 16px;
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      // pointer-events: none;
    }
    .el-checkbox {
      margin-right: 8px;
    }
    .icon-wrap {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid @Dcolour;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      &.selected {
        border-color: @Ncolour;
      }
      &.disabled {
        opacity: 0.7;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: @Ncolour;
      }
    }
    .account-index {
      width: 30px;
    }
  }
  .el-icon-loading {
    color: #409EFF;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
    span {
      margin: 0 5px;
      color: @Ncolour;
    }
    .disabled {
      cursor: not-allowed;
      // color: #C0C4CC;
      opacity: 0.3;
    }
  }
  .el-checkbox {
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      border-color: @Ncolour;
      background-color: @Ncolour;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: @Ncolour;
    }
    .el-checkbox__inner:hover {
      border-color: @Ncolour;
    }
    
  }
}
</style>
