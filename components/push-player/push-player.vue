<template>
  <div class="push-player">
    <template v-if="!isStart">
      <div class="open-btn" :style="{opacity: openBtnLoading ? '0.8' : '1'}" @click="getLiveParams" v-if="step===1">
        <img v-if="!openBtnLoading" src="./live@2x.png" alt="">
        <i v-else class="el-icon-loading"></i>
        <span>&nbsp;立即开播</span>
      </div>
      <div class="live-params" v-if="step===2">
        <p>推流地址：{{ liveParams.push_url }}</p>
        <p>串流密钥：{{ liveParams.stream_name }}</p>
        <p> 温馨提示：请先前往obs推流工具完成配置后再点击下方按钮开始直播</p>
        <button @click="step=3">配置完成 开始直播</button>
      </div>
      <div class="live-setting" v-if="step===3">
        <h4>直播设置</h4>
        <div class="upload" v-if="!liveForm.thumb" id="img_upload" @click="clickFile">
          <img src="./tianjia@2x.png" alt="">
          <p>上传封面</p>
        </div>
        <div class="uploaded" @click="clickFile" id="img_upload" v-if="liveForm.thumb" :style="{backgroundImage: `url(${liveForm.thumb})`}"></div>
        <div class="input">
          <h6>直播标题</h6>
          <el-input v-model="liveForm.title" placeholder="请输入直播标题" size="mini"/>
        </div>
        <div class="select-wrap">
          <div class="input">
            <h6>直播类型</h6>
            <el-select v-model="liveForm.cateid" placeholder="请选择直播类型" size="mini">
              <el-option v-for="item in categories" :value="item.id" :label="item.title" :key="item.id"/>
            </el-select>
          </div>
          <div class="input">
            <h6>房间类型</h6>
            <el-select v-model="liveForm.room_type" placeholder="请选择直播类型" size="mini">
              <el-option :value="0" label="普通房间"/>
              <el-option :value="1" label="私密房间"/>
              <el-option :value="2" label="付费房间"/>
            </el-select>
          </div>
        </div>
        <div class="input" v-if="liveForm.room_type !== 0">
          <h6>{{ liveForm.room_type === 1 ? '设置房间密码' : '设置房间价格（1分钟/金币）' }}</h6>
          <el-input v-if="liveForm.room_type === 1" v-model="liveForm.pwd" placeholder="请输入房间密码" size="mini"/>
          <el-input v-if="liveForm.room_type === 2" v-model="liveForm.price" placeholder="请输入房间价格" size="mini"/>
        </div>
        <div class="btn-wrap">
          <div class="btn" @click="startLive" :style="{opacity: confirmBtnLoading ? '0.8' : 1}"><i v-if="confirmBtnLoading" class="el-icon-loading"></i> 确定</div>
          <div @click="step=2" class="btn">取消</div>
        </div>
      </div>
      <input @change="selectFile" ref="file" type="file" v-show="false">
    </template>
    <anchor-player @delGift="delGift" :gift-list="giftList" is-anchor ref="player" v-else :detail="liveDetail" />
  </div>
</template>

<script>
import { post } from '../../util/http'
import { mapState } from 'vuex'
import AnchorPlayer from '../player/player'

