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

onMounted(() => {
  // 1. 先从 localStorage 立即渲染（秒开）
  const local = localStorage.getItem('homepage_data')
  if (local) {
    try {
      const d = JSON.parse(local)
      if (d.bookmarks?.length) data.value.bookmarks = d.bookmarks
      if (d.todos?.length) data.value.todos = d.todos
    } catch {}
  }

  // 2. 壁纸缓存优先（秒出背景）
  const cachedBg = localStorage.getItem('bing_wallpaper')
  if (cachedBg) {
    try {
      const bg = JSON.parse(cachedBg)
      bgUrl.value = bg.url
      bgCopyright.value = bg.copyright
    } catch {}
  } else {
    document.getElementById('bg-layer').style.background = 'linear-gradient(135deg, #667eea, #764ba2)'
  }

  // 3. 后台异步拉取云端数据（不阻塞渲染）
  fetchData().then(cloudData => {
    if (cloudData) {
      if (cloudData.bookmarks?.length) data.value.bookmarks = cloudData.bookmarks
      if (cloudData.todos?.length) data.value.todos = cloudData.todos
    }
  })

  // 4. 后台异步拉取最新壁纸
  fetchBingWallpaper().then(wallpaper => {
    if (wallpaper.url) {
      bgUrl.value = wallpaper.url
      bgCopyright.value = wallpaper.copyright
      localStorage.setItem('bing_wallpaper', JSON.stringify({
        url: wallpaper.url,
        copyright: wallpaper.copyright,
      }))
    }
  })
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

/* 移动端 / 扩展弹窗适配 */
@media (max-width: 768px) {
  .bottom-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Android Edge 弹窗场景：窄屏单列 + 紧凑间距 */
@media (max-width: 480px) {
  .bottom-grid {
    gap: 12px;
  }
}
</style>