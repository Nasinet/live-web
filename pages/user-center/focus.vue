<template>
  <user-center-wrap>
    <div class="focus-list">
      <live-item class="focus-item" :living="item.living" v-for="item in list" :key="item.id" :item="item"></live-item>
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
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../components/user-center-wrap/user-center-wrap'
import LiveItem from '../../components/live-item/live-item'
import { post } from "../../util/http";
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

const PAGE_SIZE = 9

export default {
  async asyncData({ req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my')
      return
    }

    try {
      const { data: { data } } = await post({ url: '/webapi/Anchor/getAttentAnchors', req, data: { page: 1, size: PAGE_SIZE } })
      const list = data.list.map((item) => {
        let live = item.anchor.live
        if (live) return live
        return {
          thumb: item.anchor.avatar,
          living: !!live,
          title: item.anchor.nick_name + '的直播间',
          anchor: item.anchor,
          hot: 0,
          anchorid: item.anchor.id
        }
      })
      return {
        list,
        totalCount: data.total_count
      }
    } catch (e) {
      if (req) {
        req.ctx.cookies.set('token')
        req.ctx.cookies.set('uid')
        redirect('/')
      }
    }
  },
  middleware: 'login-check',
  name: 'focus',
  components: {
    UserCenterWrap,
    LiveItem
  },
  data() {
    return {
      list: [],
      totalCount: 0,
      page: 1
    }
  },
  methods: {
    changePage(page) {
      this.page = page
      this.getList()
    },
    getList() {
      post({ url: '/webapi/Anchor/getAttentAnchors', data: { page: this.page, size: PAGE_SIZE } })
        .then(({ data: { data } }) => {
          const list = data.list.map((item) => {
            let live = item.anchor.live
            if (live) return live
            return {
              thumb: item.anchor.avatar,
              living: !!live,
              title: item.anchor.nick_name + '的直播间',
              anchor: item.anchor,
              hot: 0,
              anchorid: item.anchor.id
            }
          })
          this.list = list
          this.totalCount = data.total_count
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.focus-list
  padding 45px 85px
  display flex
  align-content flex-start
  flex-wrap wrap
  position relative
  min-height 100%
  .focus-item
    margin-right 64px
    margin-bottom 35px
    &:nth-child(3n+0)
      margin-right 0
  .pagination
    position absolute
    left 0
    bottom 10px
    width 100%
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
          background-color #fff
          &.more
            border none
          &.active
            border none
            color #fff
            background-color $theme-color
        .btn-prev, .btn-next
          background-color #fff
        span:not([class*=suffix])
          height 40px
          line-height 40px
  @media only screen and (max-width: 1406px)
    .focus-item
      margin-right 10px
      width 250px
</style>
