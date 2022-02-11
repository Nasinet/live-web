<template>
  <user-center-wrap>
    <back-head title="管理账户" />
    <div class="form">
      <div class="input">
        <label>支付宝姓名</label>
        <el-input v-model="form.alipay_name" style="flex: 1;" placeholder="请输入支付宝姓名" />
      </div>
      <div class="input">
        <label>支付宝账号</label>
        <el-input v-model="form.alipay_account" style="flex: 1;" placeholder="请输入支付宝账号" />
      </div>
      <div class="input">
        <label>手机号</label>
        <el-input v-model="phone" style="flex: 1;" placeholder="请输入手机号" />
      </div>
      <div class="input">
        <label>验证码</label>
        <el-input v-model="form.smscode" style="flex: 1;margin-right: 14px;" placeholder="请输入验证码" />
        <el-button style="width: 107px;" @click="sendCode" type="primary">{{ countText }}</el-button>
      </div>
      <el-button class="sub-button" :loading="btnLoading" @click="submit" type="primary">立即修改账户</el-button>
    </div>
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../../components/user-center-wrap/user-center-wrap'
import BackHead from '../../../components/back-head/back-head'
import { countDown } from '../../../util/mixins'
import { post } from "../../../util/http";
import getPlatform from "../../../util/platform";
import {h5Host} from "../../../util/host";

export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my/account')
    }
  },
  name: 'account',
  layout: 'common-footer',
  middleware: 'login-check',
  mixins: [countDown],
  components: {
    UserCenterWrap,
    BackHead
  },
  data() {
    return {
      btnDefaultText: '短信验证',
      form: {
        alipay_account: '',
        alipay_name: '',
        smscode: ''
      },
      phone: '',
      btnLoading: false
    }
  },
  methods: {
    sendCode() {
      if (!this.phone) {
        this.$message.error('请输入手机号')
        return
      }
      if (this.timer) return
      post({ url: '/webapi/user/sendVerifyCode', data: {mobile: this.phone} })
        .then(() => {
          this.countDown()
        })
    },
    submit() {
      let msg = ''
      if (!this.form.alipay_name) msg = '请输入支付宝姓名'
      if (!msg && !this.form.alipay_account) msg = '请输入支付账号'
      if (!msg && !this.form.smscode) msg = '请输入验证码'
      if (msg) {
        this.$message.error(msg)
        return
      }
      this.btnLoading = true
      post({url: '/webapi/withdraw/editCashAccount', data: this.form})
        .then(() => {
          this.btnLoading = false
          this.$router.back()
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.form
  padding 98px 364px 193px 364px
  @media only screen and (max-width: 1406px)
    padding-left 269px
    padding-right 269px
  .input
    display flex
    align-items center
    margin-bottom 39px
    &>label
      width 106px
      font-size 17px
      color #333333
  .sub-button
    display block
    width 278px
    margin 0 auto
    margin-top 22px
</style>
