<template>
  <div class="set-list">
    <ul class="tabs">
      <li v-if="showMgr" @click="changeTab(0)" :class="{active: active === 0}">管理员列表</li>
      <li @click="changeTab(1)" :class="{active: active === 1}">禁言列表</li>
    </ul>
    <div class="user-list" id="set_user_list" ref="scroll" @scroll="scroll">
      <user-item @cancel="cancel" :type="active" v-for="(item, index) in list" :index="index" :key="item.id" :item="active === 0 ? item.user : item" />
    </div>
  </div>
</template>

<script>
import { post } from '../../util/http'
import UserItem from './user-item'

export default {
  name: 'set-list',
  components: {
    UserItem
  },
  props: {
    showMgr: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: 0,
      list: [],
      page: 1
    }
  },
  mounted() {
    if (!this.showMgr) {
      this.active = 1
    }
    this.getList()
  },
  methods: {
    scroll() {
      if (this.$refs.scroll.scrollHeight - this.$refs.scroll.scrollTop - this.$refs.scroll.clientHeight <= 20) {
        this.loadMore()
      }
    },
    loadMore() {
      if (this.loading || this.isFinished || this.active === 0) return;
      this.page++
      this.loading = true
      this.getList()
    },
    changeTab(tab) {
      if (tab === this.active) return;
      this.active = tab
      this.list = []
      this.page = 1
      this.getList()
    },
    cancel(index) {
      this.list.splice(index, 1)
    },
    getList() {
      post({ url: this.active === 0 ? '/webapi/live/getMgrList' : '/api/live/getBannedUserList', data: { anchorid: this.$route.params.id, page: this.page, size: 20 } })
        .then(({ data: { data } }) => {
          data.forEach(item => {
            if (this.active === 0) {
              item.user.isVip = new Date(item.user.vip_date).getTime() > Date.now()
            } else {
              item.isVip = new Date(item.vip_date).getTime() > Date.now()
            }
          })
          this.list = this.list.concat(data)
          this.loading = false
          this.isFinished = data.length < 20
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.set-list
  position absolute
  left 0
  top 46px
  width 100%
  bottom 106px
  background #fff
  z-index 10
  .tabs
    height 45px
    line-height 45px
    display flex
    &>li
      flex 1
      font-size 19px
      color #636379
      background #F5F5FB
      text-align center
      cursor pointer
      &.active
        background transparent
        color $theme-color
  .user-list
    position absolute
    top 45px
    bottom 0
    width 100%
    overflow-y scroll
</style>
