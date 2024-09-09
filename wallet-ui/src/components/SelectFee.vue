<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <span class="fCN">{{ currentFee }}</span>
      <i v-if="!disabled" class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown" v-if="!disabled">
      <el-dropdown-item
        v-for="item in list"
        :key="item.symbol"
        :command="item.symbol"
        :disabled="!item.enough"
      >
        <div class="fee-between">
          <span>{{ item.symbol }}</span>
          <!-- <span>{{ item.value }}</span> -->
          <span>{{ item.enough ? item.balance: $t('public.InsufficientBalance') }}</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { timesDecimals, divisionDecimals } from "@/api/util";

export default {
  props: {
    currentFee: String,
    feeList: Array,
    assetsList: Array,
    disabled: Boolean,
  },
  computed: {
    list() {
      if (!this.currentFee || !this.feeList.length) return [];
      const list = [];
      this.feeList.map((v) => {
        let item = { ...v, enough: false };
        this.assetsList.map((k) => {
          const key = k.chainId + "-" + k.assetId;
          if (key === v.assetId && !k.contractAddress) {
            item = { ...item, balance: k.balance, enough: k.balance - v.value >= 0 };
          }
        });
        list.push(item);
      });
      return list;
    },
  },
  watch: {
    disabled(val) {
      if (val) {
        this.$emit("change", "NULS");
      }
    },
  },
  mounted() {
    //
  },
  methods: {
    handleCommand(symbol) {
      const fee = this.list.find((v) => v.symbol === symbol);
      if (fee.enough) {
        this.$emit("change", symbol);
      }
    },
  },
};
</script>

<style lang="less">
.fee-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  color: inherit;
  &:hover {
    color: #00db82;
  }
}
</style>
