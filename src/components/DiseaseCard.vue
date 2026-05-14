<template>
  <view class="disease-card" @tap="$emit('tap')">
    <view class="card-header">
      <text class="disease-icon">{{ disease.icon }}</text>
      <text class="disease-name">{{ disease.name }}</text>
    </view>
    <view class="hospital-list">
      <text class="list-label">口碑TOP3医院</text>
      <view class="hospital-row" v-for="(h, index) in topHospitals" :key="h.hospitalId">
        <view class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</view>
        <text class="hospital-name">{{ h.hospitalName }}</text>
        <text class="hospital-score">{{ h.reputationScore }}分</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import hospitals from '@/data/hospitals.json'

const props = defineProps({
  disease: { type: Object, required: true }
})
defineEmits(['tap'])

const topHospitals = computed(() => {
  return props.disease.topHospitals.map(h => {
    const hospital = hospitals.find(hosp => hosp.id === h.hospitalId)
    return {
      ...h,
      hospitalName: hospital ? hospital.name : ''
    }
  })
})
</script>

<style lang="scss" scoped>
.disease-card {
  background: linear-gradient(160deg, $primary-light 0%, $bg-card 60%);
  border-radius: $radius-md;
  padding: 28rpx;
  box-shadow: $shadow-card;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.disease-icon { font-size: 44rpx; }
.disease-name {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.list-label {
  font-size: $font-xs;
  color: $text-secondary;
  margin-bottom: 12rpx;
  display: block;
}
.hospital-row {
  display: flex;
  align-items: center;
  padding: 8rpx 0;
  gap: 10rpx;
}
.rank-badge {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  text-align: center;
  line-height: 36rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #fff;
  background-color: $text-secondary;
  &.rank-1 { background-color: #D4943A; }
  &.rank-2 { background-color: #8B9DAF; }
  &.rank-3 { background-color: #A0846B; }
}
.hospital-name {
  flex: 1;
  font-size: $font-sm;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hospital-score {
  font-size: $font-sm;
  font-weight: 700;
  color: $primary;
}
</style>
