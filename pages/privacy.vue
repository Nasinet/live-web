<template>
  <div class="privacy">
    <na-header class="na-header"/>
    <div class="content">
      <h4>{{ titles[type] }}</h4>
      <div class="rich-text" v-html="content"></div>
    </div>
  </div>
</template>

<script>
import NaHeader from '../components/header/header'
import { post } from '../util/http'
import getPlatform from "../util/platform";
import {h5Host} from "../util/host";

export default {
  name: 'privacy',
  async asyncData({ query, req, redirect }) {
    if (process.server && getPlatform(req) === 'h5') {
      redirect(h5Host)
      return
    }

    const { data: { data } } = await post({ url: '/webapi/Protocal/getProtocal', data: { type: query.type }, req })
    return {
      content: data.content,
      type: data.type
    }
  },
  layout: 'common-footer',
  components: {
    NaHeader
  },
  data() {
    return {
      content: '',
      titles: ['', '用户注册协议', '隐私权政策', '用户阳光行为规范', '直播协议', '直播内容管理规定'],
      type: ''
    }
  }
}
</script>

<style scoped lang="stylus">
  .privacy
    min-height 100vh
    overflow hidden
    background-color #fafafa
    .na-header
      background #fff
    .content
      padding 30px 36px
      width 1406px
      margin 20px auto
      min-height calc(100vh - 100px)
      background-color #fff
      color #333
      &>h4
        padding-bottom 22px
        border-bottom 1px solid #f4f4f4
        text-align center
        font-size 22px
      .rich-text
        margin-top 28px
        line-height 28px
        font-size 14px
        ::v-deep
          li
            padding 3px 0
          strong
            font-weight bold
    @media only screen and (max-width: 1406px)
      .content
        width 1137px
</style>
