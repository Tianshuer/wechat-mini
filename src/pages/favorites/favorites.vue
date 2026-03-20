<template>
  <view class="container">
    <view v-if="!userStore.isLoggedIn" class="login-tip">
      <text>请先登录查看收藏</text>
      <button class="btn" @click="goToLogin">去登录</button>
    </view>

    <view v-else-if="loading" class="loading">加载中...</view>

    <view v-else-if="favorites.length === 0" class="empty">
      <text>暂无收藏城市</text>
    </view>

    <view v-else class="favorites-list">
      <view
        v-for="fav in favorites"
        :key="fav.id"
        class="favorite-item"
        @click="viewWeather(fav)"
      >
        <view class="city-info">
          <text class="city-name">{{ fav.cityName }}</text>
          <text class="date">收藏于 {{ formatDate(fav.createdAt) }}</text>
        </view>
        <view class="actions">
          <text class="view-btn">查看天气</text>
          <text class="delete-btn" @click.stop="deleteFavorite(fav.id)">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import { useWeatherStore } from '../../stores/weather';
import { favoritesApi } from '../../services/api';
import type { Favorite } from '../../types';

const userStore = useUserStore();
const weatherStore = useWeatherStore();

const favorites = ref<Favorite[]>([]);
const loading = ref(false);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}-${date.getDate()}`;
};

const loadFavorites = async () => {
  if (!userStore.isLoggedIn) return;

  loading.value = true;
  try {
    const res = await favoritesApi.getList();
    favorites.value = res.list;
  } catch (e) {
    console.error('Load favorites failed:', e);
  } finally {
    loading.value = false;
  }
};

const viewWeather = async (fav: Favorite) => {
  await weatherStore.getCurrentWeather(fav.cityName);
  uni.navigateTo({
    url: `/pages/forecast/forecast?city=${encodeURIComponent(fav.cityName)}&code=${fav.cityCode}`,
  });
};

const deleteFavorite = async (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个收藏吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await favoritesApi.remove(id);
          uni.showToast({ title: '删除成功', icon: 'success' });
          await loadFavorites();
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' });
        }
      }
    },
  });
};

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' });
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
  padding: 20px;
}

.login-tip, .empty, .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #666;
  font-size: 15px;
}

.btn {
  background: #8FA89B;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 20px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.city-info {
  display: flex;
  flex-direction: column;
}

.city-name {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.date {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.actions {
  display: flex;
  gap: 18px;
}

.view-btn {
  color: #8FA89B;
  font-size: 14px;
  font-weight: 500;
}

.delete-btn {
  color: #ff4444;
  font-size: 14px;
}
</style>
