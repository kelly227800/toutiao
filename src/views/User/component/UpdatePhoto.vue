<template>
  <div class="avatar">
    <img :src="photo" alt="" ref="img" />
    <div class="foot">
      <span class="cancel" @click="cancelUpdatePhoto">取消</span>
      <span class="confirm" @click="onConfirm">完成</span>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadPhoto } from '@/api'
export default {
  data() {
    return {
      myCropper: null
    }
  },
  props: ['photo'],
  mounted() {
    console.log(this.$refs)
    const img = this.$refs.img
    console.log(img)
    this.myCropper = new Cropper(img, {
      viewMode: 1, // 视图控制-限制裁剪框不能超出图片的范围
      dragMode: 'move', // 拖拽图片模式-图片可移动
      aspectRatio: 1, // 设置裁剪框为固定的宽高比
      autoCropArea: 1, // 设置裁剪区域占图片的大小
      cropBoxMovable: false, // 是否可以拖拽裁剪框
      cropBoxResizable: false, // 是否可以改变裁剪框的尺寸
      background: false, // 是否在容器内显示网格状的背景
      movable: true // 是否可以移动图片
    })
  },
  methods: {
    // 确认裁剪头像
    onConfirm() {
      this.$toast.loading({
        message: '裁剪中...',
        forbidClick: true
      })
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          fm.append('photo', blob)
          // console.log(fm)
          const { data } = await uploadPhoto(fm)
          console.log(data)
          this.$toast('上传头像成功')
          this.$emit('cancel')
          this.$emit('update', data.data.photo)
        } catch (err) {
          this.$toast('上传头像失败')
        }
      })
    },
    // 取消裁剪头像
    cancelUpdatePhoto() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="less">
.avatar {
  background: #000;
  width: 100%;
  height: 100%;
  img {
    display: block;
    max-width: 100%;
  }
  .foot {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
