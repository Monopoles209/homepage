// Cloudflare Pages Functions - 数据读写 (KV)
// GET  /api/data  → 读取数据
// POST /api/data  → 保存数据

export async function onRequestGet(context) {
  const { env } = context
  try {
    const raw = await env.HOMEPAGE_KV.get('app_data')
    const data = raw ? JSON.parse(raw) : { bookmarks: [], todos: [] }
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestPost(context) {
  const { request, env } = context
  try {
    const body = await request.json()
    await env.HOMEPAGE_KV.put('app_data', JSON.stringify(body))
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}