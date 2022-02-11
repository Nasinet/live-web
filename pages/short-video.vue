<template>
  <div class="short-video">
    <na-header/>
    <div class="content">
      <div class="center-box">
        <img src="~/assets/img/short-video/phone@2x.png" alt="" class="phone">
        <div class="download">
          <img src="~/assets/img/short-video/logo@2x.png" alt="" class="logo">
          <div class="link">
            <div class="code">
              <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2162188945,3066929966&fm=11&gp=0.jpg" alt="">
              <p>扫描二维码下载钠斯直播APP</p>
            </div>
            <div class="btns">
              <a href="/"><img src="~/assets/img/short-video/android@2x.png" alt="">安卓下载</a>
              <a href="/"><img src="~/assets/img/short-video/ios@2x.png" alt="">ios下载</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../components/header/header'
export default {
  name: 'short-video',
  components: {
    NaHeader
  }
}
</script>

<style scoped lang="stylus">
.short-video
  .content
    width 100%
    height calc(100vh - 60px)
    overflow hidden
    background url(../assets/img/short-video/bg@2x.png) center center no-repeat
    background-size cover
    .center-box
      width 1397px
      margin 0 auto
      display flex
      justify-content space-between
      .phone
        width 640px
        height 751px
        margin-top 69px
      .download
        margin-top 160px
        .logo
          width 621px
          height 222px
          margin-bottom 47px
        .link
          display flex
          justify-content space-between
          padding 0 50px
          .code
            width 194px
            border-radius 19px
            padding-top 18px
            background-color #fff
            &>img
              width 100%
              padding 0 15px
              height 178px
            &>p
              padding-bottom 15px
              text-align center
              font-size 13px
              color #A1A1A1
          .btns
            margin-top 10px
            &>a
              width 274px
              height 76px
              line-height 74px
              display block
              margin-bottom 49px
              border-radius 38px
              border 2px solid #fff
              text-align center
              font-size 28px
              color #FFFFFF
              &:last-child
                margin-bottom 0
              &>img
                display inline-block
                width 53px
                height 53px
                margin-top 10px
                margin-right 21px
                vertical-align top
</style>
