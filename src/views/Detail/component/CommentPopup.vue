<template>
  <div>
    <van-popup
      class="popup"
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      @click-close-icon="closePopup"
    >
      <!-- 头部 -->
      <van-nav-bar
        class="popup-navbar"
        :title="totalCount == 0 ? '暂无回复' : totalCount + '条回复'"
      >
      </van-nav-bar>
      <main>
        <!-- 点开的当前评论 -->
        <CommentItem :commentList="[currentItem]"></CommentItem>
        <van-cell title="全部回复" />
        <van-list
          v-model="isLoading"
          :immediate-check="false"
          :finished="isFinished"
          finished-text="没有更多了"
          @load="LoadFn"
        >
          <CommentItem :commentList="replyList"></CommentItem>
        </van-list>
      </main>
      <!-- 底部 -->
      <div class="foot">
        <van-button type="default" round @click="showCommentArea"
          >评论</van-button
        >
      </div>
      <!-- 点击写评论展示 -->
      <div class="commentarea">
        <van-popup
          v-model="showCommentPopup"
          closeable
          position="bottom"
          :style="{ height: '120px' }"
        >
          <div class="zhanwei"></div>
          <van-field
            v-model="ReplyContent"
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
          />
          <div class="public" @click="publicReplyComment">发布</div>
        </van-popup>
      </div>
    </van-popup>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import eventBus from '@/EventBus/index'
import CommentItem from './CommentItem.vue'
import { getReplyList, CommentArticle } from '@/api'
export default {
  data() {
    return {
      show: false,
      showCommentPopup: false,
      isLoading: false,
      isFinished: false,
      ReplyContent: '',
      lastId: '',
      totalCount: '',
      currentItem: {},
      replyList: []
    }
  },
  methods: {
    // 获取回复列表
    async getReplyListFn() {
      console.log(this.currentItem.com_id)
      const res = await getReplyList(this.currentItem.com_id)
      console.log(res)
      this.totalCount = res.data.data.total_count
      if (res.data.data.results.length !== 0) {
        this.replyList = res.data.data.results
      } else {
        this.isFinished = true
      }
    },
    // 获取更多页评论
    async LoadFn() {
      if (this.replyList.length !== 0) {
        try {
          // console.log(this.commentList[this.commentList.length - 1].com_id)
          // console.log(this.currentItem.com_id)
          this.lastId = this.replyList[this.replyList.length - 1].com_id
          const res = await getReplyList(this.currentItem.com_id, this.lastId)
          console.log(res)
          // console.log(res.data.data.last_id)
          this.replyList.push(...res.data.data.results)
          if (res.data.data.results.length === 0) {
            this.isFinished = true
          }
        } catch (err) {
          this.$toast.fail('加载失败')
        } finally {
          this.isLoading = false
        }
      } else {
        this.isFinished = true
      }
    },
    // 对评论内容发表回复
    async publicReplyComment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true
      })
      try {
        const res = await CommentArticle(
          this.currentItem.com_id,
          this.ReplyContent,
          this.$route.params.id
        )
        console.log(res)
        this.$toast.success('评论成功')
        this.getReplyListFn()

        this.ReplyContent = ''
        this.totalCount++
      } catch (err) {
        this.$toast.fail('评论失败')
      } finally {
        this.showCommentPopup = false
      }
    },
    // 展示写评论区域
    showCommentArea() {
      this.showCommentPopup = true
    },
    // 关闭弹出层时触发评论区回复数更新
    closePopup() {
      this.$emit('update')
    }
  },
  created() {
    eventBus.$on('showReplyPopup', (item) => {
      this.show = true
      this.currentItem = item
      // console.log(this.currentItem)
      this.getReplyListFn()
    })
  },
  components: {
    CommentItem
  },
  computed: {
    time() {
      return function (pubdate) {
        return dayjs(pubdate).fromNow()
      }
    }
  }
}
</script>

<style scoped lang="less">
// 关闭按钮
:deep(.popup) {
  > .van-popup__close-icon {
    position: fixed;
    top: 0.36rem;
    font-size: 0.48rem;
  }
}
// 头部
:deep(.popup-navbar) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
}
// 主体
main {
  width: 100%;
  margin-top: 112px;
  margin-bottom: 100px;
}
:deep(.van-cell) {
  margin-top: 10px;
}
// 底部
.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 96px;
  background-color: #ff69b4;
  :deep(.van-button) {
    width: 640px;
    height: 80px;
  }
}
// 写评论区
.commentarea {
  :deep(.van-popup) {
    display: flex;
    align-items: center;
    .zhanwei {
      flex: 1;
    }
    .van-cell {
      margin: 20px 0;
      width: 596px;
      height: 176px;
      padding: 0.26667rem 0.42667rem;
      background-color: #f5f7f9;
      .van-field__word-limit {
        margin-top: -0.1rem;
      }
    }
    .public {
      flex: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6ba3d8;
      font-size: 0.37333rem;
    }
    .van-icon-cross {
      top: 0.05rem;
      &:before {
        font-size: 16px;
      }
    }
  }
}
</style>
