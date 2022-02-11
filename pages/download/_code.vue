<template>
  <div class="download">
    <div class="swiper-container" @touchstart="copy" @touchmove="copy" @click="copy">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="pc">
            <img src="./img/one/pc-phone@2x.png" alt="">
            <div class="download-right">
              <div class="top">
                <div class="logo-title">
                  <img class="logo" src="./img/one/logo@2x.png" alt="">
                  <img class="title" src="./img/one/pc-title.png" alt="">
                </div>
                <div class="code">
                  <img :src="appConfig.dl_qrcode" alt="">
                  <p>扫描二维码下载钠斯直播APP</p>
                </div>
              </div>
              <div class="download-link">
                <a :href="appConfig.dl_android">
                  <img src="./img/one/android@2x.png" alt="">
                  <span>安卓下载</span>
                </a>
                <a :href="appConfig.dl_ios">
                  <img src="./img/one/ios@2x.png" alt="">
                  <span>IOS下载</span>
                </a>
              </div>
            </div>
          </div>
          <div class="h5">
            <img src="./img/one/h5-logo@2x.png" alt="" class="logo">
            <img src="./img/one/pc-title.png" alt="" class="title">
            <img src="./img/one/h5-phone@2x.png" alt="" class="phone">
            <a href="/" class="download h5-download"  @click.prevent="download">立即下载</a>
          </div>
        </div>
        <div class="swiper-slide two">
          <div class="pc">
            <img src="./img/two/pc-phone@2x.png" alt="">
            <div class="download-right">
              <div class="top">
                <div class="logo-title">
                  <img class="logo" src="./img/one/logo@2x.png" alt="">
                  <img class="title" src="./img/two/title@2x.png" alt="">
                </div>
                <div class="code">
                  <img :src="appConfig.dl_qrcode" alt="">
                  <p>扫描二维码下载钠斯直播APP</p>
                </div>
              </div>
              <div class="download-link">
                <a :href="appConfig.dl_android">
                  <img src="./img/one/android@2x.png" alt="">
                  <span>安卓下载</span>
                </a>
                <a :href="appConfig.dl_ios">
                  <img src="./img/one/ios@2x.png" alt="">
                  <span>IOS下载</span>
                </a>
              </div>
            </div>
          </div>
          <div class="h5">
            <img src="./img/one/h5-logo@2x.png" alt="" class="logo">
            <img src="./img/two/title@2x.png" alt="" class="title">
            <img src="./img/two/h5-phone@2x.png" alt="" class="two-phone">
            <a href="/" class="download h5-download" @click.prevent="download">立即下载</a>
          </div>
        </div>
        <div class="swiper-slide three">
          <div class="pc">
            <img src="./img/three/pc-phone@2x.png" alt="">
            <div class="download-right">
              <div class="top">
                <div class="logo-title">
                  <img class="logo" src="./img/one/logo@2x.png" alt="">
                  <img class="title" src="./img/three/title.png" alt="">
                </div>
                <div class="code">
                  <img :src="appConfig.dl_qrcode" alt="">
                  <p>扫描二维码下载钠斯直播APP</p>
                </div>
              </div>
              <div class="download-link">
                <a :href="appConfig.dl_android">
                  <img src="./img/one/android@2x.png" alt="">
                  <span>安卓下载</span>
                </a>
                <a :href="appConfig.dl_ios">
                  <img src="./img/one/ios@2x.png" alt="">
                  <span>IOS下载</span>
                </a>
              </div>
            </div>
          </div>
          <div class="h5">
            <img src="./img/one/h5-logo@2x.png" alt="" class="logo">
            <img src="./img/three/title.png" alt="" class="title">
            <img src="./img/three/h5-phone@2x.png" alt="" class="three-phone">
            <a href="/" class="download h5-download"  @click.prevent="download">立即下载</a>
          </div>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
    </div>
    <div class="layer" ref="layer">
      <img src="./img/jiantou@2x.png" alt="" class="arrow">
      <img src="./img/zi@2x.png" alt="" class="tips">
    </div>
    <button id="copyBtn" ref="copyBtn" style="position: fixed; display: none;" :data-clipboard-text="'NI_' + code"></button>
  </div>
</template>

<script>
import isWeiXin from '../../util/check-wx'
import Cipboard from 'clipboard'
import { mapState } from 'vuex'

