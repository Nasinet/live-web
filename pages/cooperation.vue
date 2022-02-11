<template>
  <div class="cooperation">
    <na-header class="na-header"/>
    <div class="content">商务合作</div>
  </div>
</template>

<script>
import NaHeader from '../components/header/header'
export default {
  name: 'cooperation',
  layout: 'common-footer',
  components: {
    NaHeader
  }
}
</script>

<style scoped lang="stylus">
.cooperation
  min-height 100vh
  overflow hidden
  background-color #fafafa
  .na-header
    background #fff
  .content
    width 1406px
    margin 20px auto
    min-height calc(100vh - 100px)
    background-color #fff
  @media only screen and (max-width: 1406px)
    .content
      width 1137px
</style>
