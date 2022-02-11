<template>
  <div class="user-float" @click.stop>
    <img v-if="user.vip_level && user.isVip" :src="medalBg[user.vip_level-1]" alt="" class="bg">
    <img src="./jubao@2x.png" alt="" v-if="!showSet" class="report-link">
    <img @click="$emit('set', user)" src="../live-message/set@2x.png" v-else alt="" class="report-link">
    <i @click="$emit('close')" class="el-icon-close close"></i>
    <img :src="user.avatar || $store.state.defaultAvatar" alt="" class="avatar">
    <p class="name">{{ user.nick_name }}</p>
    <div class="level">
      <level-icon :level="user.user_level" width="25px" height="16px" />
      <div :class="['age', user.profile.gender === 0 ? 'man' : '']"><img :src="user.profile.gender === 0 ? girlIcon : boyIcon" alt="">{{ user.profile.age }}</div>
    </div>
    <p class="fans">粉丝：{{ user.fans_count }}</p>
    <a href="/" class="get-vip">了解贵族特权 <i class="el-icon-arrow-right" /></a>
    <div class="btns">
      <a href="/" @click.prevent="focus" class="btn">{{ user.isattent ? '已关注'  : '关注' }}</a>
      <i/>
      <a :href="'/dynamic/anchor/' + user.id" class="btn">主页</a>
    </div>
  </div>
</template>

<script>
import LevelIcon from '../../components/level-icon/level-icon'
import { post } from '../../util/http'

export default {
  name: 'message-user-float',
  components: {
    LevelIcon
  },
  props: {
    id: {
      type: Number,
      default: ''
    },
    showSet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      medalBg: [require('./top_youxia@2x.png'), require('./top_qishi@2x.png'), require('./top_gongjue@2x.png'), require('./top_gongjue@2x.png')],
      girlIcon: require('./girl@2x.png'),
      boyIcon: require('./boy@2x.png'),
      user: {
        profile: {}
      }
    }
  },
  mounted() {
    this.getUser()
    document.body.addEventListener('click', this.hideThis)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.hideThis)
    this.$off('close')
  },
  methods: {
    hideThis() {
      this.$emit('close')
    },
    async getUser() {
      let loading = this.$loading({
        lock: true,
        target: '.user-float',
        spinner: 'el-icon-loading',
      })
      try {
        const { data: { data } } = await post({url: '/webapi/user/getUserBasicInfo', data: { id: this.id }})
        this.user = data
        loading.close()
      } catch (e) {
        loading.close()
      }
    },
    focus() {
      post({url: '/webapi/Anchor/attentAnchor', data: { anchorid: this.user.id, type: !this.user.isattent }})
        .then(({ data: { data } }) => {
          this.$set(this.user, 'isattent', !this.user.isattent)
          this.$set(this.user, 'fans_count', data.fans_count)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.user-float
  position absolute
  left 50%
  top 203px
  padding-top 34px
  width 303px
  transform translateX(-50%)
  border-radius 17px
  border 1px solid #AFAFAF
  background #ffffff
  z-index 9
  text-align center
  .bg
    width 313px
    height 113px
    position absolute
    top -28px
    left -5px
    z-index -1
  .report-link
    position absolute
    left 21px
    top 21px
    width 24px
    z-index 2
    cursor pointer
  .close
    position absolute
    right 20px
    top 23px
    font-size 20px
    color #3D3D3D
    font-weight bold
    cursor pointer
  .avatar
    width 64px
    height 64px
    border-radius 50%
    margin-bottom 15px
    z-index 3
  .name
    margin-bottom 15px
    font-size 15px
    color #000000
  .level
    display flex
    justify-content center
    .age
      margin-bottom 13px
      padding 0 3px
      height 16px
      line-height 16px
      font-size 8px
      color #fff
      text-align center
      background #FF9CE4
      border-radius 2px
      &.man
        background #6FCAFF
      &>img
        margin-right 2px
        width 8px
        height 8px
        vertical-align middle
  .fans
    margin-bottom 22px
    font-size 13px
    color #A8A8A8
  .get-vip
    font-size 13px
    color #D8A63A
  .btns
    display flex
    align-items center
    margin-top 13px
    height 40px
    line-height 40px
    border-top 1px solid #F4F4F4
    .btn
      flex 1
      text-align center
      font-size 13px
      color #666666
    &>i
      width 1px
      height 15px
      background #F4F4F4
</style>
