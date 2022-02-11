<template>
  <div class="dynamic-item">
    <div class="dy-item-content">
      <nuxt-link :to="'/dynamic/anchor/' + item.user.id" target="_blank" class="user-info">
        <img :src="item.user.avatar" alt="" class="avatar">
        <div class="user-desc">
          <h5>{{ item.user.nick_name }}</h5>
          <p>{{ item.create_time }}</p>
        </div>
        <img src="./xiala@2x.png" alt="" class="drop">
      </nuxt-link>
      <h3 class="title" v-if="unlocked">{{ title }} <span @click="drop=!drop" v-if="item.title.length > 140">{{ drop ? '收起全文' : '展开全文' }} <img :class="{drop: drop}" src="./quanwen@2x.png" alt=""></span></h3>
      <div class="img-list" v-if="!item.video_url && (item.unlocked || item.unlock_price===0 || item.user.id === userInfo.id) && !visible">
        <div @click="previewImg(index)"
             :class="{big: imgs.length === 1, imgItem: true}"
             :key="index"
             v-for="(img, index) in imgs"
             :style="{backgroundImage: `url(${img})`}"/>
      </div>
      <div class="lock" @click="buy" v-if="!unlocked && item.type!==3">
        <div class="blur" :style="{backgroundImage: `url(${lockImg})`}"></div>
        <img class="lock-img" src="./fufei@2x.png" alt="">
        <button>{{ item.unlock_price }}金币</button>
      </div>
      <div class="preview" v-if="visible">
        <div class="close" @click="visible=false">
          <i class="el-icon-top"></i>
          <span>收起</span>
        </div>
        <el-carousel :initial-index="previewIndex" height="719px" :autoplay="false" arrow="always">
          <el-carousel-item v-for="(img, index) in imgs" :key="index">
            <div class="img" :style="{backgroundImage: `url(${img})`}"></div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="video"
           :id="'video' + item.id"
           :style="{backgroundImage: `url(${imgs[0]})`}"
           @click.stop="createPlayer"
           v-if="item.type === 3">
        <img v-if="unlocked" src="./play@2x.png" alt="">
        <img v-else class="lock-img" src="./fufei@2x.png" alt="">
      </div>
      <div class="btn-list">
        <div :class="['btn', item.collected && 'active']" @click="collected">
          <img v-if="!item.collected" src="./shoucang@2x.png" alt="">
          <img v-else src="./shoucang_click@2x.png" alt="">
          <span>收藏</span>
        </div>
        <i></i>
        <div class="btn dy-comment" @click="getComment">
          <img src="./pinglun@2x.png" alt="">
          <img src="./pinglun_click@2x.png" alt="">
          <span>评论 {{ item.comment_count ? item.comment_count : '' }}</span>
        </div>
        <i></i>
        <div :class="['btn', item.liked && 'active']" @click="like">
          <img v-if="!item.liked" src="./zan@2x.png" alt="">
          <transition name="shake">
            <img v-if="item.liked" src="./zan_click@2x.png" alt="">
          </transition>
          <span :class="{active: item.liked}">点赞 {{ item.like_count ? item.like_count : '' }}</span>
        </div>
      </div>
    </div>
    <transition name="slide">
      <dynamic-comment :id="item.id" v-if="showComment" />
    </transition>
  </div>
</template>

<script>
import DynamicComment from '../dynamic-comment/dynamic-comment'
import {post} from "../../util/http";
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'dynamic-item',
  components: {
    DynamicComment
  },
  props: {
    item: {
      type: Object,
      default () { return {} }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      drop: false,
      visible: false,
      showComment: false,
      isLock: !this.item.lock,
      comments: [],
      previewIndex: 0
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar']),
    title() {
      if (this.item.title.length <= 140) {
        return this.item.title
      }
      return !this.drop ? this.item.title.slice(0, 140) + '...' : this.item.title
    },
    imgs() {
      if (!this.item.image_url) return []
      return this.item.image_url.split(',')
    },
    lockImg() {
      if (!this.item.blur_image_url) return ''
      return this.item.blur_image_url.split(',')[0]
    },
    unlocked() {
      return this.item.unlocked || this.item.unlock_price===0 || this.item.user.id === this.userInfo.id
    }
  },
  beforeDestroy() {
    this.$off('like')
    this.$off('collected')
    this.$off('changeDyItem')
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    previewImg(index) {
      this.visible = true
      this.previewIndex = index
    },
    async like() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      try {
        const { data: { data } } = await post({ url: '/webapi/Moment/likeMoment', data: {momentid: this.item.id} })
        this.$emit('like', { ...data, index: this.index })
      } catch (e) {
      }
    },
    async collected() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      try {
        const { data: { data } } = await post({ url: '/webapi/Moment/collectMoment', data: {momentid: this.item.id, type: Number(!this.item.collected)} })
        this.$emit('collected', {
          collected: Number(!this.item.collected),
          index: this.index
        })
      } catch (e) {
      }
    },
    createPlayer() {
      if (!this.unlocked) {
        this.buy()
        return
      }
      if (this.player) return
      this.player = new this.$DPlayer({
        container: document.getElementById('video' + this.item.id),
        video: {
          url: this.item.video_url,
        },
        autoplay: true,
        volume: 0.5,
        mutex: true
      })
    },
    buy() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      const confirm = this.$buyConfirm({
        props: {
          dynamic: this.item
        },
        methods: {
          confirm: () => {
            post({ url: '/webapi/Moment/unlockMoment', data: {momentid: this.item.id} })
              .then(({ data: { data } }) => {
                this.$emit('changeDyItem', {
                  index: this.index,
                  item: data
                })
                confirm.hide()
                this.$nextTick(() => {
                  if (this.item.type === 3) {
                    this.createPlayer()
                  }
                })
              })
          }
        }
      })
    },
    getComment() {
      this.showComment = !this.showComment
    }
  }
}
</script>

