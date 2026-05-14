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
import hospitalDepartmentsData from '@/data/hospital-departments.json'
import hospitals from '@/data/hospitals.json'
import { addHistory } from '@/utils/storage.js'

const hospitalId = ref('')
const departmentId = ref('')
const favIds = ref('')
const sortBy = ref('default')

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '评分最高', value: 'rating' },
  { label: '评价最多', value: 'reviews' }
]

// Flatten all hospital departments into a single lookup array
const allHospitalDepartments = hospitalDepartmentsData.flatMap(h => h.departments)

onLoad((options) => {
  if (options?.departmentId) {
    departmentId.value = options.departmentId
    const hd = allHospitalDepartments.find(d => d.id === departmentId.value)
    if (hd) {
      uni.setNavigationBarTitle({ title: hd.departmentName + ' - 医生' })
    }
  }

  if (options?.hospitalId) {
    hospitalId.value = options.hospitalId
    if (!options?.departmentId) {
      const hosp = hospitals.find(h => h.id === hospitalId.value)
      if (hosp) {
        uni.setNavigationBarTitle({ title: hosp.name + ' - 全部医生' })
      }
    }
  }

  if (options?.favIds) {
    favIds.value = options.favIds
    uni.setNavigationBarTitle({ title: '收藏医生' })
  }
})

const filteredDoctors = computed(() => {
  // Favorites filter (from profile page)
  if (favIds.value) {
    const ids = favIds.value.split(',')
    return doctors.filter(d => ids.includes(d.id))
  }

  let list = doctors

  // Filter by hospitalDepartmentId when departmentId is provided
  if (departmentId.value) {
    list = list.filter(d => d.hospitalDepartmentId === departmentId.value)
  }

  // When hospitalId is provided without departmentId, show all doctors from that hospital
  if (hospitalId.value && !departmentId.value) {
    list = list.filter(d => d.hospitalId === hospitalId.value)
  }

  return list
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
