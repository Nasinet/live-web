<template>
  <div class="dynamic">
    <na-header/>
    <div class="dynamic-wrap">
      <div class="dy-content">
        <div class="menu">
          <a :class="['m-item', menuType === 1 ? 'active' : '']" href="/dynamic?mtype=1"><img src="./all.png" alt="">全部动态</a>
          <a :class="['m-item', menuType === 2 ? 'active' : '']" href="/dynamic?mtype=2&tabtype=2"><img src="./hot@2x.png" alt="">热门动态</a>
          <a v-if="userInfo.id" :class="['c-item', menuType === 3 ? 'active' : '']" href="/dynamic?mtype=3"><i/>我的收藏</a>
          <a v-if="userInfo.id" :class="['c-item', menuType === 4 ? 'active' : '']" href="/dynamic?mtype=4"><i/>我的赞</a>
        </div>
        <div class="dy-list">
          <div class="tabs" v-if="menuType===2">
            <a v-if="userInfo.id" :class="{active: tabType === 1}" href="/dynamic?mtype=2&tabtype=1">关注<i/></a>
            <a :class="{active: tabType === 2}" href="/dynamic?mtype=2&tabtype=2">全部<i/></a>
          </div>
          <dynamic-item @changeDyItem="changeDyItem" @collected="collected" @like="like" v-for="(item, index) in list" :index="index" :key="item.id" :item="item" />
          <div class="loading" v-if="loading"><i class="el-icon-loading" />正在加载中...</div>
        </div>
        <div class="dy-recommend">
          <dynamic-user/>
          <dynamic-hot-anchor :list="hotAnchor" />
        </div>
      </div>
    </div>
    <img src="./top@2x.png" @click="scrollTop" class="scroll-top" alt="">
  </div>
</template>

<script>
import NaHeader from '../../components/header/header'
import DynamicItem from '../../components/dynamic-item/dynamic-item'
import DynamicUser from '../../components/dynamic-user/dynamic-user'
import DynamicHotAnchor from '../../components/dynamic-hot-anchor/dynamic-hot-anchor'
import { post } from '../../util/http'
import { mapState } from 'vuex'
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

const PAGE_SIZE = 10

const urls = {
  1: '/webapi/Moment/getNewestList',
  2: '/webapi/Moment/getHotList',
  3: '/webapi/Moment/getCollection',
  4: '/webapi/Moment/getLike',
  5: '/webapi/Moment/getAttentList'
}

export default {
  name: 'dynamic',
  async asyncData({ req, query, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/dynamic')
      return
    }
    const { mtype, tabtype } = query
    const { data: { data } } = await post({
      url: tabtype === '1' ? urls['5'] : urls[mtype],
      req,
      data: {
        page: 1,
        size: PAGE_SIZE
      }
    })
    return {
      menuType: Number(mtype),
      tabType: Number(tabtype),
      list: data,
      loading: data.length >= PAGE_SIZE
    }
  },
  layout: 'common-footer',
  components: {
    NaHeader,
    DynamicItem,
    DynamicUser,
    DynamicHotAnchor
  },
  data() {
    return {
      menuType: 1,
      listType: 2,
      list: [],
      page: 1,
      loading: false,
      isLoad: false,
      tabType: 1,
      hotAnchor: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  beforeMount() {
    if (window.performance.type === 2) {
      window.location.reload()
    }
  },
  mounted() {
    document.addEventListener('scroll', this.watchScroll)
    this.getHotAnchor()
  },
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.watchScroll)
  },
  methods: {
    changeDyItem(data) {
      const copy = {...this.list[data.index]}
      copy.unlocked = true
      this.$set(this.list, data.index, {
        ...copy,
        ...data.item
      })
    },
    async getHotAnchor() {
      const { data: { data } } = await post({ url: '/webapi/Rank/getAnchorRankList', data: { type: 1 } })
      this.hotAnchor = data.slice(0, 5)
    },
    collected(data) {
      const copy = {...this.list[data.index]}
      copy.collected = data.collected
      this.$set(this.list, data.index, copy)
    },
    like(data) {
      const copy = {...this.list[data.index]}
      copy.liked = true
      copy.like_count = data.like_count
      this.$set(this.list, data.index, copy)
    },
    watchScroll() {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      if (scrollHeight - scrollTop <= document.documentElement.clientHeight + 300) {
        if (this.isLoad || !this.loading) return
        this.isLoad = true
        this.page++
        this.getList()
      }
    },
    scrollTop() {
      window.scrollTo(0, 0)
    },
    async getList() {
      const { data: { data } } = await post({
        url: this.tabType === 1 ? urls['5'] : urls[this.menuType],
        data: {
          page: this.page,
          size: PAGE_SIZE
        }
      })
      this.list = this.list.concat(data)
      this.isLoad = false
      this.loading = data.length >= PAGE_SIZE
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.dynamic
  .scroll-top
    position fixed
    top 75vh
    right 20px
    cursor pointer
    width 54px
    height 53px
  .dynamic-wrap
    width 100%
    min-height calc(100vh - 81px)
    background linear-gradient(270deg,rgba(161,100,255,1) 0%,rgba(98,99,255,1) 100%)
    .dy-content
      width 1406px
      margin 0 auto
      min-height calc(100vh - 81px)
      padding-top 9px
      background-color rgba(0, 0, 0, 0.1)
      display flex
      overflow hidden
      .menu
        width 216px
        margin-top 3px
        font-size 15px
        &>a
          display flex
          align-items center
          height 44px
          line-height 44px
          color #fff
          &:hover
            background-color #827AEA
          &.active
            background-color #827AEA
          &.m-item
            padding-left 30px
            &>img
              margin-right 10px
              width 14px
              height 14px
          &.c-item
            padding-left 36px
            &>i
              width 6px
              height 6px
              margin-right 12px
              border-radius 50%
              background-color #fff
      .dy-list
        flex 1
        .loading
          margin-bottom 10px
          width 100%
          height 30px
          line-height 30px
          background #fff
          text-align center
          font-size 16px
          color #333
        .tabs
          display flex
          align-items flex-end
          height 59px
          margin-bottom 12px
          padding-left 23px
          border-radius 14px
          background-color #fff
          &>a
            margin-right 22px
            padding-top 22px
            font-size 17px
            color #333
            &.active
              font-weight bold
              &>i
                background-color $theme-color
            &>i
              display block
              width 11px
              height 4px
              margin 0 auto
              margin-top 17px
              border-radius 2px
              background-color transparent
      .dy-recommend
        width 304px
        margin-left 11px
        margin-right 19px
  @media only screen and (max-width: 1406px)
    .dynamic-wrap
      .dy-content
        width 1200px
        .menu
          min-width 183px
          width 183px
        .dy-recommend
          width 258px
</style>
