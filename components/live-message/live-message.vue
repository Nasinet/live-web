<template>
  <div class="live-message">
    <div class="msg-scroll" :style="{height: `calc(100% - ${scrollHeight}px)`}" ref="msgScroll">
      <h4 class="tips"><span>系统提示：</span>
        {{$store.state.appConfig.room_notice}}
      </h4>
      <ul class="msg-list">
        <li v-for="(msg, index) in msgs" :key="index">
          <img class="medal" v-if="msg.vip_level && msg.isVip && msg.nick_name" :src="medals[msg.vip_level - 1]" alt="">
          <level-icon v-if="msg.nick_name" height="18px" width="28px" :level="Number(msg.user_level)" />
          <span v-if="msg.nick_name" @click.stop="showFloatUser(msg)" class="name">{{ msg.nick_name }}: </span>
          <span :style="{color: msg.nick_name ? '#333' : '#18D5D9'}">{{ msg.message }}</span>
        </li>
      </ul>
    </div>
    <div class="input-wrap">
      <div class="clear">
        <el-tooltip content="清空消息" placement="top">
          <img class="icon" @click="msgs=[]" src="./delete@2x.png" alt="">
        </el-tooltip>
        <el-tooltip v-if="isOpenAnimation" content="屏蔽特效" placement="top">
          <img class="icon" @click="toggleAnimation" src="./texiao_open@2x.png" alt="">
        </el-tooltip>
        <el-tooltip v-else content="打开特效" placement="top">
          <img class="icon" @click="toggleAnimation" src="./texiao_close@2x.png" alt="">
        </el-tooltip>
        <el-tooltip content="房间管理" placement="top">
          <img class="icon" v-if="showSet" src="./set@2x.png" @click="$emit('toggleSet')" alt="">
        </el-tooltip>
      </div>
      <form @submit.prevent="submitMsg" class="input">
        <input v-model="message" type="text">
        <button type="submit" class="btn">发送</button>
      </form>
    </div>
  </div>
</template>