export default {
  name: 'download',
  data() {
    return {
      showLayer: false,
      code: ''
    }
  },
  mounted() {
    this.createCopy()
    setTimeout(() => {
      this.mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        // 如果需要分页器,
        preventClicks: false,
        pagination: {
          el: '.swiper-pagination'
        },
        speed: 500,
        height: document.body.clientHeight,
        mousewheel: true,
        observer: false,
        observeParents: false,
        observeSlideChildren: false
      })
    }, 50)
  },
  computed: {
    ...mapState(['appConfig'])
  },
  methods: {
    copy() {
      this.$refs.copyBtn.click()
    },
    createCopy() {
      this.code = this.$route.params.code
      this.copyBtn = new Cipboard('#copyBtn')
      this.copyBtn.on('error', (err) => {
        console.log(err)
      })
    },
    download() {
      this.$refs.copyBtn.click()
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      if(isiOS){
        this.$router.push('/download/ios')
        // window.location.href = this.appConfig.dl_ios
      }else if(isAndroid){
        window.location.href = this.appConfig.dl_android
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  vw(num)
    round(num / 750, 4) * 100vw
.download
  width 100vw
  height 100vh
  position relative
  .layer
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 9
    background rgba(0, 0, 0, 0.7)
    display none
    .arrow
      position absolute
      top vw(105)
      right vw(64)
      width vw(137)
      height vw(160)
    .tips
      display block
      width vw(329)
      height vw(155)
      margin 0 auto
      margin-top vw(300)
  .swiper-container
    width 100vw
    height 100vh
    position relative
    .swiper-pagination
      width 12px
      ::v-deep
        .swiper-pagination-bullet
          width 12px
          margin 25px auto
          height 40px
          background #7D7884
          opacity 1
          border-radius 6px
          transition all 0.2s
          &.swiper-pagination-bullet-active
            width 12px
            height 67px
            background #fff
    .swiper-slide
      width 100vw
      display flex
      align-items center
      background url(./img/one/pc-bg@2x.png) center center no-repeat
      background-size cover
      .h5
        display none
      .pc
        width 1485px
        margin-left 95px
        display flex
        align-items center
        justify-content space-between
        &>img
          width 738px
          height 788px
        .download-right
          .top
            display flex
            .logo-title
              margin-right 39px
              .logo
                margin-bottom 19px
                width 338px
                height 169px
              .title
                margin-left 6px
                display block
                width 370px
                height 68px
            .code
              &>img
                width 302px
                height 302px
                margin-bottom 28px
                border-radius 10px
              &>p
                text-align center
                font-size 22px
                color #CECECE
          .download-link
            margin-top 64px
            display flex
            justify-content space-between
            &>a
              width 292px
              height 80px
              line-height 80px
              border-radius 40px
              background linear-gradient(90deg,rgba(158,93,255,1),rgba(47,233,255,1))
              text-align center
              font-size 28px
              color #FFFFFF
              text-decoration none
              &>img
                width 50px
                height 50px
                margin-right 15px
                vertical-align top
                box-sizing content-box
                padding-top 15px
      @media only screen and (max-width: 1600px)
        .pc
          width 1285px
          margin 0 auto
          &>img
            width 615px
            height 657px
          .download-right
            .top
              .logo-title
                margin-right 33px
                .logo
                  margin-bottom 16px
                  width 282px
                  height 141px
                .title
                  margin-left 6px
                  width 308px
                  height 57px
              .code
                &>img
                  width 250px
                  height 250px
                  margin-bottom 23px
                  border-radius 8px
                &>p
                  font-size 18px
            .download-link
              margin-top 53px
              &>a
                width 243px
                height 68px
                line-height 68px
                border-radius 34px
                font-size 25px
                &>img
                  width 42px
                  height 42px
                  margin-right 12px
                  padding-top 13px
  @media only screen and (max-width: 640px)
    .swiper-container
      width 100vw
      height 100vh
      .swiper-pagination
        width vw(20)
        ::v-deep
          .swiper-pagination-bullet
            width vw(10)
            margin vw(20) auto
            height vw(10)
            background #7D7884
            opacity 1
            border-radius 50%
            transition all 0.2s
            &.swiper-pagination-bullet-active
              width vw(20)
              height vw(20)
              background #fff
      .swiper-slide
        display block
        width 100vw
        background url(./img/one/h5-bg@2x.png) center center no-repeat
        background-size cover
        .pc
          display none
        .h5
          display block
          width 100vw
          padding-top vw(17)
          .logo
            display block
            width vw(209)
            margin-left vw(27)
            height vw(89)
          .title
            display block
            width vw(370)
            margin 0 auto
            margin-top vw(5)
            height vw(68)
          .phone
            display block
            width vw(643)
            height vw(728)
            margin-top vw(39)
            margin-bottom vw(36)
            margin-left vw(20)
          .two-phone
            display block
            width vw(665)
            height vw(805)
            margin 0 auto
          .three-phone
            display block
            width vw(607)
            height vw(802)
            margin-left vw(70)
          .download
            display block
            width vw(351)
            margin 0 auto
            height vw(68)
            line-height vw(68)
            border-radius vw(34)
            background linear-gradient(90deg,rgba(158,93,255,1),rgba(47,233,255,1))
            text-align center
            font-size vw(30)
            color #FFFFFF
            text-decoration none
</style>
