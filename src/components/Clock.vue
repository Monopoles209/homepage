<template>
  <div class="clock-section fade-in">
    <div class="time">{{ time }}</div>
    <div class="date">{{ dateStr }}</div>
    <div class="greeting">{{ greeting }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
const dateStr = ref('')
const greeting = ref('')
let timer = null

function update() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  time.value = `${h}:${m}:${s}`

  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  dateStr.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`

  const hour = now.getHours()
  if (hour < 6) greeting.value = '夜深了，注意休息 🌙'
  else if (hour < 9) greeting.value = '早上好，新的一天开始了 ☀️'
  else if (hour < 12) greeting.value = '上午好，保持专注 📌'
  else if (hour < 14) greeting.value = '中午好，该吃午饭了 🍱'
  else if (hour < 18) greeting.value = '下午好，继续加油 💪'
  else if (hour < 22) greeting.value = '晚上好，放松一下 🌆'
  else greeting.value = '夜深了，早点休息 🌙'
}

onMounted(() => {
  update()
  timer = setInterval(update, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.clock-section {
  text-align: center;
  padding: 10px 0;
}

.time {
  font-size: 64px;
  font-weight: 200;
  letter-spacing: 4px;
  font-variant-numeric: tabular-nums;
}

.date {
  font-size: 15px;
  opacity: 0.85;
  margin-top: 6px;
  letter-spacing: 1px;
}

.greeting {
  font-size: 18px;
  margin-top: 10px;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .time { font-size: 44px; letter-spacing: 2px; }
  .greeting { font-size: 15px; }
  .date { font-size: 13px; }
}

@media (max-width: 400px) {
  .time { font-size: 36px; }
  .greeting { font-size: 14px; }
}
</style>