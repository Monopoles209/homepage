// Cloudflare Pages Functions - Bing 每日壁纸代理
// GET /api/bing → { url, copyright }
// 解决跨域问题，并缓存到 KV 减少请求

export async function onRequestGet(context) {
  const { env } = context

  // 先查 KV 缓存（当天有效）
  try {
    const cached = await env.HOMEPAGE_KV.get('bing_wallpaper', 'json')
    if (cached && cached.date === new Date().toISOString().slice(0, 10)) {
      return new Response(JSON.stringify(cached), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
      })
    }
  } catch {}

  // 请求 Bing API
  try {
    const res = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN')
    const data = await res.json()
    const image = data.images[0]
    const result = {
      url: `https://www.bing.com${image.url}`,
      copyright: image.copyright,
      date: new Date().toISOString().slice(0, 10),
    }

    // 缓存到 KV（当天有效）
    try {
      await env.HOMEPAGE_KV.put('bing_wallpaper', JSON.stringify(result), { expirationTtl: 86400 })
    } catch {}

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ url: '', copyright: '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}