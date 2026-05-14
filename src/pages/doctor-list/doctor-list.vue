<template>
  <view class="page">
    <c-FilterBar
      :options="sortOptions"
      v-model="sortBy"
    />
    <scroll-view class="list-scroll" scroll-y>
      <c-DoctorCard
        v-for="doctor in sortedDoctors"
        :key="doctor.id"
        :doctor="doctor"
        @tap="goDetail(doctor.id)"
      />
      <view v-if="sortedDoctors.length === 0" class="empty">
        <text>暂无医生数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import doctors from '@/data/doctors.json'
import departments from '@/data/departments.json'
import { addHistory } from '@/utils/storage.js'

const deptId = ref('')
const sortBy = ref('default')

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '评分最高', value: 'rating' },
  { label: '评价最多', value: 'reviews' }
]

onLoad((options) => {
  if (options?.deptId) {
    deptId.value = options.deptId
    const dept = departments.find(d => d.id === deptId.value)
    if (dept) {
      uni.setNavigationBarTitle({ title: dept.name + '医生' })
    }
  }
})

const filteredDoctors = computed(() => {
  if (!deptId.value) return doctors
  return doctors.filter(d => d.departmentId === deptId.value)
})

const sortedDoctors = computed(() => {
  const list = [...filteredDoctors.value]
  if (sortBy.value === 'rating') return list.sort((a, b) => b.rating - a.rating)
  if (sortBy.value === 'reviews') return list.sort((a, b) => b.reviewCount - a.reviewCount)
  return list
})

function goDetail(doctorId) {
  addHistory(doctorId)
  uni.navigateTo({ url: `/pages/doctor-detail/doctor-detail?id=${doctorId}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
}
.list-scroll {
  height: calc(100vh - 100rpx);
  padding-top: 16rpx;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: $text-secondary;
}
</style>
