import Vue from 'vue'
import Vuex from 'vuex'
import storage from './api/storage';
import { defaultNodes, defaultPrefix } from '@/config/index'
import { getCurrentChain } from './api/util';
import { getAllAddressPrefix } from './api/requestData';

Vue.use(Vuex);

const getStorageAccount = (chainId) => {
  const key = `chainId${chainId}`
  const accountList = storage.get(key)
  return accountList || []
}

export default new Vuex.Store({
  state: {
    accountList: [],
    chainList: storage.get('chainList') || defaultNodes,
    currentChain: getCurrentChain(),
    addressPrifix: 'NULS'
  },
  mutations: {
    changeCurrentChain(state, data) {
      state.currentChain = data
      storage.set('currentChain', data)
    },
    changeChainList(state, data) {
      state.chainList = data
      storage.set('chainList', data)
    },
    changeAddressPrefix(state, data) {
      state.addressPrifix = data
    },
    changeAccouuntList(state, list) {
      state.accountList = list
      storage.set(`chainId${state.currentChain.chainId}`, list)
    }
  },
  actions: {
    initChain({ commit, dispatch }) {
      const chainList = storage.get('chainList') || defaultNodes
      const currentChain = getCurrentChain()
      commit('changeChainList', chainList)
      const prefixData = storage.get('prefixData')
      if (!prefixData || !prefixData.length) {
        storage.set('prefixData', defaultPrefix)
      }
      dispatch('changeCurrentChain', currentChain)
    },

    async changeCurrentChain({ commit }, data) {
      commit('changeCurrentChain', data)
      const accountList = getStorageAccount(data.chainId)
      commit('changeAccouuntList', accountList)

      const prefixData = storage.get('prefixData') || []
      const record = prefixData.find(v => v.chainId === data.chainId)
      let prefix = ''
      if (record) {
        prefix = record.addressPrefix
      } else {
        const prefixData = await getAllAddressPrefix()
        storage.set('prefixData', prefixData)
        const record = prefixData.find(v => v.chainId === data.chainId)
        prefix = record ? record.addressPrefix : 'NULS'
      }
      commit('changeAddressPrefix', prefix)
    }
  },
  getters: {
    currentAccount(state) {
      const accountList = state.accountList
      return accountList.find(v => v.selection) || {}
    }
  },
})
