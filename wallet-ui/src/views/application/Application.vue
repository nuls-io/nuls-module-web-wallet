<template>
  <div class="w1200 apps">

    <div class="cb titles" style="margin-top: 40px">团队开发</div>
    <ul class="cb">
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">社区治理</p>
        <p class="info">NULS社区治理工具，1NULS=1票</p>
        <p class="go click" @click="toUrl('nuls','https://gov.nuls.io/',1)">进入></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">POCM</p>
        <p class="info">SCO平台，用NULS挖新项目Token</p>
        <p class="go click" @click="toUrl('nuls','https://pocm.nuls.io/',1)">进入></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">浏览器</p>
        <p class="info">您想要看到NULS网络上的信息，在这里都能找到</p>
        <p class="go click" @click="toUrl('nuls',explorerUrl,1)">进入></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">Google play Nabox</p>
        <p class="info">NULS的移动端钱包（使用Google play的用户可下载）</p>
        <p class="go click" @click="toUrl('nuls','https://play.google.com/store/apps/details?id=com.nuls.nabox',1)">
          进入></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">Nabox</p>
        <p class="info">NULS的移动端钱包（所有Android用户均可下载使用）</p>
        <p class="go click" @click="toUrl('nuls','http://nabox.io',1)">进入></p>
      </li>
    </ul>

    <div class="cb titles">社区开发</div>
    <ul>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">NULS猜数字</p>
        <p class="info">基于NULS随机数开发的猜数游戏</p>
        <p class="go click" @click="toUrl('guessNumber','',0)">进入></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">可锁定NULS交易</p>
        <p class="info">可自定义锁定时间的NULS转账交易</p>
        <p class="go click" @click="toUrl('lockedTransfer','',0)">进入></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">一对多转账交易</p>
        <p class="info">可以一对多转账交易支持导入</p>
        <p class="go click" @click="toUrl('oneToMore','',0)">进入></p>
      </li>
    </ul>

    <div class="cb" style="height: 50px"></div>
  </div>
</template>

<script>
  import {addressInfo, connectToExplorer} from '@/api/util'
  import {explorerUrl} from '@/config.js'

  export default {
    data() {
      return {
        explorerUrl: explorerUrl,
        addressInfo: '', //默认账户信息
      };
    },
    created() {
      this.addressInfo = addressInfo(1);
    },
    mounted() {
    },
    watch: {},
    methods: {

      /**
       * 连接跳转
       * @param name
       * @param parameter 参数
       * @param type 类型 0:路由跳转 1:外部链接
       */
      toUrl(name, parameter, type) {
        if (type === 0) {
          this.$router.push({
            name: name
          })
        } else {
          connectToExplorer(name, parameter)
        }

      },
    },

  }
</script>

<style lang="less">
  .apps {
    .titles {
      font-size: 16px;
      line-height: 30px;
      height: 30px;
      text-align: left;
      font-weight: bold;
      color: #17202e;
      border-bottom: 1px solid #c0c4cc;
      margin: 10px 0 20px 0;
    }
    ul {
      li {
        width: 250px;
        float: left;
        height: 240px;
        border: 1px solid #c0c4cc;
        margin: 0 66px 40px 0;
        &:nth-child(4n) {
          margin: 0 0 40px 0;
        }
        img {
          width: 200px;
          height: 90px;
          margin: 10px 20px;
          text-align: center;
        }
        p {
          padding: 0 10px;
          line-height: 30px;
        }
        .title {
          text-align: left;
          font-weight: bold;
          font-size: 14px;
          height: 30px;
        }
        .info {
          font-size: 12px;
          line-height: 20px;
          height: 50px;
        }
        .go {
          text-align: right;
          font-size: 14px;
        }
      }
    }
  }

</style>
