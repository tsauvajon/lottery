<template>
  <div />
</template>

<script>
import Metamask from '@/components/Metamask'

export default {
  name: 'lottery',
  components: { Metamask },

  beforeCreate () {
    this.$store.dispatch('registerWeb3')
  }
}
</script>

<style>

</style>
