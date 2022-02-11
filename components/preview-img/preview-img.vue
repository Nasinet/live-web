<template>
  <div class="preview-img">
    <div class="control-btn">
      <div class="btn"><img src="./shouqi@2x.png" alt=""><span>收起</span></div>
      <i></i>
      <div class="btn"><img src="./datu@2x.png" alt=""><span>查看大图</span></div>
      <i></i>
      <div class="btn"><img src="./zuo@2x.png" alt=""><span>向左旋转</span></div>
      <i></i>
      <div class="btn"><img src="./you@2x.png" alt=""><span>向右旋转</span></div>
    </div>
    <div style="height: 500px;">
      <img class="rotate-img" :src="imgUrl" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'preview-img',
    props: {
      imgUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        rotate: 0
      }
    },
  }
</script>

<style scoped lang="stylus">
.preview-img
  width 661px
  margin 0 auto
  padding 30px
  background-color #F6F6F6
  .control-btn
    display flex
    align-items center
    margin-bottom 18px
    &>i
      width 1px
      height 11px
      margin 0 10px
      background-color #D9D9D9
    .btn
      font-size 14px
      color #616161
      &>img
        margin-right 6px
        vertical-align middle
        height 13px
</style>
