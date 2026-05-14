<template>
  <view class="review-card">
    <view class="review-header">
      <view class="reviewer-info">
        <view class="reviewer-avatar">
          <text class="avatar-icon">👤</text>
        </view>
        <view>
          <text class="reviewer-name">{{ review.userName }}</text>
          <text class="review-date">{{ review.date }}</text>
        </view>
      </view>
      <c-StarRating :modelValue="review.rating" :size="24" />
    </view>
    <text class="review-content">{{ review.content }}</text>
    <view class="emotion-tags" v-if="review.emotionTags && review.emotionTags.length">
      <c-TagPill v-for="tag in review.emotionTags" :key="tag" :label="tag" />
    </view>
  </view>
</template>

<script setup>
defineProps({
  review: { type: Object, required: true }
})
</script>

<style lang="scss" scoped>
.review-card {
  padding: 28rpx;
  margin: 0 32rpx 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}
.reviewer-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.reviewer-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: $bg-page;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-icon { font-size: 28rpx; }
.reviewer-name {
  display: block;
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
}
.review-date {
  font-size: $font-xs;
  color: $text-secondary;
}
.review-content {
  font-size: $font-body;
  color: $text-primary;
  line-height: 1.7;
}
.emotion-tags {
  display: flex;
  gap: 8rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}
</style>
