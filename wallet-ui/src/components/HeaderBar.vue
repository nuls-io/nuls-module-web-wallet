<template>
  <div class="header">
    <div class="w1200">
      <div class="logo">
        <img class="click" @click="toUrl('home')" :src=logoSvg>
      </div>
      <div class="nav">
        <el-menu mode="horizontal" :default-active="leftActiveMenu" @select="handleSelect">
          <el-menu-item index="home">{{$t('nav.wallet')}}</el-menu-item>
          <el-menu-item index="transfer" :disabled="addressList.length === 0">{{$t('nav.transfer')}}
          </el-menu-item>
          <el-menu-item index="consensus" :disabled="addressList.length === 0">{{$t('nav.consensus')}}
          </el-menu-item>
          <el-menu-item index="contract" :disabled="addressList.length === 0 || !nodeServiceInfo.isRunSmartContract">
            {{$t('nav.contracts')}}
          </el-menu-item>
          <!-- <el-menu-item index="application">{{$t('nav.application')}}</el-menu-item> -->
        </el-menu>
      </div>
      <div class="tool">
        <el-menu mode="horizontal" :default-active="rightActiveMenu" @select="handleSelect">
          <el-submenu index="address" class="user" :disabled="addressList.length === 0">
            <template slot="title"><i class="iconfont iconzhanghu"></i></template>
            <el-menu-item v-for="item of addressList" :key="item.address" :index="item.address">
              <span :class="item.selection ? 'fCN' : '' ">
                 <i class="iconfont iconwo ico" :class="item.selection ? 'fCN' : 'transparent' "></i>
                <font v-if="item.alias" class="w100"> {{item.alias}}</font>
                <font v-else-if="item.remark" class="w100"> {{item.remark}}</font>
                <font v-else class="w100">{{superLong(item.address)}}</font> |
                <span>{{item.balance}}</span>
              </span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <el-menu mode="horizontal" :default-active="rightActiveMenu" @select="handleSelect">
          <el-submenu index="set">
            <template slot="title">{{$t('nav.set')}}</template>
            <el-menu-item index="address">{{$t('nav.addressList')}}</el-menu-item>
            <el-menu-item index="nodeService">{{$t('nav.nodeList')}}</el-menu-item>
            <el-menu-item index="contact">{{$t('public.bookList')}}</el-menu-item>
            <el-menu-item index="setting">{{$t('public.about')}}</el-menu-item>
          </el-submenu>
        </el-menu>

        <div class="lang-wrap" @click="selectLanguage">
          <span>{{this.lang ==="en" ? "ZH":"EN"}}</span>
        </div>

        <el-menu mode="horizontal" @select="handleSelect" >
          <el-submenu index="more" class="more-nav">
            <template slot="title"><i class="el-icon-more"></i></template>
            <el-menu-item index="official">
              <span class="url-link">{{$t('tab.tab21')}}</span>
            </el-menu-item>
            <el-menu-item index="explorer">
              <span class="url-link">{{$t('tab.tab22')}}</span>
            </el-menu-item>
            <el-menu-item index="docs">
              <span class="url-link">{{$t('tab.tab23')}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </div>
    </div>
    <div class="cb"></div>
  </div>

</template>

<script>
  import logo from '@/assets/img/logo.svg'
  // import logoSvg from '@/assets/img/logo-beta.svg'
  import {superLong, connectToExplorer} from '@/api/util'
  import storage from '@/api/storage'

  export default {
    data() {
      return {
        logoSvg: logo, //logo
        navActive: '/',//菜单选中
        lang: this.$i18n.locale, //语言选择
        nodeServiceInfo: {}
      };
    },
    components: {},
    computed: {
      addressList() {
        return this.$store.state.accountList
      },
      leftActiveMenu() {
        const path = this.$route.path
         if (path === '/transfer') {
          return 'transfer'
        } else if (path ==='/consensus') {
          return 'consensus'
        } else if (path === '/contract') {
          return 'contract'
        } else if (path === '/' || path === '/wallet'){
          return 'home'
        } else {
          return ''
        }
      },
      rightActiveMenu() {
        const path = this.$route.path
         if (path === '/address') {
          return 'address'
        } else if (path === '/nodeService') {
          return 'nodeService'
        } else if (path === '/contract') {
          return 'contact'
        } else if (path === '/setting'){
          return 'setting'
        } else {
          return ''
        }
      }
    },
    mounted() {
      setInterval(() => {
        const info = storage.get('info', 'session')
        if (info) {
          this.nodeServiceInfo = info;
        } else {
          this.nodeServiceInfo.isRunCrossChain = false;
          this.nodeServiceInfo.isRunSmartContract = false;
        }
      }, 500)
    },
    methods: {
      superLong(str, len=8) {
        return superLong(str, len)
      },

      /**
       * 菜单导航
       * @param key
       * @param keyPath
       */
      handleSelect(key, keyPath) {
        if (keyPath.length > 1) {
          if (keyPath[0] === "address") {
            const addressList = [...this.addressList]
            for (let item  of addressList) {
              //清除选中
              if (item.selection) {
                item.selection = false;
              }
              //添加选中
              if (item.address === keyPath[1]) {
                item.selection = true;
              }
            }
            this.$store.commit('changeAccouuntList', addressList)
          } else if (keyPath[0] === "set") {
            this.$router.push({
              name: keyPath[1]
            })
          } else if (keyPath[0] === "more") {
            let newUrl = '';
            if (keyPath[1] === 'official') {
              newUrl = 'https://nuls.io/'
            } else if (keyPath[1] === 'explorer') {
              const currentChain = this.$store.state.currentChain
              newUrl = 'https://nulscan.io/'
              if (currentChain.chainId === 1 || currentChain.chainId === 2) {
                newUrl = currentChain.explorerUrl
              }
            } else if (keyPath[1] === 'docs') {
              newUrl = 'https://docs.nuls.io/'
            }
            connectToExplorer('nuls', newUrl);
          }
        } else if (key === 'lang') {
          this.selectLanguage()
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
        console.log(val, '333')
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
       * 语言切换
       */
      selectLanguage() {
        if (this.lang === 'cn') {
          this.lang = 'en';
        } else {
          this.lang = 'cn';
        }
        this.$i18n.locale = this.lang;
        storage.set('language', this.lang)
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
        width: 100px;
        height: 40px;
      }
    }
    .nav {
      width: 600px;
      margin: 10px 0 0 0;
      float: left;
      .el-menu {
        .el-menu-item {
          padding: 0 15px;
        }
      }
    }
    .tool {
      display: flex;
      align-items: center;
      width: 270px;
      margin: 10px 0 0 0;
      float: right;
      // background-color: #e6a23c;
      .user {
        .el-submenu__title {
          .el-icon-arrow-down {
            margin: 35px 0 0 -16px;

          }
        }
      }
      .lang-wrap {
        margin: 0 15px;
        cursor: pointer;
        &:hover {
          color: @Ncolour;
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
  
    .el-menu .el-menu-item .url-link {
      color: #000 !important;
      &:hover {
        color: @Ncolour !important;
      }
    }
  
</style>
