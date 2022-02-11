<template>
  <user-center-wrap>
    <div class="income">
<!--      <div class="form">-->
<!--        <el-date-picker-->
<!--          style="width: 122px;"-->
<!--          format="yyyy-MM"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM"-->
<!--          v-model="recordDate" />-->
<!--        <button>查询</button>-->
<!--      </div>-->
      <div class="table">
        <ul class="t-head">
          <li>时间</li>
          <li>交易类型</li>
          <li>数量（钻石）</li>
        </ul>
        <ul v-for="item in list" :key="item.id" class="t-row">
          <li class="time">{{ item.create_time }}</li>
          <li>礼物</li>
          <li>{{ item.coin_count }}</li>
        </ul>
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
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../../components/user-center-wrap/user-center-wrap'
import { getMonth } from '../../../util/time'
import { post } from "../../../util/http";
import getPlatform from "../../../util/platform";
import {h5Host} from "../../../util/host";

const PAGE_SIZE = 10

export default {
  name: 'income',
  async asyncData({ req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my/income')
      return
    }

    const { data: { data } } = await post({ url: '/webapi/User/giftProfit', req, data: { page: 1, size: PAGE_SIZE, } })
    return {
      list: data.list,
      totalCount: data.count
    }
  },
  layout: 'common-footer',
  middleware: 'login-check',
  components: {
    UserCenterWrap,
  },
  data() {
    return {
      recordDate: getMonth(new Date(), 'yy-mm'),
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
    async getList() {
      try {
        const { data: { data } } = await post({ url: '/webapi/User/giftProfit', data: { page: this.page, size: PAGE_SIZE, } })
        this.list = data.list
        this.totalCount = data.count
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../../assets/variable.styl"
.income
  width 100%
  min-height 100%
  position relative
  padding 33px 44px 90px 47px
  .form
    margin-bottom 32px
    &>button
      width 75px
      height 38px
      margin-left 19px
      border-radius 19px
      border 1px solid $theme-color
      font-size 15px
      color $theme-color
      background-color transparent
  .table
    width 100%
    display table
    border 1px solid #F6F6F6
    &>ul
      display table-row
      height 63px
      &.t-head
        height 46px
        background-color #F6F6F6
      &>li
        display table-cell
        border-bottom 1px solid #F6F6F6
        font-size 15px
        color #333333
        text-align center
        vertical-align middle
        &.time
          color #9C9C9C
  .pagination
    position absolute
    left 0
    bottom 25px
    width 100%
    height 40px
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
</style>
