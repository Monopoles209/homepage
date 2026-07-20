<template>
  <div id="bg-layer" :style="{ backgroundImage: `url(${bgUrl})` }"></div>
  <div id="bg-overlay"></div>

  <div class="main-container">
    <!-- 时钟 + 问候 -->
    <Clock />

    <!-- 搜索框 -->
    <SearchBar />

    <!-- 天气 -->
    <Weather />

    <!-- 书签 + 便签 并排 -->
    <div class="bottom-grid">
      <Bookmarks v-model="data.bookmarks" />
      <Todo v-model="data.todos" />
    </div>

    <!-- 壁纸版权 -->
    <div class="bg-credit" v-if="bgCopyright">{{ bgCopyright }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Clock from './components/Clock.vue'
import SearchBar from './components/SearchBar.vue'
import Weather from './components/Weather.vue'
import Bookmarks from './components/Bookmarks.vue'
import Todo from './components/Todo.vue'
import { fetchData, saveData, fetchBingWallpaper } from './api.js'

const data = ref({
  bookmarks: [],
  todos: [],
})

const bgUrl = ref('')
const bgCopyright = ref('')

onMounted(async () => {
  // 1. 拉取云端数据
  const cloudData = await fetchData()
  if (cloudData) {
    if (cloudData.bookmarks?.length) data.value.bookmarks = cloudData.bookmarks
    if (cloudData.todos?.length) data.value.todos = cloudData.todos
  }

  // 2. 拉取 Bing 壁纸
  const wallpaper = await fetchBingWallpaper()
  if (wallpaper.url) {
    bgUrl.value = wallpaper.url
    bgCopyright.value = wallpaper.copyright
  } else {
    // 降级：渐变背景
    bgUrl.value = ''
    document.getElementById('bg-layer').style.background = 'linear-gradient(135deg, #667eea, #764ba2)'
  }
})

// 3. 数据变化自动同步到云端
watch(data, () => {
  saveData(data.value)
}, { deep: true })
</script>

<style scoped>
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.bg-credit {
  text-align: center;
  font-size: 12px;
  opacity: 0.35;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>