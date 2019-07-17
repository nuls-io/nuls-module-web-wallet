import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addressInfo:{}
  },
  mutations: {
    setAddressInfo (state, data) {
      state.addressInfo = data
    },
  },
  getters:{
    getAddressInfo: state => state.addressInfo,
  },
  actions: {

  }
})
