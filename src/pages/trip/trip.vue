<template>
  <view class="container">
    <!-- 行程设置模式 -->
    <view v-if="!isViewMode" class="trip-setup">
      <view class="section-title">选择日期范围</view>

      <!-- 日期选择 -->
      <view class="date-range">
        <view class="date-item" @click="showStartDatePicker">
          <text class="label">开始日期</text>
          <text class="value">{{ startDate || '请选择' }}</text>
        </view>
        <view class="date-item" @click="showEndDatePicker">
          <text class="label">结束日期</text>
          <text class="value">{{ endDate || '请选择' }}</text>
        </view>
      </view>

      <!-- 城市选择列表 -->
      <view v-if="dateRange.length > 0" class="section-title">选择城市</view>
      <view v-if="dateRange.length > 0" class="city-list">
        <view v-for="(day, index) in dateRange" :key="index" class="city-item">
          <text class="day-date">{{ day.date }}</text>
          <view class="city-select" @click="showCityPicker(index)">
            <text :class="day.cityName ? '' : 'placeholder'">
              {{ day.cityName || '选择城市' }}
            </text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <button
        v-if="dateRange.length > 0"
        class="btn-save"
        :disabled="!canSave"
        @click="saveTrip"
      >
        保存行程
      </button>
    </view>

    <!-- 行程查看模式 -->
    <view v-else class="trip-view">
      <view class="trip-header">
        <text class="trip-title">行程天气</text>
        <view class="edit-btn" @click="editTrip">
          <text>编辑</text>
        </view>
      </view>

      <view class="trip-dates">
        {{ tripData?.startDate }} 至 {{ tripData?.endDate }}
      </view>

      <!-- 行程天气列表 -->
      <view class="trip-weather-list">
        <view v-for="(day, index) in tripData?.days" :key="index" class="trip-day-card">
          <view class="day-info">
            <text class="day-date">{{ day.date }}</text>
            <text class="day-city">{{ day.cityName }}</text>
          </view>
          <view v-if="day.weather" class="day-weather">
            <text class="temp">{{ day.weather.temp }}°</text>
            <text class="text">{{ day.weather.text }}</text>
          </view>
          <view v-else class="day-loading">加载中...</view>
        </view>
      </view>
    </view>

    <!-- 日期选择器 -->
    <uni-datetime-picker
      v-if="showDatePicker"
      :type="datePickerType"
      :value="currentDate"
      @change="onDateChange"
      @close="showDatePicker = false"
    />

    <!-- 城市选择 -->
    <uni-show-iframe v-if="showCitySelector" @close="showCitySelector = false">
      <view class="city-selector">
        <view class="city-header">
          <text>选择城市</text>
          <text @click="showCitySelector = false">关闭</text>
        </view>
        <input
          class="city-search"
          v-model="cityKeyword"
          placeholder="搜索城市"
          @input="onCitySearch"
        />
        <scroll-view scroll-y class="city-results">
          <view
            v-for="city in searchResults"
            :key="city.code"
            class="city-option"
            @click="selectCity(city)"
          >
            {{ city.name }}
          </view>
        </scroll-view>
      </view>
    </uni-show-iframe>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import { tripApi, weatherApi } from '../../services/api';

const userStore = useUserStore();

// 状态
const isViewMode = ref(false);
const tripData = ref<any>(null);
const startDate = ref('');
const endDate = ref('');
const showDatePicker = ref(false);
const datePickerType = ref<'date' | 'date'>('date');
const currentDate = ref('');
const selectingDateType = ref<'start' | 'end'>('start');

// 城市选择
const showCitySelector = ref(false);
const selectingDayIndex = ref(0);
const cityKeyword = ref('');
const searchResults = ref<any[]>([]);

// 临时存储每天的城市
const daysData = ref<Array<{ date: string; cityName: string; cityCode: string }>>([]);

// 计算日期范围
const dateRange = computed(() => {
  if (!startDate.value || !endDate.value) return [];

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const days: Array<{ date: string; cityName: string; cityCode: string }> = [];

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const existing = daysData.value.find(d => d.date === dateStr);
    days.push(existing || { date: dateStr, cityName: '', cityCode: '' });
    current.setDate(current.getDate() + 1);
  }

  return days;
});

