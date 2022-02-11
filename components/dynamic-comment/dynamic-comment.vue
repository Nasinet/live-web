<template>
  <div class="dynamic-comment">
    <div class="input">
      <img :src="userInfo.avatar || defaultAvatar" alt="" class="avatar">
      <el-input style="margin-right: 10px;" v-model="comment" />
      <el-button :loading="sendLoading" type="warning" @click="sendComment">评论</el-button>
    </div>
    <div class="comment-list">
      <parent-item v-for="(item, index) in commonList" @changeLike="changeLike" :index="index" :item="item" :key="item.id" />
      <div v-if="commentLoading" class="comment-loading"><i class="el-icon-loading"></i> 加载中请稍后...</div>
      <p v-if="showLoadMore" class="load-more" @click="loadMore">加载更多&gt;&gt;</p>
    </div>
  </div>
</template>

<script>
import ParentItem from './parent-item'
import { post } from '../../util/http'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'dynamic-comment',
  components: {
    ParentItem
  },
  props: {
    id: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      comment: '',
      commentLoading: false,
      commonList: [],
      sendLoading: false,
      page: 1,
      showLoadMore: false,
      isLoad: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar'])
  },
  created() {
    if (this.commentLoading) return
    this.commentLoading = true
    this.getComment()
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    changeLike(data) {
      const copy = {...this.commonList[data.index]}
      copy.like_count = data.like_count
      copy.liked = true
      this.$set(this.commonList, data.index, copy)
    },
    loadMore() {
      this.isLoad = true
      this.page++
      this.getComment()
    },
    async getComment() {
      try {
        const { data: { data } } = await post({
          url: '/webapi/Moment/getComments',
          data: {
            momentid: this.id,
            page: this.page,
            size: 5
          }
        })
        this.showLoadMore = data.length >= 5
        this.commonList = this.commonList.concat(data)
        this.commentLoading = false
      } catch (e) {
        this.commentLoading = false
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
            momentid: this.id,
            content: this.comment
          }
        })
        this.commonList.unshift(data.comment)
        this.comment = ''
        this.sendLoading = false
      } catch (e) {
        this.sendLoading = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.dynamic-comment
  border-radius 14px
  background #fff
  overflow hidden
  margin-top 18px
  transition all 0.3s
  transform translate3d(0, 0, 0)
  .load-more
    padding-bottom 10px
    text-align center
    color #333
    font-size 14px
    cursor pointer
  .comment-loading
    width 100%
    margin-top 10px
    background #FFFFFF
    height 30px
    line-height 30px
    text-align center
    font-size 14px
    color #333
  .input
    display flex
    align-items center
    padding 15px 24px 44px 19px
    .avatar
      width 49px
      height 49px
      margin-right 18px
      border-radius 50%
  .comment-list
    .comment
      margin-bottom 32px
    .parent
      padding 0 24px 0 19px
      margin-bottom 23px
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
          line-height 24px
          font-size 16px
          color #333333
          &>span
            color #FF7523
      .data-time
        display flex
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
              .clicked
                display inline
              .click
                display none
          &>img
            margin-right 8px
            vertical-align middle
            width 15px
            cursor pointer
</style>