export default {
  name: 'push-player',
  components: {
    AnchorPlayer
  },
  props: {
    liveDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    giftList: {
      type: Array,
      detail() {
        return []
      }
    }
  },
  data () {
    return {
      file: {},
      step: 1,
      openBtnLoading: false,
      liveParams: {},
      liveForm: {
        title: '',
        cateid: 0,
        thumb: '',
        stream: '',
        room_type: 0,
        pwd: '',
        price: ''
      },
      confirmBtnLoading: false,
      isStart: false
    }
  },
  computed: {
    ...mapState(['categories', 'appConfig'])
  },
  mounted() {
    this.liveForm.cateid = this.categories[0].id
    if (this.liveDetail.pull_url) {
      this.isStart = true
    }
  },
  methods: {
    delGift(index) {
      this.$emit('delGift', index)
    },
    drawDanmu(text) {
      if (!this.isStart) return
      this.$refs.player.drawDanmu(text)
    },
    endLive() {
      this.isStart = false
      this.step = 1
    },
    async getLiveParams() {
      if (this.openBtnLoading) return
      this.openBtnLoading = true
      try {
        const { data: { data } } = await post({ url: '/webapi/live/getStartLiveParams' })
        this.liveParams = data
        this.openBtnLoading = false
        this.step = 2
      } catch (e) {
        this.openBtnLoading = false
      }
    },
    clickFile() {
      this.$refs.file.click()
    },
    selectFile() {
      const file = this.$refs.file.files[0]
      if (file.type.indexOf('image') < 0) {
        this.$message.error('请选择图片文件')
        return
      }
      if (file.name === this.file.name) {
        this.$message.error('请不要重复上传')
        return
      }
      this.file = file
      this.upload(file)
    },
    upload(file) {
      const loading = this.$loading({
        lock: true,
        target: '#img_upload',
        spinner: 'el-icon-loading',
      })
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
        this.liveForm.thumb = 'https://' + data.Location
        this.$refs.file.value = ''
      })
    },
    async startLive() {
      if (this.confirmBtnLoading) return
      let msg = ''
      if (!this.liveForm.thumb) msg = '请上传直播封面'
      if (!msg && !this.liveForm.title) msg = '请输入直播标题'
      if (!msg && this.liveForm.room_type === 1 && !this.liveForm.pwd) msg = '请输入房间密码'
      if (!msg && this.liveForm.room_type === 2 && !this.liveForm.price) msg = '请输入房间价格'
      if (msg) {
        this.$message.error(msg)
        return
      }
      this.confirmBtnLoading = true
      try {
        const { data: { data } } = await post({url: '/webapi/live/startLive', data: {
          ...this.liveForm,
          ...this.liveParams
        }})
        this.confirmBtnLoading = false

        this.$emit('startLive', data)
        setTimeout(() => {
          this.isStart = true
        }, 100)
      } catch (e) {
        this.confirmBtnLoading = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.push-player
  position absolute
  left 0
  top 0
  bottom 0
  right 0
  display flex
  justify-content center
  align-items center
  background-color #000
  #anchor_player
    width 100%
    height 100%
  .open-btn
    width 170px
    height 50px
    border-radius 25px
    line-height 50px
    text-align center
    background linear-gradient(90deg,rgba(130,207,255,1),rgba(133,87,255,1))
    font-size 0
    color #FFFFFF
    cursor pointer
    overflow hidden
    &>span
      font-size 19px
    &>img
      box-sizing content-box
      padding-top 15px
      padding-right 10px
      width 21px
      height 21px
      vertical-align top
    &>i
      font-size 20px
  .live-params
    font-size 15px
    color #FFFFFF
    &>p
      margin-bottom 24px
    &>button
      width 228px
      margin-left 66px
      height 39px
      border-radius 20px
      background linear-gradient(-85deg,rgba(29,217,223,1),rgba(169,24,236,1))
      font-size 15px
      color #FFFFFF
      cursor pointer
  .live-setting
    width 382px
    border-radius 9px
    overflow hidden
    background-color #fff
    &>h4
      width 100%
      height 45px
      line-height 45px
      text-align center
      background-color #2E1A59
      font-size 17px
      color #FFFFFF
    .uploaded
      width 174px
      height 105px
      margin-left 15px
      margin-top 18px
      background-size cover
      background-position center center
      background-repeat no-repeat
      cursor pointer
    .upload
      margin-left 15px
      margin-top 18px
      border 1px dashed #B9B9B9
      width 98px
      text-align center
      cursor pointer
      font-size 40px
      &>img
        width 53px
        height 53px
        margin-top 19px
        margin-bottom 11px
      &>p
        width 100%
        height 15px
        line-height 15px
        color #FEFEFE
        font-size 12px
        text-align center
        background linear-gradient(90deg,rgba(130,216,255,1),rgba(133,84,255,1))
    .select-wrap
      display flex
      justify-content space-between
      .input
        width 45%
    .input
      padding 0 19px
      &>h6
        padding-top 16px
        margin-bottom 13px
        font-size 13px
        color #333333
    .btn-wrap
      display flex
      justify-content space-between
      margin-top 29px
      padding 0 72px
      padding-bottom 23px
      .btn
        width 109px
        height 38px
        border-radius 19px
        line-height 38px
        background #8572FF
        text-align center
        font-size 17px
        color #fff
        cursor pointer
        &:last-child
          background #C7C7D6
</style>
