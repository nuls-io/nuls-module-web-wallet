<template>
    <div class="back" :backUrl="backUrl">
      <span class="back-box" @click="back"><i class="el-icon-arrow-left"></i><span>{{backTitle}}</span></span>
    </div>
</template>

<script>
  export default {
    props: {
      backTitle: {
        type: String,
        default: ""
      },
      backUrl: {
        type: String,
        default: "1"
      },
      backParams: {
        type: String,
        default: ''
      }
    },
    methods: {
      back() {
        if (this.backUrl === "1") {
          this.$router.go(-1);
        } else {
          this.$router.push({
            name: this.backUrl,
          })
        }
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import url("../assets/css/style.less");
    .back {
      font-size: 16px;
      cursor: pointer;
      margin: 10px 0;
      height: 20px;
      text-align: left;
      width: 200px;
      &:hover{
        color:@Hcolour;
       }
    }
  @media screen and (max-width: 768px) {
    .back {
      margin: 10px 0;
    }
  }
</style>
