<template>
  <div class="hot-anchor">
    <div class="anchor-content">
      <h4>热门主播</h4>
      <div class="anchor-list">
        <a :href="`/live/${item.id}`" target="_blank" v-for="(item, index) in anchorList" :key="item.id">
          <img :src="item.avatar" alt="">
          <p>{{ item.nick_name }}</p>
          <div @click.prevent="focus(index, item)"
               class="focus-btn btn"
               :style="{color: item.is_attent ? '#98D9DA' : '#18D5D9'}">{{ item.is_attent ? '已关注' : '关注' }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '../../util/http'

export default {
  name: 'hot-anchor',
  props: {
    anchorList: {
      type: Array,
      default() { return [] }
    }
  },
  methods: {
    focus(index, item) {
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: item.id, type: !item.is_attent }})
        .then(() => {
          this.$emit('focus', index)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.hot-anchor
  margin-top 38px
  background-color #EBF7F7
  .anchor-content
    width 1406px
    margin 0 auto
    padding-top 32px
    padding-bottom 41px
    &>h4
      margin-bottom 20px
      font-weight bold
      font-size 21px
      color #333333
    .anchor-list
      display flex
      flex-wrap wrap
      &>a
        width 188px
        padding-top 36px
        margin-right 15px
        text-align center
        background-color #ffffff
        overflow hidden
        border-radius 5px
        &:nth-child(7n + 0)
          margin-right 0
        &>img
          width 82px
          height 82px
          border-radius 50%
        &>p
          margin-top 22px
          margin-bottom 20px
          font-size 15px
          color #333333
        .btn
          margin 0 auto
          margin-bottom 38px
  @media only screen and (max-width: 1406px)
    .anchor-content
      width 1137px
      .anchor-list
        &>a
          width 152px
          padding-top 29px
          margin-right 12px
          .btn
            margin-bottom 30px
</style>
