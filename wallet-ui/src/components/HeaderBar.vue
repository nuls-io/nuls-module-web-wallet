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
                    <el-menu-item index="contract" disabled>{{$t('nav.contracts')}}</el-menu-item>
                    <!--<el-submenu index="5" disabled>
                      <template slot="title">{{$t('nav.application')}}</template>
                      <el-menu-item index="2-1">应用1</el-menu-item>
                      <el-menu-item index="2-2">应用2</el-menu-item>
                      <el-menu-item index="2-3">应用3</el-menu-item>
                    </el-submenu>-->
                </el-menu>
            </div>
            <div class="tool">
                <el-menu mode="horizontal" :default-active="navActive" @select="handleSelect">
                    <el-submenu index="address" class="user" :disabled="addressList.length === 0" >
                        <template slot="title"><i class="iconfont iconzhanghu"></i></template>
                        <el-menu-item v-for="item in addressList" :key="item.address" :index="item.address" >
                            <i class="iconfont iconwo" :class="item.selection ? '' : 'transparent' "></i>
                            {{item.addresss}}<span v-show="item.alias"> | ({{item.alias}})</span> | <span>{{item.balance}}</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="set">
                        <template slot="title">设置</template>
                        <el-menu-item index="address" class="tc">地址管理</el-menu-item>
                        <el-menu-item index="nodeService" class="tc">服务节点</el-menu-item>
                        <el-menu-item index="address" class="tc" disabled>通讯录</el-menu-item>
                    </el-submenu>
                    <el-submenu index="lang" disabled>
                        <template slot="title">{{this.lang ==="en" ? "Eng":"中文"}}</template>
                        <el-menu-item index="cn">中文</el-menu-item>
                        <el-menu-item index="en">English</el-menu-item>
                    </el-submenu>
                    <li class="el-menu-item">|</li>
                    <el-menu-item index="24" disabled>帮助</el-menu-item>
                </el-menu>

            </div>
        </div>
        <div class="cb"></div>
    </div>

</template>

<script>
  import * as config from '../config.js'
  import logo from './../assets/img/logo.svg'
  //import testnetLogo from './../assets/img/logo-test-black.svg'
  import testnetLogo from './../assets/img/alpha-black.svg'
  import {superLong} from '@/api/util'

  export default {
    data() {
      return {
        logoSvg: config.RUN_DEV ? logo : testnetLogo, //logo
        navActive: '/',//菜单选中
        addressList: [], //地址列表
        lang: 'cn', //语言选择
      };
    },
    components: {},
    created() {
      this.getAddressList();
    },
    mounted() {
      setInterval(() => {
        this.getAddressList();
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
            for (let itmes of this.addressList) {
              //清除选中
              if (itmes.selection) {
                itmes.selection = false;
                localStorage.setItem(itmes.address, JSON.stringify(itmes))
              }
              //添加选中
              if (itmes.address === keyPath[1]) {
                itmes.selection = true;
                localStorage.setItem(itmes.address, JSON.stringify(itmes))
              }
            }
          } else if (keyPath[0] === "set") {
            this.$router.push({
              name: keyPath[1]
            })
          } else if (keyPath[0] === "lang") {
            this.selectLanguage(key)
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
        } else {
          return 'home'
        }
      },

      /**
       * 获取账户列表
       */
      getAddressList() {
        this.addressList = [];
        for (let i = localStorage.length - 1; i >= 0; i--) {
          if (localStorage.getItem(localStorage.key(i)) !== 'SILENT' && localStorage.key(i).length > 10) {
            this.addressList.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
          }
        }
        for (let itmes of this.addressList) {
          itmes.addresss = superLong(itmes.address, 8);
          if (itmes.selection) {
            sessionStorage.clear();
            sessionStorage.setItem(itmes.address, JSON.stringify(itmes))
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
       * @param params
       */
      toUrl(name) {
        //console.log(name,params);
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
            width: 340px;
            margin: 10px 0 0 0;
            float: right;
            background-color: #e6a23c;
            .user {
                .el-submenu__title {
                    .el-icon-arrow-down {
                        margin: 35px 0 0 -16px
                    }
                }
            }
        }
    }
</style>
