<template>
  <user-center-wrap>
    <ul class="head">
      <li @click="changeTab(0)" :class="{active: active === 0}">管理员列表</li>
      <li @click="changeTab(1)" :class="{active: active === 1}">禁言列表</li>
      <li @click="changeTab(2)" :class="{active: active === 2}">直播列表</li>
    </ul>
    <div class="set-table" v-if="active===0">
      <div class="t-head">
        <div>头像</div>
        <div>昵称</div>
        <div>操作</div>
      </div>
      <div v-for="(item, index) in list" :key="item.id" class="row">
        <div><img :src="item.user.avatar || $store.state.defaultAvatar" alt=""></div>
        <div>{{ item.user.nick_name }}</div>
        <div @click="cancelMgr(item, index)" class="blue">取消房管</div>
      </div>
    </div>
    <div class="set-table" v-if="active===1">
      <div class="t-head">
        <div>头像</div>
        <div>昵称</div>
        <div>操作</div>
      </div>
      <div v-for="(item, index) in list" :key="item.id" class="row">
        <div><img :src="item.avatar || $store.state.defaultAvatar" alt=""></div>
        <div>{{ item.nick_name }}</div>
        <div @click="cancelMuted(item, index)" class="blue">取消禁言</div>
      </div>
    </div>

    <div class="set-table" v-if="active===2">
      <div class="t-head">
        <div>时间</div>
        <div>直播标题</div>
        <div>直播收益</div>
        <div>直播时长</div>
      </div>
      <div v-for="item in list" :key="item.id" class="row">
        <div>{{ item.start_time }}</div>
        <div>{{ item.title }}</div>
        <div>{{ item.gift_profit }}</div>
        <div>{{ item.duration }}</div>
      </div>
    </div>

    <div class="pagination" v-if="active!==0">
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
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../components/user-center-wrap/user-center-wrap'
import {post} from "../../util/http";
import { mapState } from 'vuex'
import { getDuration } from "../../util/time";
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my')
    }
  },
  name: 'set',
  components: {
    UserCenterWrap
  },
  data() {
    return {
      active: 0,
      list: [],
      page: 1,
      totalCount: 3
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    cancelMgr(item, index) {
      post({ url: '/webapi/live/setRoomMgr', data: { mgrid: item.user.id, type: 0 } })
        .then(() => {
          this.list.splice(index, 1)
        })
    },
    cancelMuted(item, index) {
      post({ url: '/webapi/live/banUser', data: { userid: item.id, type: 0, anchorid: this.userInfo.id } })
        .then(() => {
          this.list.splice(index, 1)
        })
    },
    changePage(page) {
      this.page = page
      this.getList()
    },
    changeTab(tab) {
      if (this.active === tab) return;
      this.active = tab
      this.page = 1
      this.list = []
      this.getList()
    },
    getList() {
      if (this.active === 0 || this.active === 1) {
        this.getMgrList()
      } else {
        post({ url: '/webapi/User/getLiveLog', data: { page: this.page, size: 10 } })
          .then(({ data: { data } }) => {
            this.totalCount = data.count
            data.list.forEach(item => {
              item.duration = getDuration((item.end_stamp - item.start_stamp) * 1000, 'hh:mm:ss')
            })
            this.list = data.list
          })
      }
    },
    getMgrList() {
      post({ url: this.active === 0 ? '/webapi/live/getMgrList' : '/webapi/live/getBannedUserList', data: { anchorid: this.userInfo.id, page: this.page, size: 10 } })
        .then(({ data: { data } }) => {
          if (this.active === 0) {
            this.list = data
          } else {
            this.totalCount = data.count
            this.list = data.list
          }
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.head
  margin 0 23px
  display flex
  border-bottom 1px solid #F0F0F0
  &>li
    padding 0 29px
    padding-top 34px
    font-size 19px
    color #333333
    cursor pointer
    &:after
      content ' '
      display block
      width 20px
      height 5px
      border-radius 5px
      background transparent
      margin 0 auto
      margin-top 24px
    &.active
      color #333333
      font-weight bold
      &:after
        background $theme-color
.set-table
  margin 0 46px
  margin-top 53px
  font-size 15px
  color #333333
  .t-head
    display flex
    height 46px
    line-height 46px
    background #F6F6F6
    &>div
      flex 1
      text-align center
  .row
    display flex
    height 63px
    line-height 63px
    border 1px solid #F6F6F6
    border-top none
    &>div
      flex 1
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      text-align center
      &>img
        width 40px
        height 40px
        box-sizing content-box
        padding-top 11px
        border-radius 50%
        object-fit cover
      &.blue
        cursor pointer
        color $theme-color
.pagination
  box-sizing content-box
  padding 40px 0
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
