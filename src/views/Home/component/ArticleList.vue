<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="loadNextPage" success-text="刷新成功~">
    <van-list
      @load="loadNextPage"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      :error.sync="error"
      error-text="加载失败，点击重新加载"
    >
      <ArticleItem
        v-for="(item, index) in articles"
        :key="index"
        :articleInfo="item"
      ></ArticleItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api'
import ArticleItem from './ArticleItem.vue'
export default {
  data() {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshing: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    // 获取频道的文章并且处理文章数据
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, +new Date())
        this.articles = data.data.results
        this.pre_timestamp = data.data.pre_timestamp
        // console.log(this.articles)
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页频道数据
    async loadNextPage() {
      try {
        const { data } = await getArticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        // 将第n页的数据，放在articles
        if (this.refreshing) {
          // 如果是下拉刷新，将数据放在最前方
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // console.log(this.articles)
        // 更新页数
        this.pre_timestamp = data.data.pre_timestamp
      } catch (e) {
        this.error = true
      } finally {
        // loading设置为false
        this.loading = false
        this.refreshing = false
      }
    }
  }
}
</script>

<style></style>
