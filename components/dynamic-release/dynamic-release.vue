<template>
  <div class="dynamic-release" @click.stop @scroll.prevent.stop>
    <transition name="el-zoom-in-center">
      <div class="box" v-if="$store.state.showDynamicRel">
        <h3 class="head">记录生活，拥抱美好~ <i @click="toggleDynamicRel" class="el-icon-close"/></h3>
        <el-input v-model="text" :rows="3" class="textarea" type="textarea" />
        <div class="controls">
          <img src="./pic@2x.png" @click="changForm('pic')" class="up" alt="">
          <img @click="clickFile('video')" src="./video@2x.png" class="up" alt="">
          <div style="flex: 1;"/>
          <p :class="{active: isLock && Number(money)}" v-if="imgs.length || videoUrl" @click="changForm('lock')"><i class="el-icon-lock" /> {{ isLock && Number(confirmMoney) ? `付费动态${confirmMoney}金币` : '设置为付费观看动态' }}</p>
          <el-button type="warning" @click="submit" :loading="loading">发布</el-button>
        </div>
        <div class="form-box" v-if="activeForm==='lock'">
          <h5 class="sub-title">设置付费观看动态 <i @click="hideLock" class="el-icon-close"/></h5>
          <el-input type="number" style="margin-top: 23px;" v-model="money" placeholder="请输入付费金额" />
          <el-button class="button" @click="setLock" type="warning">确定</el-button>
        </div>
        <div class="form-box" v-if="activeForm==='pic'">
          <h5 class="sub-title">本地上传 <i @click="activeForm=''" class="el-icon-close"/></h5>
          <p class="tips">共{{ imgs.length }}张，还能上传{{ 9 - imgs.length }}张</p>
          <div class="imgs">
            <div :style="{backgroundImage: `url(${item})`}" v-for="(item, index) in imgs" :key="item" class="img">
              <img @click="delImg(index)" src="./close@2x.png" alt="">
            </div>
            <div v-if="imgs.length<9" @click="clickFile('image')" class="up-btn">
              <img src="./tianjia@2x.png" alt="">
            </div>
          </div>
        </div>
        <div class="form-box" v-if="activeForm==='video'">
          <h5 class="sub-title">本地上传 <i @click="activeForm=''" class="el-icon-close"/></h5>
          <p class="tips">请勿上传色情、暴力等违法视频</p>
          <div class="video-cover" id="up_player" :style="{backgroundImage: `url(${upFailBig})`}" />
          <p class="up-status">
            <img :src="upVideoStatus === 0 ? upSuccess : upFail" alt="">
            {{ upVideoStatus === 0 ? '上传成功' : '上传失败' }}
            <span v-if="upVideoStatus===1">重新上传？</span>
          </p>
        </div>
      </div>
    </transition>
    <input type="file" @change="upFile" ref="file" v-show="false">
  </div>
</template>

<script>
import upSuccess from './up-succ.png'
import upFail from './shibai@2x.png'
import upFailBig from './shibaipic@2x.png'
import { mapMutations, mapState } from 'vuex'
import { post } from "../../util/http";

