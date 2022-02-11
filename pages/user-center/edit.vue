<template>
  <user-center-wrap>
    <back-head title="修改个人资料"/>
    <form @submit.prevent="submit">
      <div class="from-item">
        <label>上传新头像</label>
        <div class="upload" v-if="!form.avatar" @click="clickFile">
          <i class="iconfont icon-jia"></i>
        </div>
        <img v-if="form.avatar" @click="clickFile" :src="form.avatar" alt="" class="avatar">
      </div>
      <p class="up-tips">不修改头像即不用上传新头像</p>
      <div class="input-list">
        <div class="from-item">
          <label>新用户名</label>
          <el-input v-model="form.nick_name" style="width: 272px;" placeholder="请输入用户名" />
        </div>
        <div class="from-item">
          <label>年龄</label>
          <el-input v-model="form.age" style="width: 272px;" placeholder="请输入年龄" />
        </div>
        <div class="from-item">
          <label>性别</label>
          <el-select v-model="form.gender" style="width: 272px;">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </div>
        <div class="from-item">
          <label>行业</label>
          <el-input v-model="form.careenr" style="width: 272px;" placeholder="请输入从事行业" />
        </div>
        <div class="from-item">
          <label>个性签名</label>
          <el-input v-model="form.signature" type="textarea" :rows="3" style="width: 272px;" placeholder="请输入个性签名" />
        </div>
        <div class="two-input">
          <div class="from-item">
            <label>身高</label>
            <el-input v-model="form.height" style="width: 272px;" placeholder="请输入身高（cm）" />
          </div>
          <div class="from-item">
            <label>体重</label>
            <el-input v-model="form.weight" style="width: 272px;" placeholder="请输入体重（kg）" />
          </div>
        </div>
        <div class="from-item">
          <label>星座</label>
          <el-select v-model="form.constellation" round placeholder="请选择星座" style="width: 272px;">
            <el-option v-for="item in constellations" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="from-item">
          <label>城市</label>
          <el-input v-model="form.city" style="width: 272px;" placeholder="请输入所在城市" />
        </div>
      </div>
<!--      <p class="phone-tips">未绑定手机号？<nuxt-link to="/user-center/bind-phone">绑定手机号&gt;&gt;</nuxt-link></p>-->
<!--      <div class="from-item">-->
<!--        <label>验证码</label>-->
<!--        <el-input style="width: 155px;margin-right: 15px;" placeholder="请输入验证码" />-->
<!--        <el-button style="width: 106px;" type="primary" @click="countDown">{{ countText }}</el-button>-->
<!--      </div>-->
      <el-button native-type="submit" :loading="btnLoading" class="submit" type="primary">立即修改</el-button>
    </form>
    <input @change="upLoad" type="file" v-show="false" ref="file" />
  </user-center-wrap>
</template>

<script>
import UserCenterWrap from '../../components/user-center-wrap/user-center-wrap'
import BackHead from '../../components/back-head/back-head'
import { countDown } from '../../util/mixins'
import { mapState, mapActions } from 'vuex'
import { post } from "../../util/http";
import getPlatform from "../../util/platform";
import {h5Host} from "../../util/host";

export default {
  name: 'edit',
  asyncData({ store, redirect, req }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host + '/my')
      return
    }

    const { userInfo } = store.state
    return {
      form: {
        avatar: userInfo.avatar,
        nick_name: userInfo.nick_name,
        ...userInfo.profile
      }
    }
  },
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
      constellations: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
      form: {
        avatar: '',
        nick_name: '',
        signature: '',
        gender: 0,
        height: '',
        weight: '',
        constellation: '',
        city: '',
        age: '',
        careenr: ''
      },
      btnLoading: false
    }
  },
  computed: {
    ...mapState(['appConfig'])
  },
  methods: {
    ...mapActions(['getUserInfo']),
    submit() {
      this.btnLoading = true
      post({
        url: '/webapi/User/editUserInfo',
        data: this.form
      })
        .then(() => {
          this.getUserInfo()
          this.$router.back()
        })
    },
    clickFile() {
      this.$refs.file.click()
    },
    upLoad() {
      const loading = this.$loading({
        lock: true,
        // target: '.upload',
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
        this.form.avatar = 'https://' + data.Location
        this.$refs.file.value = ''
      })
    }
  }
}
</script>

<style scoped lang="stylus">
form
  display block
  padding 36px 72px
  label
    width 104px
    font-size 16px
    color #333333
  .input-list
    display flex
    justify-content space-between
    flex-wrap wrap
    .from-item
      margin-bottom 30px
  .from-item
    align-items center
    display flex
    .avatar
      width 93px
      height 93px
      border-radius 50%
      cursor pointer
    .upload
      width 93px
      height 93px
      line-height 93px
      text-align center
      border-radius 4px
      border 1px dashed #BBBBBB
      cursor pointer
      &>i
        font-size 40px
        color #D9D9D9
  .up-tips
    margin-left 104px
    margin-top 15px
    margin-bottom 48px
    font-size 13px
    color #979797
  .phone-tips
    margin-left 104px
    margin-top 15px
    margin-bottom 33px
    font-size 13px
    color #333
    &>a
      color #499DE9
  .submit
    width 278px
    display block
    margin 0 auto
    margin-top 40px
</style>
