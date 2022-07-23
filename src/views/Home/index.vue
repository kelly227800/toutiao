<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round @click="$router.push('/search')"><van-icon name="search" />搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- tabs选项卡 -->
    <van-tabs v-model="active" swipeable animated>
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>
      <!-- 更多按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="isShow">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <EditChannelPoPup
      ref="popup"
      :myChannels="myChannels"
      @del-myChannel="delMychannel"
      @change-active="changeActive"
      @add-mychannel="addMychannel"
    ></EditChannelPoPup>
  </div>
</template>

<script>
import {
  getMyChannels,
  getMyChannelsByLocal,
  setMyChannelsToLocal,
  delMyChannel,
  addMyChannel
} from '@/api'
import ArticleList from './component/ArticleList.vue'
import EditChannelPoPup from './component/EditChannelPoPup.vue'
export default {
  name: 'Home',
  components: {
    ArticleList,
    EditChannelPoPup
  },
  data() {
    return {
      active: 0,
      myChannels: []
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.token
    }
  },
  created() {
    this.getMyChannels()
  },
  methods: {
    async getMyChannels() {
      try {
        if (!this.isLogin) {
          // 如果你是离线状态
          // 1.如果本地存储有数据 直接用本地存储的数据
          // 2.如果本地存储没有数据，发送请求获取默认频道数据
          const myChannels = getMyChannelsByLocal()
          if (myChannels) {
            this.myChannels = myChannels
          } else {
            const { data } = await getMyChannels()
            this.myChannels = data.data.channels
          }
        } else {
          // 如果你是登录状态
          // 发送请求获取的
          const { data } = await getMyChannels()
          this.myChannels = data.data.channels
        }
      } catch (err) {
        this.$toast.fail('请重新获取频道列表')
      }
    },
    isShow() {
      this.$refs.popup.show = true
    },
    // 删除我的频道
    async delMychannel(id) {
      // 删除我的频道
      this.myChannels = this.myChannels.filter((item) => item.id !== id)
      if (!this.isLogin) {
        // console.log(111)
        // 如果你是离线状态
        // 数据存储在本地存储中
        setMyChannelsToLocal(this.myChannels)
      } else {
        // 如果你是登录状态
        // 发送接口 删除频道
        try {
          const res = await delMyChannel(id)
          console.log(res)
        } catch (err) {
          return this.$toast.fail('删除用户频道失败')
        }
      }
      this.$toast.success('删除用户频道成功')
    },
    changeActive(active) {
      this.active = active
    },
    async addMychannel(channel) {
      // 添加频道
      this.myChannels.push(channel)
      if (!this.isLogin) {
        // 如果你是离线状态
        // 数据存储在本地存储中
        setMyChannelsToLocal(this.myChannels)
      } else {
        // 如果你是登录状态
        // 发送接口 添加频道
        try {
          await addMyChannel(channel.id, this.myChannels.length)
        } catch (err) {
          return this.$toast.fail('添加频道失败')
        }
      }
      this.$toast.success('添加频道成功')
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
//tabs选项卡
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.hamburger-btn {
  position: fixed;
  top: 92px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 66px;
  height: 82px;
  opacity: 0.6;
  i.toutiao {
    font-size: 33px;
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 1px;
    height: 100%;
    background-image: url('~@/assets/images/gradient-gray-line.png');
    background-size: contain;
  }
}
:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
</style>
