<template>
  <view
    class="tag-pill"
    :class="{ 'tag-active': active, 'tag-tappable': tappable }"
    @tap="tappable && $emit('tap')"
  >
    {{ label }}
  </view>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  tappable: { type: Boolean, default: false }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.tag-pill {
  display: inline-block;
  padding: 8rpx 20rpx;
  border-radius: $radius-sm;
  font-size: $font-sm;
  color: $text-secondary;
  background-color: $bg-card;
  border: 1rpx solid $divider;
  white-space: nowrap;
  &.tag-active {
    color: #fff;
    background-color: $primary;
    border-color: $primary;
  }
  &.tag-tappable {
    cursor: pointer;
  }
}
</style>
