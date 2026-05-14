<template>
  <view class="doctor-card" @tap="$emit('tap')">
    <view class="card-left">
      <view class="avatar">
        <text class="avatar-placeholder">{{ doctor.name[0] }}</text>
      </view>
    </view>
    <view class="card-mid">
      <view class="name-row">
        <text class="name">{{ doctor.name }}</text>
        <text class="title">{{ doctor.title }}</text>
      </view>
      <text class="hospital">{{ hospitalName }}</text>
      <text class="department" v-if="showDepartment && departmentName">{{ departmentName }}</text>
      <view class="tags" v-if="doctor.tags && doctor.tags.length">
        <c-TagPill v-for="tag in doctor.tags.slice(0, 3)" :key="tag" :label="tag" />
      </view>
    </view>
    <view class="card-right">
      <c-StarRating :modelValue="Math.round(doctor.rating)" :size="24" />
      <text class="rating-num">{{ doctor.rating }}</text>
      <text class="review-count">{{ doctor.reviewCount }}条评价</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import hospitals from '@/data/hospitals.json'
import hospitalDepartments from '@/data/hospital-departments.json'

const props = defineProps({
  doctor: { type: Object, required: true },
  showDepartment: { type: Boolean, default: false }
})

defineEmits(['tap'])

// Build lookup maps
const hospitalMap = {}
hospitals.forEach(h => {
  hospitalMap[h.id] = h.name
})

const departmentMap = {}
hospitalDepartments.forEach(hd => {
  hd.departments.forEach(dept => {
    departmentMap[`${hd.hospitalId}|${dept.id}`] = dept.departmentName
  })
})

const hospitalName = computed(() => {
  return hospitalMap[props.doctor.hospitalId] || '未知医院'
})

const departmentName = computed(() => {
  if (!props.doctor.hospitalId || !props.doctor.hospitalDepartmentId) return ''
  const key = `${props.doctor.hospitalId}|${props.doctor.hospitalDepartmentId}`
  return departmentMap[key] || ''
})
</script>

<style lang="scss" scoped>
.doctor-card {
  display: flex;
  align-items: center;
  padding: 28rpx;
  margin: 0 32rpx 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.card-left { margin-right: 20rpx; }
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light2, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-placeholder {
  font-size: 40rpx;
  color: $primary;
  font-weight: 700;
}
.card-mid {
  flex: 1;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 4rpx;
}
.name {
  font-size: $font-title;
  font-weight: 700;
  color: $text-primary;
}
.title {
  font-size: $font-xs;
  color: $primary;
  background-color: $primary-light;
  padding: 2rpx 10rpx;
  border-radius: $radius-sm;
}
.hospital {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: 2rpx;
}
.department {
  font-size: $font-xs;
  color: rgba(122, 132, 128, 0.7);
  margin-bottom: 8rpx;
}
.tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}
.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 16rpx;
}
.rating-num {
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}
.review-count {
  font-size: $font-xs;
  color: $text-secondary;
}
</style>
