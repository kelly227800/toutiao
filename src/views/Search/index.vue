<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        clearable
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="backToPrePage"
        @focus="visibleSearchSuggestion"
        background="#3296fa"
        class="search"
      />
    </form>
    <component
      :is="componentName"
      :keywords="keywords"
      @changeKeywords="changeKeywordsFn"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
export default {
  data() {
    return {
      keywords: '',
      isShowSearchResult: false
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  computed: {
    componentName() {
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  methods: {
    // 返回上一页
    backToPrePage() {
      this.$router.go(-1)
    },
    // 搜索
    onSearch() {
      // 显示搜索结果
      this.isShowSearchResult = true
    },
    visibleSearchSuggestion() {
      // 如果keywords没有值，显示搜索历史
      // 如果keywords有值，显示搜索结果
      this.isShowSearchResult = false
    },
    changeKeywordsFn(value) {
      // console.log(value)
      this.keywords = value
      this.isShowSearchResult = true
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  background-color: #f5f7f9;
  height: calc(100vh);
}
.search {
  [role='button'] {
    color: #fff;
  }
}
</style>
>