export default {
  name: 'dynamic-release',
  data () {
    return {
      loading: false,
      money: '',
      confirmMoney: '',
      text: '',
      showLock: false,
      isLock: false,
      activeForm: '',
      imgs: [],
      upSuccess,
      upFail,
      upFailBig,
      upVideoStatus: 0,
      upType: 'image',
      videoUrl: '',
      preForm: ''
    }
  },
  computed: {
    ...mapState(['appConfig']),
    releaseType() {
      if (this.videoUrl) return 3
      if (!this.videoUrl && this.imgs.length) return 2
      return 1
    }
  },
  beforeDestroy() {
    if (this.player) this.player.destroy()
  },
  methods: {
    ...mapMutations(['toggleDynamicRel']),
    hideLock() {
      this.activeForm = ''
      this.money = this.confirmMoney
    },
    changForm(type) {
      if (this.player) {
        this.player.destroy()
      }
      this.preForm = this.activeForm
      this.activeForm = type
    },
    setLock() {
      this.isLock = true
      this.activeForm = this.preForm
      this.confirmMoney = this.money
      if (this.activeForm === 'video') {
        this.$nextTick(() => {
          this.createPlayer()
        })
      }
    },
    clickFile(type) {
      this.upType = type
      this.$refs.file.click()
    },
    upFile() {
      const file = this.$refs.file.files[0]
      if (file.type.indexOf(this.upType) < 0) {
        this.$message.warning(this.upType === 'image' ? '请选择图片文件' : '请选择视频文件')
        return
      }
      const loading = this.$loading({
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)',
        text: '上传中...'
      })
      if (this.upType === 'video') {
        this.uploadMedia(file, loading)
        return
      }
      const cosObj = this.$cos()
      cosObj.putObject({
        Bucket: this.appConfig.cos_bucket,
        Region: this.appConfig.cos_region,
        Key: this.appConfig.cos_folder_image + `/${file.name}`,
        Body: file,
        Headers: {'Pic-Operations': "{\"is_pic_info\":1,\"rules\":[{\"fileid\":\"/images_blur/" + cosObj.filename + file.name+"\",\"rule\":\"imageMogr2/blur/50x25\"}]}"}
      }, (err, data) => {
        loading.close()
        if (err) {
          this.$message.error('上传失败')
          this.upVideoStatus = 1
        } else {
          this.imgs.push('https://' + data.Location)
        }
        this.$refs.file.value = ''
      })
    },
    uploadMedia(file, loading) {
      const vod = this.$vod()
      const upLoader = vod.upload({
        mediaFile: file
      })
      upLoader.done().then((res) => {
        console.log(res)
        loading.close()
        this.videoUrl = res.video.url
        this.$nextTick(() => {
          this.createPlayer()
        })
        this.preForm = 'video'
        this.activeForm = 'video'
        this.upVideoStatus = 0
        this.$refs.file.value = ''
      }).catch(() => {
        loading.close()
        this.$message.error('上传失败')
        this.upVideoStatus = 1
        this.$refs.file.value = ''
      })
    },
    createPlayer() {
      if (this.player) {
        this.player.destroy()
      }
      this.player = new this.$DPlayer({
        container: document.getElementById('up_player'),
        video: {
          url: this.videoUrl,
        },
        volume: 0.5
      })
    },
    submit() {
      if (!this.text) {
        this.$message.error('请输入您的动态内容')
        return
      }
      if (this.videoUrl && !this.imgs.length) {
        this.$message.error('请上传视频封面')
        return
      }
      const data = {
        title: this.text,
        type: this.releaseType,
        image_url: this.imgs.join(','),
        blur_image_url: this.imgs.join(',').replace(/\/images\//g,"/images_blur/"),
        video_url: this.videoUrl,
        unlock_price: this.confirmMoney,
        single_display_type: 1
      }
      this.loading = true
      post({ url: '/webapi/Moment/publish', data })
        .then(() => {
          window.location.reload()
        })
        .catch(() => {
          this.loading = false
        })
    },
    delImg(index) {
      this.imgs.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="stylus">
.dynamic-release
  position fixed
  left 0
  top 0
  width 100vw
  height 100vh
  background rgba(0, 0, 0, 0.4)
  z-index 99
  overflow hidden
  .box
    width 589px
    margin 0 auto
    margin-top 20vh
    border-radius 9px
    background #fff
    position relative
    .head
      height 46px
      display flex
      justify-content space-between
      align-items center
      padding 0 22px
      border-bottom 1px solid #F2F2F5
      font-size 15px
      color #333333
      font-weight bold
      &>i
        font-weight bold
        font-size 20px
        color #C3C3C3
        cursor pointer
    .textarea
      display block
      width 549px
      margin 0 auto
      margin-top 24px
      margin-bottom 12px
      border-radius 5px
      font-size 16px
      &:actived
        border 1px solid #18D5D9
    .controls
      width 549px
      margin 0 auto
      display flex
      align-items center
      padding-bottom 33px
      .up
        width 22px
        height 20px
        margin-right 16px
      &>p
        padding 0 8px
        margin-right 23px
        height 25px
        line-height 25px
        border-radius 12px
        background #F2F2F2
        font-size 13px
        color #A6A6A6
        cursor pointer
        &.active
          background #F7EFFF
          color #B377FD
    .sub-title
      display flex
      justify-content space-between
      align-items center
      font-size 15px
      color #333333
      &>i
        font-size 20px
        color #C3C3C3
        font-weight bold
        cursor pointer
    .form-box
      position absolute
      left 0
      top calc(100% + 8px)
      width 326px
      border-radius 9px
      background #fff
      padding 0 14px
      padding-top 15px
      padding-bottom 24px
      .button
        display block
        margin 0 auto
        margin-top 24px
      .tips
        margin-top 11px
        margin-bottom 21px
        font-size 13px
        color #7E7E7E
      .imgs
        display flex
        flex-wrap wrap
        .img
          width 94px
          height 94px
          margin-right 8px
          margin-bottom 8px
          background-repeat no-repeat
          background-position center center
          background-size cover
          &>img
            width 15px
            height 15px
            float right
            cursor pointer
          &:nth-child(3n+0)
            margin-right 0
      .up-btn
        width 94px
        height 94px
        display flex
        justify-content center
        align-items center
        border 1px dashed #BBBBBB
        border-radius 5px
        cursor pointer
      .video-cover
        width 298px
        height 145px
        background-size cover
        background-position center center
      .up-status
        margin-top 14px
        line-height 21px
        text-align center
        font-size 13px
        color #7E7E7E
        &>span
          color #FF8C26
          cursor pointer
        &>img
          margin-right 6px
          width 21px
          height 21px
          vertical-align middle
</style>
