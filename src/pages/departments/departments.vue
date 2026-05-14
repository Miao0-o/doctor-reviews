<template>
  <scroll-view class="page" scroll-y>
    <view class="search-wrap">
      <c-SearchBar placeholder="搜索医院名称" @tap="onSearchTap" />
    </view>
    <view class="section-title">
      <text>北京三甲医院</text>
      <text class="count">{{ hospitals.length }}家</text>
    </view>
    <view class="hospital-list">
      <view
        v-for="hospital in hospitals"
        :key="hospital.id"
        class="hospital-item"
        @tap="goHospital(hospital.id)"
      >
        <view class="h-info">
          <text class="h-name">{{ hospital.name }}</text>
          <view class="h-tags">
            <text class="h-level">{{ hospital.level }}</text>
            <text class="h-type">{{ hospital.type }}</text>
          </view>
        </view>
        <view class="h-score">
          <text class="score-num">{{ hospital.overallScore }}</text>
          <text class="score-label">分</text>
        </view>
        <text class="h-arrow">›</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import hospitals from '@/data/hospitals.json'

function onSearchTap() {
  // search not implemented yet
}

function goHospital(hospitalId) {
  uni.navigateTo({ url: `/pages/hospital-department/hospital-department?hospitalId=${hospitalId}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
}
.search-wrap {
  padding: 20rpx 32rpx;
  background-color: $bg-card;
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx 12rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.count {
  font-size: $font-sm;
  color: $text-secondary;
  font-weight: 400;
}
.hospital-list {
  margin: 0 32rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.hospital-item {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid $divider;
  &:last-child { border-bottom: none; }
}
.h-info { flex: 1; min-width: 0; }
.h-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 6rpx;
}
.h-tags { display: flex; gap: 8rpx; }
.h-level {
  font-size: $font-xs;
  color: $primary;
  background-color: $primary-light;
  padding: 2rpx 8rpx;
  border-radius: $radius-sm;
}
.h-type {
  font-size: $font-xs;
  color: $text-secondary;
  background-color: $bg-page;
  padding: 2rpx 8rpx;
  border-radius: $radius-sm;
}
.h-score {
  display: flex;
  align-items: baseline;
  margin: 0 12rpx;
}
.score-num {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}
.score-label {
  font-size: $font-xs;
  color: $text-secondary;
}
.h-arrow {
  font-size: 36rpx;
  color: $text-secondary;
}
</style>
