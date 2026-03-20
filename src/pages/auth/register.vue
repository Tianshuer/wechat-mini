<template>
  <view class="container">
    <view class="form">
      <view class="title">注册</view>
      <view class="input-group">
        <input class="input" v-model="username" placeholder="用户名" />
      </view>
      <view class="input-group">
        <input class="input" v-model="nickname" placeholder="昵称（可选）" />
      </view>
      <view class="input-group">
        <input class="input" v-model="password" type="password" placeholder="密码（至少6位）" />
      </view>
      <view class="input-group">
        <input class="input" v-model="confirmPassword" type="password" placeholder="确认密码" />
      </view>
      <button class="btn" @click="handleRegister" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <view class="link">
        <text>已有账号？</text>
        <text class="link-text" @click="goToLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();

const username = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const handleRegister = async () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' });
    return;
  }

  if (password.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' });
    return;
  }

  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    await userStore.register({
      username: username.value,
      password: password.value,
      nickname: nickname.value || undefined,
    });
    uni.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  } catch (e: any) {
    uni.showToast({ title: e.message || '注册失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
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
  margin-bottom: 16px;
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
  border-color: #8FA89B;
}

.btn {
  background: #8FA89B;
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
  color: #8FA89B;
  margin-left: 5px;
  font-weight: 500;
}
</style>
