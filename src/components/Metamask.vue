<template>
  <div v-if="w3i" class='metamask-info'>
    <p style="position: absolute" v-if="web3.isInjected"><img src="../assets/metamask.png" height="30" /></p>
    <p><strong>Network</strong>: {{ networks[web3.networkId] }}</p>
    <p>
      <strong>Account</strong>:
      <a :href="`https://ropsten.etherscan.io/address/${web3.coinbase}`">
        {{ web3.coinbase }}
      </a>
    </p>
    <p><strong>Balance</strong>: {{ w3i.fromWei(web3.balance) }} Ξ</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import networks from '@/eth/networks'

export default {
  name: 'metamask',
  data: () => ({ networks }),
  computed: mapGetters(['web3', 'w3i'])
}
</script>

<style>
.metamask-info {
  background: #ccc;
  display: inline-flex;
  flex-direction: column;
  text-align: right;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 35px rgba(48, 95, 129, .1);
  border-radius: 16px;
  padding: 15px 30px 20px;
  position: relative;
}
</style>
