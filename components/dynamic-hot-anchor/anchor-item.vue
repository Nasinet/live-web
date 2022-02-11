<template>
  <nuxt-link target="_blank" :to="'/dynamic/anchor/' + item.anchor.id" class="anchor-item">
    <img :src="item.anchor.avatar || $store.state.defaultAvatar" alt="">
    <div class="anchor-content">
      <h4 class="text-overflow">{{ item.anchor.nick_name }}</h4>
      <p class="text-overflow">{{ item.anchor.profile.signature }}</p>
    </div>
  </nuxt-link>
</template>

<script>
  export default {
    name: 'anchor-item',
    props: {
      item: {
        type: Object,
        default() { return {} }
      }
    }
  }
</script>

<style scoped lang="stylus">
.anchor-item
  display flex
  align-items center
  padding 0 19px
  &>img
    width 51px
    height 51px
    border-radius 50%
  .anchor-content
    margin-left 13px
    flex 1
    &>h4
      width 90%
      margin-bottom 8px
      font-size 15px
      color #333333
    &>p
      width 90%
      font-size 13px
      color #B5B3B3
</style>
