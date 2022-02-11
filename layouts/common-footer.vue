<template>
  <div>
    <nuxt />
    <div class="footer-wrap">
      <div class="footer">
        <div class="hot">
          <h4>热门频道</h4>
          <div class="list">
            <div class="item">
              <a :href="`/classify?type=${item.id}`" target="_blank" v-for="item in categories.slice(0, 5)" :key="item.id">{{ item.title }}</a>
            </div>
            <div class="item">
              <a :href="`/classify?type=${item.id}`" target="_blank" v-for="item in categories.slice(5, 10)" :key="item.id">{{ item.title }}</a>
            </div>
            <div class="item">
              <a :href="`/classify?type=${item.id}`" target="_blank" v-for="item in categories.slice(10)" :key="item.id">{{ item.title }}</a>
            </div>
          </div>
        </div>
        <div class="about">
          <h4>关于我们</h4>
          <a target="_blank" href="/h5/cooperation?hide=1">商务合作</a>
          <a target="_blank" href="/contact">联系客服</a>
        </div>
        <div class="about">
          <h4>帮助中心</h4>
          <a target="_blank" href="/privacy?type=1">用户注册协议</a>
          <a target="_blank" href="/privacy?type=2">隐私权政策</a>
          <a target="_blank" href="/privacy?type=3">用户阳光行为规范</a>
          <a target="_blank" href="/privacy?type=4">直播协议</a>
          <a target="_blank" href="/privacy?type=5">直播内容管理规定</a>
        </div>
        <div class="download">
          <h4>产品下载</h4>
          <div class="code">
            <div class="code-img">
              <img :src="appConfig.dl_qrcode" alt="">
<!--              <p>ios下载</p>-->
            </div>
          </div>
        </div>
      </div>
      <p class="copyright">{{ appConfig.copyright }}</p>
    </div>
    <login v-show="$store.state.showLogin" />
    <dynamic-release v-show="$store.state.showDynamicRel" />
  </div>
</template>

<script>
import Login from '../components/login/login'
import DynamicRelease from '../components/dynamic-release/dynamic-release'
import { mapState } from 'vuex'

export default {
  components: {
    Login,
    DynamicRelease
  },
  computed: {
    ...mapState(['categories', 'appConfig'])
  }
}
</script>

<style lang="stylus">
html
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, 'Helvetica Neue', Arial, sans-serif
  font-size 16px
  word-spacing 1px
  -ms-text-size-adjust 100%
  -webkit-text-size-adjust 100%
  -moz-osx-font-smoothing grayscale
  -webkit-font-smoothing antialiased
  box-sizing border-box
*,
*:before,
*:after
  box-sizing border-box
  margin 0

.footer-wrap
  width 100%
  padding-top 52px
  padding-bottom 32px
  background #1B1B27
  .footer
    width 1406px
    margin 0 auto
    display flex
    justify-content space-between
    .hot
      &>h4
        margin-bottom 28px
        font-size 17px
        color #FFFFFF
      .list
        display flex
        .item
          margin-right 49px
          &:last-child
            margin-right 0
          &>a
            display block
            margin-bottom 20px
            font-size 13px
            color #A4A4A9
            &:last-child
              margin-bottom 0
    .about
      &>h4
        margin-bottom 28px
        font-size 17px
        color #FFFFFF
        // text-align center
      &>a
        display block
        margin-bottom 20px
        // text-align center
        font-size 13px
        color #A4A4A9
        &:last-child
          margin-bottom 0
    .download
      &>h4
        margin-bottom 24px
        font-size 17px
        color #FFFFFF
        text-align center
      .code
        display flex
        .code-img
          margin-right 68px
          &:last-child
            margin-right 0
          &>img
            width 104px
            height 104px
          &>p
            margin-top 14px
            text-align center
            font-size 13px
            color #A4A4A9
  .friend-link
    width 1406px
    margin 0 auto
    margin-top 44px
    font-size 13px
    color #A4A4A9
    text-align center
    line-height 20px
    &>a
      white-space nowrap
      color #A4A4A9
  .copyright
    width 1406px
    margin 0 auto
    margin-top 40px
    text-align center
    font-size 13px
    color #A4A4A9
  @media only screen and (max-width: 1406px)
    .footer
      width 1137px
    .friend-link
      width 1137px
</style>

