<template>
  <user-center-wrap>
    <back-head title="实名认证" />
    <verify-form @next="$router.back()" class="real-form" />
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../components/user-center-wrap/user-center-wrap'
import BackHead from '../../components/back-head/back-head'
import VerifyForm from '../../components/verify-form/verify-form'

export default {
  name: 'verify',
  middleware: 'login-check',
  components: {
    UserCenterWrap,
    BackHead,
    VerifyForm
  }
}
</script>

<style scoped lang="stylus">
.real-form
  margin-top 20px
</style>
