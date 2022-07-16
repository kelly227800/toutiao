<template>
  <div>
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="backToPrePage"
    >
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <van-form
      @submit="login"
      class="form"
      validate-trigger="onSubmit"
      ref="loginForm"
    >
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        type="text"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-count-down
            :time="3 * 1000"
            v-if="isCountDownShouw"
            @finish="isCountDownShouw = false"
          />
          <van-button
            class="code-btn"
            size="mini"
            round
            v-else
            @click.prevent="onSendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" class="btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user.js'
import { mobileRules, codeRules } from './rules'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isCountDownShouw: false
    }
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    async login() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        // console.log(res)
        this.$store.commit('setUser', res.data.data)
        this.$router.push('/profile')
        this.$toast.success('登录成功')
      } catch (err) {
        console.log(err)
        // this.$toast.fail('登录失败')
        let message = '登录错误，请刷新~'
        if (err.response.status === 400) {
          message = err.response.data.message
        }
        this.$toast.fail(message)
        // switch (err.response.status) {
        //   case 400:
        //     this.$toast.fail(err.response.data.message)
        //     break
        //   case 507:
        //     this.$toast.fail('登录错误，请刷新~')
        //     break
        //   default:
        //     this.$toast.fail('登录错误，请刷新~')
        //     break
        // }
      }
    },
    async onSendCode() {
      try {
        await this.$refs.loginForm.validate('mobile')
        await sendCode(this.mobile)
        this.isCountDownShouw = true
      } catch (err) {
        // 1. 表单校验失败
        if (!err.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          const status = err.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(err.response.data.message)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon-cross {
    color: #fff;
  }
}
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-field__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 0.49333rem;
  }
  .code-btn {
    padding: 0 10px;
    background-color: #ededed;
    color: #666666;
  }
  .btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>
