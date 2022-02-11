<template>
  <div class="buy-dy-alert" @click="hide">
    <div class="box" @click.stop>
      <img @click="hide" src="./ic_close@2x.png" alt="" class="close">
      <img class="avatar" :src="dynamic.user.avatar" alt="">
      <p>解锁{{ dynamic.user.nick_name }}的私密动态</p>
      <button @click="confirm">观看此动态需要{{ dynamic.unlock_price }}金币</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'buy-dynamic-alert',
  props: {
    dynamic: {
      type: Object,
      default() { return {} }
    }
  },
  methods: {
    hide() {
      document.body.removeChild(this.$el)
      this.$destroy()
    }
  }
}
</script>

<style scoped lang="stylus">
  @keyframes slide
    0%
      opacity 0
      transform scale(0) translate3d(0, -80%, 0)
    100%
      opacity 1
      transform scale(1) translate3d(0, 0, 0)
.buy-dy-alert
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center
  background-color rgba(0, 0, 0, 0.4)
  z-index 9
  .box
    width 406px
    border-radius 10px
    background-color #fff
    position relative
    text-align center
    overflow hidden
    padding-top 28px
    padding-bottom 37px
    animation slide 0.3s ease
    .close
      position absolute
      right 16px
      top 15px
      width 14px
      height 15px
      cursor pointer
    .avatar
      width 87px
      height 87px
      border-radius 50%
    &>p
      margin-top 35px
      margin-bottom 55px
      font-size 18px
      color #333333
    &>button
      width 254px
      height 52px
      line-height 52px
      border-radius 26px
      border none
      outline none
      font-size 16px
      color #FFFFFF
      background linear-gradient(90deg,rgba(47,231,255,1),rgba(151,101,255,1))
</style>
