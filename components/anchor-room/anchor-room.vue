<template>
  <div class="anchor-room">
    <na-header/>
    <div class="room-content">
      <div class="video">
        <room-intro :room-people="roomPeople" :anchor="anchor" :detail="liveDetail" />
        <div class="live-player">
          <push-player @delGift="delGift" :gift-list="sendGiftList" ref="pushPlayer" @startLive="startLive" :live-detail="liveDetail"/>
        </div>
        <div class="live-get">
          <div class="coin">
            <img src="../gift-send/coin@2x.png" alt="">
            <p>直播收益：<span>{{ giftNum }}</span></p>
          </div>
          <div class="coin">
            <p>直播时长：<span>{{ duration }}</span></p>
          </div>
          <div style="flex: 1;" />
          <button @click="endLive" :style="{opacity: endBtnLoading ? '0.8' : 1}"><i v-if="endBtnLoading" class="el-icon-loading"></i><img v-if="!endBtnLoading" src="./finish@2x.png" alt="">结束直播</button>
        </div>
      </div>
      <div class="message">
        <div class="report">
          <img src="../live-detail/gonggao@2x.png" alt="">
          <p class="text-overflow">房间公告：{{ anchor.profile.signature }}</p>
        </div>
        <detail-rank :anchor-id="anchor.id" @showFloatUser="showFloatUser" />
        <set-list v-if="showSetList" />
        <live-message :is-anchor="true"
                      @changHumanNum="changHumanNum"
                      @drawDanmu="drawDanmu"
                      @pushGift="pushGift"
                      show-set
                      :room-id="'LIVEROOM_' + anchor.id"
                      @toggleSet="toggleSet"
                      @showFloatUser="showFloatUser" />
        <transition name="slide">
          <message-user-float
            @set="showSetDia"
            :id="floatUser.id"
            :show-set="userInfo.id !== floatUser.id"
            @close="visibleFloatUser=false"
            is-anchor
            v-if="visibleFloatUser" />
        </transition>
      </div>
    </div>
    <el-dialog title="请选择您要做的操作" :visible.sync="dialogVisible" width="30%">
      <span>{{ `用户：${floatUser.nick_name}（ID：${floatUser.id}）` }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mutedUser">禁言</el-button>
        <el-button @click="toggleMgr" type="primary">设为房管</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NaHeader from '../header/header'
import RoomIntro from '../room-intro/room-intro'
import DetailRank from '../detail-rank/detail-rank'
import LiveMessage from '../live-message/live-message'
import PushPlayer from '../push-player/push-player'
import MessageUserFloat from '../message-user-float/message-user-float'
import SetList from '../set-list/set-list'
import { getDuration } from '../../util/time'
import { mapState } from 'vuex'
import {post} from "../../util/http";

export default {
  name: 'anchor-room',
  components: {
    NaHeader,
    RoomIntro,
    DetailRank,
    LiveMessage,
    PushPlayer,
    MessageUserFloat,
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
  data() {
    return {
      liveTime: 0,
      visibleFloatUser: false,
      floatUser: {},
      endBtnLoading: false,
      giftNum: 0,
      roomPeople: 0,
      sendGiftList: [],
      showSetList: false,
      dialogVisible: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    duration() {
      return getDuration(this.liveTime, 'hh:mm:ss')
    }
  },
  mounted() {
    if (this.liveDetail.pull_url) {
      this.liveTime = Date.now() - this.liveDetail.start_stamp * 1000
      this.timer = setInterval(() => {
        this.liveTime+=1000
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    toggleMgr() {
      post({ url: '/webapi/live/setRoomMgr', data: { mgrid: this.floatUser.id, type: 1 } })
        .then(() => {
          this.dialogVisible = false
        })
    },
    mutedUser() {
      post({ url: '/webapi/live/banUser', data: { userid: this.floatUser.id, type: 1, anchorid: this.anchor.id } })
        .then(() => {
          this.dialogVisible = false
        })
    },
    showSetDia(user) {
      this.floatUser = user
      this.dialogVisible = true
      this.visibleFloatUser = false
    },
    toggleSet() {
      this.showSetList = !this.showSetList
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
        this.giftNum += (data.Data.gift.count * data.Data.gift.price)
        data.Data.gift.uuid = this.uuid()
        this.sendGiftList.push(data.Data.gift)
      }, 500)
    },
    delGift(index) {
      this.sendGiftList.splice(index, 1)
    },
    showFloatUser(user) {
      this.floatUser = user
      this.visibleFloatUser = true
    },
    startLive(data) {
      this.liveTime = 0
      this.giftNum = 0
      this.timer = setInterval(() => {
        this.liveTime+=1000
      }, 1000)
      this.$emit('startLive', data)
    },
    async endLive() {
      this.endBtnLoading = true
      try {
        const { data: { data } } = await post({ url: '/webapi/live/endLive' })
        this.giftNum = data.gift_profit
        this.endBtnLoading = false
        this.$refs.pushPlayer.endLive()
        clearInterval(this.timer)
      } catch (e) {
        this.endBtnLoading = false
      }
    },
    drawDanmu(text) {
      this.$refs.pushPlayer.drawDanmu(text)
    },
    changHumanNum(num) {
      this.roomPeople = num
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
.anchor-room
  .room-content
    min-height calc(100vh - 60px)
    display flex
    background-color #F5F5F5
    .video
      flex 1
      margin-left 145px
      margin-top 12px
      min-width 960px
      .live-player
        width 100%
        padding-top 49%
        position relative
      .live-get
        display flex
        width 100%
        height 64px
        align-items center
        padding-left 23px
        background-color #fff
        .coin
          margin-right 95px
          &>img
            width 23px
            height 23px
            margin-right 14px
            vertical-align middle
          &>p
            line-height 23px
            display inline-block
            font-size 17px
            color #333333
            &>span
              color #FFA619
        &>button
          margin-right 30px
          width 100px
          height 35px
          border-radius 5px
          background linear-gradient(90deg,rgba(255,94,124,1),rgba(255,125,104,1))
          font-size 15px
          color #FFFFFF
          &>img
            width 16px
            height 16px
            margin-right 5px
            vertical-align middle
    .message
      margin-top 12px
      width 425px
      min-width 360px
      display flex
      position relative
      flex-direction column
      height calc(100vh - 93px)
      margin-right 27px
      margin-left 16px
      border-radius 9px
      overflow hidden
      background-color #fff
@media only screen and (max-width: 1460px)
  .anchor-room
    .room-content
      .video
        margin-left 10px
</style>
