<template>
  <view class="container">
    <view class="header">
      <image class="logo" src="/static/tabbar/home.png" mode="aspectFit" />
      <view class="title">天气伴旅</view>
      <view class="subtitle">手机号登录，体验便捷出行</view>
    </view>

    <!-- 手机号输入 -->
    <view class="input-group">
      <input
        v-model="phone"
        type="number"
        placeholder="请输入手机号"
        maxlength="11"
        class="input-item"
      />

      <!-- 验证码输入 -->
      <view class="code-row">
        <input
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          maxlength="6"
          class="code-input"
        />
        <button
          class="code-btn"
          :disabled="countdown > 0"
          @click="handleSendCode"
        >
          {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
        </button>
      </view>
    </view>

    <!-- 登录按钮 -->
    <button
      class="btn-login"
      :loading="loading"
      @click="handleLogin"
    >
      {{ loading ? '登录中...' : '登录' }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();

const phone = ref('');
const code = ref('');
const loading = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

// 验证手机号格式
const validatePhone = (): boolean => {
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return false;
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' });
    return false;
  }
  return true;
};

// 发送验证码
const handleSendCode = async () => {
  if (!validatePhone()) return;

  if (countdown.value > 0) return;

  try {
    await userStore.sendSmsCode(phone.value);
    uni.showToast({ title: '验证码已发送', icon: 'success' });

    // 开始倒计时
    countdown.value = 60;
    countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }, 1000);
  } catch (error: any) {
    uni.showToast({ title: error.message || '发送失败', icon: 'none' });
  }
};

// 登录
const handleLogin = async () => {
  if (!validatePhone()) return;

  if (!code.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' });
    return;
  }

  if (!/^\d{6}$/.test(code.value)) {
    uni.showToast({ title: '验证码格式不正确', icon: 'none' });
    return;
  }

  loading.value = true;

  try {
    await userStore.smsLogin(phone.value, code.value);
    uni.showToast({ title: '登录成功', icon: 'success' });

    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 1000);
  } catch (error: any) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #C9D6DF 0%, #F5F5F0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #999;
  text-align: center;
}

.input-group {
  width: 100%;
  max-width: 320px;
  margin-bottom: 30px;
}

.input-item {
  background: #F0F0E8;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 16px;
  margin-bottom: 15px;
  border: none;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code-input {
  flex: 1;
  background: #F0F0E8;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
}

.code-btn {
  white-space: nowrap;
  background: #8FA89B;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 14px;
}

.code-btn[disabled] {
  background: #ccc;
}

.btn-login {
  width: 100%;
  max-width: 320px;
  background: #8FA89B;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 16px;
}

.btn-login:active {
  opacity: 0.8;
}
</style>
