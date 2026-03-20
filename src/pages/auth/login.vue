<template>
  <view class="container">
    <view class="form">
      <view class="title">登录</view>
      <view class="input-group">
        <input class="input" v-model="username" placeholder="用户名" />
      </view>
      <view class="input-group">
        <input class="input" v-model="password" type="password" placeholder="密码" />
      </view>
      <button class="btn" @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <view class="link">
        <text>还没有账号？</text>
        <text class="link-text" @click="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();

const username = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    await userStore.login(username.value, password.value);
    uni.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  } catch (e: any) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register' });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #87ceeb 0%, #f0f8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 30px;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 35px;
  color: #333;
}

.input-group {
  margin-bottom: 18px;
}

.input {
  background: #f5f5f5;
  border-radius: 25px;
  padding: 14px 20px;
  font-size: 15px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.input:focus {
  background: #fff;
  border-color: #3cc51f;
}

.btn {
  background: #3cc51f;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 15px;
}

.btn[disabled] {
  background: #ccc;
}

.link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #666;
}

.link-text {
  color: #3cc51f;
  margin-left: 5px;
  font-weight: 500;
}
</style>
