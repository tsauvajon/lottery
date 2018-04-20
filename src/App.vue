<template>
  <div id="app">
    <img src="./assets/bingo.svg" height="80">
    <h1>La MAGNIFIQUE Lotterie de la Poudre aux yeux</h1>
    <br><br>
    <router-view v-if="!error" />
    <div v-else class="error" >
      <br>
      <br>
      {{ error }}
      <br>
      <br>
      <a href="https://metamask.io">
        <img src="./assets/download-metamask.png" alt="Get Metamask" />
      </a>
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

a {
  color: #2c3e50;
  text-decoration: none;
}

.error {
 color: #cb3837;
}

body {
  background: #eff2fa;
}
</style>
