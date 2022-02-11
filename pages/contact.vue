<template>
  <div class="contact">
    <na-header class="na-header"/>
    <div class="content">联系我们</div>
  </div>
</template>

<script>
import NaHeader from '../components/header/header'
export default {
  name: 'contact',
  layout: 'common-footer',
  components: {
    NaHeader
  }
}
</script>

<style scoped lang="stylus">
  .contact
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
