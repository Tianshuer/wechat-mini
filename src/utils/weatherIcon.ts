// 天气图标映射 (WMO 天气代码)
const WEATHER_ICONS: Record<number, string> = {
  0: 'sunny',      // 晴
  1: 'sunny',      // 晴间多云
  2: 'cloudy',     // 多云
  3: 'overcast',   // 阴
  45: 'overcast',  // 雾
  48: 'overcast',  // 雾
  51: 'rainy',     // 小毛毛雨
  53: 'rainy',     // 中毛毛雨
  55: 'rainy',     // 大毛毛雨
  56: 'rainy',     // 冻毛毛雨
  57: 'rainy',     // 强冻毛毛雨
  61: 'rainy',     // 小雨
  63: 'rainy',     // 中雨
  65: 'rainy',     // 大雨
  66: 'rainy',     // 小冻雨
  67: 'rainy',     // 大冻雨
  71: 'snowy',     // 小雪
  73: 'snowy',     // 中雪
  75: 'snowy',     // 大雪
  77: 'snowy',     // 雪粒
  80: 'rainy',     // 小阵雨
  81: 'rainy',     // 中阵雨
  82: 'rainy',     // 大阵雨
  85: 'snowy',     // 小阵雪
  86: 'snowy',     // 大阵雪
  95: 'rainy',     // 雷暴
  96: 'rainy',     // 雷暴加小冰雹
  99: 'rainy'      // 雷暴加大冰雹
};

// 获取天气图标名称
export function getWeatherIcon(code: number): string {
  return WEATHER_ICONS[code] || 'sunny';
}
