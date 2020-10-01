<template>
  <div id="app">
    <CarComponent msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import CarComponent from "./components/CarComponent.vue";

export default {
  name: "App",
  components: {
    CarComponent,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
