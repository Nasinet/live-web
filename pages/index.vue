<template>
  <div class="container">
    <na-header type="home" active-color="#FFFFFF" default-color="#CDCDCD"/>
    <div class="video">
      <div class="player">
        <div id="live_player"></div>
        <div class="control">
          <img @click="pause" v-if="!paused" src="~/assets/img/home/stop@2x.png" alt="" class="stop">
          <img @click="pause" v-else src="~/assets/img/home/play@2x.png" alt="" class="stop">
          <img @click="toggleVol" v-if="volume>0" src="~/assets/img/home/voice@2x.png" alt="" class="volume">
          <img @click="toggleVol" v-else src="~/assets/img/home/mute@2x.png" alt="" class="volume">
          <div class="volume-slider">
            <el-slider v-model.lazy="volume" size="mini" input-size="mini" :show-tooltip="false" />
          </div>
          <div style="flex: 1;"></div>
          <p class="hot"><img src="~/assets/img/home/ic_hot@2x.png" alt="">热度值{{ activeVideo.hot }}</p>
          <a :href="'/live/' + activeVideo.anchorid" class="go-in">进入直播间&gt;</a>
        </div>
      </div>
      <ul class="right-desc">
        <li v-for="item in recommendLive"
            :style="{backgroundImage: `url(${item.thumb})`}"
            :key="item.anchorid"
            @click="switchVideo(item)"
            :class="{active: activeVideo.liveid === item.liveid}">
          <div class="layer"></div>
          <i class="el-icon-caret-left"></i>
        </li>
      </ul>
    </div>
    <div class="hot-live">
      <div class="title">
        <h4>热门直播</h4>
        <template v-for="item in $store.state.categories">
          <a :key="item.id" target="_blank" :href="'/classify?type=' + item.id">{{ item.title }}</a>·
        </template>
      </div>
      <div class="live-list">
        <a target="_blank" :href="'/live/' + item.anchorid" v-for="item in hotList" :key="item.id" :style="{backgroundImage: 'url(' + item.thumb + ')'}">
          <p class="text-overflow">{{ item.title }}</p>
        </a>
      </div>
    </div>
    <HomeActivity :activities="activities" :notices="notices" :anchor-rank="anchorRank" />
    <hot-anchor @focus="focusAnchor" :anchor-list="recommendAnchors" />
    <div class="classify-list">
      <div class="classify" v-if="item.lives.length" v-for="item in categories">
        <h4>{{ item.title }} <a :href="`/classify?type=${item.id}`" target="_blank">更多 <img src="~/assets/img/home/circle-right.png" alt=""></a></h4>
        <div class="live-list">
          <live-item class="item" v-for="live in item.lives" :key="live.liveid" :item="live" />
        </div>
      </div>
    </div>
    <ul class="right-float-control">
      <li @click="scrollTop" @mouseover="activeFloatControl=0" @mouseleave="activeFloatControl=null" :class="{active: activeFloatControl === 0}">
        <img v-if="activeFloatControl!==0" src="~/assets/img/home/top@2x.png" alt="">
        <img v-else src="~/assets/img/home/top_pre@2x.png" alt="">
        <p>TOP</p>
      </li>
      <li @mouseover="activeFloatControl=1" @mouseleave="activeFloatControl=null" :class="{active: activeFloatControl === 1}">
        <a href="/download" target="_blank">
          <img v-if="activeFloatControl!==1" src="~/assets/img/home/download@2x.png" alt="">
          <img v-else src="~/assets/img/home/download_pre@2x.png" alt="">
          <p>下载</p>
        </a>
      </li>
      <li @click="openLive" @mouseover="activeFloatControl=2" @mouseleave="activeFloatControl=null" :class="{active: activeFloatControl === 2}">
        <img v-if="activeFloatControl!==2" src="~/assets/img/home/start@2x.png" alt="">
        <img v-else src="~/assets/img/home/start_pre@2x.png" alt="">
        <p>开播</p>
      </li>
    </ul>
  </div>
