<template>
  <div class="detail-rank" @mouseover="showList=true" @mouseleave="showList=false">
    <ul class="tab" @mouseover.stop>
      <li :class="{active: activeRank === 1}" @click="changeTab(1)">
        <p>亲密总榜</p>
      </li>
      <li :class="{active: activeRank === 2}" @click="changeTab(2)">
        <p>亲密周榜</p>
      </li>
    </ul>
    <ul class="rank">
      <li>
        <div class="avatar">
          <img :src="no2.img || defaultAvatar" alt="">
        </div>
        <p @click.stop="showFloatUser(list[1] ? list[1].user : null)">{{ no2.text }}</p>
        <div class="level" v-if="no2.vipLevel!==null">
          <img v-if="medals[no2.vipLevel-1]  && no2.isVip" :src="medals[no2.vipLevel-1]" alt="">
          <img :src="levelIcon[no2.userLevel]" alt="">
        </div>
      </li>
      <li>
        <div class="avatar">
          <img :src="no1.img || defaultAvatar" alt="">
        </div>
        <p @click.stop="showFloatUser(list[0] ? list[0].user : null)">{{ no1.text }}</p>
        <div class="level" v-if="no1.vipLevel!==null">
          <img v-if="medals[no1.vipLevel-1]  && no1.isVip" :src="medals[no1.vipLevel-1]" alt="">
          <img :src="levelIcon[no1.userLevel]" alt="">
        </div>
      </li>
      <li>
        <div class="avatar">
          <img :src="no3.img || defaultAvatar" alt="">
        </div>
        <p @click.stop="showFloatUser(list[2] ? list[2].user : null)">{{ no3.text }}</p>
        <div class="level" v-if="no3.vipLevel!==null">
          <img v-if="medals[no3.vipLevel-1] && no3.isVip" :src="medals[no3.vipLevel-1]" alt="">
          <img :src="levelIcon[no3.userLevel]" alt="">
        </div>
      </li>
    </ul>
    <transition name="el-zoom-in-top">
      <div class="rank-list" v-if="showList && dropList.length">
        <rank-item
          :gold="activeRank===1 ? item.intimacy : item.intimacy_week"
          @showFloatUser="showFloatUser"
          :showBtn="false"
          type="user"
          v-for="(item, index) in dropList"
          :index="index+3"
          :item="item.user"
          :key="item.id" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RankItem from '../../components/rank-item/rank-item'
import { post } from '../../util/http'
import levelIcon from '../../util/level-icon'

export default {
  name: 'detail-rank',
  components: {
    RankItem
  },
  props: {
    anchorId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      activeRank: 1,
      current: [],
      list: [],
      showList: false,
      levelIcon,
      medals: [require('../../pages/rank/youxia@2x.png'), require('../../pages/rank/qishi@2x.png'), require('../../pages/rank/gongjue@2x.png'), require('../../pages/rank/king@2x.png')]
    }
  },
  computed: {
    ...mapState(['defaultAvatar']),
    no1 () {
      return this.getSingle(this.list[0])
    },
    no2 () {
      return this.getSingle(this.list[1])
    },
    no3 () {
      return this.getSingle(this.list[2])
    },
    dropList() {
      if (this.list.length > 3) return this.list.slice(3)
      return []
    }
  },
  mounted() {
    this.getRank()
  },
  beforeDestroy() {
    this.$off('showFloatUser')
  },
  methods: {
    async getRank() {
      try {
        const { data: { data } } = await post({
          url: `/webapi/intimacy/${this.activeRank === 1 ? 'getTotalIntimacyRank' : 'getWeekIntimacyRank'}`,
          data: {
            anchorid: this.anchorId
          }
        })
        data.forEach(item => {
          item.user.isVip = new Date(item.user.vip_date).getTime() > Date.now()
        })
        this.list = data
      } catch (e) {
      }
    },
    showFloatUser(user) {
      if (!user) return
      this.$emit('showFloatUser', user)
    },
    getSingle (user) {
      return {
        img: user ? (user.user.avatar || require('../../pages/rank/moren@2x.png')) : require('../../pages/rank/moren@2x.png'),
        text: user ? user.user.nick_name : '虚位以待',
        userLevel: user ? user.user.user_level : null,
        vipLevel: user ? user.user.vip_level : null,
        isVip: user ? user.user.isVip : false
      }
    },
    changeTab (tab) {
      if (tab === this.activeRank) return
      this.activeRank = tab
      this.getRank()
    }
  },
  watch: {
    anchorId (newVal) {
      if (newVal) this.getTotalRank()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.detail-rank
  position relative
  .tab
    display flex
    &>li
      flex 1
      height 45px
      line-height 45px
      box-sizing border-box
      text-align center
      background-color #F5F5FB
      font-size 15px
      color #636379
      cursor pointer
      &.active
        color $theme-color
        font-weight bold
        background-color #fff
  .rank
    display flex
    justify-content space-between
    padding 0 20px
    margin-top 18px
    &>li
      width 33%
      .level
        margin-top 8px
        display flex
        align-items center
        justify-content center
        img:first-child
          width 26px
          height 26px
          margin-right 5px
        img:last-child
          width 28px
          height 18px
      &>p
        width 95%
        padding-left 20px
        word-break break-all
        margin-top 5px
        text-align center
        font-size 12px
        color #666
        cursor pointer
      &:first-child, &:last-child
        .avatar
          width 66px
          margin 0 auto
          height 68px
          background url("./no2@2x.png") center center no-repeat
          background-size 100%
          &>img
            width 54px
            height 54px
            margin-top 11px
            margin-left 8.5px
            border-radius 50%
      &:last-child
        .avatar
          background-image url("./no3@2x.png")
      &:nth-child(2)
        margin-bottom 15px
        .avatar
          height 80px
          width 77px
          margin 0 auto
          background url("./no1@2x.png") center center no-repeat
          background-size 100%
          &>img
            width 66px
            height 66px
            margin-top 10px
            margin-left 7px
            border-radius 50%
  .rank-list
    position absolute
    top 100%
    background #fff
    z-index 9
    padding 0 17px
    width 100%
    border-bottom 1px solid #E5E5E5
</style>
