<template>
  <div class="step">
    <img src="./step1_yellow@2x.png" alt="">
    <img v-if="step===0" src="./step2_blue@2x.png" alt="">
    <img v-if="step>0" src="./step2_yellow@2x.png" alt="">
    <img v-if="step<2" src="./step3_blue@2x.png" alt="">
    <img v-if="step===2" src="./step3_yellow@2x.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'step',
  props: {
    step: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped lang="stylus">
.step
  padding 0 108px
  margin-top 36px
  display flex
  &>img
    flex 1
    height 46px
    margin-left -24px
    &:first-child
      margin-left 0
  @media only screen and (max-width: 1406px)
    &>img
      height 39px
      margin-left -20px
</style>
