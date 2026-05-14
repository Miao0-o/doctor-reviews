<template>
  <view class="star-rating" :style="{ gap: gap + 'rpx' }">
    <text
      v-for="i in max"
      :key="i"
      class="star"
      :class="{ filled: i <= modelValue, interactive: interactive }"
      :style="{ fontSize: size + 'rpx' }"
      @tap="interactive && $emit('update:modelValue', i)"
    >{{ i <= modelValue ? '★' : '☆' }}</text>
    <text v-if="showCount && count" class="count">({{ count }})</text>
  </view>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  size: { type: Number, default: 32 },
  gap: { type: Number, default: 4 },
  interactive: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  count: { type: Number, default: 0 }
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.star-rating {
  display: flex;
  align-items: center;
}
.star {
  color: #E0E5E2;
  line-height: 1;
  &.filled {
    color: $accent;
  }
  &.interactive {
    cursor: pointer;
  }
}
.count {
  color: $text-secondary;
  font-size: $font-sm;
  margin-left: 8rpx;
}
</style>
