<template>
  <div class="todo-section glass fade-in">
    <div class="section-header">
      <h2>📝 便签</h2>
      <span class="counter">{{ todos.filter(t => !t.done).length }} 待办</span>
    </div>

    <div class="add-row">
      <input
        v-model="newTodo"
        type="text"
        placeholder="添加待办..."
        @keydown.enter="addTodo"
      />
      <button @click="addTodo" class="add-btn">+</button>
    </div>

    <div class="todo-list">
      <div v-for="(todo, i) in todos" :key="i" class="todo-item" :class="{ done: todo.done }">
        <input type="checkbox" v-model="todo.done" class="checkbox" />
        <span class="todo-text">{{ todo.text }}</span>
        <button class="del-btn" @click="removeTodo(i)">✕</button>
      </div>
      <div v-if="todos.length === 0" class="empty">暂无待办，享受生活吧 🌿</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const todos = ref(
  props.modelValue?.length ? JSON.parse(JSON.stringify(props.modelValue)) : []
)
const newTodo = ref('')
let syncing = false

// 同步外部数据变更（如云端加载）到本地 ref
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    syncing = true
    todos.value = JSON.parse(JSON.stringify(newVal))
    setTimeout(() => { syncing = false }, 0)
  }
})

function addTodo() {
  if (!newTodo.value.trim()) return
  todos.value.unshift({ text: newTodo.value.trim(), done: false })
  newTodo.value = ''
}

function removeTodo(i) {
  todos.value.splice(i, 1)
}

watch(todos, () => {
  if (!syncing) emit('update:modelValue', todos.value)
}, { deep: true })
</script>

<style scoped>
.todo-section {
  padding: 20px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

h2 {
  font-size: 18px;
  font-weight: 500;
}

.counter {
  font-size: 13px;
  opacity: 0.6;
}

.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.add-row input {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}

.add-row input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.add-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  width: 36px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 220px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6c8cff;
}

.todo-text {
  flex: 1;
  font-size: 14px;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  opacity: 0.4;
}

.del-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 13px;
}

.del-btn:hover {
  color: rgba(255, 100, 100, 0.8);
}

.empty {
  text-align: center;
  opacity: 0.4;
  font-size: 14px;
  padding: 16px;
}

/* 移动端 */
@media (max-width: 480px) {
  .todo-section {
    padding: 14px 16px;
  }
  .todo-list {
    max-height: 180px;
  }
}
</style>