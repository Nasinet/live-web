<template>
  <div class="activity-detail">
    <na-header class="header" />
    <div class="act-content">
      <h2>{{ detail.title }}</h2>
      <h4>{{ detail.create_time }}</h4>
      <div class="content" v-html="detail.content"></div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../../components/header/header'
import { post } from "../../util/http";
import getPlatform from "../../util/platform";
import { h5Host } from "../../util/host";

export default {
  name: 'activity-detail',
  async asyncData({ params, redirect, req }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }

    const { data: { data } } = await post({ url: '/webapi/Activity/activityInfo', data: { id: params.id } })
    return {
      detail: data
    }
  },
  layout: 'common-footer',
  components: {
    NaHeader
  },
  data() {
    return {
      detail: {}
    }
  }
}
</script>

<style scoped lang="stylus">
.activity-detail
  min-height 100vh
  background-color #F5F5F5
  .header
    background-color #fff
  .act-content
    width 1406px
    margin 0 auto
    margin-top 15px
    padding 39px 53px 41px 53px
    min-height calc(100vh - 81px - 45px)
    border-radius 9px
    background-color #fff
    &>h2
      margin-bottom 29px
      font-weight bold
      text-align center
      font-size 24px
      color #333333
    &>h4
      margin-bottom 27px
      padding-bottom 44px
      border-bottom 1px solid #DCDCE9
      text-align center
      font-size 16px
      color #838383
    .content
      line-height 33px
      font-size 15px
      color #333333
  @media only screen and (max-width: 1406px)
    .act-content
      width 1200px
</style>
