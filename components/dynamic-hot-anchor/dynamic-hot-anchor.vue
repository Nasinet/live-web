<template>
  <div class="dynamic-hot-anchor">
    <h4>热门主播</h4>
    <anchor-item class="hot-item" v-for="item in list"  :key="item.anchorid" :item="item" />
  </div>
</template>

<script>
  import AnchorItem from './anchor-item'

  export default {
    name: 'dynamic-hot-anchor',
    components: {
      AnchorItem
    },
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
.dynamic-hot-anchor
  border-radius 14px
  background-color #fff
  overflow hidden
  &>h4
    padding 21px 0
    padding-left 19px
    border-bottom 1px solid #EDEDED
    margin-bottom 21px
    font-weight bold
    font-size 15px
    color #333333
  .hot-item
    margin-bottom 34px
</style>
