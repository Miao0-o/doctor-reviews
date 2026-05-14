<template>
  <scroll-view class="page" scroll-y v-if="disease">
    <view class="header-info">
      <text class="header-icon">{{ disease.icon }}</text>
      <text class="header-name">{{ disease.name }} — 医院口碑排名</text>
    </view>
    <view class="ranking-list">
      <c-HospitalCard
        v-for="item in rankings"
        :key="item.hospitalId"
        :hospital="getHospital(item.hospitalId)"
        :rank="item.rank"
        :score="item.score"
        @tap="goHospital(item.hospitalId)"
      />
      <view class="divider" v-if="rankings.length > 0" />
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import diseases from '@/data/diseases.json'
import hospitals from '@/data/hospitals.json'
import rankingsData from '@/data/disease-hospital-rankings.json'

const disease = ref(null)
const rankings = ref([])

onLoad((options) => {
  const diseaseId = options?.diseaseId
  disease.value = diseases.find(d => d.id === diseaseId) || null
  if (disease.value) {
    uni.setNavigationBarTitle({ title: disease.value.name + '医院排名' })
    const rankEntry = rankingsData.find(r => r.diseaseId === diseaseId)
    rankings.value = rankEntry ? rankEntry.rankings : []
  }
})

function getHospital(hospitalId) {
  return hospitals.find(h => h.id === hospitalId) || { name: '未知医院', level: '', type: '' }
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
.header-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 28rpx 32rpx;
  background-color: $bg-card;
}
.header-icon { font-size: 48rpx; }
.header-name {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.ranking-list {
  margin-top: 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  margin: 16rpx 32rpx;
  overflow: hidden;
  box-shadow: $shadow-card;
}
.divider {
  height: 1rpx;
  background-color: $divider;
}
</style>
