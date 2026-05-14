<template>
  <scroll-view class="page" scroll-y>
    <view v-for="rank in rankings" :key="rank.id" class="rank-section">
      <text class="rank-title">{{ rank.category }}</text>
      <view v-for="(doctor, index) in getRankedDoctors(rank)" :key="doctor.id">
        <view class="rank-item" @tap="goDetail(doctor.id)">
          <view class="rank-num" :class="{ 'top3': index < 3 }">
            {{ index + 1 }}
          </view>
          <view class="rank-avatar">
            <text class="rank-avatar-text">{{ doctor.name[0] }}</text>
          </view>
          <view class="rank-info">
            <text class="rank-name">{{ doctor.name }}</text>
            <text class="rank-desc">{{ doctor.title }} · {{ doctor.hospital }}</text>
          </view>
          <view class="rank-rating">
            <text class="rank-score">{{ doctor.rating }}</text>
            <text class="rank-label">分</text>
          </view>
        </view>
        <view class="rank-divider" v-if="index < rank.doctorIds.length - 1" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import rankings from '@/data/rankings.json'
import doctors from '@/data/doctors.json'
import { addHistory } from '@/utils/storage.js'

function getRankedDoctors(rank) {
  return rank.doctorIds.map(id => doctors.find(d => d.id === id)).filter(Boolean)
}

function goDetail(doctorId) {
  addHistory(doctorId)
  uni.navigateTo({ url: `/pages/doctor-detail/doctor-detail?id=${doctorId}` })
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx 0;
  background-color: $bg-page;
  min-height: 100vh;
}
.rank-section {
  margin: 0 32rpx 32rpx;
}
.rank-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 20rpx;
}
.rank-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}
.rank-num {
  width: 48rpx;
  height: 48rpx;
  text-align: center;
  line-height: 48rpx;
  font-size: $font-body;
  font-weight: 700;
  color: $text-secondary;
  &.top3 {
    color: $accent;
    font-size: 34rpx;
  }
}
.rank-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light2, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20rpx;
}
.rank-avatar-text {
  font-size: 28rpx;
  color: $primary;
  font-weight: 700;
}
.rank-info {
  flex: 1;
  min-width: 0;
}
.rank-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
  display: block;
}
.rank-desc {
  font-size: $font-xs;
  color: $text-secondary;
}
.rank-rating {
  display: flex;
  align-items: baseline;
}
.rank-score {
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}
.rank-label {
  font-size: $font-xs;
  color: $text-secondary;
  margin-left: 4rpx;
}
.rank-divider {
  height: 1rpx;
  background-color: $divider;
  margin-left: 48rpx;
}
</style>
