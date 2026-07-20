// ===== API 层：与 Cloudflare Pages Functions (KV) 交互 =====
// 开发环境用 localStorage 降级，生产环境用 /api/data

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

// 尝试从云端拉取数据，失败则用 localStorage
export async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/data`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('fetch failed')
    return await res.json()
  } catch {
    // 降级到 localStorage
    const local = localStorage.getItem('homepage_data')
    return local ? JSON.parse(local) : null
  }
}

// 保存数据到云端（带防抖）
let saveTimer = null
export async function saveData(data) {
  // 先存 localStorage 防丢
  localStorage.setItem('homepage_data', JSON.stringify(data))

  // 防抖：500ms 内只发一次
  if (saveTimer) clearTimeout(saveTimer)
  return new Promise((resolve) => {
    saveTimer = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        resolve(true)
      } catch {
        resolve(false)
      }
    }, 500)
  })
}

// 获取 Bing 每日壁纸
export async function fetchBingWallpaper() {
  try {
    const res = await fetch(`${API_BASE}/bing`)
    if (!res.ok) throw new Error('bing failed')
    return await res.json()
  } catch {
    return { url: '', copyright: '' }
  }
}