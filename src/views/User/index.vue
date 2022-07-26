<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      class="navbar"
      @click-left="backToPrePage"
    >
    </van-nav-bar>
    <!-- 内容 -->
    <main>
      <input type="file" ref="file" hidden />
      <van-cell title="头像" is-link @click="$refs.file.click()"
        ><van-image round width=".8rem" height=".8rem" :src="myInfo.photo"
      /></van-cell>
      <van-cell title="昵称" is-link :value="myInfo.name" @click="editName" />
      <van-cell
        title="性别"
        is-link
        :value="{ 0: '男', 1: '女' }[myInfo.gender]"
        @click="showPickGender = true"
      />
      <van-cell
        title="生日"
        is-link
        :value="myInfo.birthday"
        @click="showPickBirthday = true"
      />
    </main>
    <!-- 修改头像弹出层 -->
    <van-popup
      v-model="showUpdatePhoto"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdatePhoto
        v-if="showUpdatePhoto"
        :photo="photo"
        @cancel="showUpdatePhoto = false"
        @update="myInfo.photo = $event"
      ></UpdatePhoto>
    </van-popup>
    <!-- 编辑昵称弹出层 -->
    <van-popup
      class="popup-navbar"
      v-model="showEditName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 头部 -->
      <van-nav-bar
        class="popup-navbar"
        title="更新昵称"
        left-text="取消"
        right-text="保存"
        @click-left="cancelEditName"
        @click-right="saveEditName"
      ></van-nav-bar>
      <!-- 文本编辑区域 -->
      <van-field
        class="editNameArea"
        v-model="nickname"
        placeholder="请输入新的昵称"
        type="textarea"
        maxlength="7"
        show-word-limit
      />
    </van-popup>
    <!-- 更新性别弹出层 -->
    <van-popup v-model="showPickGender" position="bottom">
      <van-picker
        show-toolbar
        title="更新性别"
        :columns="columns"
        :default-index="myInfo.gender"
        @cancel="showPickGender = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 修改生日弹出层 -->
    <van-popup v-model="showPickBirthday" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showPickBirthday = false"
        @confirm="onConfirmBirth"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { getMyInformation, EditUserInfo } from '@/api'
import UpdatePhoto from './component/UpdatePhoto.vue'
export default {
  data() {
    return {
      myInfo: {},
      showEditName: false,
      showPickGender: false,
      showPickBirthday: false,
      columns: ['男', '女'],
      nickname: '',
      minDate: new Date(1936, 0, 1),
      maxDate: new Date(2030, 1, 1),
      currentDate: '',
      photo: null,
      showUpdatePhoto: false
    }
  },
  mounted(e) {
    this.$refs.file.addEventListener('change', (e) => {
      //   console.log(e.target.files)
      let file = e.target.files[0]
      file = URL.createObjectURL(file)
      console.log(file)
      this.photo = file
      this.showUpdatePhoto = true
      e.target.value = ''
    })
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    // 获取用户个人资料
    async getMyInformation() {
      try {
        const res = await getMyInformation()
        //   console.log(res)
        this.myInfo = res.data.data
        console.log(this.myInfo)
        this.nickname = this.myInfo.name
        this.currentDate = new Date(this.myInfo.birthday)
      } catch (err) {
        this.$toast('获取用户信息失败，请刷新重试')
      }
    },
    // 编辑昵称
    editName() {
      this.showEditName = true
      this.nickname = this.myInfo.name
    },
    // 取消修改昵称
    cancelEditName() {
      this.showEditName = false
    },
    // 保存修改昵称
    async saveEditName() {
      if (this.nickname.trim() !== '') {
        try {
          const res = await EditUserInfo({ name: this.nickname })
          console.log(res)
          this.getMyInformation()
          this.$toast.success('更新成功')
          this.showEditName = false
        } catch (err) {
          this.$toast.fail('更新失败')
        }
      } else {
        this.$toast('请填写昵称')
      }
    },
    // 保存修改性别
    async onConfirm(value) {
      try {
        // console.log(value)
        const index = this.columns.findIndex((item) => item === value)
        // console.log(index)
        const res = await EditUserInfo({ gender: index })
        console.log(res)
        this.getMyInformation()
        this.$toast.success('更新成功')
        this.showPickGender = false
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
    // 保存修改生日
    async onConfirmBirth(value) {
      try {
        //   console.log(value)
        const birthdayDate = dayjs(value).format('YYYY-MM-DD')
        //   console.log(birthdayDate)
        const res = await EditUserInfo({ birthday: birthdayDate })
        console.log(res)
        this.getMyInformation()
        this.$toast.success('更新成功')
        this.showPickBirthday = false
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
    // 取消修改头像
    // cancelUpdate() {
    //   this.showUpdatePhoto = false
    // },
    // 更新编辑资料页面
    // updateUserInfo() {
    //   this.getMyInformation()
    // }
  },
  components: {
    UpdatePhoto
  },
  created() {
    this.getMyInformation()
    console.log(this.$event)
  }
}
</script>

<style scoped lang="less">
// 头部
.navbar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  :deep(.van-icon) {
    color: #fff;
  }
}
// 主体
main {
  margin-top: 100px;
}
// 弹出层头部
:deep(.popup-navbar) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
}
:deep(.editNameArea) {
  background-color: #fff;
  margin-top: 92px;
}
</style>
