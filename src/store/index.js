import Vue from 'vue'
import Vuex from 'vuex'

import getWeb3 from '@/eth/getWeb3'

Vue.use(Vuex)

const registerWeb3Instance = 'REGISTER_WEB3_INSTANCE'
const setError = 'SET_ERROR'

const state = {
  web3: {
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    balance: null,
    error: null
  },
  contractInstance: null,
  error: null
}

const actions = {
  registerWeb3: async ({ commit }) => {
    try {
      const web3 = await getWeb3()
      commit(registerWeb3Instance, web3)
    } catch (e) {
      console.log('error registering web3:', e)
      commit(setError, `Couldn't connect to Metamask. Is Metamask running and are you logged with a wallet ?`)
    }
  }
}

const mutations = {
  [registerWeb3Instance]: (state, payload) => {
    const result = payload
    const web3Copy = state.web3
    web3Copy.coinbase = result.coinbase
    web3Copy.networkId = result.networkId
    web3Copy.balance = parseInt(result.balance, 10)
    web3Copy.isInjected = result.injectedWeb3
    web3Copy.web3Instance = result.web3
    state.web3 = web3Copy
  },

  [setError]: (state, payload) => {
    console.log('setting error', payload)
    state.error = payload
  }
}

const getters = {
  error: ({ error }) => error
}

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters
})
