import { defineStore } from 'pinia';
import { authApi, setToken, clearToken } from '../services/api';
import type { User, RegisterData } from '../types';

interface UserState {
  user: User | null;
  token: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: uni.getStorageSync('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string) {
      const res = await authApi.login(username, password);
      this.token = res.token;
      this.user = res.user;
      setToken(res.token);
      return res;
    },

    async register(data: RegisterData) {
      const res = await authApi.register(data);
      this.token = res.token;
      this.user = res.user;
      setToken(res.token);
      return res;
    },

    logout() {
      this.token = '';
      this.user = null;
      clearToken();
    },

    // 发送短信验证码
    async sendSmsCode(phone: string) {
      const res = await authApi.sendSmsCode(phone);
      return res;
    },

    // 短信验证码登录
    async smsLogin(phone: string, code: string) {
      const res = await authApi.smsLogin(phone, code);
      this.token = res.token;
      this.user = res.user;
      setToken(res.token);
      return res;
    },

    setToken(token: string) {
      this.token = token;
      setToken(token);
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});
