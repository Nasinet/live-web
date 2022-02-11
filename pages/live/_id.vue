<template>
  <Component @focus="focus" @liveFinished="liveFinished" @startLive="startLive" :recLive="recLive" :liveDetail="liveDetail" :anchor="anchor" :is="isAnchor ? 'AnchorRoom' : 'UserRoom'"/>
</template>

<script>
import UserRoom from '../../components/live-detail/live-detail'
import AnchorRoom from '../../components/anchor-room/anchor-room'
import { post } from '../../util/http'
import getPlatform from '../../util/platform'
import { h5Host } from "../../util/host";

export default {
  name: 'live-detail',
  async asyncData ({ params, req, store, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/live/' + params.id)
      return
    }
    const { data: { data } } = await post({url: '/webapi/live/getLivePageData', data: { anchorid: params.id }, req})
    return {
      recLive: data.rec_lives,
      liveDetail: data.live ? data.live : {},
      anchor: data.anchor,
      isAnchor: store.state.userInfo.id === data.anchor.id
    }
  },
  components: {
    UserRoom,
    AnchorRoom
  },
  data () {
    return {
      recLive: [],
      liveDetail: {
        pull_url: '',
        title: '',
        categoryid: null,
        start_stamp: 0
      },
      anchor: {},
      isAnchor: false
    }
  },
  methods: {
    focus(count) {
      this.$set(this.anchor, 'isattent', !this.anchor.isattent)
      this.$set(this.anchor, 'fans_count', count)
    },
    startLive(data) {
      this.liveDetail = {
        ...data,
        hot: 0
      }
    },
    async liveFinished() {
      try {
        const { data: { data } } = await post({url: '/webapi/live/getLivePageData', data: { anchorid: this.$route.params.id }})
        this.recLive = data.rec_lives
        this.liveDetail = data.live || {}
        this.anchor = data.anchor
        this.isAnchor = this.$store.state.userInfo.id === data.anchor.id
        this.$forceUpdate()
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease-in-out
  .slide-enter, .slide-leave-to
    transform translate3d(0, -70%, 0) scale(0.1)
    opacity 0
.live-detail
  .content-wrap
    min-width 1360px
    height calc(100vh - 81px)
    background-color #F5F5F5
  .live-content
    display flex
    overflow-x scroll
    .video
      height calc(100vh - 81px)
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
        padding-top 49%
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
      height calc(100vh - 93px)
      margin-right 27px
      width 360px
      min-width 360px
      border-radius 9px
      overflow hidden
      background-color #ffffff
</style>
