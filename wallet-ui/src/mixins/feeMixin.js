import storage from "../api/storage";
import {
  chainID,
  divisionDecimals,
  timesDecimals,
  Plus
} from "../api/util";
import { NSymbol, NDecimals, DEFAULT_FEE, FEE_PERKB, NDiffDeciamsl } from '@/constants/constants'


function getDefaultFeeList() {
  const chainId = chainID();
  if (chainId === 2) {
    return [
      {
        assetId: "2-1",
        symbol: NSymbol,
        decimals: NDecimals,
        feePerKB: FEE_PERKB,
        scFeeFoefficient: "1",
      },
    ];
  } else {
    return [
      {
        assetId: "1-1",
        symbol: NSymbol,
        decimals: NDecimals,
        feePerKB: FEE_PERKB,
        scFeeFoefficient: "1",
      },
    ];
  }
}

export default {
  data() {
    this.feeKey = "feeList" + chainID();
    return {
      txSize: 1,
      currentFee: NSymbol,
      NULSTxFeeValue: DEFAULT_FEE,
      NULSGasFeeValue: 0,
      feeValue: DEFAULT_FEE,
      feeList: [],
      disableSelectFee: false,
    };
  },
  computed: {
    computedFeeList() {
      const list = [];
      this.feeList.map((v) => {
        const txFeeValue = this.getTxFeeValue(v);
        const gasFeeValue = this.getGasFeeValue(v);
        list.push({ ...v, value: Plus(txFeeValue, gasFeeValue).toFixed() });
      });
      return list;
    },
    feeInfo() {
      const fee = this.computedFeeList.find(
        (v) => v.symbol === this.currentFee
      );
      return fee || {};
    },
    // txFeeValue() {
    //   return this.getTxFeeValue(this.feeInfo)
    // },
    // gasFeeValue() {
    //   return this.getGasFeeValue(this.feeInfo)
    // },
    totalFeeValue() {
      return this.feeInfo.value;
    },
  },
  mounted() {
    this.getStoreFeeList();
    this.getApiFeeList();
  },
  methods: {
    async getStoreFeeList() {
      let list = storage.get(this.feeKey);
      if (!list) {
        list = getDefaultFeeList();
        storage.set(this.feeKey, list);
      }
      this.feeList = list;
    },

    async getApiFeeList() {
      const result = await this.$post("/", "getChainFeeSetting", []);
      if (result.result && result.result.length) {
        const list = result.result
        list.map(v => {
          if (v.symbol === 'NULS') {
            v.symbol = NSymbol
            // v.feePerKB = timesDecimals(v.feePerKB, NDiffDeciamsl)
            v.decimals = NDecimals
          }
        })
        this.feeList = list;
        storage.set(this.feeKey, this.feeList);
      }
    },

    getTxFeeValue(feeInfo) {
      if (feeInfo.symbol === NSymbol) {
        return this.NULSTxFeeValue;
      }
      const size = this.txSize;
      const { feePerKB, decimals } = feeInfo;
      const value = divisionDecimals(Math.ceil(size * feePerKB), decimals);
      return value;
    },

    getGasFeeValue(feeInfo) {
      const { scFeeFoefficient, decimals } = feeInfo;
      const NULSGasBig = timesDecimals(this.NULSGasFeeValue, NDecimals);
      return divisionDecimals(
        Math.ceil(NULSGasBig * scFeeFoefficient),
        decimals
      );
    },

    changeCurrentFee(feeSymbol) {
      this.currentFee = feeSymbol;
    },

    changeNULSTxFeeValue(val) {
      this.NULSTxFeeValue = val;
    },

    changeNULSGasFeeValue(val) {
      this.NULSGasFeeValue = val;
    },

    changeTxSize(val) {
      this.txSize = val;
    },
  },
};
