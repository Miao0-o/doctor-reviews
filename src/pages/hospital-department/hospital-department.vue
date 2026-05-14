<template>
  <scroll-view class="page" scroll-y v-if="hospital">
    <view class="hospital-header">
      <text class="hospital-name">{{ hospital.name }}</text>
      <view class="hospital-tags">
        <text class="h-tag">{{ hospital.level }}</text>
        <text class="h-tag type-tag">{{ hospital.type }}</text>
      </view>
    </view>
    <view class="dept-list">
      <view
        v-for="dept in departments"
        :key="dept.id"
        class="dept-item"
        @tap="goDoctors(dept)"
      >
        <view class="dept-info">
          <text class="dept-name">{{ dept.departmentName }}</text>
          <view class="dept-badges">
            <c-RankingBadge
              :badge="dept.badge"
              :isNationalKey="dept.isNationalKey"
              :isCityKey="dept.isCityKey"
            />
          </view>
        </view>
        <text class="dept-arrow">›</text>
      </view>
    </view>
    <view v-if="departments.length === 0" class="empty">
      <text>暂无科室数据</text>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import hospitals from '@/data/hospitals.json'
import hospitalDepartments from '@/data/hospital-departments.json'

const hospital = ref(null)
const departments = ref([])

onLoad((options) => {
  const hospitalId = options?.hospitalId
  hospital.value = hospitals.find(h => h.id === hospitalId) || null
  if (hospital.value) {
    uni.setNavigationBarTitle({ title: hospital.value.name })
    const hd = hospitalDepartments.find(h => h.hospitalId === hospitalId)
    departments.value = hd ? hd.departments : []
  }
})

function goDoctors(dept) {
  if (!hospital.value) return
  uni.navigateTo({
    url: `/pages/doctor-list/doctor-list?hospitalId=${hospital.value.id}&departmentId=${dept.id}`
  })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
}
.hospital-header {
  background-color: $bg-card;
  padding: 32rpx;
  margin-bottom: 16rpx;
}
.hospital-name {
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 12rpx;
}
.hospital-tags {
  display: flex;
  gap: 10rpx;
}
.h-tag {
  font-size: $font-xs;
  padding: 4rpx 12rpx;
  border-radius: $radius-sm;
  color: $primary;
  background-color: $primary-light;
  &.type-tag {
    color: $text-secondary;
    background-color: $bg-page;
  }
}
.dept-list {
  margin: 0 32rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.dept-item {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid $divider;
  &:last-child { border-bottom: none; }
}
.dept-info {
  flex: 1;
  min-width: 0;
}
.dept-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
}
.dept-badges {
  display: flex;
  flex-wrap: wrap;
  margin-top: 4rpx;
}
.dept-arrow {
  font-size: 36rpx;
  color: $text-secondary;
  margin-left: 16rpx;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: $text-secondary;
}
</style>
