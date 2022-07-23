<template>
  <div>
    <!-- <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    > -->
      <div class="comment" v-for="item in commentList" :key="item.com_id">
        <div class="avatar">
          <van-image width="38" height="38" round :src="item.aut_photo" />
        </div>
        <div class="rightside">
          <div class="firstline">
            <span class="username">{{ item.aut_name }}</span>
            <span class="toutiao toutiao-dianzan"> {{ item.like_count }}</span>
          </div>
          <div>{{ item.content }}</div>
          <div class="thirdline">
            <span class="lasttime">{{ time(item.pubdate) }}</span
            ><van-button round type="default"
              >回复 {{ item.reply_count }}</van-button
            >
          </div>
        </div>
      </div>
    <!-- </van-list> -->
  </div>
</template>

<script>
// import { getCommentList } from '@/api'
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      loading: false,
      finished: false
    }
  },
  props: {
    commentList: {
      type: Array,
      required: true
    }
  },
  // mounted() {
  //   this.lastId = this.commentList[this.commentList.length - 1].com_id
  // },
  computed: {
    time() {
      return function (pubdate) {
        return dayjs(pubdate).fromNow()
      }
    }
  }
  // methods: {
  //   async onLoad() {
  //     // console.log(1)
  //     // console.log(this.commentList[this.commentList.length - 1])
  //     console.log(this.commentList[this.commentList.length - 1].com_id)
  //     const res = await getCommentList(this.$route.params.id, this.lastId)
  //     this.lastId = res.ata.data.last_id
  //     // console.log(this.endId)
  //     // this.$emit('changeCommentList', res.data.data.results)
  //     if (res.data.data.results.length === 0) {
  //       this.finished = true
  //     }
  //     console.log(res)
  //     this.loading = false
  //   }
  // }
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
        width: 1.8rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 0.28rem;
        color: #222;
      }
    }
  }
}
</style>
