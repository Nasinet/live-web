<template>
  <div class="activity">
    <na-header class="header" />
    <div class="tabs">
      <a href="/activity?type=1" :class="{active: activeTab===1}">最新活动<i/></a>
      <a href="/activity?type=2" :class="{active: activeTab===2}">官方消息<i/></a>
    </div>
    <div v-show="activeTab===1" class="activity-list">
      <a :href="'/activity/' + item.id" target="_blank" v-for="item in list" :key="item.id">
        <div class="cover" :style="{backgroundImage: `url(${item.thumb_url})`}"></div>
        <div class="desc">
          <div class="left">
            <h4>{{ item.title }}</h4>
            <p>活动时间：{{ item.start_time }}至{{ item.end_time }}</p>
          </div>
          <div class="status">{{ item.statusText }}</div>
        </div>
      </a>
    </div>
    <div v-show="activeTab === 2" class="message-list">
      <a v-for="item in list" :key="item.id" target="_blank" :href="'/activity/' + item.id" class="msg-item">
        <h4><span class="post">{{ item.type === 2 ? '公告' : '活动' }}</span>{{ item.title }}<span>{{ item.create_time }}</span></h4>
        <p class="text-overflow">{{ item.content }}</p>
      </a>
    </div>
    <div class="pagination">
      <el-pagination
        :page-size="10"
        :total="totalCount"
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :current-page="page"
        @current-change="changePage"
        background />
    </div>
  </div>
</template>

<script>
import NaHeader from '../../components/header/header'
import { post } from "../../util/http";
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

const PAGE_SIZE = 10

export default {
  layout: 'common-footer',
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }

    const { data: { data } } = await post({ url: '/webapi/Activity/getList', data: { type: query.type, page: 1, size: PAGE_SIZE } })
    data.list.forEach(item => {
      if (new Date(item.end_time).getTime() <= Date.now()) {
        item.statusText = '已结束'
      }
      if (new Date(item.start_time).getTime() >= Date.now()) {
        item.statusText = '未开始'
      }
      if (new Date(item.start_time).getTime() < Date.now() && Date.now() < new Date(item.end_time).getTime()) {
        item.statusText = '进行中'
      }
    })
    return {
      activeTab: Number(query.type),
      totalCount: data.count,
      list: data.list
    }
  },
  name: 'activity',
  components: {
    NaHeader
  },
  data() {
    return {
      activeTab: 0,
      page: 1,
      totalCount: 0,
      list: []
    }
  },
  methods: {
    changeTab(tab) {
      if (tab === this.activeTab) return
      this.activeTab = tab
      this.list = []
      this.page = 1
      this.getList()
    },
    getList() {
      post({ url: '/webapi/Activity/getList', data: { type: this.activeTab, page: this.page, size: PAGE_SIZE }})
        .then(({ data: { data } }) => {
          data.list.forEach(item => {
            item.isEnd = new Date(item.end_time).getTime() <= Date.now()
          })
          this.list = data.list
          this.totalCount = data.count
        })
    },
    changePage(page) {
      this.page = page
      this.getList()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
  .activity
    width 100%
    min-height 100vh
    background-color #F5F5F5
    position relative
    .header
      background-color #fff
    .tabs
      margin-top 3px
      height 44px
      margin-bottom 9px
      display flex
      align-items flex-end
      justify-content center
      background-color #fff
      &>a
        font-size 15px
        color #8E8994
        padding-top 11px
        cursor pointer
        &>i
          display block
          width 11px
          height 3px
          margin 0 auto
          margin-top 14px
          border-radius 1px
          background-color transparent
        &:first-child
          margin-right 60px
        &.active
          color $theme-color
          font-weight bold
          &>i
            background-color $theme-color
    .activity-list
      width 1406px
      margin 0 auto
      display flex
      flex-wrap wrap
      justify-content space-between
      align-content flex-start
      &>a
        width 694px
        margin-bottom 18px
        border-radius 5px
        overflow hidden
        background-color #fff
        .cover
          background-position center center
          background-size cover
          background-repeat no-repeat
          width 100%
          height 293px
        .desc
          display flex
          padding 10px 20px
          align-items center
          justify-content space-between
          .left
            &>h4
              margin-bottom 9px
              font-size 15px
              color #333333
              font-weight bold
            &>p
              font-size 13px
              color #7A7A8C
          .status
            width 74px
            height 30px
            line-height 30px
            text-align center
            border-radius 5px
            background linear-gradient(90deg,rgba(130,210,255,1),rgba(133,87,255,1))
            font-size 13px
            color #FFFFFF
    .message-list
      width 1406px
      margin 0 auto
      border-radius 9px
      overflow hidden
      padding 0 46px
      padding-top 7px
      padding-bottom 30px
      background-color #fff
      .msg-item
        display block
        padding 23px 0
        border-bottom 1px solid #DCDCE9
        &>h4
          margin-bottom 19px
          line-height 20px
          font-weight bold
          font-size 16px
          color #3B3B4F
          &>span
            display inline-block
            margin-right 24px
            width 36px
            height 20px
            text-align center
            line-height 20px
            border-radius 2px
            font-weight normal
            font-size 13px
            color #FFFFFF
            &.post
              background-color #F9D385
            &.act
              background-color #BFB1F3
            &:last-child
              width auto
              float right
              color #8F8FA1
        &>p
          font-size 13px
          color #8F8FA1
    .pagination
      width 100%
      height 80px
      margin 0 auto
      margin-top 20px
      display flex
      justify-content center
      ::v-deep
        .el-pagination
          .el-pager li
            width 40px
            height 40px
            line-height 40px
            border-radius 5px
            border 1px solid #CCCCCC
            color #999999
            &.more
              border none
            &.active
              border none
              color #fff
          span:not([class*=suffix])
            height 40px
            line-height 40px
    @media only screen and (max-width: 1406px)
      .activity-list
        width 1200px
        &>a
          width 589px
          &>img
            width 100%
            height 249px
      .message-list
        width 1200px
</style>
