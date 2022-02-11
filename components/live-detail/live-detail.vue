<template>
  <div class="live-detail">
    <na-header/>
    <div class="content-wrap">
      <div class="live-content">
        <float-menu :open="menuOpen" @toggleMenu="menuOpen=!menuOpen" />
        <div class="video" :style="{marginLeft: menuOpen ? '294px' : '134px'}">
          <room-intro @focus="focus" :roomPeople="roomPeople" :anchor="anchor" :detail="liveDetail" />
          <div class="player-wrap">
            <player v-if="liveDetail.room_type === 0 || showPlayer || !liveDetail.liveid" @noEnough="noEnough" @moneyEnd="confirmRecharge" @delGift="delGift" :gift-list="sendGiftList" ref="player" :detail="liveDetail" :rec-live="recLive" />
          </div>
          <gift-send :detail="liveDetail" :scroll-num="8" />
<!--          <live-recommend/>-->
          <div class="anchor-dynamic">
            <h4>主播动态</h4>
            <dynamic-item @changeDyItem="changeDyItem" @collected="collected" @like="like" v-for="(item, index) in dyList" :index="index" :key="item.id" :item="item" />
          </div>
        </div>
        <div class="message">
          <div class="report">
            <img src="./gonggao@2x.png" alt="">
            <p class="text-overflow">房间公告：{{ anchor.profile.signature }}</p>
          </div>
          <detail-rank :anchor-id="anchor.id" @showFloatUser="showFloatUser" />
          <set-list v-if="visibleSet" :show-mgr="false" />
          <live-message
            @pushGift="pushGift"
            @changHumanNum="changHumanNum"
            @drawDanmu="drawDanmu"
            @liveFinished="liveFinished"
            ref="message"
            :show-set="isMgr"
            @toggleSet="toggleSet"
            :room-id="'LIVEROOM_' + anchor.id"
            @checkMgr="checkMgr"
            @showFloatUser="showFloatUser" />
          <transition name="slide">
            <message-user-float @set="showDia" :show-set="isMgr && floatUser.id !== userInfo.id && floatUser.id !== anchor.id" :id="floatUser.id" @close="visibleFloatUser=false" v-if="visibleFloatUser" />
          </transition>
        </div>
      </div>
    </div>
    <room-confirm @close="showRoomConfirm=false" @confirm="checkConfirm" v-if="showRoomConfirm" :type="liveDetail.room_type" :price="liveDetail.price" />
    <el-dialog title="请选择您要做的操作" :visible.sync="dialogVisible" width="30%">
      <span>{{ `用户：${floatUser.nick_name}（ID：${floatUser.id}）` }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button @click="mutedUser" type="primary">禁言</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NaHeader from '../header/header'
import FloatMenu from '../float-menu/float-menu'
import RoomIntro from '../room-intro/room-intro'
import GiftSend from '../gift-send/gift-send'
import DetailRank from '../detail-rank/detail-rank'
import LiveMessage from '../live-message/live-message'
import Player from '../player/player'
import DynamicItem from '../dynamic-item/dynamic-item'
import MessageUserFloat from '../message-user-float/message-user-float'
import RoomConfirm from '../room-confirm/room-confirm'
import SetList from '../set-list/set-list'
import { post } from '../../util/http'
import CryptoJS from 'crypto-js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'live-detail',
  components: {
    NaHeader,
    FloatMenu,
    RoomIntro,
    GiftSend,
    DetailRank,
    LiveMessage,
    Player,
    DynamicItem,
    MessageUserFloat,
    RoomConfirm,
    SetList
  },
  props: {
    recLive: {
      type: Array,
      default() {
        return []
      }
    },
    liveDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    anchor: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      menuOpen: false,
      dyList: [],
      visibleFloatUser: false,
      floatUser: {},
      roomPeople: 0,
      sendGiftList: [],
      showPlayer: false,
      showRoomConfirm: false,
      visibleSet: false,
      isMgr: false,
      dialogVisible: false
    }
  },
  mounted() {
    this.getDynamicList()
    if (this.userInfo.id) {
      this.checkMgr()
    }
    if (!this.liveDetail.liveid) return
    if (this.liveDetail.room_type === 2 && this.userInfo.gold < this.liveDetail.price) {
      this.confirmRecharge()
      return
    }
    if (this.liveDetail.room_type !== 0) {
      this.showRoomConfirm = true
    }
  },
  beforeDestroy() {
    this.$off('liveFinished')
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    toggleSet() {
      this.visibleSet = !this.visibleSet
    },
    showDia() {
      this.visibleFloatUser = false
      this.dialogVisible = true
    },
    mutedUser() {
      post({ url: '/webapi/live/banUser', data: { userid: this.floatUser.id, type: 1, anchorid: this.anchor.id } })
        .then(() => {
          this.dialogVisible = false
        })
    },
    checkMgr() {
      if (!this.userInfo.id) return;
      post({ url: '/api/live/checkIsMgr', data: { anchorid: this.anchor.id, hideMSg: true } })
        .then(({ data }) => {
          this.isMgr = true
        })
        .catch(() => {
          this.isMgr = false
        })
    },
    confirmRecharge() {
      try {
        this.$messageBox.close()
        this.$messageBox.confirm('余额不足，请充值后进入房间！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!this.userInfo.id) {
            this.toggleLogin()
            return
          }
          window.location.href = '/user-center/recharge'
        })
      } catch (e) {
        this.$messageBox.confirm('余额不足，请充值后进入房间！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!this.userInfo.id) {
            this.toggleLogin()
            return
          }
          window.location.href = '/user-center/recharge'
        })
      }
    },
    noEnough() {
      try {
        this.$messageBox.close()
        this.$messageBox.confirm('您的金币即将用尽，请前往充值！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!this.userInfo.id) {
            this.toggleLogin()
            return
          }
          window.location.href = '/user-center/recharge'
        })
      } catch (e) {
        this.$messageBox.confirm('您的金币即将用尽，请前往充值！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!this.userInfo.id) {
            this.toggleLogin()
            return
          }
          window.location.href = '/user-center/recharge'
        })
      }
    },
    focus({count, type}) {
      this.$emit('focus', count)
      if (type) {
        this.$refs.message.sendMessage('关注了主播', 'RoomMessage')
      }
    },
    liveFinished() {
      this.$refs.player.destroyPlayer()
      this.$emit('liveFinished')
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    pushGift(data) {
      setTimeout(() => {
        data.Data.gift.uuid = this.uuid()
        this.sendGiftList.push(data.Data.gift)
      }, 500)
    },
    delGift(index) {
      this.sendGiftList.splice(index, 1)
    },
    changeDyItem(data) {
      const copy = {...this.dyList[data.index]}
      copy.unlocked = true
      this.$set(this.dyList, data.index, {
        ...copy,
        ...data.item
      })
    },
    collected(data) {
      const copy = {...this.dyList[data.index]}
      copy.collected = data.collected
      this.$set(this.dyList, data.index, copy)
    },
    like(data) {
      const copy = {...this.dyList[data.index]}
      copy.liked = true
      copy.like_count = data.like_count
      this.$set(this.dyList, data.index, copy)
    },
    showFloatUser(user) {
      this.floatUser = user
      this.visibleFloatUser = true
    },
    async getDynamicList() {
      try {
        const {data: { data }} = await post({url: '/webapi/moment/getUserMomentList', data: { authorid: this.anchor.id }})
        this.dyList = data
      } catch (e) {
      }
    },
    drawDanmu(text) {
      if (!this.$refs.player) return
      this.$refs.player.drawDanmu(text)
    },
    changHumanNum(num) {
      this.roomPeople = num
    },
    checkConfirm(password) {
      if (this.liveDetail.room_type === 1) {
        if (CryptoJS.MD5(password).toString() === this.liveDetail.password) {
          this.showPlayer = true
          this.showRoomConfirm = false
        } else {
          this.$message.error('密码错误')
        }
      } else {
        this.showPlayer = true
        this.showRoomConfirm = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease-in-out
  .slide-enter, .slide-leave-to
    transform translate3d(0, -70%, 0) scale(0.1) !important
    opacity 0
.live-detail
  .content-wrap
    min-width 1360px
    height calc(100vh - 60px)
    background-color #F5F5F5
  .live-content
    display flex
    overflow-x scroll
    .video
      height calc(100vh - 60px)
      min-width 600px
      flex 1
      padding-left 11px
      padding-right 11px
      padding-top 12px
      border-radius 9px
      overflow-y scroll
      transition all 0.2s
      &::-webkit-scrollbar
        display none
      .player-wrap
        position relative
        width 100%
        height 0
        background #000
        padding-top 56.3%
      .anchor-dynamic
        width 100%
        margin-top 30px
        &>h4
          margin-bottom 17px
          font-size 20px
          color #3B3B4F
          font-weight bold
    .message
      margin-left 5px
      position relative
      margin-top 12px
      height calc(100vh - 73px)
      margin-right 27px
      width 360px
      min-width 360px
      border-radius 9px
      overflow hidden
      background-color #ffffff
</style>
