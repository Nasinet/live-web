<template>
  <div class="rank">
    <NaHeader class="na-header"/>
    <div class="content-box">
      <div class="rank-wrap">
        <div class="head">
          <h4>富豪榜</h4>
          <ul class="tabs">
            <li @click="changeTab(0, 0)" :class="{active: leftActive === 0}">日榜</li>
            <li @click="changeTab(1, 0)" :class="{active: leftActive === 1}">周榜</li>
            <li @click="changeTab(2, 0)" :class="{active: leftActive === 2}">月榜</li>
            <li @click="changeTab(3, 0)" :class="{active: leftActive === 3}">总榜</li>
          </ul>
        </div>
        <div class="big-rank">
          <div class="item" v-for="item in bigUserList" :key="item.id">
            <div class="avatar">
              <img :src="item.user.avatar" alt="">
            </div>
            <p class="name text-overflow">{{ item.user.nick_name }}</p>
            <template v-if="item.user.nick_name !== '虚位以待'">
              <div class="level">
                <img v-if="item.user.vip_level && item.user.isVip" :src="medals[item.user.vip_level-1]" alt="">
                <level-icon :level="item.user.user_level" height="16px" width="25px" />
              </div>
              <div class="gold"><span>{{ item.consume }}</span>金币</div>
            </template>
          </div>
        </div>
        <div class="rank-list">
          <rank-item type="user"
                     @focus="focus"
                     v-for="(item, index) in userRank.slice(3, 10)"
                     :class="{bg: index % 2 === 0}"
                     :gold="item.consume"
                     :index="index + 3"
                     :item="item.user"
                     :key="item.id" />
        </div>
      </div>
      <div class="rank-wrap">
        <div class="head">
          <h4>明星榜</h4>
          <ul class="tabs">
            <li @click="changeTab(0, 1)" :class="{active: rightActive === 0}">日榜</li>
            <li @click="changeTab(1, 1)" :class="{active: rightActive === 1}">周榜</li>
            <li @click="changeTab(2, 1)" :class="{active: rightActive === 2}">月榜</li>
            <li @click="changeTab(3, 1)" :class="{active: rightActive === 3}">总榜</li>
          </ul>
        </div>
        <div class="big-rank">
          <div class="item" v-for="item in bigAnchorList" :key="item.id">
            <div class="avatar">
              <img :src="item.anchor.avatar" alt="">
            </div>
            <p class="name text-overflow">{{ item.anchor.nick_name }}</p>
            <template v-if="item.anchor.nick_name !== '虚位以待'">
              <div class="level">
                <img v-if="item.anchor.vip_level && item.anchor.isVip" :src="medals[item.anchor.vip_level - 1]" alt="">
                <level-icon type="anchor" :level="item.anchor.user_level" height="16px" width="25px" />
              </div>
              <div class="gold"><span>{{ item.income }}</span>金币</div>
            </template>
          </div>
        </div>
        <div class="rank-list">
          <rank-item type="anchor"
                     @focus="focus"
                     v-for="(item, index) in anchorRank.slice(3, 10)"
                     :class="{bg: index % 2 === 0}"
                     :index="index + 3"
                     :gold="item.income"
                     :item="item.anchor"
                     :key="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../../components/header/header'
import LevelIcon from '../../components/level-icon/level-icon'
import RankItem from '../../components/rank-item/rank-item'
import { post } from '../../util/http'
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

const defaultUser = {
  id: null,
  user: {
    nick_name: '虚位以待',
    avatar: require('./moren@2x.png')
  }
}

