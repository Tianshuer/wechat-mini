<template>
  <view class="container">
    <view class="header">
      <view class="city">{{ cityName }}</view>
      <view class="date-range">
        <text
          v-for="day in dayOptions"
          :key="day.value"
          :class="['day-option', selectedDays === day.value ? 'active' : '']"
          @click="selectDays(day.value)"
        >
          {{ day.label }}
        </text>
      </view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else-if="forecast" class="forecast-list">
      <view v-for="day in forecast.daily" :key="day.date" class="forecast-item">
        <view class="date">{{ formatDate(day.date) }}</view>
        <view class="weather-info">
          <view class="weather-left">
            <image class="weather-icon-small" :src="`/static/weather/${getIcon(day.codeDay)}.svg`" mode="aspectFit" />
            <text class="weather-text">{{ day.textDay }}</text>
          </view>
          <text class="temp-range">
            {{ day.tempMin }}° ~ {{ day.tempMax }}°
          </text>
        </view>
        <view class="detail">
          <text>湿度: {{ day.humidity }}%</text>
          <text>降水: {{ day.precip }}mm</text>
          <text>{{ day.windDirDay }} {{ day.windScaleDay }}级</text>
        </view>
      </view>
    </view>

    <view v-else class="empty">暂无预报数据</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useWeatherStore } from '../../stores/weather';
import { weatherApi } from '../../services/api';
import type { ForecastResponse } from '../../types';
import { getWeatherIcon } from '../../utils/weatherIcon';

const weatherStore = useWeatherStore();

const cityName = ref('');
const cityCode = ref('');
const selectedDays = ref(7);
const forecast = ref<ForecastResponse | null>(null);
const loading = ref(false);

const dayOptions = [
  { label: '3天', value: 3 },
  { label: '5天', value: 5 },
  { label: '7天', value: 7 },
  { label: '10天', value: 10 },
];

// 获取每日天气图标
const getIcon = (code: number) => {
  return getWeatherIcon(code);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[date.getDay()];
  return `${month}月${day}日 周${weekDay}`;
};

const selectDays = async (days: number) => {
  selectedDays.value = days;
  await loadForecast();
};

const loadForecast = async () => {
  if (!cityName.value) return;

  loading.value = true;
  try {
    const res = await weatherApi.getForecast(cityName.value, selectedDays.value);
    forecast.value = res;
  } catch (e) {
    console.error('Load forecast failed:', e);
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

onLoad((options) => {
  if (options?.city) {
    cityName.value = decodeURIComponent(options.city);
  }
  if (options?.code) {
    cityCode.value = options.code;
  }
  loadForecast();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.city {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.date-range {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.day-option {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.7);
  color: #666;
}

.day-option.active {
  background: #8FA89B;
  color: #fff;
}

.loading, .empty {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 15px;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.forecast-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.date {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.weather-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.weather-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weather-icon-small {
  width: 36px;
  height: 36px;
}

.temp-range {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.weather-text {
  font-size: 15px;
  color: #666;
}

.detail {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}
</style>
