<template>
  <div>
    <Metamask /><br>
    <div class="card form">
      <div>
        <input type="number" v-model="bet" />&nbsp;Ξ
        <br><br>
        <span @click="placeBet" class="link-container bet">
          <span><strong>Place bet</strong></span>
        </span>
        <template v-if="transactions.length">
          <br><br>
          <div>
            Processing transactions:
          </div>
          <div v-for="tx in transactions" :key="tx">
            <a :href="`https://ropsten.etherscan.io/tx/${tx}`">
              {{ tx }}
            </a>
          </div>
        </template>
      </div>
    </div>
    <br>
    <div v-if="contract" class="card form">
      <div v-if="w3i">
        <strong>{{ w3i.fromWei(totalBets) }} Ξ</strong>
        in play from
        <strong>{{ nbUsers }}</strong> gambler<template v-if="nbUsers > 1">s</template>
      </div>
      <div>
        <strong>Owner</strong>:
        <a :href="`https://ropsten.etherscan.io/address/${owner}`">
          {{ owner }}
        </a>
      </div>
      <div>
        <strong>Contract</strong>:
        <a :href="`https://ropsten.etherscan.io/address/${contract.address}`">
          {{ contract.address }}
        </a>
      </div>
    </div>
    <br>
    <div v-if="web3 && owner && owner == web3.coinbase" class="card form">
      <div>
        <span class="link-container bet">
          <span><strong>Roll the decentralized dice</strong></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Metamask from '@/components/Metamask'

const checkError = err => err ? console.log(err) : false

export default {
  name: 'lottery',
  components: { Metamask },
  computed: mapGetters(['contract', 'web3', 'w3i']),
  data: () => ({
    bet: 1.234,
    owner: null,
    totalBets: null,
    nbUsers: null,
    gasPrice: null,
    transactions: []
  }),

  methods: {
    refreshBets () {
      this.contract.totalBets((err, bigNumber) => {
        if (checkError(err)) {
          this.totalBets = 0
          return
        }

        this.totalBets = bigNumber.toString(10)
      })

      this.contract.nbUsers((err, bigNumber) => {
        if (checkError(err)) {
          return
        }

        this.nbUsers = bigNumber.toString(10)
      })
    },

    getGasPrice () {
      const { w3i } = this

      if (!w3i) {
        return
      }

      w3i.eth.getGasPrice((err, price) => {
        if (err) {
          console.log(`Couldn't get gas price. Keeping the default value.`)
          return
        }
        this.gasPrice = price
      })
    },

    placeBet () {
      // this.getGasPrice()
      const { contract, bet, web3, w3i } = this

      if (!contract || !web3 || !w3i) {
        // TODO: afficher message dans l'UI
        console.error('Something is missing (contract, web3 or w3i)')
        return
      }

      if (bet <= 0) {
        // TODO: afficher erreur dans l'UI
        console.log('Bets must be positive')
        return
      }

      const { gasPrice } = this

      contract.bet.sendTransaction({
        gas: 300000,
        value: w3i.toWei(bet, 'ether'),
        from: web3.coinbase,
        gasPrice
      }, (err, tx) => {
        if (err) {
          // TODO: afficher erreur
          console.log(err)
          return
        }
        this.transactions = [...this.transactions, tx]
        this.refreshBets()
        let interval
        interval = setInterval(() => {
          w3i.eth.getTransactionReceipt(tx, (err, receipt) => {
            if (err) {
              console.log('Error getting the receipt:', err)
              return
            }
            if (receipt) {
              console.log('Transaction terminée !')
              this.refreshBets()
              this.transactions = this.transactions.filter(transaction => transaction !== tx)
              clearInterval(interval)
            }
          })
        }, 3000)
      })
    },

    endLottery () {
      const { contract, web3, w3i } = this
      if (!contract || !web3 || !w3i) {
        // TODO: afficher message dans l'UI
        console.error('Something is missing (contract, web3 or w3i)')
        return
      }

      contract.endLottery.sendTransaction({
        gas: 300000,
        from: web3.coinbase
      }, (err, result) => {
        if (err) {
          // TODO: afficher l'erreur
          console.log(err)
          return
        }

        // TODO: proposer de re créer une lotterie ?
        // TODO: Afficher le gagnant
        console.log(result)

        let interval
        interval = setInterval(() => {
          w3i.eth.getTransactionReceipt(result, (err, receipt) => {
            if (err) {
              console.log('Error getting the receipt:', err)
              return
            }
            if (receipt) {
              console.log('Transaction terminée !')
              clearInterval(interval)
            }
          })
        }, 3000)
      })
    }
  },

  beforeCreate () {
    this.$store.dispatch('registerWeb3')
  },

  async created () {
    this.getGasPrice()
    await this.$store.dispatch('getContractInstance')

    this.refreshBets()

    this.contract.owner((err, owner) => {
      if (checkError(err)) {
        return
      }
      this.owner = owner
    })
  }
}
</script>

<style>
.card {
  background: #ccc;
  display: inline-flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 35px rgba(48, 95, 129, .1);
  border-radius: 16px;
  padding: 25px 30px 30px;
}

.form {
  margin-top: 40px;
}

.link-container {
  position: relative;
  cursor: pointer;
}

.link-container > *:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 4px;
  bottom: -3px;
  left: 0;
  background: #2c3e50;
  visibility: hidden;
  border-radius: 5px;
  transform: scaleX(0);
  transition: all 0.2s ease-in-out 0s;
}

.link-container > *:hover:before,
.link-container > *:focus:before {
  visibility: visible;
  transform: scaleX(1);
}

.bet {
  margin: 10px;
}
</style>
