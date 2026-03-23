<template>
  <view class="container">
    <view class="header">
      <image class="logo" src="/static/tabbar/home.png" mode="aspectFit" />
      <view class="title">天气伴旅</view>
      <view class="subtitle">一键登录，体验便捷出行</view>
    </view>

    <!-- 微信手机号登录 -->
    <button
      class="btn-wechat"
      open-type="getPhoneNumber"
      @getphonenumber="handleGetPhoneNumber"
      :loading="loading"
    >
      {{ loading ? '登录中...' : '微信手机号一键登录' }}
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
import { authApi } from '../../services/api';

const userStore = useUserStore();
const loading = ref(false);

// 微信手机号登录
const handleGetPhoneNumber = async (e: any) => {
  console.log('getPhoneNumber event:', e.detail);

  if (e.detail.errMsg === 'getPhoneNumber:fail no permission') {
    uni.showModal({
      title: '提示',
      content: '当前账号无手机号权限，请使用小程序管理员或开发者账号登录微信开发者工具',
      showCancel: false
    });
    return;
  }

  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    console.log('用户取消或授权失败:', e.detail.errMsg);
    return;
  }

  loading.value = true;

  try {
    // 1. 先调用 uni.login 获取 code
    const loginRes = await uni.login({ provider: 'weixin' });
    if (!loginRes.code) {
      throw new Error('获取登录凭证失败');
    }

    // 2. 调用后端微信登录接口
    const res = await authApi.wechatLogin(
      loginRes.code,
      e.detail.code
    );

    // 3. 保存 token 和用户信息
    userStore.setToken(res.token);
    userStore.setUser(res.user);

    uni.showToast({ title: '登录成功', icon: 'success' });

    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  } catch (err: any) {
    uni.showToast({ title: err.message || '登录失败', icon: 'none' });
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

.btn-wechat {
  width: 100%;
  max-width: 320px;
  height: 50px;
  background-color: #07C160;
  color: #ffffff;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
}

.btn-wechat[loading] {
  background-color: #07C160;
}

.btn-wechat::after {
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
