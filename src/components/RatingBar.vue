<template>
  <view class="rating-bar">
    <text class="label">{{ label }}</text>
    <view class="bar-wrap">
      <view class="bar" :style="{ width: percent + '%' }"></view>
    </view>
    <text class="value">{{ value.toFixed(1) }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, default: 0 },
  max: { type: Number, default: 5 }
})

const percent = computed(() => (props.value / props.max) * 100)
</script>

<style lang="scss" scoped>
.rating-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 8rpx 0;
}
.label {
  width: 120rpx;
  font-size: $font-sm;
  color: $text-secondary;
  text-align: right;
}
.bar-wrap {
  flex: 1;
  height: 12rpx;
  background-color: $divider;
  border-radius: 6rpx;
  overflow: hidden;
}
.bar {
  height: 100%;
  background-color: $primary;
  border-radius: 6rpx;
  transition: width 0.3s;
}
.value {
  width: 48rpx;
  font-size: $font-sm;
  color: $primary;
  font-weight: 600;
}
</style>
