<template>
  <div id="app">
    <img src="./assets/bingo.svg" height="80">
    <router-view v-if="!error" />
    <div v-else class="error" >
      {{ error }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: mapGetters(['error'])
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.error {
 color: #cb3837;
}
</style>
