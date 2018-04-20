<template>
  <div v-if="w3i" class='metamask-info'>
    <p><strong>Metamask</strong>: {{ web3.isInjected }}</p>
    <p><strong>Network</strong>: {{ networks[web3.networkId] }}</p>
    <p><strong>Account</strong>: {{ web3.coinbase }}</p>
    <p><strong>Balance</strong>: {{ w3i.fromWei(web3.balance) }} ether</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import networks from '@/eth/networks'

export default {
  name: 'metamask',
  data: () => ({ networks }),
  computed: {
    ...mapGetters(['web3']),
    w3i () {
      return this.web3.web3Instance && this.web3.web3Instance()
    }
  }
}
</script>

<style>

</style>
