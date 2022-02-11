<template>
  <div class="rank-item">
    <span>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</span>
    <img v-if="showBtn" class="avatar" :src="item.avatar || $store.state.defaultAvatar" alt="">
    <p v-if="showBtn" class="name">{{ item.nick_name }}</p>
    <img v-if="item.vip_level && item.isVip" class="model" :src="medals[item.vip_level - 1]" alt="">
    <level-icon :type="type" :level="item.user_level" height="16px" width="25px" />
    <p v-if="!showBtn" @click.stop="$emit('showFloatUser', item)" class="name right">{{ item.nick_name }}</p>
    <div style="flex: 1"></div>
    <p class="gold">{{ gold }}<span>金币</span></p>
    <button v-if="showBtn" @click="focus" :class="{active: item.isattent}">{{ item.isattent ? '已关注' : '关注' }}</button>
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
      type: String,
      default: 'user'
    },
    showBtn: {
      type: Boolean,
      default: true
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
    focus() {
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: this.item.id, type: !this.item.isattent }})
        .then(({ data: { data } }) => {
          this.$emit('focus', {
            count: data.fans_count,
            index: this.index,
            type: this.type
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.rank-item
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
    &.right
      cursor pointer
  .model
    width 36px
    height 36px
  .gold
    font-size 12px
    color #FEC838
    &>span
      color #000000
  &>button
    margin-left 35px
    width 61px
    height 26px
    border-radius 13px
    box-shadow 0 3px 6px 0 rgba(71, 101, 255, 0.35)
    background #fff
    color #683FFF
    cursor pointer
    &.active
      color #BDB0EF
</style>
