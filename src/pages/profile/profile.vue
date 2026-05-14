<template>
  <view class="page">
    <!-- Profile Header -->
    <view class="profile-header">
      <view class="profile-avatar">
        <text class="profile-avatar-icon">👤</text>
      </view>
      <text class="profile-name">用户昵称</text>
      <text class="profile-bio">这个人很懒，什么都没写</text>
      <view class="profile-stats">
        <view class="stat-item">
          <text class="stat-num">{{ favorites.length }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userReviews.length }}</text>
          <text class="stat-label">评价</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ history.length }}</text>
          <text class="stat-label">浏览</text>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="menu-list">
      <view class="menu-item" @tap="goFavorites">
        <text class="menu-icon">★</text>
        <text class="menu-label">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item" @tap="goMyReviews">
        <text class="menu-icon">✎</text>
        <text class="menu-label">我的评价</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item" @tap="goHistory">
        <text class="menu-icon">⌛</text>
        <text class="menu-label">浏览记录</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item">
        <text class="menu-icon">⚙</text>
        <text class="menu-label">账号设置</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item">
        <text class="menu-icon">💬</text>
        <text class="menu-label">帮助反馈</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getFavorites, getUserReviews, getHistory } from '@/utils/storage.js'

const favorites = ref(getFavorites())
const userReviews = ref(getUserReviews())
const history = ref(getHistory())

function goFavorites() {
  const ids = favorites.value.join(',')
  uni.navigateTo({ url: `/pages/doctor-list/doctor-list?favIds=${ids}` })
}

function goMyReviews() {
  uni.showToast({ title: '我的评价（开发中）', icon: 'none' })
}

function goHistory() {
  uni.showToast({ title: '浏览记录（开发中）', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
}
.profile-header {
  background: linear-gradient(180deg, $primary-light 0%, #fff 100%);
  padding: 48rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: $primary-light2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}
.profile-avatar-icon {
  font-size: 56rpx;
}
.profile-name {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
}
.profile-bio {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 8rpx;
}
.profile-stats {
  display: flex;
  gap: 60rpx;
  margin-top: 28rpx;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}
.stat-label {
  font-size: $font-xs;
  color: $text-secondary;
  margin-top: 4rpx;
}
.menu-list {
  margin: 24rpx 32rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx;
  cursor: pointer;
}
.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}
.menu-label {
  flex: 1;
  font-size: $font-body;
  color: $text-primary;
}
.menu-arrow {
  font-size: 36rpx;
  color: $text-secondary;
}
.menu-divider {
  height: 1rpx;
  background-color: $divider;
  margin-left: 80rpx;
}
</style>
