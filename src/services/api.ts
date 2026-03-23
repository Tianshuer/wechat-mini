import type {
  LoginResponse,
  RegisterData,
  WeatherResponse,
  ForecastResponse,
  City,
  Favorite,
  SearchHistory,
} from '../types';

const BASE_URL = 'http://localhost:3000/api';

// 获取 token
const getToken = (): string => {
  return uni.getStorageSync('token') || '';
};

// 设置 token
export const setToken = (token: string): void => {
  uni.setStorageSync('token', token);
};

// 清除 token
export const clearToken = (): void => {
  uni.removeStorageSync('token');
};

// 请求封装
type RequestParams = Omit<UniApp.RequestOptions, 'url'>;

const request = <T>(url: string, options: RequestParams = {}): Promise<T> => {
  const token = getToken();
  const header = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.header,
  };

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${BASE_URL}${url}`,
      header,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 认证 API
export const authApi = {
  register: (data: RegisterData) =>
    request<LoginResponse>('/auth/register', {
      method: 'POST',
      data,
    }),

  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      data: { username, password },
    }),

  wechatLogin: (code: string) =>
    request<LoginResponse>('/auth/wechat-login', {
      method: 'POST',
      data: { code },
    }),

  getProfile: () =>
    request<{ userId: number; username: string }>('/auth/profile'),
};

// 天气 API
export const weatherApi = {
  searchLocation: (location: string) =>
    request<{ list: City[] }>(`/weather/search?location=${encodeURIComponent(location)}`),

  getCurrentWeather: (location: string) =>
    request<WeatherResponse>(`/weather/current?location=${encodeURIComponent(location)}`),

  getForecast: (location: string, days?: number) => {
    const params = days ? `&days=${days}` : '';
    return request<ForecastResponse>(
      `/weather/forecast?location=${encodeURIComponent(location)}${params}`
    );
  },
};

// 收藏 API
export const favoritesApi = {
  getList: () =>
    request<{ list: Favorite[] }>('/favorites'),

  add: (cityCode: string, cityName: string) =>
    request<Favorite>('/favorites', {
      method: 'POST',
      data: { cityCode, cityName },
    }),

  remove: (id: number) =>
    request<{ success: boolean }>(`/favorites/${id}`, {
      method: 'DELETE',
    }),
};

// 历史记录 API
export const historyApi = {
  getList: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return request<{ list: SearchHistory[] }>(`/history${params}`);
  },

  clear: () =>
    request<{ success: boolean }>('/history', {
      method: 'DELETE',
    }),
};
