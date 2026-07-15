# 无限画布思维导图 V16：GitHub Pages 更新说明

## 更新前

在旧版本中先点击：

`备份全部笔记`

保存完整 JSON 备份。不要在没有备份时清除浏览器网站数据。

## 必须完整覆盖的内容

这次不能只替换 `index.html`。必须上传整个项目包，包括：

```text
index.html
sw.js
manifest.webmanifest
.nojekyll
icon-192.png
icon-512.png
vendor/pdf.min.mjs
vendor/pdf.worker.min.mjs
.github/workflows/pages.yml
```

## 本地仓库更新

解压 V16 项目包，用其中内容覆盖原仓库目录，然后执行：

```bash
git status
git add .
git commit -m "Update to V16 stable architecture"
git push
```

## 部署检查

1. 打开 GitHub 仓库的 `Actions`。
2. 等待 Pages 工作流变成绿色。
3. 访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=16
```

4. 完全关闭旧 Safari 标签页或主屏幕应用。
5. 从新地址重新打开。

## 旧 Service Worker

V16 的 Service Worker 会删除旧版本缓存，并遵守：

- 页面导航失败时才回退到 `index.html`；
- 缺少 `.mjs` 或 Worker 时绝不会返回 HTML；
- PDF.js 只在用户主动进入批注模式后下载和缓存。

不要在没有完整备份时使用“清除网站数据”。

## 第一次升级

旧版内嵌数据会执行一次性迁移：

- 手写笔迹 → `ink-strokes`
- PDF 批注 → `pdf-annotations`
- PDF/Office Base64 → `binary-assets`

迁移期间不要连续关闭页面。迁移完成后，日常书写不会再重写原始 PDF。
