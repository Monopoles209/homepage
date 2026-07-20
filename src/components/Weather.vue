<template>
  <div class="weather-section glass fade-in" v-if="weather">
    <div class="weather-icon">{{ icon }}</div>
    <div class="weather-info">
      <div class="temp">{{ weather.temp }}°C</div>
      <div class="desc">{{ weather.desc }} · {{ weather.city }}</div>
      <div class="range" v-if="weather.min !== null">
        {{ weather.min }}° ~ {{ weather.max }}°C
      </div>
    </div>
  </div>
  <div class="weather-section glass fade-in" v-else-if="loading">
    <div class="weather-icon">⏳</div>
    <div class="weather-info"><div class="temp">--</div><div class="desc">加载天气...</div></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const weather = ref(null)
const loading = ref(true)
const icon = ref('🌤️')

const weatherIcons = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '🌧️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

const weatherDesc = {
  0: '晴', 1: '晴间多云', 2: '多云', 3: '阴',
  45: '雾', 48: '冻雾',
  51: '小毛雨', 53: '毛雨', 55: '大毛雨',
  61: '小雨', 63: '中雨', 65: '大雨',
  71: '小雪', 73: '中雪', 75: '大雪',
  80: '阵雨', 81: '中阵雨', 82: '大阵雨',
  95: '雷暴', 96: '雷暴+冰雹', 99: '强雷暴+冰雹',
}

async function fetchWeather() {
  loading.value = true
  try {
    // 先获取城市坐标（默认上海，可改）
    const city = localStorage.getItem('weather_city') || 'Shanghai'
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`)
    const geoData = await geoRes.json()
    if (!geoData.results || geoData.results.length === 0) throw new Error('city not found')
    const { latitude, longitude, name } = geoData.results[0]

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    )
    const data = await weatherRes.json()

    const code = data.current.weather_code
    weather.value = {
      temp: Math.round(data.current.temperature_2m),
      desc: weatherDesc[code] || '未知',
      city: name,
      min: Math.round(data.daily.temperature_2m_min[0]),
      max: Math.round(data.daily.temperature_2m_max[0]),
    }
    icon.value = weatherIcons[code] || '🌤️'
  } catch {
    weather.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchWeather)
</script>

<style scoped>
.weather-section {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  align-self: flex-start;
}

.weather-icon {
  font-size: 36px;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.temp {
  font-size: 26px;
  font-weight: 500;
}

.desc {
  font-size: 13px;
  opacity: 0.8;
}

.range {
  font-size: 12px;
  opacity: 0.6;
}
</style>