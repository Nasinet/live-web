<template>
  <div class="gift-send">
    <img src="./coin@2x.png" class="coin" alt="">
    <p class="coin-num">金币：<span>{{ userInfo.gold }}</span></p>
    <div class="recharge" @click="recharge">充值</div>
    <div style="flex: 1;"></div>
    <div class="gift-list">
      <div @click="turnLeft" class="left control"><i class="el-icon-arrow-left"></i></div>
      <div class="scroll-wrap" :style="{width: scrollWidth}">
        <ul class="list" :style="{width: listWidth, ...giftStyle}">
          <li @mouseover="showFloat(gift, index)"
              @mouseleave="hideFloat"
              v-for="(gift, index) in giftList"
              :key="gift.id"
              :class="{active: gift.id === selectedGift.id}">
            <img :src="gift.icon" alt="">
          </li>
        </ul>
      </div>
      <div @click="turnRight" class="control right"><i class="el-icon-arrow-right"></i></div>
      <template v-if="showGiftFloat">
        <static-float
          :index="selectedIndex"
          @show="showFloat"
          @sendGift="sendGift"
          @hide="hideFloat"
          :scroll-num="scrollNum"
          :gift="selectedGift"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { post } from '../../util/http'
import StaticFloat from './static-float'

export default {
  name: 'gift-send',
  components: {
    StaticFloat
  },
  props: {
    scrollNum: {
      type: Number,
      default: 5
    },
    detail: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      giftList: [],
      transformNum: 0,
      giftTransform: 0,
      selectedGift: {},
      selectedIndex: 0,
      showGiftFloat: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    scrollWidth () {
      return this.scrollNum * 58 + 11 + 'px'
    },
    listWidth () {
      return this.giftList.length * 58 + 11 + 'px'
    },
    giftStyle () {
      return { transform: `translate3d(-${this.giftTransform}px, 0, 0)` }
    }
  },
  created () {
    this.getGiftList()
  },
  methods: {
    ...mapMutations(['changeUserInfo', 'toggleLogin']),
    showFloat(gift, index) {
      this.timer && clearInterval(this.timer)
      this.showGiftFloat = true
      if (!gift) return
      this.selectedGift = gift
      this.selectedIndex = index
    },
    hideFloat() {
      this.timer = setTimeout(() => {
        this.showGiftFloat = false
      }, 100)
    },
    getGiftList () {
      post({ url: '/webapi/gift/getGiftList' })
        .then(({ data: { data } }) => {
          this.giftList = data
        })
    },
    turnRight () {
      if (this.transformNum >= (Math.ceil(this.giftList.length / this.scrollNum)) - 1) return
      this.transformNum++
      this.giftTransform += 58 * this.scrollNum
    },
    turnLeft () {
      if (this.transformNum === 0) return
      this.transformNum--
      this.giftTransform -= 58 * this.scrollNum
    },
    async sendGift(num) {
      this.showGiftFloat = false
      if (!this.detail.anchorid) {
        this.$message.error('主播还未开播')
        return
      }
      try {
        const { data: { data } } = await post({
          url: '/webapi/gift/sendGift',
          data: {
            giftid: this.selectedGift.id,
            anchorid: this.detail.anchorid,
            liveid: this.detail.liveid,
            count: num
          }
        })

        this.changeUserInfo({
          ...this.userInfo,
          gold: data.gold
        })
      } catch (e) {
      }
    },
    recharge() {
      if (!this.userInfo.id) {
        this.toggleLogin()
      } else {
        this.$router.push('/user-center/recharge')
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.gift-send
  display flex
  background-color #fff
  height 60px
  padding-left 17px
  padding-right 10px
  align-items center
  .coin
    width 25px
    height 25px
    margin-right 15px
  .coin-num
    font-size 13px
    color #333333
    &>span
      color #FFA619
  .recharge
    cursor pointer
    width 66px
    height 30px
    margin-left 26px
    text-align center
    line-height 30px
    border-radius 3px
    background linear-gradient(81deg,rgba(255,213,30,1),rgba(255,164,34,1))
    color #fff
    font-size 13px
  .gift-list
    display flex
    position relative
    .control
      width 17px
      height 47px
      border-radius 4px
      border 1px solid #E8E8E8
      line-height 47px
      text-align center
      z-index 9
      &>i
        font-size 14px
        color #D1D1D1
      &:last-child
        &>img
          transform rotateZ(180deg)
    .scroll-wrap
      overflow hidden
      height 47px
      .list
        display flex
        transition all 0.3s ease
        &>li
          box-sizing border-box
          width 47px
          height 47px
          line-height 45px
          border-radius 11px
          border 1px solid #E8E8E8
          margin-right 12px
          display flex
          justify-content center
          align-items center
          &.active
            border-color #FFAA21
          &:first-child
            margin-left 11px
          &>img
            width 90%
  .send-btn
    width 66px
    height 30px
    margin-left 12px
    line-height 30px
    border-radius 3px
    background linear-gradient(81deg,rgba(130,209,255,1),rgba(133,100,255,1))
    text-align center
    font-size 13px
    color #fff
    cursor pointer
</style>
