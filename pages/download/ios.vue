<template>
  <div class="ios-download">
    <h6>钠斯直播，安装说明</h6>
    <h4>第一步</h4>
    <p>下载【TestFlight】，然后<span class="danger">返回本页面</span>，操作<br>第二步</p>
    <a :href="appConfig.dl_ios">
      <img src="./img/testflight-logo.png" alt="">
      <div class="btn">安装苹果TestFlight</div>
    </a>
    <div style="height: 10px;"></div>
    <h4>第二步</h4>
    <div style="height: 10px;"></div>
    <p>点【下载官方版】 ，安装好后，点开始测试。</p>
    <div style="height: 20px;"></div>
    <a :href="appConfig.dl_ios">
      <img src="./img/nasilivelogo.png" alt="">
      <p>钠斯直播</p>
      <div class="btn">下载官方版</div>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ios',
  computed: {
    ...mapState(['appConfig'])
  }
}
</script>

<style scoped lang="stylus">
vw(num)
  round(num / 750, 4) * 100vw
.ios-download
  width 100%
  &>h6
    margin-bottom vw(16)
    height vw(94)
    line-height vw(94)
    text-align center
    font-size vw(34)
    color #333
    background #f5f5f5
  &>h4
    margin-bottom vw(20)
    text-align center
    font-weight bold
    font-size vw(54)
  &>p
    margin 0 vw(30)
    margin-bottom vw(10)
    line-height vw(40)
    color #666
    font-size vw(32)
    .danger
      font-size vw(42)
      color red
  &>a
    display block
    text-align center
    &>p
      margin vw(20) 0
      font-size vw(30)
      color #666
    &>img
      display block
      margin 0 auto
      width vw(220)
      height vw(220)
    .btn
      display inline-block
      margin-top vw(10)
      margin-bottom vw(20)
      padding 0 vw(40)
      height vw(60)
      line-height vw(60)
      border-radius vw(30)
      font-size vw(30)
      color #fff
      background linear-gradient(#17BEFA,#1B78F3)
</style>
