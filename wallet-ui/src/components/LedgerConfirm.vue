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

      <img src="../assets/img/ledger.svg" alt="">
      <div class="tip">{{$t('ledger.ledger11')}}</div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
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
.ledger-confirm {
  .el-dialog {
    width: 370px;
    .el-dialog__body {
      background-color: #f5f6f9 !important;
      padding: 30px 20px 30px 20px !important;
      img {
        width: 120px;
      }
      .tip {
        padding-top: 10px;
        font-size: 15px;
        // font-weight: 600;
        color: #000;
      }
    }
  }
  .el-dialog .el-dialog__header .el-dialog__headerbtn {
    // display: none;
  }
}
</style>
