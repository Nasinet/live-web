<template>
  <div class="animation">
    <div class="animation-box" v-if="gift.animat_type === 1" :style="{backgroundImage: `url(${gift.animation})`}"></div>
    <div class="animation-box" id="svg_play_ani" v-else></div>
  </div>
</template>

<script>
import SVGA from "svgaplayerweb";

export default {
  name: 'animation',
  mounted() {
    if (this.gift.animat_type === 1) {
    }
    if (this.gift.animat_type === 2) {
      this.giftType = 'svga'
      this.$nextTick(() => {
        this.playSvg()
      })
    }
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
          this.player = null
        }, this.gift.duration)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .animation
    position absolute
    width 50%
    height 50%
    left 25%
    top 25%
    z-index 9
    .animation-box
      width 100%
      height 100%
      background-repeat no-repeat
      background-size cover
      background-position center center
</style>
