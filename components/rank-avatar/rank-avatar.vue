<template>
  <div class="rank-avatar" :style="rankBgStyle">
    <img :src="avatar" alt="">
  </div>
</template>

<script>
const rankBg = [require('./no1@2x.png'), require('./no2@2x.png'), require('./no3@2x.png')]

export default {
  name: 'rank-avatar',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    rank: {
      type: Number,
      default: 0
    }
  },
  computed: {
    rankBgStyle () {
      const bgImg = rankBg[this.rank]
      if (bgImg) return {backgroundImage: `url(${bgImg})`}
      return ''
    }
  }
}
</script>

<style scoped lang="stylus">
.rank-avatar
  width 51px
  height 53px
  margin-bottom 8px
  background-position 0 0
  background-size 100%
  overflow hidden
  &>img
    margin-left 7px
    margin-top 8px
    width 41px
    height 41px
    border-radius 50%
</style>
