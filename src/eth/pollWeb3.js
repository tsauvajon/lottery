import Web3 from 'web3'
import store from '@/store'

const pollWeb3 = function (state) {
  const web3 = new Web3(window.web3.currentProvider)

  return setInterval(() => {
    if (!web3 || !store.state.web3.web3Instance) {
      return
    }

    if (web3.eth.coinbase !== store.state.web3.coinbase) {
      const { coinbase } = web3.eth
      web3.eth.getBalance(coinbase, (err, newBalance) => {
        if (err) {
          console.log(err)
          return
        }

        store.dispatch('pollWeb3', {
          coinbase,
          balance: parseInt(newBalance, 10)
        })
      })

      return
    }

    web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
      if (err) {
        console.log(err)
        return
      }

      if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
        store.dispatch('pollWeb3', {
          coinbase: store.state.web3.coinbase,
          balance: polledBalance
        })
      }
    })
  }, 500)
}

export default pollWeb3
