import { defineStore } from 'pinia';
import { weatherApi } from '../services/api';
import type { WeatherResponse, ForecastResponse, City, Favorite } from '../types';

interface WeatherState {
  currentWeather: WeatherResponse | null;
  forecast: ForecastResponse | null;
  favorites: Favorite[];
  searchResults: City[];
  loading: boolean;
}

export const useWeatherStore = defineStore('weather', {
  state: (): WeatherState => ({
    currentWeather: null,
    forecast: null,
    favorites: [],
    searchResults: [],
    loading: false,
  }),

  actions: {
    async searchCity(keyword: string) {
      if (!keyword) {
        this.searchResults = [];
        return;
      }
      try {
        const res = await weatherApi.searchLocation(keyword);
        this.searchResults = res.list;
      } catch (e) {
        console.error('Search failed:', e);
        this.searchResults = [];
      }
    },

    async getCurrentWeather(location: string) {
      this.loading = true;
      try {
        const res = await weatherApi.getCurrentWeather(location);
        this.currentWeather = res;
        return res;
      } catch (e) {
        console.error('Get weather failed:', e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async getForecast(location: string, days?: number) {
      this.loading = true;
      try {
        const res = await weatherApi.getForecast(location, days);
        this.forecast = res;
        return res;
      } catch (e) {
        console.error('Get forecast failed:', e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    clearSearch() {
      this.searchResults = [];
    },
  },
});
