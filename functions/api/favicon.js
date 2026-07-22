// Cloudflare Pages Functions - Favicon 代理
// GET /api/favicon?domain=github.com
// 解决国内无法访问 Google Favicon 服务的问题
// CF 服务器在国外，可以正常抓取，用户通过本站域名访问

export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const domain = url.searchParams.get('domain')
  const size = url.searchParams.get('size') || '64'

  if (!domain) {
    return new Response('Missing domain', { status: 400 })
  }

  const cacheKey = `favicon:${domain}:${size}`

  // 1. 先查 KV 缓存
  try {
    const cached = await env.HOMEPAGE_KV.get(cacheKey, 'arrayBuffer')
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=604800',
        },
      })
    }
  } catch {}

  // 2. 从 Google Favicon 服务抓取
  try {
    const resp = await fetch(
      `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
      { cf: { cacheTtl: 604800 } }
    )
    if (resp.ok) {
      const buffer = await resp.arrayBuffer()
      // 缓存到 KV（7 天）
      try {
        await env.HOMEPAGE_KV.put(cacheKey, buffer, { expirationTtl: 604800 })
      } catch {}
      return new Response(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=604800',
        },
      })
    }
  } catch {}

  // 3. 降级：返回透明占位 (1x1 GIF)
  const placeholder = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0))
  return new Response(placeholder, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}
