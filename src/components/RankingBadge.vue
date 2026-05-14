<template>
  <text v-if="badge" class="ranking-badge" :class="badgeClass">{{ badge }}</text>
  <text v-if="isNationalKey" class="ranking-badge badge-national">国家重点</text>
  <text v-else-if="isCityKey" class="ranking-badge badge-city">市级重点</text>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  badge: { type: String, default: '' },
  isNationalKey: { type: Boolean, default: false },
  isCityKey: { type: Boolean, default: false }
})

const badgeClass = computed(() => {
  if (props.isNationalKey) return 'badge-national'
  if (props.isCityKey) return 'badge-city'
  return 'badge-rank'
})
</script>

<style lang="scss" scoped>
.ranking-badge {
  display: inline-block;
  padding: 2rpx 10rpx;
  border-radius: $radius-sm;
  font-size: $font-xs;
  font-weight: 600;
  margin-left: 8rpx;
  &.badge-rank {
    color: $accent;
    background-color: $accent-light;
  }
  &.badge-national {
    color: #fff;
    background-color: $primary;
  }
  &.badge-city {
    color: $primary;
    background-color: $primary-light;
    border: 1rpx solid $primary-light2;
  }
}
</style>
