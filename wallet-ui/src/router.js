import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'home',
      component: resolve => require(['@/views/Home.vue'], resolve)
    },
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/views/Home.vue'], resolve)
    },
    {
      path: '/wallet',
      name: 'home',
      component: resolve => require(['@/views/Home.vue'], resolve)
    },
    {
      path: '/wallet/frozenList',
      name: 'frozenList',
      component: resolve => require(['@/views/users/FrozenList.vue'], resolve)
    },
    {
      path: '/wallet/txList',
      name: 'txList',
      component: resolve => require(['@/views/users/TxList.vue'], resolve),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/wallet/tokenTxList',
      name: 'tokenTxList',
      component: resolve => require(['@/views/users/TokenTxList.vue'], resolve),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: resolve => require(['@/views/transfer/Transfer.vue'], resolve)
    },
    {
      path: '/transfer/transferInfo',
      name: 'transferInfo',
      component: resolve => require(['@/views/transfer/TransferInfo.vue'], resolve)
    },
    {
      path: '/consensus',
      name: 'consensus',
      component: resolve => require(['@/views/consensus/Consensus.vue'], resolve)
    },
    {
      path: '/consensus/consensusInfo',
      name: 'consensusInfo',
      component: resolve => require(['@/views/consensus/ConsensusInfo.vue'], resolve)
    },
    {
      path: '/consensus/newConsensus',
      name: 'newConsensus',
      component: resolve => require(['@/views/consensus/NewConsensus.vue'], resolve)
    },
    {
      path: '/consensus/consensusList',
      name: 'consensusList',
      component: resolve => require(['@/views/consensus/ConsensusList.vue'], resolve)
    },
    {
      path: '/contract',
      name: 'contract',
      component: resolve => require(['@/views/contract/Contract.vue'], resolve)
    },
    {
      path: '/contractInfo',
      name: 'contractInfo',
      component: resolve => require(['@/views/contract/ContractInfo.vue'], resolve)
    },
    {
      path: '/address',
      name: 'address',
      component: resolve => require(['@/views/users/Address.vue'], resolve)
    },
    {
      path: '/newAddress',
      name: 'newAddress',
      component: resolve => require(['@/views/users/NewAddress.vue'], resolve)
    },
    {
      path: '/backupsAddress',
      name: 'backupsAddress',
      component: resolve => require(['@/views/users/BackupsAddress.vue'], resolve)
    },
    {
      path: '/setAlias',
      name: 'setAlias',
      component: resolve => require(['@/views/users/SetAlias.vue'], resolve)
    },
    {
      path: '/editPassword',
      name: 'editPassword',
      component: resolve => require(['@/views/users/EditPassword.vue'], resolve)
    },
    {
      path: '/nodeService',
      name: 'nodeService',
      component: resolve => require(['@/views/set/NodeService.vue'], resolve)
    },
    {
      path: '/set',
      name: 'seting',
      component: resolve => require(['@/views/set/Set.vue'], resolve)
    },
    {
      path: '/contact',
      name: 'contact',
      component: resolve => require(['@/views/set/Contact.vue'], resolve)
    },
    {
      path: '/application',
      name: 'application',
      component: resolve => require(['@/views/application/Application.vue'], resolve)
    }
  ]
})
