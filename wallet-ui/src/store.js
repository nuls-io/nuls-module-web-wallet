import Vue from 'vue'
import Vuex from 'vuex'
import {defaultData,RUN_DEV} from '@/config'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addressInfo: {},
    urlData: [],
    height: 0, //最新高度
  },
  mutations: {
    setAddressInfo(state, data) {
      state.addressInfo = data
    },
    setUrlData(state, data) {
      state.urlData = data;
      let urlName = RUN_DEV ? 'mainUrlData' :'TestUrlData';
      localStorage.setItem(urlName, JSON.stringify(data));
    },
    setHeight(state, data) {
      state.height = data;
      sessionStorage.setItem('height', JSON.stringify(data));
    },
  },
  getters: {
    getAddressInfo: state => state.addressInfo,

    getUrlData(state) {
      if (state.urlData.length === 0) {
        let urlName = RUN_DEV ? 'mainUrlData' :'TestUrlData';
        state.urlData = localStorage.hasOwnProperty(urlName) ? JSON.parse(localStorage.getItem(urlName)) : defaultData;
        localStorage.setItem(urlName, JSON.stringify(state.urlData));
      }
      return state.urlData
    },

    getHeight(state) {
      state.height = sessionStorage.hasOwnProperty('height') ? JSON.parse(sessionStorage.getItem('height')) : 0;
      sessionStorage.setItem('height', JSON.stringify(state.height));
      return state.height
    }
  },
  actions: {}
})
