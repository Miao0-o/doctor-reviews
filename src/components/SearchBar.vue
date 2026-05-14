<template>
  <view class="search-bar" @tap="$emit('tap')">
    <text class="search-icon">🔍</text>
    <text class="placeholder">{{ placeholder }}</text>
  </view>
</template>

<script setup>
defineProps({
  placeholder: { type: String, default: '搜索疾病/医院/科室' }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 72rpx;
  background-color: $bg-card;
  border: 2rpx solid $primary-light2;
  border-radius: $radius-round;
  padding: 0 28rpx;
}
.search-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}
.placeholder {
  color: $text-secondary;
  font-size: $font-body;
}
</style>
