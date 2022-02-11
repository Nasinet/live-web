<template>
  <div class="anchor-dynamic">
    <na-header/>
    <div class="anchor-wrap">
      <div class="center-box">
        <div class="anchor-head">
          <img class="avatar" :src="user.avatar || $store.state.defaultAvatar" alt="">
          <h5>{{ user.nick_name }}</h5>
          <p>{{ user.profile.signature || '这个用户很懒，什么也没留下。' }}</p>
          <button @click="focus" v-if="userInfo.id!==user.id">{{ user.isattent ? '已关注' : '关注' }}</button>
        </div>
        <div class="dy-content">
          <div class="dy-data">
            <anchor-dy-data :user="user" />
            <a :href="`/live/${user.id}`" v-if="user.live" class="live-link">
              <h4>直播间</h4>
              <div class="cover" :style="{backgroundImage: `url(${user.live.thumb})`}">
                <p class="status">
                  <img src="./movie@2x.png" alt="">
                  <span>直播中</span>
                </p>
              </div>
              <p class="live-title text-overflow">{{ activeCategory.title }}</p>
            </a>
          </div>
          <div class="dy-list">
            <div class="tabs" v-if="userInfo.id===user.id">
              <a :href="`/dynamic/anchor/${user.id}?type=0`" :class="{active: tabType===0}">全部动态</a>
              <a :href="`/dynamic/anchor/${user.id}?type=1`" :class="{active: tabType===1}">收藏动态</a>
            </div>
            <dynamic-item @collected="collected" @like="like" v-for="(item, index) in list" :index="index" :key="item.id" :item="item"/>
            <div class="loading" v-if="loading"><i class="el-icon-loading" />正在加载中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../../../components/header/header'
import AnchorDyData from '../../../components/anchor-dy-data/anchor-dy-data'
import DynamicItem from '../../../components/dynamic-item/dynamic-item'
import { post } from '../../../util/http'
import { mapState } from 'vuex'
import getPlatform from "../../../util/platform";
import {h5Host} from "../../../util/host";

const PAGE_SIZE = 10

export default {
  async asyncData({ req, params, query, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }
    const { data: { data: user } } = await post({ url: '/webapi/Anchor/getAnchorInfo', data: { anchorid: params.id }, req })
    let list = []
    const tabType = Number(query.type) || 0
    if (tabType === 0) {
      const { data: { data } } = await post({ url: '/webapi/moment/getUserMomentList', data: {authorid: params.id, page: 1, size: PAGE_SIZE}, req })
      list = data
    } else {
      const { data: { data } } = await post({ url: '/webapi/Moment/getCollection', data: { page: 1, size: PAGE_SIZE}, req })
      list = data
    }

    return {
      user,
      list,
      loading: list.length >= PAGE_SIZE,
      tabType
    }
  },
  name: 'anchor-dynamic',
  layout: 'common-footer',
  components: {
    DynamicItem,
    NaHeader,
    AnchorDyData
  },
  data() {
    return {
      list: [],
      user: {},
      loading: false,
      page: 1,
      isLoad: false,
      tabType: 0
    }
  },
  computed: {
    ...mapState(['userInfo', 'categories']),
    activeCategory() {
      if (!this.user.live) {
        return {}
      }
      return this.categories.find(item => {
        return item.id === this.user.live.categoryid
      })
    }
  },
  mounted() {
    document.addEventListener('scroll', this.watchScroll)
    this.visitor()
  },
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.watchScroll)
  },
  methods: {
    visitor() {
      if (this.userInfo.id && this.userInfo.id !== this.user.id) {
        post({url: '/webapi/Anchor/addVisitorLog', data: { anchorid: this.user.id }})
      }
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
    async getList() {
      let list = []
      if (this.tabType === 0) {
        const { data: { data } } = await post({ url: '/webapi/moment/getUserMomentList', data: {authorid: this.$route.params.id, page: this.page, size: PAGE_SIZE} })
        list = data
      } else {
        const { data: { data } } = await post({ url: '/webapi/Moment/getCollection', data: { page: this.page, size: PAGE_SIZE} })
        list = data
      }
      this.list = this.list.concat(list)
      this.loading = list.length >= PAGE_SIZE
      this.isLoad = false
    },
    focus() {
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: this.user.id, type: !this.user.isattent }})
        .then(({ data: { data } }) => {
          this.$set(this.user, 'isattent', !this.user.isattent)
          this.$set(this.user, 'fans_count', data.fans_count)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.anchor-dynamic
  .anchor-wrap
    width 100%
    min-height calc(100vh - 81px)
    background linear-gradient(270deg,rgba(161,100,255,1) 0%,rgba(98,99,255,1) 100%)
    .center-box
      width 1171px
      margin 0 auto
      padding-top 14px
      .anchor-head
        background url(./bg_top@2x.png) center center no-repeat
        background-size cover
        padding-top 28px
        padding-bottom 23px
        margin-bottom 18px
        text-align center
        .avatar
          width 116px
          height 116px
          margin-bottom 15px
          border-radius 50%
        &>h5
          margin-bottom 10px
          font-size 23px
          color #FEFEFE
          font-weight bold
        &>p
          margin-bottom 25px
          font-size 15px
          color #FEFEFE
        &>button
          width 96px
          height 32px
          border-radius 16px
          background linear-gradient(254deg,rgba(157,93,255,1),rgba(47,232,255,1))
          border none
          outline none
          color #fff
          font-size 16px
          cursor pointer
  .dy-content
    display flex
    .dy-data
      width 304px
      margin-right 11px
      .live-link
        display block
        margin-top 18px
        border-radius 14px
        overflow hidden
        background-color #fff
        &>h4
          margin-bottom 18px
          padding 24px 0 21px 20px
          font-weight bold
          font-size 15px
          color #333333
          border-bottom 1px solid #EDEDED
        .cover
          height 158px
          margin 0 21px
          background-size cover
          background-repeat no-repeat
          background-position center center
          position relative
          .status
            position absolute
            right 10px
            top 12px
            width 84px
            height 26px
            line-height 26px
            border-radius 13px
            background linear-gradient(96deg,rgba(55,223,255,1),rgba(151,99,255,1))
            text-align center
            font-size 13px
            color #FFFFFF
            &>img
              width 15px
              height 15px
              margin-top 5px
              vertical-align top
        .live-title
          margin-top 15px
          margin-left 21px
          padding-bottom 16px
          font-size 13px
          color #636363
    .dy-list
      flex 1
      .tabs
        width 100%
        display flex
        height 46px
        margin-bottom 9px
        padding-left 24px
        align-items center
        border-radius 10px
        background #fff
        &>a
          margin-right 41px
          font-size 14px
          color #666565
          &.active
            color #18D5D9
      .loading
        margin-bottom 10px
        width 100%
        height 30px
        line-height 30px
        background #fff
        text-align center
        font-size 16px
        color #333
</style>