</template>

<script>
import NaHeader from '../components/header/header'
import HomeActivity from '../components/home-activity/home-activity'
import HotAnchor from '../components/hot-anchor/hot-anchor'
import LiveItem from '../components/live-item/live-item'
import { post } from '../util/http'
import { mapState, mapMutations } from 'vuex'
import getPlatform from "../util/platform";
import {h5Host} from "../util/host";

export default {
  async asyncData({ redirect, req }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }
    const { data: { data } } = await post({url: '/webapi/home/getHomeData', req})
    return {
      recommendLive: data.recommend_lives,
      activeVideo: data.recommend_lives[0],
      hotList: data.hot_lives,
      activities: data.activities,
      notices: data.notices.map(item => { item.content = item.content.replace(/\<p\>/g, '').replace(/\<\/p\>/g, '').replace(/\<br\>/g, ''); return item }),
      recommendAnchors: data.recoomend_anchors,
      categories: data.categorys,
      anchorRank: data.anchor_rank.slice(0, 5)
    }
  },
  layout: 'common-footer',
  components: {
    NaHeader,
    HomeActivity,
    HotAnchor,
    LiveItem
  },
  data () {
    return {
      volume: 50,
      activeVideo: {},
      recommendLive: [],
      hotList: [],
      activities: [],
      notices: [],
      recommendAnchors: [],
      categories: [],
      anchorRank: [],
      paused: false,
      activeFloatControl: null
    }
  },
  computed: {
    ...mapState(['userInfo']),
    liveUrl() {
      return !this.userInfo.is_anchor ? '/user-center/become-anchor' : '/live/' + this.userInfo.id
    }
  },
  mounted() {
    this.createPlayer()
  },
  beforeDestroy() {
    if (this.player) this.player.destroy()
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    focusAnchor(index) {
      const copy = {...this.recommendAnchors[index]}
      copy.is_attent = !copy.is_attent
      this.$set(this.recommendAnchors, index, copy)
    },
    openLive() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      this.$router.push(this.liveUrl)
    },
    createPlayer() {
      this.player = new this.$DPlayer({
        container: document.getElementById('live_player'),
        video: {
          url: this.activeVideo.pull_url,
          pic: this.activeVideo.thumb
        },
        volume: 0.5,
        loop: true
      })

      this.player.on('pause', () => {
        this.paused = true
      })

      this.player.on('play', () => {
        this.paused = false
      })

      this.player.play()

      this.doPlay()
    },
    doPlay() {
      this.player.volume(0.5, true, false)
      this.player.on('canplay', () => {
        this.player.video.play()
          .then(() => {
            this.volume = 50
          })
          .catch((err) => {
            this.volume = 0
            this.player.video.muted = true
            this.player.play()
            this.player.volume(0, true, false)
          })
      })
    },
    pause() {
      this.paused = !this.paused
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
    switchVideo(video) {
      this.activeVideo = video
      this.player.destroy()
      this.createPlayer()
    },
    scrollTop() {
      window.scrollTo(0, 0)
    }
  },
  watch: {
    volume(newVal) {
      this.volumeTimer = setTimeout(() => {
        if (this.volumeTimer) clearTimeout(this.volumeTimer)
        this.player.volume(newVal / 100, true, false)
      }, 300)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../assets/variable.styl"
.container
  width 100%
  min-height 100vh
  background url(../assets/img/home/bg@2x.png) center top no-repeat
  background-size 100% 684px
  background-color #FAFAFA
  .right-float-control
    position fixed
    right 0
    top 50%
    width 53px
    height 177px
    border-radius 27px
    background #fff
    text-align center
    overflow hidden
    display flex
    flex-direction column
    box-shadow 1px 1px 7px 0px rgba(0, 0, 0, 0.07)
    &>li
      flex 1
      overflow hidden
      font-size 12px
      color #3E4246
      cursor pointer
      &>a
        color #3E4246
      &.active
        background #F0FFFF
        color $theme-color
      &>img
        margin-top 9px
        width 28px
        height 28px
  .video
    width 1406px
    margin 0 auto
    display flex
    .player
      width 1170px
      height 661px
      background-color #000
      position relative
      #live_player
        width 100%
        height 100%
      .control
        position absolute
        left 0
        bottom 0
        width 100%
        height 39px
        padding 0 30px
        display flex
        align-items center
        background-color rgba(0, 0, 0, 0.5)
        .stop
          width 19px
          height 19px
          margin-right 32px
          cursor pointer
        .volume
          width 16px
          height 16px
          margin-right 10px
          cursor pointer
        .volume-slider
          width 80px
          transform-origin 0
        .hot
          margin-right 20px
          line-height 16px
          font-size 12px
          color #FEFEFE
          &>img
            width 12px
            height 16px
            margin-right 10px
            vertical-align top
        .go-in
          width 90px
          height 24px
          line-height 24px
          border-radius 12px
          background url(../assets/img/home/button@2x.png) 0 0 no-repeat
          background-size 100% 100%
          color #ffffff
          font-size 12px
          text-align center
    @media only screen and (max-width: 1406px)
      .player
        width 936px
        height 528px
    .right-desc
      flex 1
      display flex
      flex-direction column
      justify-content space-between
      padding 13px 16px
      border-bottom-right-radius 5px
      border-top-right-radius 5px
      background-color rgba(0, 0, 0, 0.7)
      &>li
        width 100%
        height 119px
        cursor pointer
        position relative
        background-size cover
        background-position center center
        background-repeat no-repeat
        &>i
          position absolute
          left -12px
          top 50%
          margin-top -8px
          font-size 16px
          color $theme-color
          display none
        &:hover
          border 2px solid $theme-color
          &>i
            display block
          .layer
            display none
        &.active
          border 2px solid $theme-color
          &>i
            display block
          .layer
            display none
        .layer
          position absolute
          left 0
          top 0
          width 100%
          height 100%
          background-color rgba(0, 0, 0, 0.4)
  .hot-live
    width 1406px
    margin 0 auto
    margin-top 30px
    .title
      display flex
      align-items center
      margin-bottom 14px
      font-size 15px
      color #333
      font-weight bold
      &>h4
        margin-right 10px
        font-size 20px
      &>a
        color #333
        margin 0 16px
    .live-list
      display flex
      flex-wrap wrap
      &>a
        margin-bottom 14px
        width 222px
        height 129px
        position relative
        margin-right 14px
        background-size cover
        background-repeat no-repeat
        background-position center center
        border-radius 5px
        overflow hidden
        &:nth-child(6n + 0)
          margin-right 0
        &>p
          position absolute
          padding 0 10px
          padding-top 40px
          width 100%
          height 50%
          left 0
          bottom 0
          background linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4))
          color #fff
          font-size 14px
          font-weight 500
          word-break break-all
  @media only screen and (max-width: 1406px)
    .hot-live
      width 1137px
      .live-list
        &>a
          width 178px
          height 103px
          margin-right 12px
          &>p
            padding-top 28px
  .classify-list
    width 1406px
    margin 0 auto
    padding-top 21px
    .classify
      margin-bottom 29px
      &>h4
        display flex
        justify-content space-between
        margin-bottom 17px
        font-size 21px
        color #333333
        font-weight bold
        &>a
          line-height 15px
          font-size 15px
          color #636379
          &>img
            width 15px
            height 15px
            vertical-align top
      .live-list
        display flex
        .item
          margin-right 15px
          &:last-child
            margin-right 0
@media only screen and (max-width: 1406px)
  .container
    background-size 100% 547px
    .video
      width 1137px
      .right-desc
        padding 10px 13px
        &>li
          height 95px
    .classify-list
      width 1137px
      .live-list
        .item
          width 215px
          ::v-deep
            .cover
              height 122px
</style>
