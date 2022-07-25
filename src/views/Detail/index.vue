<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar
      class="navbar"
      title="黑马头条"
      left-arrow
      @click-left="backToPrePage"
    >
    </van-nav-bar>
    <!-- 文章加载 -->
    <van-loading
      size="24px"
      vertical
      v-if="isLoading"
      style="margin-top: 7.8rem"
      color="#1989fa"
      >加载中...</van-loading
    >
    <!-- 主体内容 -->
    <main v-else>
      <!-- 标题 -->
      <h1>{{ detailList.title }}</h1>
      <!-- 作者信息 -->
      <div class="author">
        <div class="avator">
          <van-image width="38" height="38" round :src="detailList.aut_photo" />
        </div>
        <div class="text">
          <div class="name">{{ detailList.aut_name }}</div>
          <div class="time">{{ time }}</div>
        </div>
        <div class="follow">
          <button
            v-if="isFollow"
            style="
              background-color: unset;
              color: #323233;
              border: 1px solid #ebedf0;
            "
            @click="deleteFollowFn"
          >
            <span class="followtext">已关注</span>
          </button>
          <button v-else @click="followUserFn">
            <span class="add">＋</span>
            <span class="followtext">关注</span>
          </button>
        </div>
      </div>
      <!-- 正文内容 -->
      <div
        class="article-content markdown-body"
        v-html="detailList.content"
      ></div>
      <!-- 正文结束 -->
      <div class="divider" id="contentEnd">
        <van-divider> 正文结束 </van-divider>
      </div>
      <!-- 评论区 -->
      <CommentList
        :commentList="commentList"
        @changeCommentList="changeCommentListFn"
      ></CommentList>
    </main>
    <!-- 底部导航 -->
    <div class="footer">
      <!-- 写评论 -->
      <div class="left">
        <div class="content clickcontent" v-if="showCommentPopup">写评论</div>
        <div class="content" v-else @click="writeComment">写评论</div>
      </div>
      <div class="right">
        <div class="icon" @click="focusCommentArea">
          <van-badge :content="totalCount">
            <van-icon name="comment-o" />
          </van-badge>
        </div>
        <!-- 收藏 -->
        <div class="icon">
          <van-icon
            name="star"
            class="active"
            v-if="isCollect"
            @click="cancelCollect"
          />
          <van-icon name="star-o" v-else @click="collectFn" />
        </div>
        <!-- 点赞 -->
        <div class="icon">
          <van-icon
            class="active"
            name="good-job"
            v-if="isLike"
            @click="unLikeFn"
          />
          <van-icon name="good-job-o" v-else @click="likeFn" />
        </div>
        <!-- 分享 -->
        <div class="icon">
          <van-icon name="share" @click="showShare = true" />
        </div>
      </div>
    </div>
    <!-- 点击分享展示 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
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
          v-model="CommentArticleContent"
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <div class="public" @click="publicArticleComment">发布</div>
      </van-popup>
    </div>
    <!-- 点击回复弹出层展示 -->
    <CommentPopup @update="updateCommentList"></CommentPopup>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import {
  getArticleDetail,
  followUser,
  deleteFollow,
  collectArticle,
  cancelCollections,
  likeArticle,
  cancelLikeings,
  getCommentList,
  CommentArticle
} from '@/api'
import '@/css/news.css'
import CommentList from './component/CommentList.vue'
import CommentPopup from './component/CommentPopup.vue'
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      detailList: {},
      imgList: [],
      commentList: [],
      totalCount: '',
      isLoading: true,
      isFollow: false,
      isCollect: false,
      isLike: false,
      showShare: false,
      showCommentPopup: false,
      CommentArticleContent: '',
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ]
      ]
    }
  },
  computed: {
    time() {
      return dayjs(this.detailList.pubdate).fromNow()
    }
  },
  created() {
    this.getArticleDetail()
  },
  components: {
    CommentList,
    CommentPopup
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    // 点击底部评论图标跳转到评论区位置
    focusCommentArea() {
      const contentEnd = document.querySelector('#contentEnd')
      if (contentEnd) {
        contentEnd.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },
    // 获取文章详情
    async getArticleDetail() {
      try {
        const id = this.$route.params.id
        //   console.log(id)
        const res = await getArticleDetail(id)
        this.detailList = res.data.data
        console.log(this.detailList)
        this.isCollect = this.detailList.is_collected
        this.isFollow = this.detailList.is_followed
        this.getCommentList()
        this.$nextTick(() => {
          this.imgList = document.querySelectorAll('img')
          //   console.log(this.imgList)
          const imgSrc = []
          this.imgList.forEach((item) => {
            imgSrc.push(item.src)
            item.onclick = () => {
              ImagePreview(imgSrc)
            }
          })
        })
      } catch (err) {
        this.$toast('请求失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    // 获取评论
    async getCommentList() {
      try {
        const res = await getCommentList(this.detailList.art_id)
        // console.log(res)
        this.commentList = res.data.data.results
        this.totalCount = res.data.data.total_count
        console.log(this.commentList)
      } catch (err) {
        this.$toast.fail('获取失败请重试')
      }
    },
    // 回复后评论区回复数更新
    updateCommentList() {
      this.getCommentList()
    },
    // 关注用户
    async followUserFn() {
      try {
        // console.log(this.detailList.aut_id)
        await followUser(this.detailList.aut_id)
        this.isFollow = true
        // console.log(res)
      } catch (err) {
        this.$toast('关注失败，请重试')
      }
    },
    // 取消关注用户
    async deleteFollowFn() {
      try {
        await deleteFollow(this.detailList.aut_id)
        this.isFollow = false
        // console.log(res)
      } catch (err) {
        this.$toast('取消关注失败，请重试')
        // console.log(err)
      }
    },
    // 收藏文章
    async collectFn() {
      try {
        await collectArticle(this.detailList.art_id)
        // console.log(res)
        this.isCollect = true
      } catch (err) {
        this.$toast('收藏失败，请重试')
      }
    },
    // 取消收藏文章
    async cancelCollect() {
      try {
        await cancelCollections(this.detailList.art_id)
        // console.log(res)
        this.isCollect = false
      } catch (err) {
        this.$toast('取消收藏失败，请重试')
        // console.log(err)
      }
    },
    // 点赞文章
    async likeFn() {
      try {
        const res = await likeArticle(this.detailList.art_id)
        console.log(res)
        this.isLike = true
      } catch (err) {
        this.$toast('点赞失败，请重试')
      }
    },
    // 取消点赞文章
    async unLikeFn() {
      try {
        const res = await cancelLikeings(this.detailList.art_id)
        console.log(res)
        this.isLike = false
      } catch (err) {
        this.$toast('取消点赞失败，请重试')
        // console.log(err)
      }
    },
    // 点击写评论
    writeComment() {
      this.showCommentPopup = true
    },
    // 评论文章
    async publicArticleComment() {
      if (this.CommentArticleContent.trim() !== '') {
        this.$toast.loading({
          message: '发布中...',
          forbidClick: true
        })
        try {
          const res = await CommentArticle(
            this.detailList.art_id,
            this.CommentArticleContent
          )
          console.log(res)
          this.getCommentList()
          this.$toast.success('评论成功')
          this.CommentArticleContent = ''
          this.totalCount++
        } catch (err) {
          this.$toast.fail('评论失败')
        } finally {
          this.showCommentPopup = false
        }
      } else {
        this.$toast('请输入评论内容')
      }
    },
    // 修改评论列表
    changeCommentListFn(addList) {
      this.commentList.push(...addList)
    }
  }
}
</script>

<style scoped lang="less">
// 头部
:deep(.navbar) {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
// 标题
h1 {
  margin-top: 112px;
  padding: 20px 40px;
  font-size: 40px;
}
// 主体
main {
  width: 100%;
  margin-bottom: 100px;
  .author {
    display: flex;
    width: 100%;
    height: 90px;
    .avator {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex: 1;
      height: 100%;
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 3.5;
      height: 100%;
      font-size: 20px;
      .name {
        margin-left: 22px;
      }
      .time {
        margin-left: 22px;
        color: #b7b7b7;
      }
    }
    .follow {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 2;
      height: 100%;
      button {
        height: 62px;
        width: 2.3rem;
        border-radius: 31px;
        background-color: #3296fa;
        display: flex;
        font-size: 14px;
        align-items: center;
        justify-content: center;
        color: #fff;
        border: none;
        .add {
          padding-bottom: 8px;
          font-size: 0.63rem;
          font-weight: 100;
        }
      }
    }
  }
  .divider {
    width: 100%;
    .van-divider {
      font-size: 0.36rem;
    }
  }
}
// 底部
.footer {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  display: flex;
  border-top: 1px solid #d8d8d8;
  .left {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      width: 278px;
      height: 46px;
      border: 1px solid #eee;
      border-radius: 23px;
      text-align: center;
      line-height: 46px;
      font-size: 30px;
      color: #a7a7a7;
      &.clickcontent {
        background-color: #e6e6e6;
      }
    }
  }
  .right {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex: 1.2;
    text-align: center;
    .icon {
      flex: 1;
      position: relative;
      :deep(.van-badge--fixed) {
        top: 5px;
      }
      .van-icon {
        font-size: 42px;
        color: #777;
        &.active {
          color: #3296fa;
        }
      }
    }
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
