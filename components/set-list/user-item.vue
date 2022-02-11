<template>
  <div class="rank-item">
    <img class="avatar" :src="item.avatar || $store.state.defaultAvatar" alt="">
    <img v-if="item.vip_level && item.isVip" class="model" :src="medals[item.vip_level - 1]" alt="">
    <level-icon :level="item.user_level" height="16px" width="25px" />
    <img src="./fangguan@2x.png" v-if="type===0" class="mgr" alt="">
    <p @click.stop="$emit('showFloatUser', item)" class="name right">{{ item.nick_name }}</p>
    <button @click="cancel(type)">{{ type === 0 ? '取消房管' : '取消禁言' }}</button>
  </div>
</template>

<script>
  import LevelIcon from '../level-icon/level-icon'
  import {post} from "../../util/http";

  export default {
    name: 'rank-item',
    components: {
      LevelIcon
    },
    props: {
      item: {
        type: Object,
        default() { return {} }
      },
      index: {
        type: Number,
        default: 0
      },
      type: {
        type: Number,
        default: 0
      },
      gold: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        medals: [require('../../pages/rank/youxia@2x.png'), require('../../pages/rank/qishi@2x.png'), require('../../pages/rank/gongjue@2x.png'), require('../../pages/rank/king@2x.png')]
      }
    },
    methods: {
      cancel(type) {
        if (type === 0) {
          post({url: '/webapi/live/setRoomMgr', data: { mgrid: this.item.id, type: 0 }})
            .then(() => {
              this.$emit('cancel', this.index)
            })
        } else {
          post({ url: '/webapi/live/banUser', data: { userid: this.item.id, type: 0, anchorid: this.$route.params.id } })
            .then(() => {
              this.$emit('cancel', this.index)
            })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
  .rank-item
    margin 0 18px
    height 69px
    display flex
    align-items center
    &.bg
      background #F9F9FF
    &>span
      margin-right 10px
      font-size 12px
      color #D5D5D5
    .avatar
      width 42px
      height 42px
      margin-right 10px
      border-radius 50%
    .name
      margin-right 6px
      font-size 13px
      color #000
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      &.right
        flex 1
        cursor pointer
    .model
      width 36px
      height 36px
      margin-right 7px
    .mgr
      width 37px
      height 17px
      margin-right 5px
    .gold
      font-size 12px
      color #FEC838
      &>span
        color #000000
    &>button
      padding 0 8px
      height 26px
      border-radius 13px
      border 1px solid $theme-color
      background #fff
      color $theme-color
      cursor pointer
      &.active
        color #BDB0EF
</style>
