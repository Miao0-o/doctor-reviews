<template>
  <view class="page">
    <view class="grid">
      <view
        v-for="dept in departments"
        :key="dept.id"
        class="dept-card"
        @tap="goDept(dept.id)"
      >
        <text class="dept-icon">{{ dept.icon }}</text>
        <text class="dept-name">{{ dept.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import departments from '@/data/departments.json'

function goDept(deptId) {
  uni.navigateTo({ url: `/pages/doctor-list/doctor-list?deptId=${deptId}` })
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx;
  background-color: $bg-page;
  min-height: 100vh;
}
.grid {
  display: flex;
  flex-wrap: wrap;
}
.dept-card {
  width: calc(25% - 18rpx);
  margin: 0 24rpx 24rpx 0;
  padding: 28rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  &:nth-child(4n) {
    margin-right: 0;
  }
}
.dept-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}
.dept-name {
  font-size: $font-sm;
  color: $text-primary;
  font-weight: 500;
}
</style>
