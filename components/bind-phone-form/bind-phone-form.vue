<template>
  <div class="form">
    <div class="input">
      <img src="./bind-phone@2x.png" alt="">
      <input placeholder="请输入手机号" type="text">
    </div>
    <div class="input">
      <img src="./code@2x.png" alt="">
      <input placeholder="请输入验证码" type="text">
      <el-button @click="countDown" type="primary" style="width: 118px;margin-right: 9px;height: 40px;" size="mini" round>{{ countText }}</el-button>
    </div>
    <el-button @click="submit" :loading="btnLoading" type="primary" style="width: 100%;height: 54px;border-radius: 27px;font-size: 18px;" round>立即绑定</el-button>
  </div>
</template>

<script>
import { countDown } from '../../util/mixins'

export default {
  name: 'bind-phone-form',
  mixins: [countDown],
  data() {
    return {
      btnLoading: false,
      btnDefaultText: '验证码',
    }
  },
  methods: {
    submit() {
      this.btnLoading = true
    }
  }
}
</script>

<style scoped lang="stylus">
  .form
    width 390px
    margin 0 auto
    .input
      display flex
      align-items center
      margin-bottom 26px
      height 55px
      border-radius 27px
      border 1px solid #EDEDED
      overflow hidden
      &>img
        width 72px
        height 100%
      &>input
        flex 1
        height 100%
        border none
        outline none
        padding-left 15px
        font-size 16px
</style>
