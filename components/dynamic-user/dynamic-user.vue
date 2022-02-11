<template>
  <div class="dynamic-user" @click="goDetail">
    <template v-if="userInfo.id">
      <img :src="userInfo.avatar || defaultAvatar" alt="" class="avatar">
      <p>{{ userInfo.nick_name }} <level-icon width="31px" height="19px" :level="1"/></p>
      <div class="data-num">
        <p>{{ userInfo.attent_count }} <span>关注</span></p>
        <i></i>
        <p>{{ userInfo.fans_count }} <span>粉丝</span></p>
        <i></i>
        <p>{{ userInfo.moment_count }} <span>动态</span></p>
      </div>
    </template>
    <template v-else>
      <img class="login-avatar" src="./moren@2x.png" alt="">
      <div class="tips">快速登录，跟大家一起互动吧~</div>
      <button @click.stop="toggleLogin">立即登录</button>
    </template>
  </div>
</template>

<script>
import LevelIcon from '../level-icon/level-icon'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'dynamic-user',
  components: {
    LevelIcon
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar'])
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    goDetail() {
      if (this.userInfo.id) {
        this.$router.push('/dynamic/anchor/' + this.userInfo.id)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.dynamic-user
  padding-top 17px
  padding-bottom 22px
  margin-bottom 12px
  border-radius 14px
  background-color #fff
  text-align center
  .avatar
    width 65px
    height 65px
    border-radius 50%
    cursor pointer
  &>p
    margin-top 14px
    margin-bottom 27px
    font-size 16px
    color #333
    font-weight bold
    cursor pointer
  .data-num
    display flex
    align-items center
    padding 0 35px
    &>p
      flex 1
      text-align center
      font-size 18px
      color #333333
      font-weight bold
      &>span
        display block
        margin-top 14px
        text-align center
        font-size 15px
        color #7A7A7A
        font-weight normal
    &>i
      width 1px
      height 22px
      background-color #EDEDED
  .login-avatar
    width 66px
    height 66px
    border-radius 50%
    margin-top 5px
    margin-bottom 19px
  .tips
    margin-bottom 30px
    font-size 15px
    color #8D8D8D
  &>button
    width 111px
    height 27px
    border-radius 13px
    background linear-gradient(90deg,rgba(48,232,255,1),rgba(151,102,255,1))
    font-size 14px
    color #FFFFFF
</style>
