import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import {post} from './api/https'
import storage from './api/storage'
//浏览器模式注释下面两行代码
/*import VueElectron from 'vue-electron'
Vue.use(VueElectron);*/

const lang = storage.get('language')
i18n.locale = lang || 'en'
console.log(lang, 322211)

Vue.config.productionTip = false;
//定义全局变量
Vue.prototype.$post = post;
store.dispatch('initChain')
// var a = storage.get('chainId2')
// console.log(a,212)
// a = a.slice(0,6)
// console.log(a,221)
// storage.set('chainId2', a)

console.log(123)
// storage.remove('chainId2')

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
