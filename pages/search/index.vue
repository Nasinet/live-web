<template>
  <div class="search">
    <NaHeader class="header" />
    <div class="content">
      <form class="form" action="/search" method="get">
        <input name="searchKey" v-model="searchKey" type="text">
        <input type="text" v-model="active" name="type" v-show="false">
        <button type="submit">搜索</button>
      </form>
      <ul class="tabs">
        <li @click="changeTab(0)" :class="{active: active === 0}">
          <p>综合</p>
          <i/>
        </li>
        <li  @click="changeTab(1)" :class="{active: active === 1}">
          <p>主播</p>
          <i/>
        </li>
        <li  @click="changeTab(2)" :class="{active: active === 2}">
          <p>直播</p>
          <i/>
        </li>
      </ul>
      <div class="loading" v-if="loading && page===1">
        <i class="el-icon-loading"></i>
        <span>加载中...</span>
      </div>
      <template v-else>
        <div class="list" v-if="(active === 0 || active === 1) && anchors.length">
          <h4>相关主播 <span @click="changeTab(1)" v-if="active===0">全部</span></h4>
          <div class="anchors">
            <a v-for="(item, index) in currentAnchors" :key="item.id" :href="'/live/' + item.id">
              <div :class="['avatar', item.live ? 'living' : '']">
                <img :src="item.avatar || $store.state.defaultAvatar" alt="">
                <p v-if="item.live">LIVE</p>
              </div>
              <p class="text-overflow nick-name">{{ item.nick_name }}</p>
              <p class="text-overflow sign">{{ item.profile.signature }}</p>
              <button @click.prevent="focus(index, item)" class="focus-btn" :style="{color: item.isattent ? '#98D9DA' : '#18D5D9'}">{{ item.isattent ? '已关注' : '关注' }}</button>
            </a>
          </div>
        </div>
        <div class="list" v-if="(active === 0 || active === 2) && liveList.length">
          <h4>相关直播 <span @click="changeTab(2)" v-if="active===0">全部</span></h4>
          <div class="live-list">
            <LiveItem class="live" v-for="item in currentLiveList" :item="item" :key="item.id" />
          </div>
        </div>
      </template>
    </div>
    <div class="pagination" v-if="active!==0 && showPagination">
      <el-pagination
        :page-size="active === 1 ? 21 : 15"
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
import LiveItem from '../../components/live-item/live-item'
import { post } from '../../util/http'
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

const urls = [
  '/webapi/search/main',
  '/webapi/search/anchor',
  '/webapi/search/live'
]

const liveSize = 15
const anchorSize = 21

export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/search')
      return
    }
    const active = query.type ? Number(query.type) : 0
    const { data: { data } } = await post({ url: urls[active], data: { keyword: query.searchKey, page: 1, size: active === 1 ? anchorSize : liveSize }, req })
    return {
      searchKey: query.searchKey,
      anchors: data.anchors || [],
      liveList: data.lives || [],
      totalCount: data.count || 0,
      active
    }
  },
  name: 'index',
  layout: 'common-footer',
  components: {
    NaHeader,
    LiveItem
  },
  data () {
    return {
      searchKey: '',
      anchors: [],
      liveList: [],
      active: 0,
      page: 1,
      totalCount: 0,
      loading: false
    }
  },
  computed: {
    currentAnchors () {
      return this.active === 0 ? this.anchors.slice(0, 7) : this.anchors
    },
    currentLiveList () {
      return this.active === 0 ? this.liveList.slice(0, 10) : this.liveList
    },
    showPagination() {
      if (this.loading && this.page === 1) {
        return false
      }
      if (this.active === 1) {
        return this.anchors.length
      }
      if (this.active === 2) {
        return this.liveList.length
      }
      return true
    }
  },
  methods: {
    changePage(page) {
      this.page = page
      this.getList()
    },
    async getList() {
      const { data: { data } } = await post({ url: urls[this.active], data: { keyword: this.searchKey, page: this.page, size: this.active === 1 ? anchorSize : liveSize } })
      if (this.active === 0) {
        this.anchors = data.anchors
        this.liveList = data.lives
      }
      if (this.active === 1) {
        this.anchors = data.anchors
        this.totalCount = data.count
      }
      if (this.active === 2) {
        this.liveList = data.lives
        this.totalCount = data.count
      }
      this.loading = false
      window.scrollTo(0, 0)
    },
    changeTab(tab) {
      if (tab === this.active || this.loading) return
      this.active = tab
      this.page = 1
      this.loading = true
      this.getList()
    },
    focus(index, item) {
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: item.id, type: !item.isattent }})
        .then(() => {
          const copy = {...this.anchors[index]}
          copy.isattent = !copy.isattent
          this.$set(this.anchors, index, copy)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.search
  min-height 100vh
  background-color #F5F5F5
  .header
    background #fff
  .content
    width 1406px
    margin 0 auto
    .form
      width 580px
      margin 0 auto
      margin-top 35px
      height 58px
      display flex
      border-radius 29px
      overflow hidden
      background-color #fff
      &>input
        flex 1
        padding 0 40px
        height 100%
        border none
        outline none
        background-color transparent
        font-size 17px
        color #333333
      &>button
        width 86px
        height 58px
        background-color #906EFF
        color #fff
        font-size 17px
    .tabs
      width 304px
      margin 0 auto
      margin-top 53px
      display flex
      justify-content space-between
      &>li
        font-size 22px
        color #333333
        cursor pointer
        &.active
          color #000
          font-weight bold
          &>i
            background-color $theme-color
        &>i
          display block
          width 16px
          margin 0 auto
          height 4px
          margin-top 13px
          border-radius 2px
          background-color transparent
    .list
      margin-top 39px
      &>h4
        margin-bottom 26px
        display flex
        justify-content space-between
        font-size 22px
        color #333333
        &>span
          font-size 18px
          color #848484
          cursor pointer
      .anchors
        display flex
        flex-wrap wrap
        &>a
          width 188px
          padding 0 10px
          padding-bottom 30px
          margin-right 15px
          margin-bottom 15px
          box-sizing border-box
          border-radius 5px
          text-align center
          overflow hidden
          background-color #fff
          &:nth-child(7n + 0)
            margin-right 0
          .avatar
            width 82px
            margin 0 auto
            height 82px
            border-radius 50%
            margin-top 36px
            margin-bottom 22px
            position relative
            &.living
              border 2px solid #F71D65
              &>p
                position absolute
                top 72px
                left 50%
                width 36px
                height 15px
                line-height 15px
                margin-left -18px
                background #F71D65
                font-size 12px
                color #FFFFFF
                font-weight bold
                text-align center
            &>img
              border-radius 50%
              width 100%
              height 100%
          .nick-name
            margin-bottom 15px
            font-size 17px
            color #333333
          .sign
            margin-bottom 21px
            font-size 13px
            color #8A8A8A
        @media only screen and (max-width: 1406px)
          &>a
            width 152px
            margin-right 12px
            padding-bottom 24px
            .avatar
              margin-top 28px
      .live-list
        display flex
        flex-wrap wrap
        .live
          margin-right 12px
          margin-bottom 28px
          &:nth-child(5n + 0)
            margin-right 0
        @media only screen and (max-width: 1406px)
          .live
            width 217px
            ::v-deep
              .cover
                height 122px
  @media only screen and (max-width: 1406px)
    .content
      width 1137px
  .loading
    margin-top 20px
    text-align center
    color #8A8A8A
    font-size 15px
  .pagination
    width 1406px
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
</style>
