<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-box">
      <input
        class="search-input"
        type="text"
        v-model="searchKeyword"
        placeholder="搜索城市名称"
        @input="onSearch"
        @confirm="onSearchConfirm"
      />
    </view>

    <!-- 行程天气按钮 -->
    <view class="trip-btn" @click="goToTrip">
      <text class="trip-icon">📅</text>
      <text class="trip-text">行程天气</text>
    </view>

    <!-- 搜索结果 -->
    <view v-if="showSearchResults" class="search-results">
      <view
        v-for="city in weatherStore.searchResults"
        :key="city.code"
        class="search-item"
        @click="selectCity(city)"
      >
        {{ city.name }} - {{ city.admin1 || city.country }}
      </view>
    </view>

    <!-- 当前天气 -->
    <view v-if="weatherStore.currentWeather" class="weather-card">
      <view class="city-name">{{ weatherStore.currentWeather.cityName }}</view>
      <image class="weather-icon" :src="`/static/weather/${currentWeatherIcon}.svg`" mode="aspectFit" />
      <view class="temp">{{ weatherStore.currentWeather.current.temp }}°</view>
      <view class="weather-text">{{ weatherStore.currentWeather.current.text }}</view>
      <view class="weather-detail">
        <text>风向: {{ weatherStore.currentWeather.current.windDir }}</text>
        <text>风力: {{ weatherStore.currentWeather.current.windScale }}级</text>
        <text>湿度: {{ weatherStore.currentWeather.current.humidity }}%</text>
      </view>
      <view class="actions">
        <button class="btn" @click="viewForecast">查看预报</button>
        <button class="btn btn-outline" @click="addToFavorite">收藏</button>
      </view>
    </view>

    <!-- 快捷收藏 -->
    <view v-if="favorites.length > 0" class="favorites-section">
      <view class="section-title">我的收藏</view>
      <scroll-view scroll-x class="favorites-scroll">
        <view class="favorites-list">
          <view
            v-for="fav in favorites"
            :key="fav.id"
            class="favorite-item"
            @click="selectFavorite(fav)"
          >
            {{ fav.cityName }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 未登录提示 -->
    <view v-if="!userStore.isLoggedIn" class="login-tip">
      <text>登录后可收藏城市</text>
      <button class="btn-small" @click="goToLogin">去登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWeatherStore } from '../../stores/weather';
import { useUserStore } from '../../stores/user';
import { weatherApi, favoritesApi } from '../../services/api';
import type { City, Favorite } from '../../types';
import { getWeatherIcon } from '../../utils/weatherIcon';

const weatherStore = useWeatherStore();
const userStore = useUserStore();

const searchKeyword = ref('');
const showSearchResults = ref(false);
const favorites = ref<Favorite[]>([]);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

// 当前天气图标
const currentWeatherIcon = computed(() => {
  if (!weatherStore.currentWeather?.current?.code) return 'sunny';
  return getWeatherIcon(weatherStore.currentWeather.current.code);
});

const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (searchKeyword.value.length >= 2) {
      await weatherStore.searchCity(searchKeyword.value);
      showSearchResults.value = true;
    } else {
      showSearchResults.value = false;
    }
  }, 300);
};

const onSearchConfirm = async () => {
  if (searchTimer) clearTimeout(searchTimer);
  if (searchKeyword.value) {
    showSearchResults.value = false;
    await weatherStore.getCurrentWeather(searchKeyword.value);
  }
};

const selectCity = async (city: City) => {
  searchKeyword.value = city.name;
  showSearchResults.value = false;
  await weatherStore.getCurrentWeather(city.name);
};

const viewForecast = () => {
  if (weatherStore.currentWeather) {
    uni.navigateTo({
      url: `/pages/forecast/forecast?city=${encodeURIComponent(
        weatherStore.currentWeather.cityName
      )}&code=${weatherStore.currentWeather.cityCode}`,
    });
  }
};

const addToFavorite = async () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  if (!weatherStore.currentWeather) return;

  try {
    await favoritesApi.add(
      weatherStore.currentWeather.cityCode,
      weatherStore.currentWeather.cityName
    );
    uni.showToast({ title: '收藏成功', icon: 'success' });
    await loadFavorites();
  } catch (e: any) {
    uni.showToast({ title: e.message || '收藏失败', icon: 'none' });
  }
};

const selectFavorite = async (fav: Favorite) => {
  await weatherStore.getCurrentWeather(fav.cityName);
};

const loadFavorites = async () => {
  if (!userStore.isLoggedIn) return;
  try {
    const res = await favoritesApi.getList();
    favorites.value = res.list;
  } catch (e) {
    console.error('Load favorites failed:', e);
  }
};

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' });
};

const goToTrip = () => {
  uni.navigateTo({ url: '/pages/trip/trip' });
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
}

.search-box {
  margin-bottom: 15px;
}

.trip-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 25px;
  padding: 12px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.trip-icon {
  font-size: 16px;
  margin-right: 8px;
}

.trip-text {
  font-size: 14px;
  color: #8FA89B;
}

.search-input {
  background: #fff;
  border-radius: 25px;
  padding: 14px 20px;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-results {
  background: #fff;
  border-radius: 20px;
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.search-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #333;
}

.search-item:last-child {
  border-bottom: none;
}

.weather-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.city-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.weather-icon {
  width: 90px;
  height: 90px;
  margin: 10px auto;
}

.temp {
  font-size: 64px;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.weather-text {
  font-size: 18px;
  color: #666;
  margin: 8px 0;
}

.weather-detail {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  font-size: 13px;
  color: #888;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  background: #8FA89B;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
}

.btn-outline {
  background: transparent;
  border: 1px solid #8FA89B;
  color: #8FA89B;
}

.favorites-section {
  margin-top: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.favorites-scroll {
  white-space: nowrap;
}

.favorites-list {
  display: flex;
  gap: 12px;
}

.favorite-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 24px;
  border-radius: 20px;
  white-space: nowrap;
  font-size: 14px;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.login-tip {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.btn-small {
  background: #8FA89B;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
}
</style>
