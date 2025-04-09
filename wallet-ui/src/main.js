import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import {post} from './api/https'
import storage from './api/storage'
import { toThousands } from './api/util'

/*import VueElectron from 'vue-electron'
Vue.use(VueElectron);*/

const lang = storage.get('language')
i18n.locale = lang || 'en'
// console.log(lang, 32211)

Vue.config.productionTip = false;

Vue.prototype.$post = post;
Vue.prototype.$toThousands = toThousands
store.dispatch('initChain')
// var a = storage.get('chainId2')
// console.log(a,212)
// a = a.slice(0,6)
// console.log(a,221)
// storage.set('chainId2', a)

// storage.remove('chainId2')

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
