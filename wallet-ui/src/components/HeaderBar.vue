<template>
  <div class="header">
    <div class="w1200">
      <div class="logo">
        <img class="click" @click="toUrl('home')" :src=logoSvg>
      </div>
      <div class="nav">
        <el-menu mode="horizontal" :default-active="navActives($route.path)" @select="handleSelect">
          <el-menu-item index="home">{{$t('nav.wallet')}}</el-menu-item>
          <el-menu-item index="transfer" :disabled="addressList.length === 0">{{$t('nav.transfer')}}
          </el-menu-item>
          <el-menu-item index="consensus" :disabled="addressList.length === 0">{{$t('nav.consensus')}}
          </el-menu-item>
          <el-menu-item index="contract" :disabled="addressList.length === 0 || !nodeServiceInfo.isRunSmartContract">
            {{$t('nav.contracts')}}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="tool">
        <el-menu mode="horizontal" :default-active="navActive" @select="handleSelect">
          <el-submenu index="address" class="user" :disabled="addressList.length === 0">
            <template slot="title"><i class="iconfont iconzhanghu"></i></template>
            <el-menu-item v-for="item of addressList" :key="item.address" :index="item.address">
              <span :class="item.selection ? 'fCN' : '' ">
                 <i class="iconfont iconwo ico" :class="item.selection ? 'fCN' : 'transparent' "></i>
                <font v-show="!item.alias" class="w100"> {{item.addresss}}</font>
                <span v-show="item.alias" class="w100">{{item.alias}}</span> |
                <span>{{item.balance}}</span>
              </span>

            </el-menu-item>
          </el-submenu>
          <el-submenu index="set">
            <template slot="title">{{$t('nav.set')}}</template>
            <el-menu-item index="address">{{$t('nav.addressList')}}</el-menu-item>
            <el-menu-item index="nodeService">{{$t('nav.nodeList')}}</el-menu-item>
            <el-menu-item index="contact">{{$t('public.bookList')}}</el-menu-item>
            <el-menu-item index="seting">{{$t('public.about')}}</el-menu-item>
          </el-submenu>
          <el-submenu index="lang">
            <template slot="title">{{this.lang ==="en" ? "Eng":"中文"}}</template>
            <el-menu-item index="cn">中文</el-menu-item>
            <el-menu-item index="en">English</el-menu-item>
          </el-submenu>
          <el-submenu index="more">
            <template slot="title"><i class="el-icon-more"></i></template>
            <el-menu-item index="official">{{$t('tab.tab21')}}</el-menu-item>
            <el-menu-item index="explorer">{{$t('tab.tab22')}}</el-menu-item>
            <el-menu-item index="docs">{{$t('tab.tab23')}}</el-menu-item>
          </el-submenu>
        </el-menu>

      </div>
    </div>
    <div class="cb"></div>
  </div>

</template>

<script>
  import logo from '@/assets/img/logo.svg'
  import logoSvg from '@/assets/img/logo-beta.svg'
  import {superLong, chainIdNumber, addressInfo, connectToExplorer} from '@/api/util'
  import {RUN_DEV} from '@/config.js'

  export default {
    data() {
      return {
        logoSvg: RUN_DEV ? logo : logoSvg, //logo
        navActive: '/',//菜单选中
        addressList: [], //地址列表
        lang: 'cn', //语言选择
        nodeServiceInfo: {},
      };
    },
    components: {},
    created() {
      this.getAddressList();
    },
    mounted() {
      setInterval(() => {
        this.getAddressList();
        if (sessionStorage.hasOwnProperty('info')) {
          this.nodeServiceInfo = JSON.parse(sessionStorage.getItem('info'));
        } else {
          this.nodeServiceInfo.isRunCrossChain = false;
          this.nodeServiceInfo.isRunSmartContract = false;
        }
      }, 500)
    },
    methods: {

      /**
       * 菜单导航
       * @param key
       * @param keyPath
       */
      handleSelect(key, keyPath) {
        if (keyPath.length > 1) {
          if (keyPath[0] === "address") {
            for (let item  of this.addressList) {
              //清除选中
              if (item.selection) {
                item.selection = false;
              }
              //添加选中
              if (item.address === keyPath[1]) {
                item.selection = true;
              }
            }
            localStorage.setItem(chainIdNumber(), JSON.stringify(this.addressList));
          } else if (keyPath[0] === "set") {
            this.$router.push({
              name: keyPath[1]
            })
          } else if (keyPath[0] === "lang") {
            this.selectLanguage(key)
          } else if (keyPath[0] === "more") {
            let newUrl = '';
            if (keyPath[1] === 'official') {
              newUrl = 'https://nuls.io/'
            } else if (keyPath[1] === 'explorer') {
              newUrl = RUN_DEV ? 'https://nulscan.io/' : 'http://beta.nulscan.io/'
            } else if (keyPath[1] === 'docs') {
              newUrl = 'https://docs.nuls.io/'
            }
            connectToExplorer('nuls', newUrl);
          }
        } else {
          this.$router.push({
            name: key
          })
        }
      },

      /**
       * 导航栏的选中
       * @param val
       **/
      navActives(val) {
        if (val.indexOf('/transfer') === 0) {
          return 'transfer'
        } else if (val.indexOf('/consensus') === 0) {
          return 'consensus'
        } else if (val.indexOf('/contract') === 0) {
          return 'contract'
        } else {
          return 'home'
        }
      },

      /**
       * 获取账户列表
       */
      getAddressList() {
        this.addressList = addressInfo(0);
        if (this.addressList) {
          for (let item  of this.addressList) {
            item.addresss = superLong(item.address, 8);
          }
        }
      },

      /**
       * 语言切换
       * @param e
       */
      selectLanguage(e) {
        this.lang = e;
        this.$i18n.locale = this.lang;
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        this.$router.push({
          name: name
        })
      },
    },
    watch: {}
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .header {
    border-bottom: 1px solid @Dcolour;
    height: 80px;
    .logo {
      width: 120px;
      float: left;
      img {
        margin: 20px 0 0 0;
        width: 100%;
      }
    }
    .nav {
      width: 600px;
      margin: 10px 0 0 0;
      float: left;
    }
    .tool {
      width: 270px;
      margin: 10px 0 0 0;
      float: right;
      background-color: #e6a23c;
      .user {
        .el-submenu__title {
          .el-icon-arrow-down {
            margin: 35px 0 0 -16px;

          }
        }
      }
    }
  }

  .el-menu--horizontal {
    .ico {
      float: left;
      display: block;
      width: 25px;
    }
    .fCN {
      color: @Ncolour;
    }
    .w100 {
      display: block;
      float: left;
      width: 200px;
    }
  }
</style>
