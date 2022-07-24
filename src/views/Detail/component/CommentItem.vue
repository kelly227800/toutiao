<template>
  <div>
    <div class="comment" v-for="item in commentList" :key="item.com_id">
      <div class="avatar">
        <van-image width="38" height="38" round :src="item.aut_photo" />
      </div>
      <div class="rightside">
        <div class="firstline">
          <span class="username">{{ item.aut_name }}</span>
          <span
            class="toutiao toutiao-dianzan"
            @click="clickCommentLike(item)"
            :class="{ liking: item.is_liking }"
          >
            {{ item.like_count === 0 ? '赞' : item.like_count }}</span
          >
        </div>
        <div>{{ item.content }}</div>
        <div class="thirdline">
          <span class="lasttime">{{ time(item.pubdate) }}</span
          ><van-button round type="default" @click="clickReply(item)"
            >回复 {{ item.reply_count }}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import eventBus from '@/EventBus'
import { LikeComment, cancelLikeComment } from '@/api'
export default {
  data() {
    return {}
  },
  props: {
    commentList: {
      type: Array,
      required: true
    }
  },
  computed: {
    time() {
      return function (pubdate) {
        return dayjs(pubdate).fromNow()
      }
    }
  },
  methods: {
    // 点击回复
    clickReply(item) {
      eventBus.$emit('showReplyPopup', item)
    },
    // 点赞
    async clickCommentLike(item) {
      if (!item.is_liking) {
        // console.log(typeof 1)
        await LikeComment(item.com_id)
        // console.log(res)
        item.like_count++
        item.is_liking = true
      } else {
        await cancelLikeComment(item.com_id)
        // console.log(res)
        item.like_count--
        item.is_liking = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment {
  width: 100%;
  height: 196px;
  display: flex;
  margin-top: 50px;
  font-size: 0.42667rem;
  .avatar {
    margin-right: 30px;
    margin-left: 30px;
    > img {
      width: 100%;
    }
  }
  .rightside {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    .firstline {
      display: flex;
      justify-content: space-between;
      .username {
        color: #6582ac;
        font-size: 0.34667rem;
      }
      .toutiao-dianzan {
        margin-right: 40px;
        &:before {
          padding-top: 2px;
          padding-right: 1.5px;
          font-size: 12.5px;
        }
      }
    }
    .thirdline {
      display: flex;
      align-items: center;
      .lasttime {
        font-size: 0.25333rem;
        color: #222;
        margin-right: 30px;
      }
      .van-button {
        width: 2rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 0.28rem;
        color: #222;
      }
    }
  }
}
.liking {
  &:before {
    color: #3296fa;
    font-weight: bold;
  }
}
</style>
