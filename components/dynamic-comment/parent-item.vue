<template>
  <div class="comment">
    <div class="parent">
      <div class="top">
        <img :src="item.user.avatar || $store.state.defaultAvatar" alt="">
        <p><span>{{ item.user.nick_name }}：</span> {{ item.content }}</p>
      </div>
      <div class="data-time">
        <p class="time">{{ item.create_time }}</p>
        <div style="flex: 1;"></div>
        <p class="icon" @click="like">
          <img v-if="!item.liked" src="../dynamic-item/zan@2x.png" alt="">
          <transition name="shake">
            <img v-if="item.liked" src="../dynamic-item/zan_click@2x.png" alt="">
          </transition>
          <span>{{ item.like_count }}</span>
        </p>
        <p class="icon comment-img" @click="toggleChild">
          <img class="click" src="../dynamic-item/pinglun@2x.png" alt="">
          <img class="clicked" src="../dynamic-item/pinglun_click@2x.png" alt="">
          {{ item.reply_count ? item.reply_count : '' }}
        </p>
      </div>
      <transition name="comment">
        <div class="comment-input" v-if="showInput">
<!--          <img :src="userInfo.avatar || defaultAvatar" alt="">-->
          <el-input v-model="comment" style="width: auto;flex: 1;margin-right: 10px;">
            <template slot="prepend">回复{{ item.user.nick_name }}</template>
          </el-input>
          <el-button :loading="sendLoading" type="warning" @click="sendComment">评论</el-button>
        </div>
      </transition>
    </div>
    <div class="children" v-if="showInput">
      <child-item @changeLike="changeLike" @comment="childComment" :rootid="item.id" v-for="(child, index) in replys" :index="index" :key="child.id" :child="child" />
      <p v-if="showLoadMore" class="load-more" @click="getList">加载更多&gt;&gt;</p>
    </div>
  </div>
</template>

<script>
import ChildItem from './child-item'
import { mapState, mapMutations } from 'vuex'
import {post} from "../../util/http";

export default {
  name: 'parent-item',
  components: {
    ChildItem
  },
  props: {
    item: {
      type: Object,
      default() { return {} }
    },
    index: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      showInput: false,
      comment: '',
      replys: [],
      sendLoading: false,
      showLoadMore: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar'])
  },
  beforeDestroy() {
    this.$off('changeLike')
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    changeLike(data) {
      const copy = {...this.replys[data.index]}
      copy.like_count = data.like_count
      copy.liked = true
      this.$set(this.replys, data.index, copy)
    },
    like() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      post({ url: '/webapi/Moment/likeComment', data: { commentid: this.item.id } })
        .then(({ data: { data } }) => {
          this.$emit('changeLike', {
            index: this.index,
            ...data
          })
        })
    },
    childComment(comment) {
      this.replys.unshift(comment)
    },
    toggleChild() {
      this.showInput = !this.showInput
      if (!this.showInput) return
      this.replys = []
      this.getList()
    },
    async getList() {
      try {
        const { data: { data } } = await post({
          url: '/webapi/Moment/getCommentReplys',
          data: {
            commentid: this.item.id,
            lastid: this.replys[this.replys.length - 1] ? this.replys[this.replys.length - 1].id : null,
            size: 5
          }
        })
        this.showLoadMore = data.length >= 5
        this.replys = this.replys.concat(data)
      } catch (e) {
      }
    },
    async sendComment() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      if (!this.comment) {
        this.$message.error('请输入评论')
        return
      }
      this.sendLoading = true
      try {
        const { data: { data } } = await post({
          url: '/webapi/Moment/publishComment',
          data: {
            momentid: this.item.momentid,
            content: this.comment,
            touid: this.item.user.id,
            rootid: this.item.id
          }
        })
        this.comment = ''
        this.replys.unshift(data.comment)
        this.sendLoading = false
      } catch (e) {
        this.sendLoading = false
      }
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
  .shake-enter-active, .shake-leave-active
    animation shake 1s ease-in-out
  .comment
    margin-bottom 32px
    .load-more
      padding-bottom 10px
      text-align center
      color #333
      font-size 14px
      cursor pointer
    .parent
      padding 0 24px 0 19px
      .top
        display flex
        align-items center
        margin-bottom 10px
        &>img
          width 49px
          height 49px
          margin-right 16px
          border-radius 50%
        &>p
          word-break break-all
          line-height 24px
          font-size 16px
          color #333333
          &>span
            color #FF7523
      .data-time
        display flex
        margin-bottom 30px
        padding-left 67px
        color #ABABAB
        .time
          font-size 15px
        .icon
          margin-right 26px
          font-size 13px
          &.comment-img
            .clicked
              display none
            .click
              display inline
            &:hover
              color #FF7523
              .clicked
                display inline
              .click
                display none
          &>img
            margin-right 8px
            vertical-align middle
            width 15px
            cursor pointer
    .comment-input
      display flex
      height 107px
      padding-left 10px
      padding-right 24px
      align-items center
      margin-left 69px
      border-top-right-radius 9px
      border-top-left-radius 9px
      background-color #F5F5F5
      transition all 0.3s
      &.comment-enter-active, &.comment-leave-active
        transition all 0.3s
      &.comment-enter, &.comment-leave-to
        height 0
        opacity 0
        margin-top 0
      &>img
        width 49px
        height 49px
        margin-right 23px
        border-radius 50%
    .children
      margin-left 88px
      margin-right 24px
      border-bottom-right-radius 9px
      border-bottom-left-radius 9px
      background-color #F5F5F5
</style>
