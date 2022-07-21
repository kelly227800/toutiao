<template>
  <div>
    <van-cell title="搜索历史" v-if="isCloseBtnShow">
      <template #default>
        <span style="margin-right: 8px" @click="delAll">全部删除</span>
        <span @click="finish">完成</span>
      </template>
    </van-cell>
    <van-cell title="搜索历史" v-else>
      <template #right-icon>
        <van-icon name="delete-o" @click="delFn" />
      </template>
    </van-cell>
    <van-cell :title="item" v-for="(item, index) in historyList" :key="index" @click="clickFn(item)">
      <template #right-icon>
        <van-icon name="close" v-if="isCloseBtnShow" @click.stop="del(item)" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import { storage } from '@/utils/storage'
export default {
  data() {
    return {
      isCloseBtnShow: false,
      historyList: storage.get('historylist') || []
    }
  },
  methods: {
    delFn() {
      this.isCloseBtnShow = true
    },
    del(item) {
      this.historyList = this.historyList.filter((ele) => ele !== item)
      storage.set('historylist', this.historyList)
    },
    delAll() {
      this.historyList = []
      storage.set('historylist', this.historyList)
    },
    finish() {
      this.isCloseBtnShow = false
    },
    clickFn(keywords) {
      this.$emit('changeKeywords', keywords)
    }
  }
}
</script>

<style scoped lang="less">
.search-icon {
  padding-top: 10px;
}
</style>
