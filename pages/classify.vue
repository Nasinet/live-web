<template>
  <div class="live-classify">
    <na-header/>
    <div class="live-list">
      <div class="tab">
        <a href="/classify?type=0" :class="{active: type === 0}">全部</a>
        <a v-for="item in categories" :key="item.id" :href="'/classify?type=' + item.id" :class="{active: type === item.id}">{{ item.title }}</a>
      </div>
      <div class="list-content">
        <div class="item-wrap">
          <live-item class="cls-item" v-for="item in list" :key="item.id" :item="item" />
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          :page-size="25"
          :total="totalCount"
          layout="prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
          :current-page="page"
          @current-change="changePage"
          background />
      </div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../components/header/header'
import LiveItem from '../components/live-item/live-item'
import { mapState } from 'vuex'
import { post } from '../util/http'
import getPlatform from "../util/platform";
import {h5Host} from "../util/host";

export default {
  layout: 'common-footer',
  name: 'live-classify',
  async asyncData ({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }

    const { data: { data } } = await post({url: '/webapi/live/getListByCategory', data: {
        page: 1,
        categoryid: query.type,
        size: 25
      }})
    return {
      type: Number(query.type),
      list: data.list,
      totalCount: data.count
    }
  },
  components: {
    NaHeader,
    LiveItem
  },
  data () {
    return {
      type: 0,
      list: [],
      totalCount: 1000,
      page: 1
    }
  },
  computed: {
    ...mapState(['categories']),
    activeCategory() {
      return this.categories.find(item => {
        return item.id === this.type
      })
    }
  },
  methods: {
    async changePage (page) {
      const { data: { data } } = await post({url: '/webapi/live/getListByCategory', data: {
          page,
          categoryid: this.type,
          size: 25
        }})
      this.list = data.list
      this.totalCount = data.count
      this.page = page
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/variable.styl"
.live-classify
  .live-list
    width 100%
    margin 0 auto
    overflow hidden
    background-color #F5F5F5
    .tab
      width 1406px
      margin 0 auto
      margin-top 33px
      margin-bottom 30px
      padding-left 43px
      height 60px
      display flex
      align-items center
      background-color #fff
      &>a
        margin-right 48px
        font-size 16px
        color #666666
        &.active
          color $active-color
          font-weight bold
    .list-content
      width 1406px
      min-height 516px
      margin 0 auto
      &>h3
        margin-bottom 27px
        font-size 22px
        color #333333
      .item-wrap
        display flex
        flex-wrap wrap
        .cls-item
          margin-right 15px
          margin-bottom 36px
          &:nth-child(5n + 0)
            margin-right 0
  @media only screen and (max-width: 1406px)
    .live-list
      .tab
        width 1137px
      .list-content
        width 1137px
        .item-wrap
          .cls-item
            &:nth-child(5n + 0)
              margin-right 15px
            &:nth-child(4n + 0)
              margin-right 0
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
