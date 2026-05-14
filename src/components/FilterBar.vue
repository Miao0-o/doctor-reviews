<template>
  <view class="filter-bar">
    <view
      v-for="item in options"
      :key="item.value"
      class="filter-item"
      :class="{ active: modelValue === item.value }"
      @tap="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script setup>
defineProps({
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 32rpx;
  background-color: $bg-card;
}
.filter-item {
  padding: 10rpx 24rpx;
  border-radius: $radius-round;
  font-size: $font-sm;
  color: $text-secondary;
  background-color: $bg-page;
  cursor: pointer;
  &.active {
    color: $primary;
    background-color: $primary-light;
    font-weight: 600;
  }
}
</style>
