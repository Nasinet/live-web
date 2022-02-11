<template>
  <div class="user-info-form">
    <div class="i-row">
      <div class="input">
        <label>性别</label>
        <el-select round placeholder="请选择性别" style="margin-left: 22px;width: 240px;" v-model="form.gender">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="0" />
        </el-select>
      </div>
      <div class="input">
        <label>年龄</label>
        <el-input style="margin-left: 22px;width: 240px;" placeholder="请输入年龄" v-model="form.age" />
      </div>
    </div>
    <div class="i-row">
      <div class="input">
        <label>身高</label>
        <el-input style="margin-left: 22px;width: 240px;" placeholder="请输入身高（CM）" v-model="form.height" />
      </div>
      <div class="input">
        <label>体重</label>
        <el-input style="margin-left: 22px;width: 240px;" placeholder="请输入体重（KG）" v-model="form.weight" />
      </div>
    </div>
    <div class="i-row">
      <div class="input">
        <label>星座</label>
        <el-select round placeholder="请选择星座" style="margin-left: 22px;width: 240px;" v-model="form.constellation">
          <el-option v-for="item in constellations" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="input">
        <label>职业</label>
        <el-input style="margin-left: 22px;width: 240px;" placeholder="请输入职业" v-model="form.careenr" />
      </div>
    </div>
    <div class="i-row">
      <div class="input">
        <label>城市</label>
        <el-input style="margin-left: 22px;width: 240px;" placeholder="请输入城市" v-model="form.city" />
      </div>
    </div>
    <el-input type="textarea" placeholder="请编辑个性签名" v-model="form.signature" style="width: 613px;margin-left: 108px;" rows="8" />
    <div class="button">
      <el-button @click="submit" :loading="btnLoading" type="primary" round>确认提交</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {post} from "../../util/http";
  export default {
    name: 'userinfo-form',
    data() {
      return {
        constellations: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        form: {
          signature: '',
          gender: 0,
          height: '',
          weight: '',
          constellation: '',
          city: '',
          age: '',
          careenr: ''
        },
        btnLoading: false
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    created() {
      this.form = {...this.userInfo.profile}
    },
    methods: {
      ...mapActions(['getUserInfo']),
      submit() {
        this.btnLoading = true
        post({
          url: '/webapi/User/editUserInfo',
          data: this.form
        })
          .then(() => {
            this.getUserInfo()
            this.$emit('next')
          })
      },
    }
  }
</script>

<style scoped lang="stylus">
.user-info-form
  margin-top 50px
  .i-row
    display flex
    margin-left 108px
    .input
      width 300px
      display flex
      align-items center
      margin-bottom 35px
      &>label
        font-size 17px
        color #333333
      &:first-child
        margin-right 112px
      ::v-deep
        .el-input__inner
          border-radius 38px !important
  .button
    display flex
    justify-content center
    margin-top 59px
    padding-bottom 37px
</style>
