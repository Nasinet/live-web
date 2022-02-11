<template>
  <div class="player">
    <div class="recommend" v-if="!detail.pull_url">
      <h4>主播还没开播哦，去其他直播间看看吧~</h4>
      <div class="list">
        <live-item class="item" v-for="item in recLive" :key="item.id" :item="item" />
      </div>
    </div>
    <div v-if="detail.pull_url" @mousemove="toggleControl" style="width: 100%;height: 100%;position: relative;" id="live_video"></div>
    <player-control
      @togglePlay="togglePlay"
      v-if="detail.pull_url"
      :class="showControl || paused ? 'slide-in' : ''"
      @fullscreen="fullscreen"
      :paused="paused"
      @show="alwaysShow"
      @hide="toggleControl"
      @changeVol="changeVol"
      @toggleVol="toggleVol"
      @toggleDan="toggleDan"
      ref="playControl"
      :default-volume="volume" />
    <float-gift ref="floatGift" v-for="(item, index) in giftList" :index="index" @delGift="delGift" :key="item.uuid" :gift="item" />
  </div>
</template>

<script>
import LiveItem from '../../components/live-item/live-item'
import PlayerControl from '../../components/player-control/player-control'
import FloatGift from '../../components/float-gift/float-gift'
import axios from 'axios'
import { post } from '../../util/http'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'player',
  components: {
    LiveItem,
    PlayerControl,
    FloatGift
  },
  props: {
    detail: {
      type: Object,
      default() {
        return null
      }
    },
    recLive: {
      type: Array,
      default() {
        return []
      }
    },
    giftList: {
      type: Array,
      default() {
        return []
      }
    },
    isAnchor: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      paused: false,
      volume: 50,
      showControl: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted() {
    if (this.detail.pull_url) {
      this.createPlayer()
    }
  },
  beforeDestroy() {
    try {
      if (this.player) this.player.destroy()
    } catch (e) {
    }
    clearInterval(this.payTimer)
  },
  methods: {
    ...mapMutations(['changeUserInfo']),
    destroyPlayer() {
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
      clearInterval(this.payTimer)
    },
    delGift(index) {
      this.$emit('delGift', index)
    },
    toggleDan(show) {
      if (show) {
        this.player.danmaku.hide()
      } else {
        this.player.danmaku.show()
      }
    },
    changeVol(vol) {
      this.volume = vol
      this.player.volume(vol / 100, true, false)
    },
    alwaysShow() {
      clearTimeout(this.timer)
      this.showControl = true
    },
    toggleControl() {
      this.showControl = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.showControl = false
      }, 1500)
    },
    togglePlay() {
      this.player.toggle()
    },
    toggleVol() {
      if (this.volume > 0) {
        this.volume = 0
        this.player.volume(0, true, false)
        return
      }
      this.player.volume(1, true, false)
      this.volume = 100
    },
    fullscreen(full) {
      if (full) {
        this.player.fullScreen.request('browser')
      } else {
        this.player.fullScreen.cancel('browser')
      }
    },
    createPlayer() {
      this.player = new this.$DPlayer({
        container: document.getElementById('live_video'),
        video: {
          url: this.detail.pull_url,
          pic: this.detail.thumb
        },
        danmaku: {
          api: 'https://' + window.location.host + '/danmu',
          id: 123
        },
        autoplay: true,
        volume: 0.5,
        loop: true,
      })

      this.player.on('pause', () => {
        this.paused = true
      })

      this.player.on('play', () => {
        this.paused = false
      })

      this.doPlay()

      axios.get(this.detail.pull_url).catch(() => {
        this.player.destroy()
        this.createPlayer()
      })
    },
    doPlay() {
      this.player.volume(0.5, true, false)
      this.player.on('canplay', () => {
        this.player.video.play().catch(() => {
          this.volume = 0
          this.player.video.muted = true
          this.player.play()
          this.player.volume(0, true, false)
          this.$refs.playControl.volume = 0
        })
        if (!this.isAnchor && this.detail.room_type === 2 && !this.payTimer) {
          this.timePay()
        }
      })
    },
    drawDanmu(msg) {
      if (!this.player) return
      this.player.danmaku.draw({
        text: msg,
        color: '#fff',
        type: 'top',
      })
    },
    timePay() {
      this.pay()
      this.payTimer = setInterval(() => {
        if (this.userInfo.gold < this.detail.price) {
          this.$emit('moneyEnd')
          this.player.destroy()
          clearInterval(this.payTimer)
          return
        }
        this.pay()
      }, 1000 * 60)
    },
    pay() {
      post({ url: '/webapi/live/timeBilling', data: { liveid: this.detail.liveid } })
        .then(({ data: { data } }) => {
          this.changeUserInfo({
            ...this.userInfo,
            gold: data.gold
          })
          if (data.gold < this.detail.price) {
            this.$emit('noEnough')
          }
        })
        .catch(() => {
          clearInterval(this.payTimer)
          this.player.destroy()
          this.$message.error('扣费失败，请刷新后观看')
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.player
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  background-color #000
  overflow hidden
  .slide-in
    transform translate3d(0, 0, 0)
  .recommend
    position absolute
    left 50%
    top 20%
    transform translateX(-50%)
    &>h4
      margin-bottom 54px
      text-align center
      font-size 17px
      color #FFFFFF
    .list
      display flex
      .item
        margin-right 15px
        &:last-child
          margin-right 0
  @media only screen and (max-width: 1460px)
    .recommend
      transform translateX(-50%) scale(0.8)
</style>
