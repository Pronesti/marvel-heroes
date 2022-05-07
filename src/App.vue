<template>
  <div id="app" class="dark:bg-slate-800">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html, body, #app{
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
