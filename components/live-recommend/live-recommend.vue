<template>
  <div class="live-recommend">
    <h4>直播推荐</h4>
    <div style="position:relative;">
      <div ref="scroll" class="scroll-wrap">
        <div ref="list" class="list" :style="{width: (list.length * 286 - 17) + 'px', transform: `translate3d(-${transX}px, 0, 0)`}">
          <LiveItem class="item" v-for="item in list" :key="item.id" :item="item" />
        </div>
      </div>
      <img @click="prev" src="./before@2x.png" alt="" class="control left">
      <img @click="next" src="./next@2x.png" alt="" class="control right">
    </div>
  </div>
</template>

<script>
import LiveItem from '../live-item/live-item'

export default {
  name: 'live-recommend',
  created () {
    const list = []
    for (let i = 0; i < 25; i++) {
      list.push({
        id: i + 1,
        title: '进来听歌鸭fffdgsjfggfjkfbrefberfenkrcscsdsdfds',
        cover: 'http://img5.imgtn.bdimg.com/it/u=2249005249,1957188694&fm=26&gp=0.jpg',
        nick_name: '小丫',
        hot: 1000
      })
    }
    this.list = list
  },
  components: {
    LiveItem
  },
  data () {
    return {
      list: [],
      listWidth: 0,
      transX: 0
    }
  },
  mounted() {
    this.listWidth = this.$refs.list.clientWidth
  },
  methods: {
    next () {
      const scrollWidth = this.$refs.scroll.clientWidth
      if (this.listWidth <= scrollWidth) return
      const maxX = this.listWidth - scrollWidth
      if (this.transX === maxX) return
      const num = Math.floor(scrollWidth / 286)
      const oneX = num * 286
      if (this.transX + oneX >= maxX) {
        this.transX = maxX
        return
      }
      this.transX += oneX
    },
    prev() {
      const scrollWidth = this.$refs.scroll.clientWidth
      if (this.transX === 0) return
      const num = Math.floor(scrollWidth / 286)
      const oneX = num * 286
      if (this.transX - oneX <= 0) {
        this.transX = 0
        return
      }
      this.transX -= oneX
    }
  }
}
</script>

<style scoped lang="stylus">
.live-recommend
  margin-top 31px
  margin-bottom 24px
  &>h4
    margin-bottom 18px
    font-size 21px
    color #3B3B50
    font-weight bold
  .control
    position absolute
    top 65px
    width 23px
    height 23px
    cursor pointer
    &.left
      left -11px
    &.right
      right -11px
  .scroll-wrap
    width 100%
    overflow hidden
    .list
      display flex
      transition all 0.5s
      .item
        margin-right 17px
        &:last-child
          margin-right 0
</style>
