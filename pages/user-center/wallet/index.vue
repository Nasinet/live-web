<template>
  <user-center-wrap bg-color="transparent">
    <div class="diamond-data">
      <div class="num">
        <h4>{{ userInfo.diamond_total }}</h4>
        <p>累计钻石</p>
      </div>
      <div class="num">
        <h4>{{ userInfo.diamond }}</h4>
        <p>可提取钻石数</p>
      </div>
    </div>
    <div class="withdraw">
      <div class="form">
        <p>提现金额</p>
        <el-input v-model="withdrawNum" style="width: 176px;margin-right: 32px;" placeholder="请输入可提取的钻石数" />
        <p>可到账金额 <span>¥{{ rateMoney }}</span></p>
        <div style="flex: 1;"></div>
        <el-button :loading="btnLoading" @click="withdraw" type="primary" round>立即提现</el-button>
      </div>
      <div class="account">
        <div class="desc" v-if="userInfo.is_anchor">
          <h5>我的提现账户</h5>
          <p>支付宝账户：<span>{{ account.alipay_account }}</span></p>
          <p>支付宝姓名：<span>{{ account.alipay_name }}</span></p>
        </div>
        <nuxt-link v-if="userInfo.is_anchor" class="button" to="/user-center/wallet/account">管理账户</nuxt-link>
        <div class="verify" v-if="!userInfo.is_anchor">
          <h4>我的提现账户</h4>
          <p>您还未进行实名认证 <nuxt-link to="/user-center/become-anchor">立即认证</nuxt-link></p>
        </div>
      </div>
    </div>
    <div class="record">
      <div class="form">
        提现记录
<!--        <el-date-picker-->
<!--          style="width: 122px;"-->
<!--          format="yyyy-MM"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM"-->
<!--          v-model="recordDate" />-->
<!--        <button>查询</button>-->
      </div>
      <div class="table" v-if="list.length">
        <ul class="t-head">
          <li>状态</li>
          <li>时间</li>
          <li>提现钻石数量</li>
          <li>实际到账金额</li>
          <li>收款支付宝</li>
          <li>转账单号</li>
        </ul>
        <ul v-for="item in list" :key="item.id" class="t-row">
          <li :style="{color: statusColor[item.status]}">{{ statusText[item.status] }}</li>
          <li class="time">{{ item.create_time }}</li>
          <li>{{ item.diamond }}</li>
          <li>{{ item.cash }}</li>
          <li>{{ item.alipay_account }}</li>
          <li>{{ item.trade_no }}</li>
        </ul>
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
      <div class="no-record" v-else>
        <img src="./kong@2x.png" alt="">
        <p>暂无内容</p>
      </div>
    </div>
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../../components/user-center-wrap/user-center-wrap'
import { getMonth } from '../../../util/time'
import { mapState } from 'vuex'
import {post} from "../../../util/http";
import getPlatform from "../../../util/platform";
import {h5Host} from "../../../util/host";

const PAGE_SIZE = 10

export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my/wallet')
    }
  },
  name: 'wallet',
  layout: 'common-footer',
  middleware: 'login-check',
  components: {
    UserCenterWrap
  },
  data() {
    return {
      recordDate: getMonth(new Date(), 'yy-mm'),
      statusColor: ['#4EA4F5', '#40C843', '#F59C4E', '#FF1717'],
      statusText: ['待处理', '已完成', '已驳回', '订单异常'],
      list: [],
      withdrawNum: '',
      btnLoading: false,
      account: {},
      page: 1,
      totalCount: 0
    }
  },
  computed: {
    ...mapState(['userInfo', 'appConfig']),
    rateMoney() {
      return (Number(this.withdrawNum) / this.appConfig.exchange_rate).toFixed(2)
    }
  },
  created() {
    this.getAccount()
    this.getRecord()
  },
  methods: {
    withdraw() {
      if (this.rateMoney < this.appConfig.withdraw_min) {
        this.$message.warning(`提现金额不能小于${this.appConfig.withdraw_min}`)
        return
      }
      if (!this.account) {
        this.$message.warning('请先完成实名认证')
        return
      }
      this.btnLoading = true
      post({
        url: '/webapi/withdraw/withdraw',
        data: {
          cash: this.rateMoney,
          diamond: this.withdrawNum,
          alipay_account: this.account.alipay_account,
          alipay_name: this.account.alipay_name
        }
      })
        .then(() => {
          this.btnLoading = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    getAccount() {
      post({url: '/webapi/withdraw/getAccount'})
        .then(({ data: { data } }) => {
          this.account = data
        })
    },
    getRecord() {
      post({ url: '/webapi/withdraw/withdrawlog', data: { page: this.page, size: PAGE_SIZE } })
        .then(({ data: { data } }) => {
          this.list = data.list
          this.totalCount = data.count
        })
    },
    changePage(page) {
      this.page = page
      this.getRecord()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../../assets/variable.styl"
.diamond-data
  display flex
  padding 0 44px
  height 150px
  margin-bottom 13px
  align-items center
  border-radius 5px
  background-color #fff
  .num
    margin-right 78px
    margin-bottom 13px
    text-align center
    &>h4
      margin-bottom 25px
      font-size 28px
      color #FFA336
      font-weight bold
    &>p
      font-size 19px
      color #333333
.withdraw
  padding 24px 62px 40px 44px
  border-radius 5px
  background-color #fff
  margin-bottom 13px
  .form
    display flex
    align-items center
    ::v-deep
      .el-input__inner
        border-radius 38px !important
    &>p
      margin-right 15px
      font-size 17px
      color #333333
      &>span
        color #F06E1E
        font-weight bold
  .account
    display flex
    justify-content space-between
    .verify
      margin-top 43px
      &>h4
        margin-bottom 24px
        font-weight bold
        font-size 17px
        color #333333
      &>p
        display flex
        align-items center
        font-size 17px
        color #333333
        &>a
          margin-left 25px
          width 108px
          height 38px
          line-height 38px
          text-align center
          border-radius 19px
          border 1px solid #18D5D9
          color #18D5D9
    .desc
      margin-top 43px
      &>h5
        font-weight bold
        font-size 17px
        color #333333
      &>p
        margin-top 28px
        font-size 17px
        color #9C9C9C
        &>span
          color #333333
    .button
      margin-top 32px
      width 105px
      height 38px
      border-radius 19px
      line-height 38px
      border 1px solid $theme-color
      text-align center
      font-size 17px
      color $theme-color
.record
  padding 28px 44px 90px 47px
  min-height 418px
  background-color #fff
  position relative
  .form
    margin-bottom 32px
    font-size 17px
    font-weight bold
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
    display table
    width 100%
    border 1px solid #F6F6F6
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
    &>ul
      display table-row
      height 63px
      width 100%
      &.t-head
        height 46px
        background-color #F6F6F6
      &>li
        vertical-align middle
        display table-cell
        text-align center
        border-bottom 1px solid #F6F6F6
        font-size 15px
        color #333333
        &.time
          color #9C9C9C
  .no-record
    padding-top 90px
    text-align center
    &>img
      width 342px
      height 195px
    &>p
      margin-top 35px
      opacity 0.5
      font-size 19px
      color #1B1B1B
</style>
