<template>
  <div class="player-control" @mouseover.stop="$emit('show')" @mouseleave.stop="$emit('hide')">
    <img @click="togglePlay" v-if="!paused" src="~/assets/img/home/stop@2x.png" alt="" class="stop">
    <img @click="togglePlay" v-else src="~/assets/img/home/play@2x.png" alt="" class="stop">
    <div style="flex: 1;"></div>
    <img @click="toggleVol" v-if="defaultVolume>0" src="~/assets/img/home/voice@2x.png" alt="" class="volume">
    <img @click="toggleVol" v-else src="~/assets/img/home/mute@2x.png" alt="" class="volume">
    <div class="volume-slider">
      <el-slider v-model.lazy="volume" size="mini" input-size="mini" :show-tooltip="false" />
    </div>
    <div @click="closeDan" :class="['switch', close ? 'close' : '']">
      <div class="circle">弹</div>
    </div>
    <img @click="fullscreen" src="./quanping@2x.png" class="full" alt="">
  </div>
</template>

<script>
export default {
  name: 'player-control',
  props: {
    paused: {
      type: Boolean,
      default: false
    },
    defaultVolume: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      volume: 50,
      close: false,
      full: false
    }
  },
  mounted() {
    this.volume = this.defaultVolume
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.$off('togglePlay')
    this.$off('toggleVol')
    this.$off('toggleDan')
    this.$off('fullscreen')
    this.$off('changeVol')
  },
  methods: {
    togglePlay() {
      this.$emit('togglePlay')
    },
    toggleVol() {
      this.$emit('toggleVol')
      if (this.volume > 0) {
        this.volume = 0
      } else {
        this.volume = 100
      }
    },
    closeDan() {
      this.close = !this.close
      this.$emit('toggleDan', this.close)
    },
    fullscreen() {
      this.full = !this.full
      this.$emit('fullscreen', this.full)
      document.getElementById('live_video').appendChild(this.$el)
    }
  },
  watch: {
    volume(newVal) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('changeVol', newVal)
      }, 100)
    }
  }
}
</script>

<style scoped lang="stylus">
.player-control
  position absolute
  left 0
  bottom 0
  width 100%
  padding 0 25px
  height 49px
  background-color rgba(0,0,0,.4)
  display flex
  align-items center
  box-sizing border-box
  transform translate3d(0, 100%, 0)
  transition all 0.3s
  .stop
    width 19px
    height 19px
    margin-right 32px
    cursor pointer
  .volume
    width 16px
    height 16px
    margin-right 10px
    cursor pointer
  .volume-slider
    width 80px
    transform-origin 0
  .switch
    width 50px
    height 20px
    margin-left 43px
    position relative
    border-radius 10px
    background-color #E88332
    cursor pointer
    .circle
      width 24px
      height 24px
      position absolute
      top -2px
      left 26px
      line-height 24px
      border-radius 50%
      text-align center
      background-color #fff
      transition all 0.3s
      font-size 14px
      color #E88332
    &.close
      background-color #ccc
      .circle
        left 0
  .full
    width 22px
    height 22px
    margin-left 39px
</style>
