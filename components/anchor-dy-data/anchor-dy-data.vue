<template>
  <div class="anchor-dy-data">
    <div class="data-num">
      <p>{{ user.attent_count }} <span>关注</span></p>
      <i></i>
      <p>{{ user.fans_count }} <span>粉丝</span></p>
      <i></i>
      <p>{{ user.moment_count }} <span>动态</span></p>
    </div>
    <div class="intro">
      <span>性别</span>
      {{ user.profile.gender ? '男' : '女' }}
    </div>
    <div class="intro">
      <span>简介</span>
      {{ user.profile.signature || '这个用户很懒，什么也没留下。' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'anchor-dy-data',
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.anchor-dy-data
  border-radius 14px
  background-color #fff
  overflow hidden
  padding-top 29px
  padding-bottom 20px
  .data-num
    display flex
    align-items center
    padding 0 18px
    margin-bottom 31px
    &>p
      flex 1
      text-align center
      font-size 18px
      color #333333
      font-weight bold
      &>span
        display block
        margin-top 14px
        text-align center
        font-size 15px
        color #7A7A7A
        font-weight normal
    &>i
      width 1px
      height 22px
      background-color #EDEDED
  .intro
    padding-left 26px
    margin-bottom 22px
    font-size 14px
    color #656565
    &>span
      display inline-block
      color #333333
</style>
