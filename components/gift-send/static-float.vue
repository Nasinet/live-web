<template>
  <div @mouseover="$emit('show')" @mouseleave="$emit('hide')" class="static-float" :style="{left: left + 'px'}">
    <div class="box">
      <div class="desc">
        <div class="icon">
          <img v-if="gift.animat_type!==2" :src="gift.animation" alt="">
          <div id="svg_play" style="width: 100%; height: 100%;"></div>
        </div>
        <div class="text">
          <h4>{{ gift.title }}</h4>
          <p>({{ gift.price }}金币)</p>
          <span>幸运爆棚，赶走水逆！</span>
          <button @click="sendGift" v-if="gift.animat_type!==0">赠送</button>
        </div>
      </div>
      <ul class="num" v-if="gift.animat_type===0">
        <li @click="activeNum=item" v-for="item in sendNum" :key="item" :class="{active: activeNum === item}">{{ item }}</li>
      </ul>
      <div class="send" v-if="gift.animat_type===0">
        <span>消耗{{ gift.price * activeNum }}金币</span>
        <div class="send-btn">
          <input v-model="activeNum" type="text">
          <button @click="sendGift">赠送</button>
        </div>
      </div>
    </div>
    <i class="el-icon-caret-bottom"></i>
  </div>
</template>

<script>
// import SVGA from 'svgaplayerweb'
import { loadScript } from '../../util'
export default {
  name: 'static-float',
  props: {
    gift: {
      type: Object,
      default() { return {} }
    },
    index: {
      type: Number,
      default: 0
    },
    scrollNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      sendNum: [1, 10, 66, 88, 100, 520, 1314],
      activeNum: 1
    }
  },
  computed: {
    left() {
      const leftIndex = this.index % this.scrollNum
      return -380 + 26 + (leftIndex + 1) * 58
    }
  },
  beforeDestroy() {
    this.$off('sendGift')
    this.player = null
  },
  mounted() {
    loadScript('https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.1/build/svga.min.js', 'SVGA').then(() => {
      if (this.gift.animat_type === 2) this.playSvg()
    })
  },
  methods: {
    playSvg() {
      if (!this.player) {
        this.player = new SVGA.Player('#svg_play')
        this.parser = new SVGA.Parser('#svg_play')
      }
      this.player.clear()
      this.parser.load(this.gift.animation, (videoItem) => {
        if (!this.player) return
        this.player.setVideoItem(videoItem)
        this.player.startAnimation()
      })
    },
    sendGift() {
      this.$emit('sendGift', this.activeNum)
    }
  },
  watch: {
    gift: function(newVal) {
      this.activeNum = 1
      if (this.player) {
        this.player.stopAnimation()
        this.player.clear()
        this.player = null
        this.parser = null
      }
      this.$nextTick(() => {
        if (newVal.animat_type === 2) {
          this.playSvg()
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.static-float
  position absolute
  right -17px
  bottom 46px
  width 380px
  z-index 99
  overflow hidden
  padding-bottom 18px
  .box
    width 100%
    padding 13px 9px 17px 9px
    background-color #fff
    border-radius 9px
    .desc
      display flex
      .icon
        width 103px
        height 103px
        margin-right 14px
        line-height 103px
        text-align center
        border-radius 5px
        border 1px solid #EEEEEE
        display flex
        justify-content center
        align-content center
        &>img
          height 90%
          width 90%
      .text
        &>h4
          margin-bottom 6px
          font-size 15px
          color #333337
        &>p
          margin-bottom 12px
          font-size 13px
          color $theme-color
        &>span
          font-size 13px
          color #B2B2B2
        &>button
          display block
          width 48px
          height 22px
          margin-top 18px
          border-radius 3px
          text-align center
          background linear-gradient(90deg,rgba(130,210,255,1),rgba(133,87,255,1))
          font-size 13px
          color #FFFFFF
    .num
      display flex
      margin-top 11px
      justify-content space-between
      margin-bottom 16px
      &>li
        width 44px
        height 18px
        border-radius 9px
        line-height 16px
        text-align center
        border 1px solid #DBDBDB
        font-size 13px
        color #666666
        cursor pointer
        &.active
          border-color $theme-color
          color $theme-color
    .send
      display flex
      align-items center
      justify-content space-between
      &>span
        font-size 13px
        color #888888
      .send-btn
        display flex
        height 27px
        &>input
          width 44px
          height 100%
          font-size 13px
          color #666666
          text-align center
          border 1px solid #CACACA
          outline none
        &>button
          width 44px
          height 100%
          background linear-gradient(81deg,rgba(130,209,255,1),rgba(133,100,255,1))
          font-size 13px
          color #FFFFFF
  &>i
    position absolute
    right 24px
    bottom 5px
    font-size 20px
    color #fff
</style>