export default {
  name: 'index',
  async asyncData({ req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }
    const { data: { data: userRank } } = await post({ url: '/webapi/Rank/getUserRankList', data: { type: 0 }, req })
    const { data: { data: anchorRank } } = await post({ url: '/webapi/Rank/getAnchorRankList', data: { type: 0 }, req })
    userRank.forEach(item => {
      item.user.isVip = new Date(item.user.vip_date).getTime() > Date.now()
    })
    anchorRank.forEach(item => {
      item.anchor.isVip = new Date(item.anchor.vip_date).getTime() > Date.now()
    })
    return {
      userRank,
      anchorRank
    }
  },
  layout: 'common-footer',
  components: {
    NaHeader,
    LevelIcon,
    RankItem
  },
  data() {
    return {
      leftActive: 0,
      rightActive: 0,
      list: [],
      userRank: [],
      anchorRank: [],
      medals: [require('./youxia@2x.png'), require('./qishi@2x.png'), require('./gongjue@2x.png'), require('./king@2x.png')]
    }
  },
  computed: {
    bigUserList() {
      return [this.userRank[1] || defaultUser, this.userRank[0] || defaultUser, this.userRank[2] || defaultUser]
    },
    bigAnchorList() {
      let anchorDefault = {
        ...defaultUser,
        anchor: { ...defaultUser.user }
      }
      return [this.anchorRank[1] || anchorDefault, this.anchorRank[0] || anchorDefault, this.anchorRank[2] || anchorDefault]
    }
  },
  methods: {
    focus(data) {
      const copy = JSON.parse(JSON.stringify(data.type === 'user' ? this.userRank[data.index] : this.anchorRank[data.index]))
      if (data.type === 'user') {
        copy.user.isattent = !copy.user.isattent
        this.$set(this.userRank, data.index, copy)
      } else {
        copy.anchor.isattent = !copy.anchor.isattent
        this.$set(this.anchorRank, data.index, copy)
      }
    },
    changeTab(tab, type) {
      if (type === 0) {
        if (tab === this.leftActive) return
        post({ url: '/webapi/Rank/getUserRankList', data: { type: tab } })
          .then(({ data: { data } }) => {
            data.forEach(item => {
              item.user.isVip = new Date(item.user.vip_date).getTime() > Date.now()
            })
            this.userRank = data
          })
        this.leftActive = tab
      } else {
        if (tab === this.rightActive) return
        post({ url: '/webapi/Rank/getAnchorRankList', data: { type: tab } })
          .then(({ data: { data } }) => {
            data.forEach(item => {
              item.anchor.isVip = new Date(item.anchor.vip_date).getTime() > Date.now()
            })
            this.anchorRank = data
          })
        this.rightActive = tab
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.rank
  overflow hidden
  min-height 100vh
  background #F5F5F5
  .na-header
    background #ffff
  .content-box
    width 1250px
    margin 31px auto
    display flex
    justify-content space-between
    .rank-wrap
      width 616px
      padding 0 18px
      background-color #fff
      overflow hidden
      .head
        display flex
        padding-top 16px
        margin-bottom 76px
        align-items center
        justify-content space-between
        &>h4
          font-size 17px
          color #262C48
          font-weight bold
        .tabs
          display flex
          &>li
            width 48px
            height 20px
            line-height 20px
            border-radius 10px
            text-align center
            font-size 12px
            color #262C48
            cursor pointer
            &.active
              color #ffffff
              font-weight bold
              background linear-gradient(90deg,rgba(158,93,255,1),rgba(47,233,255,1))
    .big-rank
      padding 0 43px
      display flex
      justify-content space-between
      overflow hidden
      padding-bottom 90px
      background url(./jiangtai@2x.png) no-repeat
      background-position bottom 0 left 0
      background-size 100%
      .item
        width 99px
        height 200px
        text-align center
        &:nth-child(1)
          margin-top 33px
          .avatar
            background url(./no2@2x.png) center center no-repeat
            background-size 100% 100%
        &:last-child
          margin-top 58px
          .avatar
            background url(./no3@2x.png) center center no-repeat
            background-size 100% 100%
        .avatar
          width 100%
          height 104px
          margin-bottom 14px
          background url(./no1@2x.png) center center no-repeat
          background-size 100% 100%
          overflow hidden
          &>img
            display block
            width 81px
            height 81px
            margin-top 18px
            margin-left 13px
            border-radius 50%
        &>p
          margin-bottom 8px
          text-align center
          font-size 15px
          color #000000
        .level
          display flex
          justify-content center
          align-items center
          margin-bottom 13px
          img:first-child
            width 32px
            height 32px
            margin-right 5px
        .gold
          font-size 13px
          color #000000
          &>span
            color #FEC838
    .rank-list
      .bg
        background #F9F9FF
</style>
