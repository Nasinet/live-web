<template>
  <div class="vip-alert" @scroll.prevent>
    <div class="box">
      <img @click="$emit('close')" src="./close@2x.png" alt="" class="close">
      <img src="./top@2x.png" alt="" class="title">
      <ul class="tabs">
        <li>特权对比</li>
        <li @click="active=0" :class="{active: active === 0}"><img src="./youxia_pre@2x.png" alt=""><span>游侠</span></li>
        <li @click="active=1" :class="{active: active === 1}"><img src="./qishi@2x.png" alt=""><span>骑士</span></li>
        <li @click="active=2" :class="{active: active === 2}"><img src="./gongjue@2x.png" alt=""><span>公爵</span></li>
        <li @click="active=3" :class="{active: active === 3}"><img src="./guowang@2x.png" alt=""><span>国王</span></li>
      </ul>
      <div class="desc">
        <div class="left">
          <img :src="levels[active].icon" alt="">
          <p>{{ levels[active].title }}</p>
        </div>
        <ul class="right">
          <li v-for="item in currentPrivilege" :key="item.id">
            <img :src="item.icon" alt="">
            <div class="text">
              <h6>{{ item.title }}</h6>
              <p>{{ item.content }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="foot">
        <div class="price" v-if="prices.length">
          <p>赠送<span>{{ prices[active].gold }}</span>金币</p>
          <p><span>{{ prices[active].price }}</span>元/<span>30</span>天</p>
        </div>
        <div style="flex: 1;"></div>
        <p class="status">{{ vipText }}</p>
        <button>{{ vipText === '暂未开通' ? '立即开通' : '立即续费' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '../../util/http'
import { mapState } from 'vuex'

export default {
  name: 'vip-alert',
  data () {
    return {
      active: 0,
      privilege: [
        {
          id: 1,
          icon: require('./texiao@2x.png'),
          title: '开通特效',
          content: '全频道广播'
        },
        {
          id: 2,
          icon: require('./mingpian@2x.png'),
          title: '贵族名片',
          content: '尊贵身份象征'
        },
        {
          id: 3,
          icon: require('./guizu@2x.png'),
          title: '贵族勋章',
          content: '贵族专属勋章'
        },
        {
          id: 4,
          icon: require('./changliao@2x.png'),
          title: '无限畅聊',
          content: '与主播无限畅聊'
        },
        {
          id: 5,
          icon: require('./lianmai@2x.png'),
          title: '连卖互动',
          content: '与主播零距离亲密互动'
        },
        {
          id: 6,
          icon: require('./gift@2x.png'),
          title: '贵族礼物',
          content: '贵族专属礼物'
        },
        {
          id: 7,
          icon: require('./jinchang@2x.png'),
          title: '进场欢迎',
          content: '进场信息提示'
        },
        {
          id: 8,
          icon: require('./dongtai@2x.png'),
          title: '私密动态',
          content: '免费查看私密动态'
        },
        {
          id: 9,
          icon: require('./jinyan@2x.png'),
          content: '无法被房管禁言'
        }
      ],
      levels: [
        { icon: require('./youxia_big@2x.png'), title: '游侠' },
        { icon:  require('./qishi2@2x.png'), title: '骑士' },
        { icon:  require('./gongjue2@2x.png'), title: '公爵' },
        { icon:  require('./guowang2@2x.png'), title: '国王' }
      ],
      prices: []
    }
  },
  computed: {
    ...mapState(['userInfo']),
    currentPrivilege() {
      if (this.active === 0) return this.privilege.slice(0, 4)
      if (this.active === 1) return this.privilege.slice(0, 7)
      if (this.active === 2) return this.privilege.slice(0, 8)
      return this.privilege
    },
    vipText() {
      if (this.userInfo.vip_level && new Date(this.userInfo.vip_date).getTime() > Date.now()) {
        if (this.userInfo.vip_level === this.active + 1) {
          return `${this.userInfo.vip_date}到期`
        }
      }
      return '暂未开通'
    }
  },
  created() {
    post({ url: '/webapi/vip/getVipPriceList' })
      .then(({ data: { data } }) => {
        this.prices = data
      })
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  beforeDestroy() {
    document.body.style = null
  }
}
</script>

<style scoped lang="stylus">
.vip-alert
  position fixed
  padding 7px
  width 933px
  top 50%
  transform translate3d(0, -50%, 0) scale(1)
  background linear-gradient(0deg, rgba(106,84,66,1), rgba(132,98,56,1), rgba(211,185,102,1))
  border-radius 28px
  .box
    height 640px
    position relative
    padding 0 48px
    padding-top 100px
    border-radius 22px
    background-color #191A1E
    .close
      position absolute
      right 14px
      top 16px
      width 37px
      height 37px
      cursor pointer
    .title
      position absolute
      left 50%
      transform translateX(-50%)
      top -75px
      display block
      width 347px
      height 151px
    .tabs
      display flex
      margin-bottom 33px
      &>li
        flex 1
        display flex
        justify-content center
        align-items center
        border 1px solid #52493D
        font-size 18px
        color #766A5B
        cursor pointer
        &:first-child
          color #E1C39C
          cursor default
        &.active
          border none
          color #EACCA4
          font-weight bold
          background linear-gradient(180deg,rgba(159,131,86,1),rgba(73,60,48,1))
        &>img
          width 57px
          height 57px
          margin-right 16px
    .desc
      display flex
      background url(./bg@2x.png) center center no-repeat
      background-size 100% 100%
      .left
        margin 12px
        margin-bottom 23px
        background url(./bg_yuan@2x.png) center center no-repeat
        background-size 100% 100%
        width 303px
        min-width 303px
        height 303px
        overflow hidden
        &>img
          display block
          width 170px
          margin 0 auto
          margin-top 69px
          height 180px
        &>p
          width 82px
          margin 0 auto
          margin-top 7px
          height 30px
          border-radius 8px
          border 3px solid #4E4337
          background linear-gradient(185deg,rgba(33,32,39,1),rgba(23,22,28,1));
          text-align center
          line-height 24px
          color #E1C39C
          font-size 15px
          font-weight bold
      .right
        margin-top 12px
        height 303px
        overflow-y scroll
        display flex
        align-content flex-start
        justify-content space-between
        flex-wrap wrap
        &::-webkit-scrollbar-thumb
          background-color #fff
        &>li
          width 45%
          display flex
          overflow hidden
          margin-bottom 23px
          &:first-child
            margin-top 13px
          &:nth-child(2)
            margin-top 13px
          &>img
            margin-right 8px
            width 54px
            height 54px
          .text
            &>h6
              margin-top 3px
              margin-bottom 19px
              font-size 14px
              color #C8B793
            &>p
              font-size 13px
              color #939393
    .foot
      display flex
      margin-top 26px
      align-items center
      .price
        font-size 15px
        color #939393
        &>p
          margin-bottom 17px
          &>span
            color #C7B793
            font-weight bold
          &:last-child
            margin-bottom 0
      .status
        margin-right 34px
        font-size 15px
        color #939393
      &>button
        width 152px
        height 50px
        background url(./button@2x.png) center center no-repeat
        background-size 100% 100%
        font-size 15px
        color #53330D
        cursor pointer
</style>
