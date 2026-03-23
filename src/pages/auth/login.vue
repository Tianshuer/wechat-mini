<template>
  <view class="container">
    <view class="header">
      <image class="logo" src="/static/tabbar/home.png" mode="aspectFit" />
      <view class="title">天气伴旅</view>
      <view class="subtitle">手机号登录，体验便捷出行</view>
    </view>

    <!-- 手机号输入 -->
    <view class="input-group">
      <view class="input-item">
        <text class="label">+86</text>
        <input
          class="input"
          v-model="phone"
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>

      <!-- 验证码输入 -->
      <view class="input-item">
        <text class="label">验证码</text>
        <input
          class="input"
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          maxlength="6"
        />
        <button
          class="btn-code"
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

    <view class="tips">
      登录即表示同意
      <text class="link">《用户协议》</text>
      和
      <text class="link">《隐私政策》</text>
    </view>
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
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 25px;
  padding: 12px 20px;
  margin-bottom: 15px;
  height: 50px;
}

.label {
  font-size: 16px;
  color: #333;
  margin-right: 15px;
  min-width: 50px;
}

.input {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.btn-code {
  font-size: 14px;
  color: #8FA89B;
  background: none;
  padding: 0;
  margin: 0;
  line-height: normal;
}

.btn-code[disabled] {
  color: #999;
}

.btn-code::after {
  border: none;
}

.btn-login {
  width: 100%;
  max-width: 320px;
  height: 50px;
  background-color: #8FA89B;
  color: #ffffff;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
}

.btn-login[loading] {
  background-color: #8FA89B;
}

.btn-login::after {
  border: none;
}

.tips {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 30px;
  line-height: 1.8;
}

.link {
  color: #8FA89B;
}
</style>
