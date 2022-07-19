<template>
  <div>
    <van-popup
      v-model="show"
      position="right"
      :style="{ width: '100%', height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="popupMain">
        <!-- 我的频道 -->
        <div class="my-channel">
          <!-- 我的频道标题 -->
          <van-cell title="我的频道">
            <van-button
              size="small"
              round
              class="edit-btn"
              @click="isEdit = !isEdit"
              >{{ isEdit ? '完成' : '编辑' }}</van-button
            >
          </van-cell>
          <!-- 我的频道 -->
          <!-- :class="{添加的类名：boolean}" -->
          <van-grid :border="false" gutter="0.13rem">
            <van-grid-item
              v-for="(item, index) in myChannels"
              :key="item.id"
              :text="item.name"
              :class="{ 'active-channel': item.name === '推荐' }"
              @click="onClickMyChannel(item, index)"
            >
              <template #icon>
                <van-icon v-show="isEdit && item.name !== '推荐'" name="cross"
              /></template>
            </van-grid-item>
          </van-grid>
        </div>
        <!-- 推荐频道 -->
        <div class="recommend-channel">
          <!-- 推荐频道的标题 -->
          <van-cell title="推荐频道" />
          <!-- 推荐频道 -->
          <van-grid :border="false" gutter="0.13rem">
            <van-grid-item
              v-for="item in recommendChannels"
              :key="item.id"
              :text="item.name"
              icon="plus"
              @click="addMyChannel(item)"
            />
          </van-grid>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels } from '@/api'
export default {
  data() {
    return {
      show: false,
      allChannels: [],
      // 用于标记是否处于编辑状态
      isEdit: false
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created() {
    this.getAllChannels()
    // console.log(this.myChannels)
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter(
        (item) => !this.myChannels.find((i) => i.id === item.id)
      )
    }
  },
  // props什么时候不能修改?基本数据类型，完全不能修改
  // 复杂数据类型：Array, Object,vue也不建议修改, 但实际上可以修改
  // 一般修改通过父组件修改 传回来
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
      // console.log(this.allChannels)
    },
    onClickMyChannel(channel, index) {
      // 边缘情况判断
      if (this.isEdit && channel.name !== '推荐') {
        // 删除
        return this.$emit('del-myChannel', channel.id)
      }
      if (!this.isEdit) {
        this.show = false
        // 切换
        this.$emit('change-active', index)
      }
    },
    // 添加频道
    addMyChannel(myChannel) {
      this.$emit('add-mychannel', { ...myChannel })
    }
  }
}
</script>

<style scoped lang="less">
// 高亮频道
.active-channel {
  :deep(.van-grid-item__text) {
    color: red;
  }
}
.popupMain {
  padding-top: 100px;

  // 按钮的样式
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;
      background-color: #eee;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        .van-icon {
          font-size: 10px;
        }
        .van-icon-cross {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 0.32rem;
        }
      }
    }
    // /deep/ .van-icon-clear {
    //   position: absolute;
    //   right: -10px;
    //   top: -10px;
    //   font-size: 36px;
    //   color: #ccc;
    // }
  }
  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      align-items: center;
      flex-direction: row;
      background-color: #eee;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
