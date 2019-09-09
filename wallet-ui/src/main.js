import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import {post} from './api/https'
//浏览器模式注释下面两行代码
/*import VueElectron from 'vue-electron'
Vue.use(VueElectron);*/

Vue.config.productionTip = false;
//定义全局变量
Vue.prototype.$post = post;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
