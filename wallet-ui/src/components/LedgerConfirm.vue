<template>
  <div class="ledger-confirm">
    <el-dialog
      :title="$t('ledger.ledger10')"
      :visible.sync="visible"
      top="30vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="$emit('closed')"
    >
      <div class="wrap">
        <img src="../assets/img/ledger.svg" alt="">
        <div class="tip">{{$t('ledger.ledger11')}}</div>
        <div class="error-tip" v-if="errorMsg">
          {{errorMsg}}
        </div>
        <div class="close-btn" @click="$emit('closed')">
          <span>{{$t('ledger.ledger13')}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    errorMsg: String
  },
  data() {
    return {
      //
    };
  },
  methods: {},
};
</script>

<style lang="less">
@import "../assets/css/style";
.ledger-confirm {
  .el-dialog {
    width: 380px;
    .el-dialog__body {
      .wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      img {
        width: 90px;
        height: 30px;
      }
      .tip {
        margin: 20px 0 35px;
        font-size: 16px;
        // font-weight: 600;
        color: @Ncolour;
      }
      .error-tip {
        margin: -15px 0 20px;
        color: #F56C6C;
      }
      .close-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 200px;
        height: 40px;
        border: 1px solid #DFE3EF;
        border-radius: 2px;
        margin-bottom: 30px;
        span {
          color: @labelColor;
        }
      }
    }
  }
}
</style>
