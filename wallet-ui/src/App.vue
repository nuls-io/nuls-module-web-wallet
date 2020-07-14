<template>
    <div id="app" class="app">
        <HeaderBar>
        </HeaderBar>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
            </router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive">
        </router-view>
        <!--<router-view>
        </router-view>-->
        <BottomBar>
        </BottomBar>
    </div>
</template>

<script>
  import HeaderBar from './components/HeaderBar'
  import BottomBar from './components/BottomBar'

  export default {
    components: {
      HeaderBar,
      BottomBar
    },
    methods: {}
  }
</script>

<style lang="less">
    @import "assets/css/base.less";
    .app {
        background-color: #ffffff;
    }
</style>
