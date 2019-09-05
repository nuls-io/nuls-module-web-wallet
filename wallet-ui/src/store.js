import Vue from 'vue'
import Vuex from 'vuex'
import {defaultData} from '@/config'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addressInfo: {},
    urlData: [],
  },
  mutations: {
    setAddressInfo(state, data) {
      state.addressInfo = data
    },
    setUrlData(state, data) {
      state.urlData = data;
      localStorage.setItem('urlsData', JSON.stringify(data));
    },
  },
  getters: {
    getAddressInfo: state => state.addressInfo,

    getUrlData(state) {
      if (state.urlData.length === 0) {
        state.urlData = localStorage.hasOwnProperty('urlsData') ? JSON.parse(localStorage.getItem('urlsData')) : defaultData;
        localStorage.setItem('urlsData', JSON.stringify(state.urlData));
      }
      return state.urlData
    }
  },
  actions: {}
})
