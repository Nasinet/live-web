<template>
  <div class="room-intro">
    <img :src="anchor.avatar || defaultAvatar" alt="" class="avatar">
    <div class="intro-center">
      <h4>{{ detail.title || anchor.profile.signature }}<span v-if="detail.anchorid">{{ activeCategory.title }}</span></h4>
      <div class="bottom">
        <p class="name">主播：{{ anchor.nick_name }}</p>
        <p class="room">房间号：{{ anchor.id }}</p>
        <p class="hot" v-if="detail.anchorid"><img src="./renqi@2x.png" alt="">{{ detail.hot }}</p>
        <p class="people"><img src="./people@2x.png" alt="">{{ roomPeople }}</p>
      </div>
    </div>
    <div class="intro-right">
      <div class="share">
        <a href="/download" target="_blank" ><img src="./phone@2x.png" alt=""> 手机观看</a>
        <span @click="dialogVisible=true"><img src="./share@2x.png" alt=""> 分享</span>
      </div>
      <div class="focus">
        <div class="num">{{ anchor.fans_count }}</div>
        <div :class="['btn', cancel ? 'cancel' : '']" @mouseleave="hover=false" @mouseover="hover=true" @click="focus">
          <img src="./guanzhu@2x.png" alt="">
          <span v-if="!cancel">{{ anchor.isattent ? '已关注' : '关注' }}</span>
          <span v-else>{{ '取消' }}</span>
        </div>
      </div>
    </div>
    <el-dialog
      title="复制分享链接"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{ shareUrl }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" id="copyBtn" :data-clipboard-text="shareUrl" @click="dialogVisible = false">复制</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {post} from "../../util/http";
import Cipboard from 'clipboard'

export default {
  name: 'room-intro',
  props: {
    anchor: {
      type: Object,
      default() {
        return {}
      }
    },
    detail: {
      type: Object,
      default() {
        return {}
      }
    },
    roomPeople: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hover: false,
      dialogVisible: false,
      shareUrl: ''
    }
  },
  computed: {
    ...mapState(['categories', 'userInfo', 'defaultAvatar']),
    activeCategory() {
      return this.categories.find(item => {
        return item.id === this.detail.categoryid
      })
    },
    cancel() {
      if (!this.anchor.isattent) return false
      return this.hover
    }
  },
  mounted() {
    this.shareUrl = window.location.href
    this.copyBtn = new Cipboard('#copyBtn')
    this.copyBtn.on('success', () => {
      this.$message.success('复制成功')
    })
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    focus() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: this.anchor.id, type: !this.anchor.isattent }})
        .then(({ data: { data } }) => {
          this.$emit('focus', { count: data.fans_count, type: !this.anchor.isattent })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.room-intro
  height 100px
  padding 0 24px
  display flex
  align-items center
  background-color #fff
  .avatar
    width 73px
    height 73px
    margin-right 20px
    border-radius 50%
  .intro-center
    flex 1
    &>h4
      margin-bottom 14px
      font-size 20px
      color #3B3B50
      font-weight bold
      &>span
        display inline-block
        margin-left 18px
        padding 0 10px
        height 20px
        line-height 20px
        border-radius 4px
        background-color #E3FEFF
        text-align center
        font-size 12px
        color $theme-color
        vertical-align center
    .bottom
      display flex
      flex-wrap wrap
      align-items center
      .name
        margin-right 47px
        font-size 14px
        color #636379
      .room
        margin-right 53px
        font-size 14px
        color #9090A2
      .hot
        margin-right 39px
        line-height 18px
        font-size 14px
        color #636379
        &>img
          display inline-block
          width 13px
          height 18px
          margin-right 8px
          vertical-align bottom
      .people
        line-height 15px
        font-size 14px
        color #636379
        &>img
          display inline-block
          width 21px
          height 15px
          margin-right 8px
          vertical-align bottom
  .intro-right
    .share
      display flex
      padding-left 10px
      margin-bottom 19px
      &>span, &>a
        display flex
        align-items center
        margin-right 23px
        font-size 14px
        color #9090A2
        cursor pointer
        &:last-child
          margin-right 0
          &>img
            margin-right 8px
            width 16px
            height 17px
        &>img
          margin-right 8px
          vertical-align middle
          width 14px
          height 18px
    .focus
      display flex
      align-items center
      .num
        width 100px
        height 26px
        line-height 26px
        border-radius 15px
        background-color #F5F5FB
        text-align center
        font-size 14px
        color #636379
      .btn
        width 93px
        height 30px
        margin-left -20px
        line-height 30px
        text-align center
        border-radius 17px
        background linear-gradient(90deg,rgba(130,224,255,1),rgba(134,74,255,1))
        box-shadow 0px 2px 5px 0px rgba(102,134,255,0.41)
        font-size 14px
        color #FFFFFF
        cursor pointer
        transform all 0.2s
        &.cancel
          background linear-gradient(90deg,rgba(207,207,218,1),rgba(189,189,203,1))
        &>img
          width 15px
          height 14px
          vertical-align middle

</style>
