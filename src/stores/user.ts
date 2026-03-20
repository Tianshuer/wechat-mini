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

    setUser(user: User) {
      this.user = user;
    },
  },
});
