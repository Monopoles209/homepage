# 🏠 Glass Homepage

毛玻璃风格的浏览器主页，基于 Vue 3 + Cloudflare Pages。

## ✨ 功能

- 🕐 实时时钟 + 日期 + 智能问候语
- 🔍 多引擎搜索（Google/Bing/百度/DuckDuckGo/Perplexity/GitHub/YouTube/B站）
- 🌤️ 天气信息（Open-Meteo 免费 API，无需 Key）
- 🌄 Bing 每日壁纸自动换背景
- 📂 书签分组管理（可视化编辑）
- 📝 便签/待办小工具
- ☁️ Cloudflare KV 云端同步（多设备数据一致）

## 🚀 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:5173

> 本地开发时，如果没有 KV，会自动降级到 localStorage 存储数据。

## 📦 部署到 Cloudflare Pages

### 1. 创建 KV 命名空间

```bash
npx wrangler kv:namespace create HOMEPAGE_KV
```

记下返回的 `id`，填入 `wrangler.toml`。

### 2. 推送到 GitHub

```bash
git init
git add .
git commit -m "init homepage"
git remote add origin https://github.com/你的用户名/glass-homepage.git
git push -u origin main
```

### 3. 在 Cloudflare 创建 Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** → **创建** → **Pages** → **连接到 Git**
3. 选择你的仓库，构建设置：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. 点击 **保存并部署**

### 4. 绑定 KV

1. 进入 Pages 项目 → **设置** → **函数** → **KV 命名空间绑定**
2. 变量名：`HOMEPAGE_KV`
3. 选择第一步创建的 KV 命名空间
4. **重新部署** 使绑定生效

### 5. 绑定自定义域名（可选）

Pages 项目 → **自定义域** → 添加你的域名

## 🔧 自定义

- **天气城市**：在浏览器控制台执行 `localStorage.setItem('weather_city', 'Beijing')`
- **书签**：点击页面上的 ✏️ 编辑 按钮可视化添加/删除
- **搜索引擎**：在搜索框右侧点击引擎名称切换，按 `/` 键快速聚焦搜索框

## 📂 项目结构

```
├── index.html              # 入口
├── src/
│   ├── App.vue             # 主应用
│   ├── api.js              # API 层（KV 交互 + 降级）
│   ├── style.css           # 全局样式（毛玻璃）
│   └── components/
│       ├── Clock.vue       # 时钟 + 问候
│       ├── SearchBar.vue   # 多引擎搜索
│       ├── Weather.vue     # 天气
│       ├── Bookmarks.vue   # 书签管理
│       └── Todo.vue        # 便签待办
├── functions/api/
│   ├── data.js             # 数据读写 (KV)
│   └── bing.js             # Bing 壁纸代理 + 缓存
├── wrangler.toml           # Wrangler 配置
└── package.json
```

## License

MIT