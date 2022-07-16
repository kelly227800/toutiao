<template>
  <div class="my">
    <header>
      <!-- 登录的头部盒子 -->
      <div v-if="isLogin" class="user-info banner">
        <van-row></van-row>
        <van-row class="row-2">
          <van-col span="12">
            <van-row type="flex" align="center" justify="space-around">
              <van-image
                round
                width="1.76rem"
                height="1.76rem"
                :src="userInfo.photo"
              />
              <span class="mobile">{{ userInfo.name }}</span>
            </van-row>
          </van-col>
          <van-col span="11">
            <van-row class="code-row" type="flex" justify="end" align="center">
              <van-button class="code-btn" size="mini" round
                >编辑资料</van-button
              >
            </van-row>
          </van-col>
        </van-row>
        <van-row>
          <div class="data-stats">
            <div class="data-item">
              <span class="count">{{ userInfo.art_count }}</span>
              <span class="text">头条</span>
            </div>
            <div class="data-item">
              <span class="count">{{ userInfo.fans_count }}</span>
              <span class="text">关注</span>
            </div>
            <div class="data-item">
              <span class="count">{{ userInfo.follow_count }}</span>
              <span class="text">粉丝</span>
            </div>
            <div class="data-item">
              <span class="count">{{ userInfo.like_count }}</span>
              <span class="text">获赞</span>
            </div>
          </div>
        </van-row>
      </div>
      <!-- 未登录的头部盒子 -->
      <div v-else class="banner login-register">
        <div class="login-btn" @click="$router.push('/login')">
          <img class="mobile-img" src="~@/assets/images/mobile.png" />
          <span class="text">登录 / 注册 </span>
        </div>
      </div>
    </header>

    <!-- 主体 -->
    <main>
      <van-grid class="nav-grid" :column-num="2" clickable>
        <van-grid-item class="grid-item">
          <i slot="icon" class="toutiao toutiao-shoucang"></i>
          <span class="text" slot="text">收藏</span>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <i slot="icon" class="toutiao toutiao-lishi"></i>
          <span class="text" slot="text">历史</span>
        </van-grid-item>
      </van-grid>

      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>
    <!-- 底部退出按钮 -->
    <van-button block class="login-btn" v-if="isLogin" @click="logout"
      >退出</van-button
    >
  </div>
</template>

<script>
import { getUserInfo } from '@/api'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.token
    }
  },
  methods: {
    logout() {
      this.$dialog
        .confirm({
          title: '黑马头条',
          message: '是否确认退出该账号'
        })
        .then(() => {
          this.$store.commit('setUser', {})
        })
    },
    async getUserInfo() {
      if (this.isLogin) {
        const {
          data: { data }
        } = await getUserInfo()
        this.userInfo = data
        console.log(data)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f5f7f9;
  height: calc(100vh - 100px);
}
.banner {
  width: 100%;
  height: 400px;
  background: url('../../assets/images/banner.png') no-repeat 0 0 / cover;
}
.user-info {
  display: flex;
  flex-direction: column;
  > .van-row {
    flex: 1;
  }
  .row-2 {
    .van-col {
      height: 100%;
    }
  }
  .mobile {
    font-size: 0.4rem;
    color: #fff;
  }
  .code-row {
    height: 100%;
    .code-btn {
      width: 1.53333rem;
      height: 0.42667rem;
      background: #fff;
      border-radius: 0.21333rem;
      font-size: 0.26667rem;
      color: #666;
      padding: 0;
    }
  }
  .data-stats {
    background-color: unset;
    display: flex;
    border: none;
    .data-item {
      flex: 1;
      height: 130px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
}
main {
  .nav-grid {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      span.text {
        font-size: 28px;
        color: #646566;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .link {
    margin: 10px 0;
  }
}
.login-btn {
  margin: 10px 0;
  :deep(.van-button__text) {
    color: red;
  }
}
.login-register {
  display: flex;
  justify-content: center;
  align-items: center;
  .login-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile-img {
      width: 132px;
      height: 132px;
      margin-bottom: 15px;
    }
    .text {
      font-size: 28px;
      color: #fff;
    }
  }
}
</style>
