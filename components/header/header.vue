<template>
  <div style="width: 100%;">
    <div class="header">
      <img v-if="type === 'home'" src="./logo-white@3x.png" class="logo" alt="">
      <img v-else src="./logo-blue@3x.png" class="logo" alt="">
      <div class="link">
        <nuxt-link :style="{color: $route.path === '/' ? activeColor : defaultColor}"
                   exact-active-class="active" to="/">首页<i></i></nuxt-link>
        <nuxt-link :style="{color: $route.path === '/classify' ? activeColor : defaultColor}"
                   active-class="active" to="/classify?type=0">分类<i></i></nuxt-link>
        <nuxt-link :style="{color: $route.path === '/dynamic' ? activeColor : defaultColor}"
                   active-class="active" to="/dynamic?mtype=2&tabtype=2">动态<i></i></nuxt-link>
        <nuxt-link target="_blank" :style="{color: $route.path === '/download' ? activeColor : defaultColor}"
                   active-class="active" to="/download">短视频<i></i></nuxt-link>
        <nuxt-link :style="{color: $route.path === '/rank' ? activeColor : defaultColor}"
                   active-class="active" to="/rank">排行榜<i></i></nuxt-link>
        <nuxt-link :style="{color: $route.path === '/activity' ? activeColor : defaultColor}"
                   active-class="active" to="/activity?type=1">活动<i></i></nuxt-link>
      </div>
      <form action="/search" method="get" class="search">
        <input name="searchKey" type="text" placeholder="搜索主播、频道">
        <button type="submit"><img src="./ic_search@2x.png" alt=""></button>
      </form>
      <div class="control">
        <button @click="toggleDynamicRel" v-if="userInfo.id" :style="{color: defaultColor}"><img src="./fabu@2x.png" alt="">动态</button>
        <nuxt-link class="download" target="_blank" to="/download" :style="{color: defaultColor}"><img src="./ic_download@2x.png" alt="">下载</nuxt-link>
        <a href="/login" v-if="!userInfo.id" @click.prevent="toggleLogin" :style="{color: defaultColor}"><img src="./ic_login@2x.png" alt="">登录</a>
        <div class="user" v-else @mouseover="showInfo=true" @mouseleave="showInfo=false" :style="{color: defaultColor}">
          <img :src="userInfo.avatar || defaultAvatar" alt="">
          <p class="text-overflow">{{ userInfo.nick_name }}</p>
          <transition name="el-zoom-in-top">
            <float-user-info v-if="showInfo"/>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import FloatUserInfo from '../float-user-info/float-user-info'

export default {
  name: 'na-header',
  components: {
    FloatUserInfo
  },
  props: {
    activeColor: {
      type: String,
      default: '#333'
    },
    defaultColor: {
      type: String,
      default: '#656565'
    },
    type: {
      type: String,
      default: 'another'
    }
  },
  data() {
    return {
      showInfo: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar'])
  },
  methods: {
    ...mapMutations(['toggleLogin', 'toggleDynamicRel'])
  }
}
</script>

<style scoped lang="stylus">
.header
  width 1406px
  margin 0 auto
  display flex
  height 60px
  align-items center
  .logo
    width 125px
    height 39px
    margin-right 74px
  .link
    flex 1
    display flex
    align-items center
    &>a
      margin-right 46px
      font-size 17px
      color #656565
      position relative
      &:last-child
        margin-right 0
      &.active
        color #333
        font-weight bold
        &>i
          background linear-gradient(90deg,rgba(157,93,255,1),rgba(47,232,255,1))
      &>i
        position absolute
        left 50%
        margin-left -6px
        bottom -12px
        display block
        width 12px
        height 4px
        border-radius 2px
        background transparent
  .search
    width 200px
    height 36px
    display flex
    margin-left 20px
    align-items center
    border-radius 21px
    padding-left 20px
    background-color #F7F7FB
    &>input
      width 100%
      border none
      outline none
      background-color transparent
      font-size 14px
    &>button
      padding 0
      background transparent
      &>img
        width 15px
        height 15px
        margin-right 17px
        cursor pointer
  .control
    flex 1
    display flex
    align-items center
    justify-content flex-end
    &>button
      min-width 86px
      display flex
      align-items center
      margin-right 20px
      font-size 17px
      color #666666
      background transparent
      cursor pointer
      &>img
        width 20px
        height 20px
        margin-right 13px
    &>a
      min-width 63px
      display flex
      align-items center
      line-height 20px
      font-size 17px
      color #656565
      &.download
        margin-right 20px
      &>img
        width 20px
        height 20px
        margin-right 7px
        vertical-align middle
    .user
      display flex
      align-items center
      font-size 15px
      color #656565
      cursor pointer
      position relative
      &>img
        width 34px
        height 34px
        border-radius 50%
        margin-right 8px
@media only screen and (max-width: 1406px)
  .header
    width 1137px
    .logo
      margin-right 20px
    .link
      min-width 391px
      flex 1
      display flex
      align-items center
      &>a
        margin-right 28px
    .control
      .user
        &>p
          width 60px
</style>
