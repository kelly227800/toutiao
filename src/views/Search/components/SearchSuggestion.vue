<template>
  <div>
    <van-cell v-for="(item, index) in highlightDate" :key="index">
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 引入API
import { getSearchSuggestion } from '@/api'
export default {
  data () {
    return {
      suggestions: []
    }
  },
  props: {
    // 搜索建议
    keywords: {
      type: String
    }
  },
  watch: {
    // 监视属性绑定的函数 如果是methods里面的函数 支持字符串的写法  会自己去找
    keywords: {
      immediate: true, // 先执行一次 避免第一次输入不会发起请求
      handler () {
        this.getSearchSuggestion()
      }
    }
  },
  methods: {
    async getSearchSuggestion () {
      // 获取搜索建议 并处理数据
      try {
        const res = await getSearchSuggestion(this.keywords)
        // 没有关键词的提示
        this.suggestions = res.data.data.options.filter(Boolean)
        if (this.suggestions.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    // 计算符合搜索关键词 变颜色
    highlightDate () {
      const reg = new RegExp(this.keywords, 'gi') // 定义正则
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color: red">${match}</span>`)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 10px;
}
</style>
>
