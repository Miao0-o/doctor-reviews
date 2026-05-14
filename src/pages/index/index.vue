<template>
  <scroll-view class="page" scroll-y>
    <!-- Location + Search -->
    <view class="top-bar">
      <view class="location">
        <text class="location-icon">📍</text>
        <text class="location-text">北京</text>
        <text class="location-arrow">▾</text>
      </view>
      <view class="search-wrap">
        <c-SearchBar placeholder="搜索疾病/医院/科室" @tap="onSearchTap" />
      </view>
    </view>

    <!-- Disease Grid -->
    <view class="disease-grid">
      <view class="grid-title">
        <text class="title-text">按疾病查找医院口碑</text>
        <text class="title-sub">点击疾病查看该领域医院排名</text>
      </view>
      <view class="grid-2col">
        <c-DiseaseCard
          v-for="disease in diseases"
          :key="disease.id"
          :disease="disease"
          class="grid-item"
          @tap="goDisease(disease.id)"
        />
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import diseases from '@/data/diseases.json'

function onSearchTap() {
  uni.navigateTo({ url: '/pages/doctor-list/doctor-list' })
}

function goDisease(diseaseId) {
  uni.navigateTo({ url: `/pages/hospital-ranking/hospital-ranking?diseaseId=${diseaseId}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
}
.top-bar {
  background-color: $bg-card;
  padding: 16rpx 32rpx 24rpx;
}
.location {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.location-icon { font-size: 28rpx; margin-right: 6rpx; }
.location-text {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.location-arrow {
  font-size: 24rpx;
  color: $text-secondary;
  margin-left: 4rpx;
}
.search-wrap {
  flex: 1;
}
.disease-grid {
  padding: 24rpx 24rpx 48rpx;
}
.grid-title {
  padding: 8rpx 8rpx 20rpx;
}
.title-text {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.title-sub {
  display: block;
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 4rpx;
}
.grid-2col {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.grid-item {
  width: calc(50% - 8rpx);
}
</style>