// 是否可以保存
const canSave = computed(() => {
  return dateRange.value.length > 0 && dateRange.value.every(d => d.cityName);
});

// 显示开始日期选择器
const showStartDatePicker = () => {
  currentDate.value = startDate.value;
  selectingDateType.value = 'start';
  datePickerType.value = 'date';
  showDatePicker.value = true;
};

// 显示结束日期选择器
const showEndDatePicker = () => {
  currentDate.value = endDate.value;
  selectingDateType.value = 'end';
  datePickerType.value = 'date';
  showDatePicker.value = true;
};

// 日期变化
const onDateChange = (e: any) => {
  if (selectingDateType.value === 'start') {
    startDate.value = e;
  } else {
    endDate.value = e;
  }
  showDatePicker.value = false;
};

// 显示城市选择器
const showCityPicker = (index: number) => {
  selectingDayIndex.value = index;
  cityKeyword.value = '';
  searchResults.value = [];
  showCitySelector.value = true;
};

// 城市搜索
const onCitySearch = async () => {
  if (cityKeyword.value.length >= 2) {
    try {
      const res = await weatherApi.searchLocation(cityKeyword.value);
      searchResults.value = res.list || [];
    } catch (e) {
      console.error('搜索城市失败:', e);
    }
  }
};

// 选择城市
const selectCity = (city: any) => {
  const index = selectingDayIndex.value;
  if (dateRange.value[index]) {
    dateRange.value[index].cityName = city.name;
    dateRange.value[index].cityCode = city.code;
  }
  showCitySelector.value = false;
};

// 保存行程
const saveTrip = async () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }

  try {
    await tripApi.createTrip({
      startDate: startDate.value,
      endDate: endDate.value,
      days: dateRange.value,
    });
    uni.showToast({ title: '保存成功', icon: 'success' });
    // 切换到查看模式并加载天气
    isViewMode.value = true;
    await loadTripWithWeather();
  } catch (e: any) {
    uni.showToast({ title: e.message || '保存失败', icon: 'none' });
  }
};

// 加载行程和天气
const loadTripWithWeather = async () => {
  try {
    const res = await tripApi.getTrip();
    if (res.trip) {
      tripData.value = res.trip;
      // 为每天加载天气
      for (const day of tripData.value.days) {
        try {
          const weatherRes = await weatherApi.getForecast(day.cityName, 1);
          day.weather = weatherRes.daily?.[0] || null;
        } catch (e) {
          day.weather = null;
        }
      }
    } else {
      // 没有行程，切换到设置模式
      isViewMode.value = false;
    }
  } catch (e) {
    console.error('加载行程失败:', e);
    isViewMode.value = false;
  }
};

// 编辑行程
const editTrip = () => {
  if (tripData.value) {
    startDate.value = tripData.value.startDate;
    endDate.value = tripData.value.endDate;
    daysData.value = tripData.value.days.map((d: any) => ({
      date: d.date,
      cityName: d.cityName,
      cityCode: d.cityCode,
    }));
  }
  isViewMode.value = false;
};

onMounted(async () => {
  if (userStore.isLoggedIn) {
    await loadTripWithWeather();
  }
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.date-range {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.date-item {
  flex: 1;
  background: #fff;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.date-item .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.date-item .value {
  font-size: 16px;
  color: #333;
}

.city-list {
  margin-bottom: 20px;
}

.city-item {
  background: #fff;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-date {
  font-size: 14px;
  color: #333;
}

.city-select {
  display: flex;
  align-items: center;
}

.city-select .placeholder {
  color: #999;
}

.city-select .arrow {
  margin-left: 10px;
  color: #999;
}

.btn-save {
  background: #8FA89B;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 15px;
  font-size: 16px;
}

.btn-save[disabled] {
  background: #ccc;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.trip-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.edit-btn {
  color: #8FA89B;
  font-size: 14px;
}

.trip-dates {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.trip-weather-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trip-day-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-info {
  display: flex;
  flex-direction: column;
}

.day-info .day-date {
  font-size: 14px;
  color: #666;
}

.day-info .day-city {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

.day-weather {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.day-weather .temp {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.day-weather .text {
  font-size: 14px;
  color: #666;
}

.day-loading {
  color: #999;
  font-size: 14px;
}
</style>
