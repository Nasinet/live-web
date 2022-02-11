<template>
  <user-center-wrap>
    <back-head title="绑定手机号" />
    <bind-phone-form class="bind-form" />
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../components/user-center-wrap/user-center-wrap'
import BackHead from '../../components/back-head/back-head'
import BindPhoneForm from '../../components/bind-phone-form/bind-phone-form'
import {post} from "../../util/http";
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";
export default {
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
    }
  },
  name: 'bind-phone',
  middleware: 'login-check',
  components: {
    UserCenterWrap,
    BackHead,
    BindPhoneForm
  }
}
</script>

<style scoped lang="stylus">
.bind-form
  margin-top 135px
</style>
