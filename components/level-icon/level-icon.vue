<template>
  <img :src="type === 'user' ? levelImgs[level] : anchorLevel[level]" class="level-icon" :style="{height: height, width: width}" alt="">
</template>

<script>
import levelImgs, { anchorLevel } from '../../util/level-icon'

export default {
  name: 'level-icon',
  props: {
    level: {
      type: Number,
      detail: 1
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'user'
    }
  },
  data () {
    return {
      levelImgs,
      anchorLevel
    }
  }
}
</script>

<style scoped lang="stylus">
  .level-icon
    display inline-block
    margin-right 6px
    vertical-align middle
</style>
