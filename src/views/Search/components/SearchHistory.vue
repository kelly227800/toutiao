<template>
  <div>
    <van-cell title="单元格" value="内容">
        <template #icon>
            <van-icon name="search" class="search-icon" />
        </template>
    </van-cell>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'>
.search-icon {
    padding-top: 10px;
}
</style>
