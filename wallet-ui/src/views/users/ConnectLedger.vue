<template>
  <div class="new_address connect-ledger">
    <div
      class="w630"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
    >
      <template v-if="!accounts.length">
        <h3>{{ $t("ledger.ledger2") }}</h3>
        <div class="ledger-logo">
          <img src="../../assets/img/ledger.svg" alt="" />
        </div>
        <h4>{{ $t("ledger.ledger3") }}</h4>
        <p>{{ $t("ledger.ledger4") }}</p>
        <div class="next tc">
          <el-button type="success" @click="getAccounts">{{
            $t("public.next")
          }}</el-button>
        </div>
      </template>
      <template v-else>
        <p class="choose-account">{{ $t('ledger.ledger7') }}</p>
        <div class="address-wrap">
          <template v-for="item in accounts">
            <div class="address-item" :key="item.address">
              <el-checkbox size="medium" v-if="item.disabled" :value="true" :disabled="item.disabled" />
              <el-checkbox size="medium" v-else v-model="item.selected" @change="(status) => changeSelect(status, item)" />
              <span style="width: 20px">{{ item.index + 1 }}</span>
              <span>{{ superLong(item.address) }}</span>
            </div>
          </template>
        </div>
        <div class="pagination">
          <span :class="['click', { disabled: pageIndex === 1 }]" @click="previous">{{ $t('ledger.ledger8') }}</span>
          <span class="click" @click="next">{{ $t('ledger.ledger9') }}</span>
        </div>
        <div class="tc">
          <el-button :disabled="!selectedAccounts.length" @click="confirmConnect" type="success">{{ $t('public.confirm') }}</el-button>
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
      pageSize: 5,
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
        this.accounts = result.map((account, i) => {
          const address = sdk.getStringAddress(chainId, '', account.publicKey, prefix)
          return {
            address,
            pub: account.publicKey,
            selected: this.checkIsSelected(address),
            disabled: this.checkIsAlreadyConnect(address),
            index: i + (this.pageIndex - 1) * this.pageSize,
          }
        });
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
    changeSelect(status, account) {
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
.connect-ledger {
  * {
    color: #606266;
    font-size: 14px;
  }
  h4 {
    color: #000;
    font-size: 15px;
    font-weight: 600;
    margin: 10px 0;
  }
  .ledger-logo {
    background-color: #f2f4f6;
    margin: 20px 0;
    width: 200px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    img {
      width: 100%;
    }
  }
  .el-button {
    margin-top: 20px;
    width: 190px;
    span {
      color: #fff !important;
    }
  }
  .choose-account {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .address-wrap {
      margin-bottom: 10px;
    }
    .address-item {
      display: flex;
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid #d6d9dc;
      .el-checkbox {
        margin-right: 8px;
      }
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
      span {
        margin: 0 5px;
        color: #7db46d;
      }
      .disabled {
        cursor: not-allowed;
        // color: #C0C4CC;
        opacity: 0.3;
      }
    }
    .el-checkbox {
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        border-color: #7db46d;
        background-color: #7db46d;
      }
      .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #7db46d;
      }
      .el-checkbox__inner:hover {
        border-color: #7db46d;
      }
      
    }
}
</style>
