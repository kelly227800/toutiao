<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem :commentList="commentList"></CommentItem>
    </van-list>
  </div>
</template>

<script>
import { getCommentList } from '@/api'
import CommentItem from '@/views/Detail/component/CommentItem.vue'
export default {
  data() {
    return {
      loading: false,
      finished: false,
      lastId: ''
    }
  },
  props: {
    commentList: {
      type: Array,
      required: true
    }
  },
  components: {
    CommentItem
  },
  methods: {
    // 加载更多页评论
    async onLoad() {
      if (this.commentList.length === 0) {
        this.finished = true
        return
      }
      try {
        // console.log(this.commentList[this.commentList.length - 1].com_id)
        this.lastId = this.commentList[this.commentList.length - 1].com_id
        const res = await getCommentList(this.$route.params.id, this.lastId)
        // console.log(res)
        // console.log(res.data.data.last_id)
        this.$emit('changeCommentList', res.data.data.results)
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
      } catch (err) {
        this.$toast.fail('加载失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
