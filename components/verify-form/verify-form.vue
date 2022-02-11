<template>
  <div class="verify-form">
    <div class="input">
      <label>真实姓名</label>
      <el-input v-model="form.real_name" placeholder="请输入姓名" style="border-radius: 38px;width: 298px;" />
    </div>
    <div class="input">
      <label>身份证</label>
      <el-input v-model="form.id_num" placeholder="请输入身份证" style="border-radius: 38px;width: 298px;" />
    </div>
<!--    <div class="input">-->
<!--      <label>支付宝姓名</label>-->
<!--      <el-input v-model="form.alipay_name" placeholder="请输入支付宝姓名" style="border-radius: 38px;width: 298px;" />-->
<!--    </div>-->
<!--    <div class="input">-->
<!--      <label>支付宝账号</label>-->
<!--      <el-input v-model="form.alipay_account" placeholder="请输入支付宝账号" style="border-radius: 38px;width: 298px;" />-->
<!--    </div>-->
    <ul class="upload">
      <li class="id-img1" @click="clickFile(0)">
        <img :src="imgs[0]" alt="">
        <p>身份证正面</p>
      </li>
      <li class="id-img2" @click="clickFile(1)">
        <img :src="imgs[1]" alt="">
        <p>身份证背面</p>
      </li>
      <li class="id-img3" @click="clickFile(2)">
        <img :src="imgs[2]" alt="">
        <p>手持身份证</p>
      </li>
    </ul>
    <p class="verify-tips"><span>温馨提示：</span>请确保姓名、身份证号清晰可见，这可以帮助客服人员快速通过你的申请</p>
    <el-button style="margin-left: 354px;margin-bottom: 37px;" :loading="btnLoading" @click="submit" type="primary" round>确认提交</el-button>
    <input @change="upLoad" type="file" v-show="false" ref="file">
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {post} from "../../util/http";

export default {
  name: 'verify-form',
  data() {
    return {
      form: {
        real_name: '',
        id_num: '',
        // alipay_account: '',
        // alipay_name: '',
        id_card_url: ''
      },
      current: 0,
      imgs: [require('./zhengmian@2x.png'), require('./fanmian@2x.png'), require('./shouchi@2x.png')],
      btnLoading: false
    }
  },
  computed: {
    ...mapState(['appConfig'])
  },
  beforeDestroy() {
    this.$off('next')
  },
  methods: {
    clickFile(type) {
      this.current = type
      this.$refs.file.click()
    },
    upLoad() {
      const loading = this.$loading({
        lock: true,
        target: `.id-img${this.current + 1}`,
        spinner: 'el-icon-loading',
      })
      const file = this.$refs.file.files[0]
      const cosObj = this.$cos()
      cosObj.putObject({
        Bucket: this.appConfig.cos_bucket,
        Region: this.appConfig.cos_region,
        Key: this.appConfig.cos_folder_image + `/${file.name}`,
        Body: file
      }, (err, data) => {
        loading.close()
        if (err) {
          this.$message.error('上传失败')
          return
        }
        this.$set(this.imgs, this.current, 'https://' + data.Location)
        this.$refs.file.value = ''
      })
    },
    checkForm() {
      let msg = ''
      if (!this.form.real_name) msg = '请输入真实姓名'
      if (!this.form.id_num && !msg) msg = '请输入身份证号'
      // if (!this.form.alipay_name && !msg) msg = '请输入支付宝姓名'
      // if (!this.form.alipay_account && !msg) msg = '请输入支付宝账户'
      if (!msg && this.imgs[0].indexOf('https') < 0) msg = '请上传身份证正面'
      if (!msg && this.imgs[1].indexOf('https') < 0) msg = '请上传身份证背面'
      if (!msg && this.imgs[2].indexOf('https') < 0) msg = '请上传手持身份证'
      if (msg) {
        this.$message.error(msg)
        return false
      }
      return true
    },
    submit() {
      if (!this.checkForm()) return
      this.btnLoading = true
      const data = {
        ...this.form,
        id_card_url: this.imgs.join(',')
      }
      post({ url: '/webapi/auth/identityAuth', data })
        .then(() => {
          this.$emit('next')
          this.btnLoading = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.verify-form
  margin-top 65px
  margin-left 108px
  .input
    display flex
    align-items center
    margin-bottom 22px
    &>label
      width 120px
      font-size 17px
      color #333333
    ::v-deep
      .el-input__inner
        border-radius 38px !important
  .upload
    margin-top 45px
    display flex
    &>li
      margin-right 22px
      text-align center
      cursor pointer
      &>img
        width 203px
        height 132px
        margin-bottom 18px
      &>p
        font-size 17px
        color #959595
  .verify-tips
    margin-top 38px
    margin-bottom 56px
    font-size 13px
    color #959595
    &>span
      color #FF3B3B
</style>
