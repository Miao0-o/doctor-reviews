<template>
  <scroll-view class="page" scroll-y v-if="doctor">
    <!-- Profile Header -->
    <view class="header">
      <view class="header-avatar">
        <text class="header-avatar-text">{{ doctor.name[0] }}</text>
      </view>
      <text class="header-name">{{ doctor.name }}</text>
      <text class="header-sub">{{ doctor.title }} · {{ doctor.hospital }}</text>
      <text class="header-bio">{{ doctor.bio }}</text>
    </view>

    <!-- Overall Rating -->
    <view class="rating-section">
      <view class="overall-rating">
        <text class="overall-num">{{ doctor.rating }}</text>
        <text class="overall-label">综合评分</text>
      </view>
      <view class="sub-ratings">
        <c-RatingBar label="医术印象" :value="doctor.subRatings.skill" />
        <c-RatingBar label="耐心程度" :value="doctor.subRatings.patience" />
        <c-RatingBar label="沟通感受" :value="doctor.subRatings.communication" />
      </view>
    </view>

    <!-- Skill Tags -->
    <view class="tags-section" v-if="doctor.tags && doctor.tags.length">
      <text class="block-title">擅长领域</text>
      <view class="tags-wrap">
        <c-TagPill v-for="tag in doctor.tags" :key="tag" :label="tag" />
      </view>
    </view>

    <!-- Reviews -->
    <view class="reviews-section">
      <text class="block-title">用户真实点评</text>
      <c-FilterBar
        :options="reviewFilters"
        v-model="reviewFilter"
      />
      <c-ReviewCard
        v-for="review in filteredReviews"
        :key="review.id"
        :review="review"
      />
      <view v-if="filteredReviews.length === 0" class="empty-text">
        暂无评价
      </view>
    </view>

    <!-- Bottom Buttons -->
    <view class="bottom-bar">
      <view class="btn-fav" :class="{ faved: isFaved }" @tap="toggleFav">
        <text>{{ isFaved ? '★ 已收藏' : '☆ 收藏医生' }}</text>
      </view>
      <view class="btn-review" @tap="goWriteReview">
        <text>✎ 写点评</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import doctors from '@/data/doctors.json'
import reviews from '@/data/reviews.json'
import { isFavorite, addFavorite, removeFavorite, getUserReviews } from '@/utils/storage.js'

const doctor = ref(null)
const isFaved = ref(false)
const reviewFilter = ref('all')

const reviewFilters = [
  { label: '全部', value: 'all' },
  { label: '好评', value: 'positive' },
  { label: '中评', value: 'neutral' },
  { label: '差评', value: 'negative' }
]

onLoad((options) => {
  const id = options?.id
  doctor.value = doctors.find(d => d.id === id)
  if (doctor.value) {
    isFaved.value = isFavorite(id)
    uni.setNavigationBarTitle({ title: doctor.value.name })
  }
})

const allReviews = computed(() => {
  if (!doctor.value) return []
  const staticReviews = reviews.filter(r => r.doctorId === doctor.value.id)
  const userReviews = getUserReviews().filter(r => r.doctorId === doctor.value.id)
  return [...userReviews, ...staticReviews]
})

const filteredReviews = computed(() => {
  if (reviewFilter.value === 'all') return allReviews.value
  return allReviews.value.filter(r => r.sentiment === reviewFilter.value)
})

function toggleFav() {
  if (!doctor.value) return
  if (isFaved.value) {
    removeFavorite(doctor.value.id)
  } else {
    addFavorite(doctor.value.id)
  }
  isFaved.value = !isFaved.value
}

function goWriteReview() {
  if (!doctor.value) return
  uni.navigateTo({ url: `/pages/write-review/write-review?doctorId=${doctor.value.id}&doctorName=${doctor.value.name}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.header {
  background: linear-gradient(180deg, $primary-light 0%, $bg-card 100%);
  padding: 48rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}
.header-avatar-text {
  font-size: 60rpx;
  color: #fff;
  font-weight: 700;
}
.header-name {
  font-size: 44rpx;
  font-weight: 700;
  color: $text-primary;
}
.header-sub {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 8rpx;
}
.header-bio {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 16rpx;
  text-align: center;
  line-height: 1.5;
  padding: 0 16rpx;
}
.rating-section {
  background-color: $bg-card;
  margin: 24rpx 32rpx;
  padding: 32rpx;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  display: flex;
  gap: 32rpx;
}
.overall-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
}
.overall-num {
  font-size: 72rpx;
  font-weight: 700;
  color: $primary;
  line-height: 1;
}
.overall-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 8rpx;
}
.sub-ratings {
  flex: 1;
}
.tags-section {
  margin: 0 32rpx 24rpx;
}
.block-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 16rpx;
}
.tags-wrap {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}
.reviews-section {
  margin-top: 8rpx;
  padding: 0 0 16rpx;
}
.empty-text {
  text-align: center;
  padding: 48rpx;
  color: $text-secondary;
  font-size: $font-sm;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: $bg-card;
  border-top: 1rpx solid $divider;
}
.btn-fav {
  flex: 1;
  height: $btn-height;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  border: 2rpx solid $primary;
  color: $primary;
  font-size: $font-body;
  font-weight: 600;
  &.faved {
    background-color: $primary-light;
    border-color: $primary;
  }
}
.btn-review {
  flex: 1.5;
  height: $btn-height;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  background-color: $primary;
  color: #fff;
  font-size: $font-body;
  font-weight: 600;
}
</style>
