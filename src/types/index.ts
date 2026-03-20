// 用户相关类型
export interface User {
  id: number;
  username: string;
  nickname: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  password: string;
  nickname?: string;
}

// 天气相关类型
export interface City {
  code: string;
  name: string;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  temp: number;
  text: string;
  code?: number;
  windDir: string;
  windScale: string;
  humidity: number;
  pressure: number;
  obsTime: string;
}

export interface WeatherResponse {
  cityCode: string;
  cityName: string;
  current: CurrentWeather;
}

export interface DailyForecast {
  date: string;
  textDay: string;
  codeDay: number;
  textNight: string;
  codeNight: number;
  tempMax: number;
  tempMin: number;
  windDirDay: string;
  windScaleDay: string;
  humidity: number;
  precip: number;
}

export interface ForecastResponse {
  cityCode: string;
  cityName: string;
  daily: DailyForecast[];
}

// 收藏相关类型
export interface Favorite {
  id: number;
  cityCode: string;
  cityName: string;
  createdAt: string;
}

// 历史记录相关类型
export interface SearchHistory {
  id: number;
  cityCode: string;
  cityName: string;
  searchDate: string;
  createdAt: string;
}
