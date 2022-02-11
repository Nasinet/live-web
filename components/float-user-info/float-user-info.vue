<template>
  <div class="float-user-info">
    <a href="/api/user/logout" class="logout">退出</a>
    <img :src="userInfo.avatar || defaultAvatar" alt="">
    <p class="name">{{ userInfo.nick_name }} <img v-if="userInfo.is_anchor" :src="anchorLevel[userInfo.anchor_level]" alt=""></p>
    <div class="data-num">
      <p>{{ userInfo.attent_count }}<span>关注</span></p>
      <i></i>
      <p>{{ userInfo.fans_count }}<span>粉丝</span></p>
    </div>
    <div class="coin">
      <img src="../gift-send/coin@2x.png" alt="">
      <p>金币：<span>{{ userInfo.gold }}</span></p>
      <div style="flex: 1;"></div>
      <nuxt-link to="/user-center/recharge"><button>充值</button></nuxt-link>
    </div>
    <div class="link">
      <nuxt-link target="_blank" to="/user-center" exact-active-class="active">个人中心</nuxt-link>
      <nuxt-link target="_blank" to="/user-center/focus" active-class="active">我的关注</nuxt-link>
      <a :href="liveUrl" target="_blank" :class="liveUrl.indexOf($route.path) >= 0 ? 'active' : ''">我要直播</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { anchorLevel } from '../../util/level-icon'

export default {
  name: 'float-user-info',
  computed: {
    ...mapState(['userInfo', 'defaultAvatar']),
    liveUrl() {
      return !this.userInfo.is_anchor ? '/user-center/become-anchor' : '/live/' + this.userInfo.id
    }
  },
  data() {
    return {
      anchorLevel
    }
  }
}
</script>

<style scoped lang="stylus">
.float-user-info
  position absolute
  right -5px
  top 100%
  z-index 11
  padding 47px 25px 29px 36px
  width 323px
  background url(./bg@2x.png) center center no-repeat
  background-size 100% 100%
  .logout
    position absolute
    right 25px
    top 34px
    font-size 17px
    color #666666
    font-weight bold
  &>img
    display block
    width 89px
    height 89px
    border-radius 56%
    margin 0 auto
    margin-bottom 21px
  .name
    text-align center
    font-size 19px
    color #333333
    font-weight bold
    &>img
      display inline-block
      width 30px
      height 19px
      border-radius 2px
      background linear-gradient(96deg,rgba(255,150,118,1),rgba(255,100,62,1))
      vertical-align middle
  .data-num
    display flex
    justify-content center
    align-items center
    margin-top 30px
    &>i
      width 1px
      height 23px
      margin 0 35px
      background-color #EEEEEE
    &>p
      text-align center
      font-weight bold
      font-size 19px
      color #333333
      &>span
        display block
        margin-top 14px
        font-size 15px
        color #7A7A7A
        font-weight normal
  .coin
    display flex
    align-items center
    margin-top 22px
    margin-bottom 29px
    padding-top 19px
    border-top 1px solid #F4F4F4
    &>img
      width 23px
      height 23px
      margin-right 14px
    &>p
      font-size 15px
      color #333333
      &>span
        color #FFA619
        font-weight bold
    &>a>button
      width 68px
      height 30px
      border-radius 15px
      background linear-gradient(90deg,rgba(130,210,255,1),rgba(133,87,255,1))
      box-shadow 1px 3px 7px 0px rgba(116, 255, 73, 0.35)
      font-size 15px
      color #fff
      cursor pointer
  .link
    display flex
    justify-content space-between
    &>a
      font-size 15px
      color #666666
      font-weight bold
      &.active
        color #18D5D9
</style>
