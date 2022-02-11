<template>
  <div class="gift-wrap">
    <div class="float-gift">
      <img :src="gift.sender.avatar || $store.state.defaultAvatar" alt="">
      <p class="name text-overflow">{{ gift.sender.nick_name }}</p>
      <span>赠送</span>
      <p class="gift">{{ gift.title }}x{{gift.count}}</p>
    </div>
    <div class="animation" v-if="giftType==='gif'" :style="{backgroundImage: `url(${imgUrl})`}"></div>
    <div class="animation" :id="'svg_play' + index" v-if="giftType==='svga'"></div>
  </div>
</template>

<script>
// import SVGA from 'svgaplayerweb'
import { loadScript } from '../../util'
export default {
  name: 'float-gift',
  props: {
    gift: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      giftType: 'img'
    }
  },
  computed: {
    imgUrl() {
      return this.gift.animation + `?time=${Date.now()}`
    }
  },
  beforeDestroy() {
    this.player = null
    clearTimeout(this.timer)
  },
  mounted() {
    document.getElementById('live_video').appendChild(this.$el)
    this.timer = setTimeout(() => {
      this.$emit('delGift', this.index)
    }, this.gift.duration > 8000 ? this.gift.duration : 8000)
    if (!this.$store.state.isOpenAnimation) return;
    if (this.gift.animat_type === 1) {
      this.giftType = 'gif'
      setTimeout(() => {
        this.giftType = 'img'
      }, this.gift.duration)
    }
    loadScript('https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.1/build/svga.min.js', 'SVGA').then(() => {
      if (this.gift.animat_type === 2) {
        this.giftType = 'svga'
        this.$nextTick(() => {
          this.playSvg()
        })
      }
    })
    
  },
  methods: {
    playSvg() {
      if (!this.player) {
        this.player = new SVGA.Player('#svg_play' + this.index)
        this.parser = new SVGA.Parser('#svg_play' + this.index)
      }
      this.player.clear()
      this.parser.load(this.gift.animation, (videoItem) => {
        if (!this.player) return
        this.player.setVideoItem(videoItem)
        this.player.startAnimation()
        setTimeout(() => {
          this.giftType = 'img'
          this.player = null
        }, this.gift.duration)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @keyframes slideRight
    0%
      left 100%
    100%
      left -339px
.gift-wrap
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  .animation
    position absolute
    width 50%
    height 50%
    left 25%
    top 25%
    z-index 9
    background-repeat no-repeat
    background-size contain
    background-position center center
.float-gift
  width 339px
  height 46px
  position absolute
  top 16px
  z-index 9
  left 100%
  background url(./gift@2x.png) center center no-repeat
  background-size 100% 100%
  display flex
  padding-top 8px
  align-items center
  animation slideRight 8s linear
  &>img
    width 33px
    height 33px
    margin-left 12px
    margin-right 11px
    border-radius 50%
  .name
    margin-right 7px
    max-width 101px
    font-size 17px
    color #FFFFFF
    font-weight bold
  &>span
    margin-right 7px
    font-size 17px
    color #FFFFFF
    font-weight bold
  .gift
    font-size 17px
    color #FFFC16
    font-weight bold
</style>
