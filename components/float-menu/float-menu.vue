<template>
  <div :class="{'float-menu': true, open: open}">
    <div class="small" v-show="!open">
      <nuxt-link target="_blank" to="/user-center/focus" class="menu">
        <img src="./guanzhu@2x.png" alt="">
        <p>关注</p>
      </nuxt-link>
      <nuxt-link target="_blank" to="/rank" class="menu">
        <img src="./bangdan@2x.png" alt="">
        <p>榜单</p>
      </nuxt-link>
      <div class="menu">
        <img src="./fenlei_click@2x.png" alt="">
        <p>分类</p>
      </div>
      <a target="_blank" href="/download" class="download">
        <img src="./phone@2x.png" alt="">
        <p>下载APP</p>
      </a>
    </div>
    <div class="big" v-show="open">
      <nuxt-link target="_blank" to="/user-center/focus" class="menu">
        <img src="./guanzhu@2x.png" alt="">
        <p>我的关注</p>
      </nuxt-link>
      <nuxt-link target="_blank" to="/rank" class="menu">
        <img src="./bangdan@2x.png" alt="">
        <p>榜单</p>
      </nuxt-link>
      <div class="menu">
        <img src="./fenlei_click@2x.png" alt="">
        <p>分类</p>
      </div>
      <div class="link-list">
        <a v-for="item in categories" target="_blank" :key="item.id" :href="`/classify?type=${item.id}`">{{ item.title }}</a>
      </div>
      <div class="download">
        <img :src="$store.state.appConfig.dl_qrcode" alt="" class="code">
        <p>扫描二维码下载钠斯直播APP</p>
      </div>
    </div>
    <div class="btn" @click="toggleMenu">
      <i :class="['el-icon-caret-right', open ? 'rotate' : '']"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'float-menu',
  computed: {
    ...mapState(['categories'])
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleMenu () {
      this.$emit('toggleMenu')
    }
  }
}
</script>

<style scoped lang="stylus">
.float-menu
  position fixed
  left 0
  top 60px
  bottom 0
  min-width 60px
  width 60px
  padding-top 53px
  background-color #1B1B27
  transition all 0.2s
  z-index 9
  &.open
    min-width 260px
    width 260px
    margin-right 24px
  .btn
    position absolute
    top 323px
    right -15px
    background-color #1B1B27
    width 30px
    height 130px
    border-radius 20px
    cursor pointer
    &>i
      margin-top 54px
      margin-left 10px
      font-size 18px
      color #9A98A4
      &.rotate
        transform rotateZ(180deg)
  .small
    .menu
      display block
      margin-bottom 40px
      text-align center
      font-size 15px
      color #B5B5C4
      &>img
        margin-bottom 13px
        width 26px
        height 26px
    .download
      position absolute
      bottom 0
      width 100%
      display block
      padding-bottom 43px
      margin-top 350px
      text-align center
      &>img
        width 15px
        height 20px
        margin-bottom 14px
      &>p
        font-size 12px
        color #B5B5C4
  .big
    .menu
      padding-left 38px
      display flex
      align-items center
      margin-bottom 36px
      font-size 15px
      color #B5B5C4
      &>img
        width 25px
        height 25px
        margin-right 11px
    .link-list
      padding 0 40px
      margin-bottom 32px
      display flex
      flex-wrap wrap
      justify-content space-between
      &>a
        margin-bottom 12px
        width 85px
        height 30px
        line-height 30px
        text-align center
        font-size 12px
        color #FEFEFE
        background-color #202030
    .download
      position absolute
      bottom 60px
      width 100%
      text-align center
      &>img
        width 147px
        height 147px
        padding 13px
        background-color #fff
      &>p
        margin-top 25px
        font-size 13px
        color #B5B5C4
</style>
