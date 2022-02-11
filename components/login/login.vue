<template>
  <div class="login" @scroll.stop>
    <transition name="el-zoom-in-center">
      <div class="box" v-if="$store.state.showLogin">
        <div class="head">
          <div :class="['tab', type === 'login' ? 'active' : '']" @click="type='login'">账号登录<i></i></div>
          <div :class="['tab', type === 'register' ? 'active' : '']" @click="type='register'">注册<i></i></div>
          <img src="./logo@2x.png" class="logo" alt="">
          <img src="./close@2x.png" @click="toggleLogin" class="close" alt="">
        </div>
        <div class="account">
          <form @submit.prevent="submit">
            <div class="input">
              <img src="./phone@2x.png" alt="">
              <input v-model="phone" type="text" placeholder="请输入手机号/用户名">
            </div>
            <div class="input" v-show="type==='register'">
              <img src="./yanzheng@2x.png" alt="">
              <input v-model="code" type="text" placeholder="请输入验证码">
              <div class="code-btn" @click="sendCode">{{ countText }}</div>
            </div>
            <div class="input">
              <img src="./code@2x.png" alt="">
              <input type="password" v-model="password" placeholder="请输入密码">
            </div>
            <el-button round
                       :loading="btnLoading"
                       style="width: 100%;height: 51px;border-radius: 26px;font-size: 19px;"
                       native-type="submit"
                       type="primary">{{ type === 'login' ? '登录' : '注册' }}</el-button>
          </form>
          <div class="third" v-show="type==='login'">
            <h5><i/>合作账号登录<i/></h5>
            <div class="link">
              <a href="/">
                <img src="./wechat@2x.png" alt="">
                <p>微信登录</p>
              </a>
              <a href="/">
                <img src="./qq@2x.png" alt="">
                <p>QQ登录</p>
              </a>
            </div>
          </div>
          <p class="agreement" v-show="type==='register'">注册即同意<a target="_blank" href="/privacy?type=1">钠斯直播用户协议</a></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from 'axios'
import { post } from '../../util/http'
import { setItem } from '../../util/storage'

export default {
  name: 'login',
  data() {
    return {
      type: 'login',
      codeTime: 60,
      phone: '',
      password: '',
      code: '',
      btnLoading: false
    }
  },
  computed: {
    countText () {
      if (this.codeTime < 60 && this.codeTime > 0) return `${this.codeTime}s`
      return '获取验证码'
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    ...mapMutations(['toggleLogin']),
    submit(e) {
      if (this.type === 'login') {
        this.login()
      } else {
        this.register()
      }
    },
    register() {
      let msg = ''
      if (!this.phone) msg = '请输入正确的手机号'
      if (!this.code && !msg) msg = '请输入验证码'
      if (!this.password && !msg) msg = '请输入密码'
      if (msg) {
        this.$message.warning(msg)
        return
      }
      this.btnLoading = true
      axios.post('/api/user/register', {
        account: this.phone,
        pwd: this.password,
        smscode: this.code
      }, { withCredentials: true })
        .then(({ data }) => {
          this.btnLoading = false
          if (data.msg) {
            this.$message.warning(data.msg)
            return
          }
          this.toggleLogin()
          setItem('token', data.data.token)
          setItem('uid', data.data.id)
          window.location.reload()
        })
    },
    login() {
      let msg = ''
      if (!this.phone) msg = '请输入正确的手机号'
      if (!this.password && !msg) msg = '请输入密码'
      if (msg) {
        this.$message.warning(msg)
        return
      }
      this.btnLoading = true
      axios.post('/api/user/login?type=123', {
        account: this.phone,
        pwd: this.password,
      }, {
        withCredentials: true
      }).then(({ data }) => {
        this.btnLoading = false
        if (data.msg) {
          this.$message.warning(data.msg)
          return
        }
        this.toggleLogin()
        setItem('token', data.data.token)
        setItem('uid', data.data.id)
        window.location.reload()
      })
    },
    sendCode() {
      if (this.timer) return
      if (!this.phone) {
        this.$message.warning('请输入正确的手机号')
        return
      }
      post({
        url: '/webapi/user/sendCode',
        data: {
          mobile: this.phone
        }
      })
        .then(() => {
          this.countDown()
        })
    },
    countDown () {
      this.$message.success('发送成功')
      this.timer = setInterval(() => {
        if (this.codeTime <= 0) {
          clearInterval(this.timer)
          this.timer = null
          this.codeTime = 60
          return
        }
        this.codeTime--
      }, 1000)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/variable.styl"
.login
  position fixed
  left 0
  top 0
  width 100vw
  height 100vh
  background-color rgba(0, 0, 0, 0.5)
  z-index 9
  display flex
  justify-content center
  align-items center
  .box
    width 493px
    border-radius 9px
    overflow hidden
    background-color #fff
    .head
      height 69px
      display flex
      align-items flex-end
      padding-left 46px
      position relative
      background-color #2E1A59
      .close
        position absolute
        right 0
        top 0
        width 31px
        height 29px
        cursor pointer
      .logo
        position absolute
        right 70px
        top 15px
        width 117px
        height 37px
      .tab
        padding-top 28px
        margin-right 52px
        font-size 17px
        color #fff
        cursor pointer
        &.active
          &>i
            background-color $theme-color
        &>i
          display block
          width 20px
          height 3px
          margin 0 auto
          margin-top 22px
          background-color transparent
          border-radius 1px
    .account
      padding 49px 30px 16px 30px
      .input
        height 50px
        margin-bottom 23px
        border-radius 25px
        border 1px solid #EEEEEE
        padding 0 22px
        display flex
        align-items center
        &>img
          height 20px
          margin-right 20px
        &>input
          flex 1
          height 100%
          border none
          outline none
          font-size 17px
        .code-btn
          width 116px
          height 36px
          line-height 36px
          border-radius 18px
          background-color $theme-color
          text-align center
          font-size 17px
          color #FFFFFF
          cursor pointer
      .submit
        display block
        width 100%
        height 50px
        margin-top 38px
        border none
        outline none
        border-radius 25px
        font-size 19px
        color #FFFFFF
        background-color $theme-color
      .third
        margin-top 53px
        &>h5
          display flex
          margin-bottom 17px
          justify-content center
          align-items center
          font-size 14px
          color #666666
          &>i
            width 81px
            height 1px
            background-color #E7E7E7
            margin 0 22px
        .link
          display flex
          justify-content center
          &>a
            text-align center
            &:first-child
              margin-right 40px
            &>img
              width 45px
              height 44px
              margin-bottom 9px
            &>p
              font-size 13px
              color #333333
      .agreement
        margin-top 17px
        margin-bottom 41px
        text-align center
        font-size 15px
        color #333333
        &>a
          color #FF491F
</style>
