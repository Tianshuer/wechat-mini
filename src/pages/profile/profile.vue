<template>
  <view class="container">
    <!-- 已登录 -->
    <view v-if="userStore.isLoggedIn" class="profile">
      <view class="user-info">
        <view class="avatar">{{ userStore.user?.nickname?.charAt(0) || 'U' }}</view>
        <view class="info">
          <text class="nickname">{{ userStore.user?.nickname || '用户' }}</text>
          <text class="username">@{{ userStore.user?.username }}</text>
        </view>
      </view>

      <view class="menu">
        <view class="menu-item" @click="viewHistory">
          <text>搜索历史</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="logout">
          <text class="logout-text">退出登录</text>
        </view>
      </view>
    </view>

    <!-- 未登录 -->
    <view v-else class="not-login">
      <view class="avatar-large">?</view>
      <text class="tip">登录后享受更多功能</text>
      <view class="buttons">
        <button class="btn" @click="goToLogin">登录</button>
        <button class="btn btn-outline" @click="goToRegister">注册</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user';
import { historyApi } from '../../services/api';
import type { SearchHistory } from '../../types';

const userStore = useUserStore();

const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.showToast({ title: '已退出', icon: 'success' });
      }
    },
  });
};

const viewHistory = async () => {
  try {
    const res = await historyApi.getList(20);
    if (res.list.length === 0) {
      uni.showToast({ title: '暂无历史记录', icon: 'none' });
      return;
    }

    // 显示历史记录
    const historyText = res.list
      .slice(0, 5)
      .map((h) => h.cityName)
      .join(', ');
    uni.showModal({
      title: '最近搜索',
      content: historyText + (res.list.length > 5 ? '...' : ''),
      showCancel: false,
    });
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' });
};

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #87ceeb 0%, #f0f8ff 100%);
  padding: 20px;
}

.profile {
  margin-top: 30px;
}

.user-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3cc51f, #2ea316);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-right: 15px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ccc, #aaa);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 25px;
}

.info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 19px;
  font-weight: 600;
  color: #333;
}

.username {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.menu {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #333;
}

.menu-item:last-child {
  border-bottom: none;
}

.arrow {
  color: #bbb;
  font-size: 18px;
}

.logout-text {
  color: #ff4444;
}

.not-login {
  margin-top: 80px;
  text-align: center;
}

.tip {
  color: #666;
  font-size: 15px;
  margin-bottom: 35px;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  background: #3cc51f;
  color: #fff;
  border: none;
  padding: 14px 40px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
}

.btn-outline {
  background: transparent;
  border: 1px solid #3cc51f;
  color: #3cc51f;
}
</style>
