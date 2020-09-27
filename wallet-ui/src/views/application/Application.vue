<template>
  <div class="w1200 apps">

    <div class="cb titles" style="margin-top: 40px">{{$t('application.application0')}}</div>
    <ul class="cb">
      <li>
        <img src="./../../assets/img/community.png"/>
        <p class="title">{{$t('application.application2')}}</p>
        <p class="info">{{$t('application.application3')}}</p>
        <p class="go click" @click="toUrl('community','gov',1)">
          {{$t('application.application4')}}></p>
      </li>
      <li>
        <img src="./../../assets/img/pocm.png"/>
        <p class="title">POCM</p>
        <p class="info">{{$t('application.application5')}}</p>
        <p class="go click" @click="toUrl('pocm','pocm',1)">
          {{$t('application.application4')}}></p>
      </li>
      <li>
        <img src="./../../assets/img/logo.svg"/>
        <p class="title">{{$t('application.application6')}}</p>
        <p class="info">{{$t('application.application7')}}</p>
        <p class="go click" @click="toUrl('nuls',explorerUrl,1)">{{$t('application.application4')}}></p>
      </li>
      <li>
        <img src="./../../assets/img/goole.png"/>
        <p class="title">Google Play Nabox</p>
        <p class="info">{{$t('application.application8')}}</p>
        <p class="go click" @click="toUrl('nuls','https://play.google.com/store/apps/details?id=com.nuls.nabox',1)">
          {{$t('application.application4')}}></p>
      </li>
      <li>
        <img src="./../../assets/img/nabox.png"/>
        <p class="title">Nabox</p>
        <p class="info">{{$t('application.application9')}}</p>
        <p class="go click" @click="toUrl('nuls','http://nabox.io',1)">{{$t('application.application4')}}></p>
      </li>
    </ul>
    <div class="cb" style="height: 50px"></div>

  </div>
</template>

<script>
  import {addressInfo, connectToExplorer} from '@/api/util'
  import {explorerUrl, walletUrl} from '@/config.js'

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
        let urlInfo = window.location.href;
        if (name === 'guessNumber' && urlInfo.includes('beta')) {
          this.$message({message: this.$t('tips.tips24'), type: 'error', duration: 3000});
          return;
        }
        if (type === 0) {
          this.$router.push({
            name: name
          })
        } else {
          if (name === 'community' || name === 'pocm') {
            name = 'nuls';
            parameter = walletUrl + parameter
          }
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
        border: 1px solid #dfe4ef;
        margin: 0 66px 40px 0;
        &:nth-child(4n) {
          margin: 0 0 40px 0;
        }
        img {
          width: 227px;
          height: 97px;
          margin: 10px 10px;
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
