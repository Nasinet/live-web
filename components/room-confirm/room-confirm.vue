<template>
  <div class="room-confirm">
    <h4>{{ type === 1 ? '私密房间' : '付费房间' }}</h4>
    <i @click="$emit('close')" class="el-icon-close"></i>
    <p v-if="type===2">本房间为付费房间，每分钟需支付<span>{{ price }}</span>金币</p>
    <el-input type="password" v-model="pass" v-else placeholder="请输入房间密码" />
    <el-button @click="confirm" round class="confirm" type="primary">确定</el-button>
  </div>
</template>

<script>
export default {
  name: 'room-confirm',
  props: {
    type: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pass: ''
    }
  },
  methods: {
    confirm() {
      if (this.type === 1) {
        if (!this.pass) {
          this.$message.error('请输入密码')
          return
        }
        this.$emit('confirm', this.pass)
      } else {
        this.$emit('confirm')
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.room-confirm
  position fixed
  top 50%
  left 50%
  width 316px
  padding 22px 28px 34px 28px
  border-radius 10px
  transform translate3d(-50%, -50%, 0)
  background #fff
  &>h4
    margin-bottom 37px
    text-align center
    font-size 19px
    color #333333
  &>i
    position absolute
    right 21px
    top 19px
    font-size 20px
    font-weight bold
    color #D3D3D3
  &>p
    line-height 24px
    font-size 17px
    color #333333
    &>span
      color #FF7930
  .confirm
    display block
    margin 0 auto
    margin-top 36px
    width 131px
</style>
