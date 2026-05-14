<template>
  <view class="page">
    <!-- Star Rating -->
    <view class="section">
      <text class="section-label">为 {{ doctorName }} 打分</text>
      <c-StarRating
        v-model="rating"
        :size="48"
        :gap="12"
        interactive
      />
    </view>

    <!-- Quick Tags -->
    <view class="section">
      <text class="section-label">快捷标签（可多选）</text>
      <view class="quick-tags">
        <c-TagPill
          v-for="tag in quickTags"
          :key="tag"
          :label="tag"
          :active="selectedTags.includes(tag)"
          tappable
          @tap="toggleTag(tag)"
        />
      </view>
    </view>

    <!-- Text Area -->
    <view class="section">
      <text class="section-label">评价内容</text>
      <textarea
        class="review-textarea"
        v-model="content"
        placeholder="分享你的真实感受即可"
        placeholder-style="color: #C0C8C4;"
        :maxlength="500"
        auto-height
      />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <!-- Submit -->
    <view class="submit-wrap">
      <view class="btn-submit" @tap="submitReview">提交评价</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addUserReview } from '@/utils/storage.js'

const doctorId = ref('')
const doctorName = ref('')
const rating = ref(0)
const selectedTags = ref([])
const content = ref('')

const quickTags = ['耐心亲和', '专业靠谱', '沟通顺畅', '讲解清晰', '等待较久', '环境舒适']

onLoad((options) => {
  doctorId.value = options?.doctorId || ''
  doctorName.value = options?.doctorName || '医生'
  if (doctorName.value) {
    uni.setNavigationBarTitle({ title: '给' + doctorName.value + '写口碑评价' })
  }
})

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function submitReview() {
  if (rating.value === 0) {
    uni.showToast({ title: '请先打分', icon: 'none' })
    return
  }
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入评价内容', icon: 'none' })
    return
  }
  addUserReview({
    doctorId: doctorId.value,
    userName: '匿名用户',
    rating: rating.value,
    content: content.value,
    emotionTags: selectedTags.value,
    sentiment: rating.value >= 4 ? 'positive' : rating.value >= 3 ? 'neutral' : 'negative'
  })
  uni.showToast({ title: '评价提交成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<style lang="scss" scoped>
.page {
  padding: 32rpx;
  background-color: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.section {
  margin-bottom: 40rpx;
}
.section-label {
  display: block;
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20rpx;
}
.quick-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}
.review-textarea {
  width: 100%;
  min-height: 280rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  padding: 24rpx;
  font-size: $font-body;
  color: $text-primary;
  line-height: 1.7;
  box-sizing: border-box;
}
.char-count {
  text-align: right;
  font-size: $font-xs;
  color: $text-secondary;
  margin-top: 8rpx;
}
.submit-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: $bg-card;
  border-top: 1rpx solid $divider;
}
.btn-submit {
  width: 100%;
  height: $btn-height;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  background-color: $primary;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}
.btn-submit:active {
  opacity: 0.85;
}
</style>