<style scoped lang="stylus">
  @keyframes shake
    0%
      transform rotateZ(0deg)
    25%
      transform rotateZ(45deg)
    50%
      transform rotateZ(-45deg)
    75%
      transform rotateZ(45deg)
    100%
      transform rotateZ(0deg)
  .slide-enter-active, .slide-leave-active
    transition all 0.2s
  .slide-enter, .slide-leave-to
    margin 0
  .shake-enter-active, .shake-leave-active
    animation shake 1s ease-in-out
.dynamic-item
  margin-bottom 12px
  .dy-item-content
    border-radius 14px
    overflow hidden
    background-color #fff
    .preview
      margin 0 98px
      height 805px
      padding 26px 30px
      background #F6F6F6
      .close
        font-size 14px
        color #616161
        cursor pointer
      .img
        width 100%
        height 100%
        background-size contain
        background-repeat no-repeat
        background-position center center
    .lock
      width 360px
      height 360px
      margin-left 98px
      position relative
      background-color #333
      cursor pointer
      .lock-img
        position absolute
        left 50%
        top 50%
        z-index 2
        width 48px
        height 63px
        margin-left -24px
        margin-top -31px
      &>button
        position absolute
        right 21px
        top 15px
        z-index 2
        width 80px
        height 34px
        border-radius 17px
        border none
        outline none
        font-size 15px
        color #fff
        background linear-gradient(90deg,rgba(55,223,255,1),rgba(155,97,255,1))
      .blur
        z-index 1
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        background-size cover
        background-repeat no-repeat
        background-position center center
    .user-info
      padding 22px 35px 18px 23px
      display flex
      align-items center
      position relative
      .drop
        position absolute
        right 35px
        top 36px
        width 11px
        height 6px
        cursor pointer
      .avatar
        width 60px
        height 60px
        margin-right 14px
        border-radius 50%
      .user-desc
        &>h5
          margin-bottom 19px
          font-size 17px
          color #333333
          font-weight bold
        &>p
          font-size 14px
          color #A0A0A0
    .title
      padding 0 100px
      margin-bottom 28px
      line-height 28px
      font-size 17px
      color #333333
      word-break break-all
      &>span
        display inline-block
        color #FF7623
        cursor pointer
        &>img
          vertical-align middle
          width 11px
          height 6px
          transition all 0.2s
          &.drop
            transform rotateZ(180deg)
    .img-list
      display flex
      flex-wrap wrap
      width 641px
      padding-left 98px
      .imgItem
        width 175px
        height 175px
        margin-right 9px
        margin-bottom 8px
        background-size cover
        background-repeat no-repeat
        background-position center center
        &:nth-child(3n+0)
          margin-right 0
        &.big
          width 360px
    .video
      width 667px
      margin-left 100px
      height 376px
      background-size cover
      background-repeat no-repeat
      background-position center center
      display flex
      justify-content center
      align-items center
      cursor pointer
      &>img
        width 53px
        height 53px
        &.lock-img
          width 48px
          height 63px
    @media only screen and (max-width: 1406px)
      .video
        width 567px
        height 320px
    .btn-list
      height 63px
      display flex
      margin-top 39px
      align-items center
      border-top 1px solid #E8E8E8
      &>i
        height 26px
        width 1px
        background-color #EEEEEE
      .btn
        flex 1
        display flex
        align-items center
        justify-content center
        line-height 16px
        text-align center
        font-size 13px
        color #9C9C9C
        cursor pointer
        &.active
          color #FF7623
        &>img
          margin-right 6px
          width 16px
          height 16px
          &.liked
            animation shake 1s ease-in-out
        &.dy-comment
          img:nth-child(2)
            display none
          &:hover
            color #FF7623
            img:first-child
              display none
            img:nth-child(2)
              display inline
  ::v-deep
    .el-carousel__item
      &>img
        width 100%
</style>
