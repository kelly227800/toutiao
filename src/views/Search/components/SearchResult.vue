<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        :title="item.title"
        v-for="(item, index) in resultList"
        :key="index"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api'
import { storage } from '@/utils/storage'
export default {
  name: 'SearchResult',
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      resultList: [],
      page: 1,
      historyList: storage.get('historylist') || []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      try {
        const res = await getSearchResult(this.keywords, this.page)
        this.resultList.push(...res.data.data.results)
        // console.log(this.resultList)
        this.page++
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    getHistory() {
      this.historyList.unshift(this.keywords)
      this.historyList = [...new Set(this.historyList)]
      console.log(this.historyList)
      storage.set('historylist', this.historyList)
    }
  },
  created() {
    this.getHistory()
  }
}
</script>

<style></style>
