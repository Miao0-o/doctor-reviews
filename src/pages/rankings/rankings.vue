<template>
  <scroll-view class="page" scroll-y>
    <view v-for="rank in rankings" :key="rank.id" class="rank-section">
      <text class="rank-title">{{ rank.category }}</text>
      <view class="rank-list">
        <view
          v-for="(hospitalId, index) in rank.hospitalIds"
          :key="hospitalId"
        >
          <view class="rank-item" @tap="goHospital(hospitalId)">
            <view class="rank-num" :class="{ 'top3': index < 3 }">
              {{ index + 1 }}
            </view>
            <view class="rank-info">
              <text class="r-name">{{ getHospital(hospitalId).name }}</text>
              <view class="r-tags">
                <text class="r-level">{{ getHospital(hospitalId).level }}</text>
                <text class="r-type">{{ getHospital(hospitalId).type }}</text>
              </view>
            </view>
            <view class="r-score">
              <text class="r-score-num">{{ getHospital(hospitalId).overallScore }}</text>
              <text class="r-score-label">分</text>
            </view>
          </view>
          <view class="divider" v-if="index < rank.hospitalIds.length - 1" />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import rankings from '@/data/rankings.json'
import hospitals from '@/data/hospitals.json'

function getHospital(id) {
  return hospitals.find(h => h.id === id) || { name: '未知', level: '', type: '', overallScore: 0 }
}

function goHospital(hospitalId) {
  uni.navigateTo({ url: `/pages/hospital-department/hospital-department?hospitalId=${hospitalId}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
  padding: 24rpx 0;
}
.rank-section {
  margin: 0 32rpx 32rpx;
}
.rank-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 16rpx;
}
.rank-list {
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.rank-item {
  display: flex;
  align-items: center;
  padding: 22rpx 24rpx;
}
.rank-num {
  width: 52rpx;
  height: 52rpx;
  text-align: center;
  line-height: 52rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-secondary;
  &.top3 { color: $accent; font-size: 38rpx; }
}
.rank-info { flex: 1; margin: 0 16rpx; min-width: 0; }
.r-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
  display: block;
}
.r-tags { display: flex; gap: 6rpx; margin-top: 4rpx; }
.r-level {
  font-size: $font-xs;
  color: $primary;
  background-color: $primary-light;
  padding: 2rpx 8rpx;
  border-radius: $radius-sm;
}
.r-type {
  font-size: $font-xs;
  color: $text-secondary;
  background-color: $bg-page;
  padding: 2rpx 8rpx;
  border-radius: $radius-sm;
}
.r-score { display: flex; align-items: baseline; }
.r-score-num { font-size: 40rpx; font-weight: 700; color: $primary; }
.r-score-label { font-size: $font-xs; color: $text-secondary; margin-left: 4rpx; }
.divider { height: 1rpx; background-color: $divider; margin-left: 52rpx; }
</style>
