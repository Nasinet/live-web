<template>
  <user-center-wrap>
    <div class="desc">
      <img :src="userInfo.avatar || defaultAvatar" alt="头像" class="avatar">
      <div class="right">
        <div class="top">
          <p>{{ userInfo.nick_name }}</p>
          <img v-if="userInfo.is_anchor" class="level" :src="anchorLevel[userInfo.anchor_level]" />
          <nuxt-link to="/user-center/edit">
            <img src="~/assets/img/user-center/pencil.svg" class="edit" alt="">
          </nuxt-link>
          <span>ID:{{ userInfo.id }}</span>
          <nuxt-link class="open" :to="liveUrl"><img src="./live@2x.png" alt="">我要直播</nuxt-link>
        </div>
        <div class="bottom">
          <div class="coin">
            <img src="./coin@2x.png" alt="">
            <p>金币：<span>{{ userInfo.gold }}</span></p>
          </div>
          <nuxt-link to="/user-center/recharge">
            <button>充值</button>
          </nuxt-link>
        </div>
      </div>
    </div>
    <img @click="showVip=true" src="./banner@2x.png" class="vip-banner" alt="">
    <div class="account">
      <h4>账号管理</h4>
      <div class="open-list">
        <div class="link">
          <img class="phone" src="./phone@2x.png" alt="">
          <div class="text">
            <h6>{{ userInfo.account ? `手机号：${userInfo.account}` : '手机号未绑定' }}</h6>
            <p>绑定手机号后享受更安全及提醒服务</p>
          </div>
          <nuxt-link v-if="!userInfo.account" to="/user-center/bind-phone">绑定手机号</nuxt-link>
        </div>
        <div class="link" to="/user-center/become-anchor">
          <img class="anchor" src="./anchor@2x.png" alt="">
          <div class="text">
            <h6>{{ userInfo.is_anchor ? '已认证主播' : '成为主播' }}</h6>
            <p>敢说就来，快速签约，互利双赢</p>
          </div>
          <nuxt-link :to="liveUrl">{{ userInfo.is_anchor ? '我要开播' : '成为主播' }}</nuxt-link>
        </div>
        <div class="link">
          <img class="verify" src="./renzheng@2x.png" alt="">
          <div class="text">
            <h6>{{ userInfo.is_anchor ? '已完成实名认证' : '实名认证' }}</h6>
            <p>实名认证，提现更方便</p>
          </div>
          <nuxt-link v-if="!userInfo.is_anchor" :to="liveUrl">实名认证</nuxt-link>
        </div>
      </div>
    </div>
    <transition name="vip-slide">
      <vip-alert @close="showVip=false" v-if="showVip" />
    </transition>
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../components/user-center-wrap/user-center-wrap'
import VipAlert from '../../components/vip-alert/vip-alert'
import { mapState } from 'vuex'
import { anchorLevel } from '../../util/level-icon'
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my')
    }
  },
  name: 'user-center',
  layout: 'common-footer',
  middleware: 'login-check',
  components: {
    UserCenterWrap,
    VipAlert
  },
  data() {
    return {
      showVip: false,
      anchorLevel
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar']),
    liveUrl() {
      return !this.userInfo.is_anchor ? '/user-center/become-anchor' : '/live/' + this.userInfo.id
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/variable.styl"
.vip-slide-enter-active, .vip-slide-leave-active
  transition all 0.3s ease-in-out
.vip-slide-enter, .vip-slide-leave-to
  transform translate3d(0, -70%, 0) scale(0.1) !important
.desc
  display flex
  align-items center
  padding 30px
  .avatar
    width 127px
    height 127px
    border-radius 50%
    margin-right 30px
  .right
    .top
      display flex
      align-items center
      margin-bottom 20px
      &>p
        margin-right 7px
        font-size 20px
        color #333333
        font-weight bold
      .level
        width 30px
        height 18px
        border-radius 2px
        background linear-gradient(96deg,rgba(255,149,117,1),rgba(255,99,61,1))
      .edit
        width 20px
        height 20px
        margin-left 30px
        margin-right 75px
        cursor pointer
      &>span
        font-size 15px
        color #989898
      .open
        width 162px
        height 48px
        line-height 48px
        margin-left 78px
        border-radius 24px
        border 1px solid $theme-color
        background-color #fff
        text-align center
        font-size 16px
        color $theme-color
        &>img
          width 26px
          height 19px
          margin-top -2px
          vertical-align middle
          margin-right 11px
    .bottom
      display flex
      align-items center
      .coin
        display flex
        align-items center
        margin-right 48px
        &>img
          width 23px
          height 23px
          margin-right 14px
        &>p
          font-size 15px
          color #333333
          &>span
            color #FFA519
            font-weight bold
      &>a>button
        width 77px
        height 30px
        border-radius 15px
        line-height 30px
        background linear-gradient(90deg,rgba(129,209,255,1),rgba(133,87,255,1))
        box-shadow 0px 2px 6px 0px rgba(116, 255, 73, 0.35)
        font-size 15px
        color #FFFFFF
.vip-banner
  display block
  width 1047px
  margin 0 auto
  height 143px
  padding 12px
  border 1px solid #E1E1E1
  cursor pointer
.account
  padding 31px 28px 0 28px
  &>h4
    margin-bottom 37px
    font-size 22px
    color #494949
    font-weight bold
  .open-list
    display flex
    justify-content space-between
    flex-wrap wrap
    .link
      width 515px
      height 135px
      margin-bottom 27px
      padding-left 25px
      padding-right 20px
      display flex
      align-items center
      background-color #F7F7F7
      &>img
        &.phone
          margin-right 26px
          width 36px
          height 55px
        &.anchor
          margin-right 15px
          width 53px
          height 60px
        &.verify
          margin-right 16px
          width 52px
          height 38px
      .text
        flex 1
        &>h6
          margin-bottom 17px
          font-size 16px
          color #333333
        &>p
          font-size 16px
          color #6A6A6A
      &>a
        width 119px
        height 48px
        line-height 48px
        text-align center
        border-radius 24px
        border 1px solid $theme-color
        font-size 18px
        color $theme-color
        background-color transparent
@media only screen and (max-width: 1406px)
  .vip-banner
    width 890px
  .account
    .open-list
      .link
        width 438px
</style>
