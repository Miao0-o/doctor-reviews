<template>
  <view class="page">
    <!-- Search -->
    <view class="search-wrap">
      <c-SearchBar @tap="onSearchTap" />
    </view>

    <!-- Department Tags -->
    <scroll-view class="dept-scroll" scroll-x show-scrollbar="false">
      <view class="dept-tags">
        <c-TagPill
          v-for="dept in departments"
          :key="dept.id"
          :label="dept.name"
          :active="activeDept === dept.id"
          tappable
          @tap="onDeptTap(dept.id)"
        />
      </view>
    </scroll-view>

    <!-- TOP Rankings -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">口碑TOP医生榜单</text>
        <text class="section-more" @tap="switchTab('/pages/rankings/rankings')">查看全部 ›</text>
      </view>
      <scroll-view class="top-scroll" scroll-x show-scrollbar="false">
        <view
          v-for="(doctor, index) in topDoctors"
          :key="doctor.id"
          class="top-card"
          @tap="goDetail(doctor.id)"
        >
          <view class="top-rank">TOP{{ index + 1 }}</view>
          <view class="top-avatar">
            <text class="top-avatar-text">{{ doctor.name[0] }}</text>
          </view>
          <text class="top-name">{{ doctor.name }}</text>
          <text class="top-dept">{{ getDeptName(doctor.departmentId) }}</text>
          <c-StarRating :modelValue="Math.round(doctor.rating)" :size="22" />
        </view>
      </scroll-view>
    </view>

    <!-- High-Rated Doctors -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">高分人气医生推荐</text>
      </view>
      <c-DoctorCard
        v-for="doctor in highRatedDoctors"
        :key="doctor.id"
        :doctor="doctor"
        @tap="goDetail(doctor.id)"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import departments from '@/data/departments.json'
import doctors from '@/data/doctors.json'
import rankings from '@/data/rankings.json'
import { addHistory } from '@/utils/storage.js'

const activeDept = ref('')

const topDoctorIds = rankings[0].doctorIds.slice(0, 6)
const topDoctors = computed(() =>
  topDoctorIds.map(id => doctors.find(d => d.id === id)).filter(Boolean)
)

const highRatedDoctors = computed(() =>
  [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 8)
)

function getDeptName(deptId) {
  return departments.find(d => d.id === deptId)?.name || ''
}

function onDeptTap(deptId) {
  activeDept.value = deptId
  uni.navigateTo({ url: `/pages/doctor-list/doctor-list?deptId=${deptId}` })
}

function goDetail(doctorId) {
  addHistory(doctorId)
  uni.navigateTo({ url: `/pages/doctor-detail/doctor-detail?id=${doctorId}` })
}

function onSearchTap() {
  uni.navigateTo({ url: '/pages/doctor-list/doctor-list' })
}

function switchTab(url) {
  uni.switchTab({ url })
}
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 32rpx;
  background-color: $bg-page;
  min-height: 100vh;
}
.search-wrap {
  padding: 20rpx 32rpx;
}
.dept-scroll {
  white-space: nowrap;
  padding: 0 32rpx 16rpx;
}
.dept-tags {
  display: inline-flex;
  gap: 12rpx;
}
.section {
  margin-top: 24rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx 16rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.section-more {
  font-size: $font-sm;
  color: $primary;
}
.top-scroll {
  white-space: nowrap;
  padding-left: 32rpx;
}
.top-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
  padding: 24rpx 16rpx;
  margin-right: 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.top-rank {
  font-size: $font-xs;
  color: $accent;
  font-weight: 700;
  margin-bottom: 8rpx;
  background-color: $accent-light;
  padding: 2rpx 12rpx;
  border-radius: $radius-sm;
}
.top-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light2, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}
.top-avatar-text {
  font-size: 32rpx;
  color: $primary;
  font-weight: 700;
}
.top-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
}
.top-dept {
  font-size: $font-xs;
  color: $text-secondary;
  margin-bottom: 8rpx;
}
</style>
