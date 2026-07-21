<template>
  <div class="search-section glass fade-in">
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="`使用 ${currentEngine.name} 搜索...`"
        @keydown.enter="search"
        @keydown.slash.prevent="cycleEngine"
      />
      <button class="engine-btn" @click="cycleEngine" :title="'按 / 切换引擎'">
        {{ currentEngine.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const engines = [
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: '百度', url: 'https://www.baidu.com/s?wd=' },
  { name: 'GitHub', url: 'https://github.com/search?q=' },
]

const query = ref('')
const engineIndex = ref(0)
const inputRef = ref(null)

const currentEngine = ref(engines[0])

function cycleEngine() {
  engineIndex.value = (engineIndex.value + 1) % engines.length
  currentEngine.value = engines[engineIndex.value]
}

function search() {
  if (!query.value.trim()) return
  // _blank 兼容桌面新标签页 (newtab override) 和 Android popup 两种场景
  window.open(currentEngine.value.url + encodeURIComponent(query.value.trim()), '_blank')
}

// 快捷键：/ 聚焦搜索框
function handleKey(e) {
  if (e.key === '/' && document.activeElement !== inputRef.value) {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKey)
  // 从 localStorage 恢复引擎选择
  const saved = localStorage.getItem('search_engine')
  if (saved) {
    const idx = engines.findIndex(e => e.name === saved)
    if (idx >= 0) {
      engineIndex.value = idx
      currentEngine.value = engines[idx]
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKey)
})

// 监听引擎变化，保存到 localStorage
import { watch } from 'vue'
watch(engineIndex, (newIdx) => {
  localStorage.setItem('search_engine', engines[newIdx].name)
})
</script>

<style scoped>
.search-section {
  padding: 16px 20px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-icon {
  font-size: 20px;
  opacity: 0.7;
}

input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 18px;
  padding: 6px 0;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.engine-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s;
}

.engine-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

@media (max-width: 480px) {
  .engine-btn {
    padding: 5px 8px;
    font-size: 12px;
  }
  .search-icon {
    font-size: 16px;
  }
  input {
    font-size: 15px;
  }
}
</style>