<template>
  <h2 class="ed-title"><i @click="$router.back()" class="iconfont icon-back"/>{{ title }}</h2>
</template>

<script>
export default {
  name: 'back-head',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
  .ed-title
    margin 0 22px
    padding 30px 0
    font-size 18px
    color #333333
    font-weight bold
    border-bottom 1px solid #F0F0F0
    &>i
      padding-right 15px
      font-size 15px
      color #919191
      cursor pointer
</style>
