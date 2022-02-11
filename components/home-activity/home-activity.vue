<template>
  <div class="hot-active">
    <div class="activity">
      <h4 class="title">热门活动 <a href="/activity?type=1" target="_blank">更多 <i class="el-icon-arrow-right"></i></a></h4>
      <div class="content" v-if="activities.length > 2">
        <a :href="'/activity/' + activities[0].id" class="big" target="_blank">
          <img :src="activities[0].thumb_url" alt="">
        </a>
        <div class="right">
          <a :href="'/activity/' + activities[1].id" target="_blank">
            <img :src="activities[1].thumb_url" alt="">
          </a>
          <a :href="'/activity/' + activities[2].id" target="_blank">
            <img :src="activities[2].thumb_url" alt="">
          </a>
        </div>
      </div>
    </div>
    <div class="message">
      <h4 class="title">官方消息 <a href="/activity?type=2" target="_blank">更多 <i class="el-icon-arrow-right"></i></a></h4>
      <div class="msg-list">
        <a v-for="item in notices" :key="item.id" target="_blank" :href="'/activity/' + item.id">
          <h5 class="text-overflow"><span :class="item.type === 2 ? 'report-title' : 'act'">{{ item.type === 2 ? '公告' : '活动' }}</span>{{ item.title }}</h5>
          <div class="content text-overflow">{{ item.content }}</div>
        </a>
      </div>
    </div>
    <div class="anchor-rank">
      <h4 class="title">主播周榜 <a href="/rank" target="_blank">更多 <i class="el-icon-arrow-right"></i></a></h4>
      <div class="anchor-list">
        <a v-for="(item, index) in anchorRank" :key="item.id" target="_blank" :href="`/live/${item.anchor.id}`">
          <span>0{{ index + 1 }}</span>
          <rank-avatar :avatar="item.anchor.avatar" :rank="index" />
          <div :style="{marginTop: index < 3 ? '-8px' : '0'}" class="name text-overflow">{{ item.anchor.nick_name }}</div>
          <div style="flex: 1;"></div>
          <div class="diamond"><img src="./zuanshi@3x.png" alt=""><span>{{ item.income }}</span></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import RankAvatar from '../rank-avatar/rank-avatar'
import {post} from "../../util/http";
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'home-activity',
  components: {
    RankAvatar
  },
  props: {
    activities: {
      type: Array,
      default() { return [] }
    },
    notices: {
      type: Array,
      default() {
        return []
      }
    },
    anchorRank: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      anchorList: []
    }
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    focus(item) {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: item.anchor.id, type: !item.anchor.isattent }})
        .then(({ data: { data } }) => {
          this.$emit('focus', data.fans_count)
        })
    }
  }
}
</script>

<style lang="stylus">
.hot-active
  margin 0 auto
  margin-top 20px
  width 1406px
  display flex
  .title
    display flex
    align-items center
    margin-bottom 20px
    justify-content space-between
    font-size 20px
    color #333333
    font-weight bold
    &>a
      line-height 16px
      font-size 13px
      color #575757
      font-weight normal
  .activity
    margin-right 16px
    .content
      display flex
      .big
        margin-right 14px
        &>img
          width 459px
          height 328px
      .right
        &>a
          display block
          &:first-child
            margin-bottom 16px
          &>img
            width 222px
            height 155px
  .message
    width 340px
    margin-right 15px
    .msg-list
      padding 17px 15px
      border-radius 5px
      background-color #fff
      height 328px
      &>a
        display block
        margin-bottom 21px
        &>h5
          margin-bottom 5px
          font-size 14px
          color #233255
          font-weight bold
          &>span
            display inline-block
            width 36px
            margin-right 10px
            height 16px
            line-height 16px
            text-align center
            font-size 13px
            color #FFFFFF
            font-weight normal
            border-radius 3px
            &.report-title
              background-color #F9D385
            &.act
              background-color #B29CFF
        .content
          font-size 12px
          color #848498
          p
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            word-break break-all
  .anchor-rank
    max-width 350px
    flex 1
    .anchor-list
      padding 0 16px
      padding-top 14px
      height 328px
      background-color #fff
      &>a
        display flex
        align-items center
        .name
          width 150px
          padding-left 10px
          font-size 15px
          color #333333
          font-weight bold
        &>span
          margin-right 10px
          font-size 13px
          font-style italic
          font-weight bold
        .diamond
          width 69px
          text-align right
          font-size 14px
          color #333333
          &>img
            width 16px
            height 14px
            margin-right 7px
            vertical-align middle
@media only screen and (max-width: 1406px)
  .hot-active
    width 1137px
    .activity
      margin-right 13px
      .content
        .big
          margin-right 11px
          &>img
            width 367px
            height 262px
        .right
          &>a
            &:first-child
              margin-bottom 13px
            &>img
              width 177px
              height 124px

    .message
      width 272px
      .msg-list
        height 264px
    .anchor-rank
      .anchor-list
        &>a
          .name
            width 90px
</style>
