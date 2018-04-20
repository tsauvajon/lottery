import Vue from 'vue'
import Vuex from 'vuex'

import getWeb3 from '@/eth/getWeb3'
import pollWeb3 from '@/eth/pollWeb3'
import getContract from '@/eth/getContract'

Vue.use(Vuex)

const registerWeb3Instance = 'REGISTER_WEB3_INSTANCE'
const pollWeb3Instance = 'POLL_WEB3_INSTANCE'
const setError = 'SET_ERROR'
const setContractInstance = 'SET_CONTRACT_INSTANCE'

const state = {
  web3: {
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    balance: null,
    error: null
  },
  contractInstanceGetter: null,
  error: null
}

let pollInterval = null

const actions = {
  registerWeb3: async ({ commit }) => {
    try {
      const web3 = await getWeb3()
      commit(registerWeb3Instance, web3)
      clearInterval(pollInterval)
      pollInterval = pollWeb3()
    } catch (e) {
      console.log('error registering web3:', e)
      commit(setError, `Couldn't connect to Metamask. Is Metamask running and are you logged with a wallet ?`)
    }
  },

  pollWeb3: ({ commit }, payload) => {
    commit(pollWeb3Instance, payload)
  },

  getContractInstance: async ({ commit }) => {
    try {
      const contract = await getContract()
      commit(setContractInstance, { ...contract })
    } catch (e) {
      console.log('error getting the contract:', e)
      commit(setError, `Couldn't get the Lottery smart-contract`)
    }
  }
}

const mutations = {
  [registerWeb3Instance]: (state, { coinbase, networkId, balance, injectedWeb3, web3 }) => {
    state.web3 = {
      ...state.web3,
      coinbase,
      networkId,
      balance: parseInt(balance, 10),
      isInjected: injectedWeb3,
      web3Instance: web3
    }
  },

  [pollWeb3Instance]: (state, { coinbase, balance }) => {
    state.web3 = {
      ...state.web3,
      coinbase,
      balance: parseInt(balance, 10)
    }
  },

  [setError]: (state, payload) => {
    state.error = payload
  },

  [setContractInstance]: (state, contract) => {
    state.contractInstanceGetter = () => contract
  }
}

const getters = {
  error: ({ error }) => error,
  web3: ({ web3 }) => web3,
  contract: ({ contractInstanceGetter }) => contractInstanceGetter()
}

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters
})