<script>
import LevelIcon from '../level-icon/level-icon'
import TIM from 'tim-js-sdk'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'live-message',
  components: {
    LevelIcon
  },
  props: {
    scrollHeight: {
      type: Number,
      default: 86
    },
    roomId: {
      type: String,
      default: ''
    },
    isAnchor: {
      type: Boolean,
      default: false
    },
    showSet: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      msgs: [],
      message: '',
      medals: [require('../../pages/rank/youxia@2x.png'), require('../../pages/rank/qishi@2x.png'), require('../../pages/rank/gongjue@2x.png'), require('../../pages/rank/king@2x.png')]
    }
  },
  computed: {
    ...mapState(['userInfo', 'appConfig', 'isOpenAnimation'])
  },
  mounted() {
    this.initIm()
    window.addEventListener('beforeunload', async (e) => {
      if (this.tim && this.roomId && !this.isAnchor) {
        await this.tim.quitGroup(this.roomId)
      }
    })
  },
  beforeDestroy() {
    if (this.tim && this.roomId && !this.isAnchor) {
      this.tim.quitGroup(this.roomId)
        .then(() => {
          this.tim.logout()
          this.tim = null
        })
    } else {
      this.tim = null
    }
    clearTimeout(this.msgTimer)
    this.$off('showFloatUser')
    this.$off('liveFinished')
    this.$off('pushGift')
    this.$off('drawDanmu')
    this.$off('changHumanNum')
  },
  methods: {
    ...mapMutations(['toggleLogin', 'toggleAnimation']),
    sleep() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 2000)
      })
    },
    submitMsg() {
      if (!this.userInfo.id) {
        this.toggleLogin()
        return
      }
      if (!this.message) {
        this.$message.warning('请输入消息')
        return
      }
      clearTimeout(this.msgTimer)
      this.msgTimer = setTimeout(() => {
        this.sendMessage(this.message, 'RoomMessage')
      }, 200)
    },
    showFloatUser(user) {
      this.$emit('showFloatUser', user)
    },
    initIm() {
      this.tim = TIM.create({
        SDKAppID: this.appConfig.im_sdkappid
      })

      this.tim.setLogLevel(1)

      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.receiveMsg)

      this.tim.on(TIM.EVENT.SDK_READY, this.imReady)

      if (this.userInfo.id) {
        this.tim.login({userID: this.userInfo.id.toString(), userSig: this.userInfo.txim_sign})
      }

      if (this.roomId && !this.userInfo.id) {
        this.tim.joinGroup({groupID: this.roomId})
      }
    },
    receiveMsg(e) {
      e.data.forEach(item => {
        if (!item.payload.data) return
        const data = JSON.parse(item.payload.data)
        if (data.Action === 'RoomNotification') {
          let { type, user } = data.Data.notify
          this.$emit('checkMgr')
          this.showMsg({
            message: type === 'RoomNotifyTypeSetManager' ? `${user.nick_name} 被主播设置为房管` : `${user.nick_name} 房管权限已被取消`,
            sender: {}
          })
        }
        if (data.Action === 'LiveFinished') this.$emit('liveFinished');
        if (data.Action === 'RoomMessage' && item.to === this.roomId) {
          if (data.Data.chat.sender.id === this.userInfo.id) {
            return
          }
          this.showMsg(data.Data.chat)
        }
        // console.log(data)
        // if (data.Action === 'RoomAttentAnchor') {
        //   this.showMSg(data)
        //   this.$emit('increaseAttend')
        // }
        if (data.Action === 'LiveGroupMemberJoinExit') this.getMemberNum()
        if (data.Action === 'GiftAnimation') {
          const { title, sender, count } = data.Data.gift
          this.showMsg({
            message: `${sender.nick_name} 送给主播 ${title}x${count}`,
            sender: {}
          })
          this.$emit('pushGift', data)
        }
      })
    },
    imReady() {
      this.tim.joinGroup({groupID: this.roomId})
        .then(() => {
          if (this.userInfo.id && !this.isAnchor) {
            this.sendMessage('进入直播间', 'RoomMessage')
          }
          this.getMemberNum()
        })
    },
    sendMessage(message, action) {
      const content = {
        Action: action,
        Data: {
          chat: {
            sender: {
              id: this.userInfo.id,
              nick_name: this.userInfo.nick_name,
              avatar: this.userInfo.avatar,
              user_level: this.userInfo.user_level.toString(),
              vip_level: this.userInfo.vip_level,
              vip_date: this.userInfo.vip_date,
              is_anchor: this.userInfo.is_anchor
            },
            message: message
          }
        }
      }

      const msgBody = this.tim.createCustomMessage({
        to: this.roomId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          data: JSON.stringify(content)
        }
      })

      this.tim.sendMessage(msgBody)
        .then(() => {
          this.message = ''
          this.showMsg(content.Data.chat)
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    showMsg(chat) {
      this.msgs.push({
        message: chat.message,
        ...chat.sender,
        isVip: chat.sender.vip_level && new Date(chat.sender.vip_date.replace(/\-/g, '/')).getTime() > Date.now()
      })
      if (chat.sender.nick_name) {
        this.$emit('drawDanmu', chat.sender.nick_name + '：' + chat.message)
      }
      this.$nextTick(() => {
        if (this.$refs.msgScroll) {
          this.$refs.msgScroll.scrollTop = this.$refs.msgScroll.scrollHeight
        }
      })
    },
    getMemberNum () {
      if (!this.roomId) return
      this.tim.getGroupProfile({
        groupID: this.roomId
      })
        .then((res) => {
          this.$emit('changHumanNum', res.data.group.memberNum)
        })
    },
  }
}
</script>

<style scoped lang="stylus">
  .live-message
    position absolute
    left 0
    width 100%
    top 255px
    bottom 20px
    display flex
    flex-direction column
    .msg-scroll
      overflow-y scroll
    .tips
      padding-left 14px
      padding-right 23px
      padding-bottom 20px
      line-height 25px
      font-size 13px
      color #F06E1E
    .msg-list
      padding 0 15px
      &>li
        margin-bottom 10px
        line-height 20px
        font-size 13px
        color #9090A2
        .medal
          width 32px
          height 32px
          vertical-align middle
        &>span
          word-break break-all
          color #333333
          &.name
            color #a2e0fe
            cursor pointer
    .input-wrap
      border-top 1px solid #E5E5E5
      .clear
        padding-top 10px
        padding-left 16px
        display flex
        margin-bottom 11px
        .icon
          width 24px
          height 24px
          margin-right 32px
          cursor pointer
          border none
          outline none
      .input
        display flex
        height 40px
        margin 0 20px
        &>input
          flex 1
          height 100%
          outline none
          border-bottom-left-radius 5px
          border-top-left-radius 5px
          border 1px solid #E5E5E5
          font-size 15px
        .btn
          width 60px
          height 40px
          line-height 40px
          border-bottom-right-radius 5px
          border-top-right-radius 5px
          text-align center
          color #fff
          font-size 15px
          background linear-gradient(81deg,rgba(130,221,255,1),rgba(133,83,255,1))
          cursor pointer
</style>
