<template>
  <Metamask />
</template>

<script>
import Metamask from '@/components/Metamask'

export default {
  name: 'lottery',
  components: { Metamask },

  beforeCreate () {
    this.$store.dispatch('registerWeb3')
  },

  async created () {
    await this.$store.dispatch('getContractInstance')
  }
}
</script>

<style>

</style>
