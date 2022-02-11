<template>
  <div class="user-center">
    <na-header class="header" />
    <div class="content-wrap">
      <user-tab/>
      <div :style="{background: bgColor}" class="right-content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../header/header'
import UserTab from '../user-tab/user-tab'

export default {
  name: 'user-center-wrap',
  components: {
    NaHeader,
    UserTab
  },
  props: {
    bgColor: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped lang="stylus">
.user-center
  min-height 100vh
  overflow hidden
  background-color #F5F5F5
  .header
    background-color #fff
  .content-wrap
    width 1406px
    margin 0 auto
    display flex
    justify-content space-between
    margin-top 13px
    margin-bottom 23px
    .right-content
      flex 1
      border-radius 4px
      overflow hidden
      margin-left 11px
  @media only screen and (max-width: 1406px)
    .content-wrap
      width 1200px
</style>
