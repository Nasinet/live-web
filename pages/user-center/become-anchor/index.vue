<template>
  <user-center-wrap>
    <back-head title="成为主播" />
    <step :step="step" v-if="step<3" />
    <bind-phone-form class="phone-form" v-if="step===0" />
    <VerifyForm @next="step+=1" v-if="step===1" />
    <user-info-form @next="step+=1" v-if="step===2" />
    <div class="submit-success" v-if="step===3">
      <img src="./sub-cc@2x.png" alt="">
      <p>提交成功!</p>
      <p>请耐心系统等待审核</p>
    </div>
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../../components/user-center-wrap/user-center-wrap'
import BackHead from '../../../components/back-head/back-head'
import Step from '../../../components/step/step'
import UserInfoForm from '../../../components/userinfo-form/userinfo-form'
import BindPhoneForm from '../../../components/bind-phone-form/bind-phone-form'
import VerifyForm from '../../../components/verify-form/verify-form'
import getPlatform from "../../../util/platform";
import {h5Host} from "../../../util/host";

export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my/verify')
    }
  },
  name: 'become-anchor',
  layout: 'common-footer',
  middleware: 'login-check',
  components: {
    UserCenterWrap,
    BackHead,
    Step,
    UserInfoForm,
    BindPhoneForm,
    VerifyForm
  },
  data() {
    return {
      step: 1
    }
  }
}
</script>

<style scoped lang="stylus">
.phone-form
  margin-top 102px !important
.submit-success
  padding-top 150px
  text-align center
  &>img
    width 158px
    height 147px
    margin-bottom 38px
  &>p
    line-height 30px
    font-size 20px
    color #5E5E5E
</style>
