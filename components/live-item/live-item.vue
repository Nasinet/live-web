<template>
  <a target="_blank" :href="'/live/' + item.anchorid" class="live-item">
    <div class="cover" :style="{backgroundImage: `url(${item.thumb})`}">
      <div class="layer">
        <img src="./play@2x.png" v-if="living" alt="">
        <p v-else>暂未开播</p>
      </div>
    </div>
    <h4 class="text-overflow">{{ item.title }}</h4>
    <p>
      <span>{{ item.anchor.nick_name }}</span>
      <span v-if="item.hot"><img src="./hot2@2x.png" alt="">{{item.hot}}</span>
    </p>
    <p :class="['room-type', typeClass[item.room_type]]">{{ roomType[item.room_type] }}</p>
  </a>
</template>

<script>
export default {
  name: 'live-item',
  props: {
    item: {
      type: Object,
      default () { return {} }
    },
    living: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      roomType: ['普通房间', '私密房间', '付费房间'],
      typeClass: ['orange', 'blue', 'purple']
    }
  }
}
</script>

<style scoped lang="stylus">
.live-item
  width 269px
  background-color #ffffff
  border-radius 8px
  overflow hidden
  display block
  box-shadow 0px 3px 15px 0px rgba(0, 0, 0, 0.06)
  position relative
  .cover
    position relative
    height 153px
    background-repeat no-repeat
    background-size 100%
    background-position center center
    margin-bottom 13px
    transition all 0.3s
    &:hover
      background-size 120%
      .layer
        opacity 1
    .layer
      position absolute
      width 100%
      height 100%
      display flex
      align-items center
      justify-content center
      background-color rgba(0,0,0,0.4)
      opacity 0
      transition all 0.3s
      border-top-left-radius 8px
      border-top-right-radius 8px
      &>img
        width 60px
        height 60px
      &>p
        font-size 17px
        color #fff
  &>h4
    padding 0 9px
    margin-bottom 9px
    font-size 15px
    color #333333
  &>p
    padding 0 9px
    margin-bottom 15px
    display flex
    justify-content space-between
    font-size 12px
    color #979797
    &>span
      &>img
        width 11px
        height 13px
        margin-right 6px
        vertical-align center
  .room-type
    display block
    padding 0
    position absolute
    left 8px
    top 8px
    width 55px
    height 25px
    line-height 25px
    border-radius 3px
    font-size 12px
    color #fff
    text-align center
    &.orange
      background linear-gradient(-85deg,rgba(255,204,47,1),rgba(255,169,58,1))
    &.blue
      background linear-gradient(-85deg,rgba(47,218,255,1),rgba(47,145,255,1))
    &.purple
      background linear-gradient(-85deg,rgba(246,96,255,1),rgba(191,39,255,1))
</style>
