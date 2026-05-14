<template>
  <view class="hospital-card" @tap="$emit('tap')">
    <view class="rank-num" :class="{ 'top3': rank <= 3 }">{{ rank }}</view>
    <view class="card-body">
      <view class="name-row">
        <text class="hospital-name">{{ hospital.name }}</text>
        <text class="level-tag">{{ hospital.level }}</text>
        <text class="type-tag">{{ hospital.type }}</text>
      </view>
    </view>
    <view class="score-area">
      <text class="score-num">{{ score }}</text>
      <text class="score-label">分</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  hospital: { type: Object, required: true },
  rank: { type: Number, default: 1 },
  score: { type: Number, default: 0 }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.hospital-card {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  background-color: $bg-card;
}
.rank-num {
  width: 56rpx;
  height: 56rpx;
  text-align: center;
  line-height: 56rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-secondary;
  &.top3 {
    color: $accent;
    font-size: 40rpx;
  }
}
.card-body {
  flex: 1;
  margin: 0 20rpx;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-wrap: wrap;
}
.hospital-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
}
.level-tag {
  font-size: $font-xs;
  color: $primary;
  background-color: $primary-light;
  padding: 2rpx 8rpx;
  border-radius: $radius-sm;
}
.type-tag {
  font-size: $font-xs;
  color: $text-secondary;
  background-color: $bg-page;
  padding: 2rpx 8rpx;
  border-radius: $radius-sm;
}
.score-area {
  display: flex;
  align-items: baseline;
}
.score-num {
  font-size: 44rpx;
  font-weight: 700;
  color: $primary;
}
.score-label {
  font-size: $font-xs;
  color: $text-secondary;
  margin-left: 4rpx;
}
</style>
