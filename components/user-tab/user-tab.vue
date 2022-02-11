<template>
  <div class="user-tab">
    <nuxt-link to="/user-center" :class="{active: activeInfo}">
      <img src="./ziliao@2x.png" alt="">
      <span>我的资料</span>
    </nuxt-link>
    <nuxt-link to="/user-center/focus" active-class="active">
      <img src="./guanzhu@2x.png" alt="">
      <span>我的关注</span>
    </nuxt-link>
    <nuxt-link to="/user-center/wallet" active-class="active">
      <img src="./qianbao@2x.png" alt="">
      <span>我的钱包</span>
    </nuxt-link>
    <nuxt-link to="/user-center/income" active-class="active">
      <img src="./zhibpshouyi@2x.png" alt="">
      <span>直播收益</span>
    </nuxt-link>
    <nuxt-link to="/user-center/set" active-class="active">
      <img src="./live@2x.png" alt="">
      <span>直播管理</span>
    </nuxt-link>
    <nuxt-link to="/user-center/dynamic-income" active-class="active">
      <img src="./shouyi@2x.png" alt="">
      <span>动态收益</span>
    </nuxt-link>
    <nuxt-link to="/user-center/guild" active-class="active">
      <img src="./gonghui@2x.png" alt="">
      <span>公会中心</span>
    </nuxt-link>
    <a :href="liveUrl" active-class="active">
      <img src="./zhibo@2x.png" alt="">
      <span>我要直播</span>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'user-tab',
  computed: {
    ...mapState(['userInfo']),
    activeInfo() {
      const { path } = this.$route
      return path === '/user-center' || path === '/user-center/edit' ||
             path === '/user-center/bind-phone' || path === '/user-center/recharge' || path === '/user-center/verify'
    },
    liveUrl() {
      return !this.userInfo.is_anchor ? '/user-center/become-anchor' : '/live/' + this.userInfo.id
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.user-tab
  width 289px
  height 772px
  background-color #fff
  border-radius 4px
  overflow hidden
  &>a
    display block
    height 84px
    line-height 84px
    text-align center
    border-left 9px solid transparent
    font-size 16px
    color #515359
    &>img
      width 33px
      height 33px
      vertical-align middle
    &.active
      border-left-color $theme-color
      background-color #E2F9FA
@media only screen and (max-width: 1406px)
  .user-tab
    width 246px
</style>
