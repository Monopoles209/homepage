<template>
  <div class="bookmarks-section glass fade-in">
    <div class="section-header">
      <h2>📂 书签</h2>
      <button class="edit-btn" @click="editing = !editing">
        {{ editing ? '✓ 完成' : '✏️ 编辑' }}
      </button>
    </div>

    <!-- 分组列表 -->
    <div class="groups">
      <div v-for="(group, gi) in groups" :key="gi" class="group">
        <div class="group-header">
          <span v-if="!editing" class="group-name">{{ group.name }}</span>
          <input v-else v-model="group.name" class="group-name-input" placeholder="分组名" />
          <button v-if="editing" class="del-btn" @click="removeGroup(gi)">🗑️</button>
        </div>
        <div class="links">
          <div v-for="(link, li) in group.links" :key="li" class="link-item">
            <a v-if="!editing" :href="link.url" target="_blank" rel="noopener" class="link-card">
              <img :src="getFavicon(link.url)" alt="" class="favicon" @error="onFaviconError" />
              <span class="link-name">{{ link.name }}</span>
            </a>
            <div v-else class="link-card editing-card">
              <input v-model="link.name" placeholder="名称" class="link-input" />
              <input v-model="link.url" placeholder="https://" class="link-input" />
              <button class="del-btn" @click="removeLink(gi, li)">🗑️</button>
            </div>
          </div>
          <button v-if="editing" class="add-link-btn" @click="addLink(gi)">+ 添加链接</button>
        </div>
      </div>
    </div>

    <button v-if="editing" class="add-group-btn" @click="addGroup">+ 添加分组</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const groups = ref(props.modelValue.length ? props.modelValue : [
  {
    name: '常用',
    links: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'YouTube', url: 'https://youtube.com' },
      { name: 'B站', url: 'https://bilibili.com' },
      { name: '知乎', url: 'https://zhihu.com' },
    ],
  },
  {
    name: '工具',
    links: [
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'Claude', url: 'https://claude.ai' },
      { name: 'Google翻译', url: 'https://translate.google.com' },
      { name: 'WolframAlpha', url: 'https://wolframalpha.com' },
    ],
  },
  {
    name: '社交',
    links: [
      { name: 'Twitter', url: 'https://twitter.com' },
      { name: 'Reddit', url: 'https://reddit.com' },
      { name: '微博', url: 'https://weibo.com' },
      { name: 'Gmail', url: 'https://mail.google.com' },
    ],
  },
])

const editing = ref(false)

function getFavicon(url) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ''
  }
}

function onFaviconError(e) {
  e.target.style.display = 'none'
}

function addGroup() {
  groups.value.push({ name: '新分组', links: [] })
}

function removeGroup(gi) {
  groups.value.splice(gi, 1)
}

function addLink(gi) {
  groups.value[gi].links.push({ name: '新链接', url: 'https://' })
}

function removeLink(gi, li) {
  groups.value[gi].links.splice(li, 1)
}

// 同步到父组件
watch(groups, () => {
  emit('update:modelValue', groups.value)
}, { deep: true })
</script>

<style scoped>
.bookmarks-section {
  padding: 20px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h2 {
  font-size: 18px;
  font-weight: 500;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.group-name {
  font-size: 14px;
  opacity: 0.7;
  letter-spacing: 1px;
}

.group-name-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 12px;
  text-decoration: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  transition: all 0.2s;
}

.link-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.editing-card {
  gap: 4px;
}

.favicon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.link-name {
  font-size: 13px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.link-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  width: 100%;
}

.add-link-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  grid-column: span 1;
}

.add-group-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 12px;
  width: 100%;
}

.del-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
}
.del-btn:hover { opacity: 1; }
</style>