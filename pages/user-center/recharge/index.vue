<template>
  <user-center-wrap>
    <back-head title="充值"/>
    <div class="user">
      <img :src="userInfo.avatar || $store.state.defaultAvatar" alt="">
      <div class="right">
        <h4>{{ userInfo.nick_name }}</h4>
        <p><img src="../coin@2x.png" alt="">金币：<span>{{ userInfo.gold }}</span></p>
      </div>
    </div>
    <div class="gold-list">
      <p>充值金额</p>
      <ul class="list">
        <li v-for="item in list" :key="item.id" @click="active=item" :class="{active: active.id === item.id}">
          <h4>{{ item.gold }} 金币</h4>
          <p>¥{{ item.price }}</p>
        </li>
      </ul>
    </div>
    <div class="money">
      <h5>应付金额</h5>
      <p>{{ active.price }}<span> 元</span></p>
    </div>
    <div class="pay-code">
      <div class="code green">
        <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1458229275,3774320714&fm=26&gp=0.jpg" alt="">
        <p><img src="./wechat@2x.png" alt="">微信支付</p>
      </div>
      <div class="code blue">
        <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1458229275,3774320714&fm=26&gp=0.jpg" alt="">
        <p><img src="./alipay@2x.png" alt="">支付宝支付</p>
      </div>
    </div>
    <p class="buy-tips"><span>注：</span>通过充值获得的金币不可提现；充值成功后，到账可能会有一定的延迟，请您耐心等待</p>
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../../components/user-center-wrap/user-center-wrap'
import BackHead from '../../../components/back-head/back-head'
import { post } from '../../../util/http'
import { mapState } from 'vuex'
import getPlatform from "../../../util/platform";
import {h5Host} from "../../../util/host";

export default {
  async asyncData({ req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my/recharge')
      return
    }
    const { data: { data } } = await post({ url: '/api/recharge/getPriceList', req })
    return {
      list: data,
      active: data[0]
    }
  },
  name: 'recharge',
  layout: 'common-footer',
  middleware: 'login-check',
  components: {
    UserCenterWrap,
    BackHead
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      list: [],
      active: {}
    }
  }
}
</script>

<style scoped lang="stylus">
.user
  display flex
  align-items center
  padding 20px 48px
  &>img
    width 84px
    height 84px
    border-radius 50%
    margin-right 27px
  .right
    &>h4
      margin-bottom 19px
      font-size 20px
      color #333333
      font-weight bold
    &>p
      line-height 23px
      font-size 15px
      color #333333
      &>span
        color #FFA519
      &>img
        width 23px
        height 23px
        vertical-align top
        margin-right 14px
.gold-list
  display flex
  margin-top 40px
  margin-left 48px
  &>p
    width 106px
    margin-right 38px
    font-size 16px
    color #333333
  .list
    display flex
    flex-wrap wrap
    &>li
      width 140px
      height 82px
      margin-right 52px
      margin-bottom 32px
      text-align center
      border 1px solid #E5E5E5
      cursor pointer
      @media only screen and (max-width: 1406px)
        &:nth-child(4n + 0)
          margin-right 0
      &.active
        background url(./selecte_jinbi_pre@2x.png) center center no-repeat
        background-size cover
        border none
        &>h4
          border-bottom none
          color #fff
        &>p
          color #fff
      &>h4
        height 50px
        line-height 50px
        font-size 22px
        color #000000
        border-bottom 1px solid #E5E5E5
      &>p
        line-height 30px
        font-size 16px
        color #9F9F9F
.money
  display flex
  align-items center
  margin-top 24px
  padding-left 48px
  &>h5
    margin-right 41px
    font-size 17px
    color #333333
  &>p
    font-size 28px
    color #FF3B40
    &>span
      font-size 17px
      color #333333
.pay-code
  margin-top 40px
  margin-left 159px
  width 375px
  display flex
  justify-content space-between
  .code
    width 131px
    &.green
      &>img
        border 1px solid #32C032
      &>p
        color #09BB07
    &.blue
      &>img
        border 1px solid #3E57F0
      &>p
        color #3E57F0
    &>img
      width 100%
      height 131px
      padding 10px
      margin-bottom 15px
    &>p
      text-align center
      font-size 15px
      line-height 26px
      &>img
        height 26px
        margin-right 10px
        vertical-align top
.buy-tips
  padding-left 48px
  padding-bottom 38px
  margin-top 46px
  font-size 12px
  color #9F9F9F
  &>span
    color #FF2B2B
</style>
