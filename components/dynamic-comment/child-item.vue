<template>
  <div class="child-item">
    <div class="ch-comment">
      <img :src="child.user.avatar || $store.state.defaultAvatar" alt="">
      <div class="right">
        <p><span>{{ child.user.nick_name }}</span><template v-if="child.touser">回复</template><span v-if="child.touser">{{ child.touser.nick_name }}</span>：{{ child.content }}</p>
        <div class="data-time">
          <p class="time">{{ child.create_time }}</p>
          <div style="flex: 1;"></div>
          <p class="icon" @click="like">
            <img v-if="!child.liked" src="../dynamic-item/zan@2x.png" alt="">
            <transition name="shake">
              <img v-if="child.liked" src="../dynamic-item/zan_click@2x.png" alt="">
            </transition>
            <span>{{ child.like_count }}</span>
          </p>
          <p class="icon comment-img" @click="showInput=!showInput">
            <img class="click" src="../dynamic-item/pinglun@2x.png" alt="">
            <img class="clicked" src="../dynamic-item/pinglun_click@2x.png" alt="">
            {{ child.reply_count ? child.reply_count : '' }}
          </p>
        </div>
      </div>
    </div>
    <transition name="comment">
      <div class="comment-input" v-if="showInput">
        <el-input v-model="comment" style="width: auto;flex: 1;margin-right: 10px;">
          <template slot="prepend">回复{{ child.user.nick_name }}</template>
        </el-input>
        <el-button :loading="sendLoading" type="warning" @click="sendComment">评论</el-button>
      </div>
    </transition>
  </div>
</template>

<script>
import {post} from "../../util/http";
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'child-irem',
  props: {
    child: {
      type: Object,
      default() { return {} }
    },
    parent: {
      type: Object,
      default() {
        return {}
      }
    },
    rootid: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showInput: false,
      comment: '',
      sendLoading: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar'])
  },
  beforeDestroy() {
    this.$off('changeLike')
    this.$off('comment')
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    like() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      post({ url: '/webapi/Moment/likeComment', data: { commentid: this.child.id } })
        .then(({ data: { data } }) => {
          this.$emit('changeLike', {
            index: this.index,
            ...data
          })
        })
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
            momentid: this.child.momentid,
            content: this.comment,
            touid: this.child.user.id,
            rootid: this.rootid
          }
        })
        this.comment = ''
        this.$emit('comment', data.comment)
        this.showInput = false
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
  .child-item
    padding 20px 15px
    padding-bottom 0
    &::after
      content ''
      display block
      height 1px
      margin-top 20px
      background-color #F1F1F1
    .comment-input
      display flex
      height 60px
      margin-top 20px
      padding-left 64px
      align-items center
      border-radius 9px
      background-color #F5F5F5
      transition all 0.3s
      &.comment-enter-active, &.comment-leave-active
        transition all 0.3s
      &.comment-enter, &.comment-leave-to
        height 0
        opacity 0
        margin-top 0
      &>img
        width 45px
        height 45px
        margin-right 23px
        border-radius 50%
  .ch-comment
    display flex
    align-items center
    &>img
      width 45px
      height 45px
      margin-right 19px
      border-radius 50%
    .right
      flex 1
      &>p
        line-height 22px
        font-size 15px
        color #333333
        &>span
          color #FF7523
      .data-time
        margin-top 15px
        display flex
        color #ABABAB
        .time
          font-size 13px
        .icon
          margin-right 26px
          font-size 13px
          &>img
            width 15px
            vertical-align middle
            margin-right 8px
            cursor pointer
          &.comment-img
            .clicked
              display none
            .click
              display inline
            &:hover
              .clicked
                display inline
              .click
                display none
</style>
