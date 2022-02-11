<template>
  <div>
    <nuxt />
    <login v-show="$store.state.showLogin" />
    <dynamic-release v-show="$store.state.showDynamicRel" />
  </div>
</template>

<script>
import Login from '../components/login/login'
import DynamicRelease from '../components/dynamic-release/dynamic-release'
export default {
  components: {
    Login,
    DynamicRelease
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
