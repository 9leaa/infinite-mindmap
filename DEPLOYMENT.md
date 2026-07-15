# 无限画布思维导图 V17：GitHub Pages 部署

## 1. 更新前

在旧版本中先执行“备份全部笔记”。

V17 会尝试读取 V16 的 IndexedDB 并执行一次性迁移，但迁移不能替代完整备份。

## 2. 使用哪个压缩包

正式部署使用：

`infinite-mindmap-v17-github-pages.zip`

该压缩包已经是构建后的静态网站。不要把源码包直接上传到 Pages 根目录。

## 3. 覆盖仓库

将部署包解压，用其中全部内容覆盖本地 `infinite-mindmap` 仓库。

确认根目录包含：

```text
index.html
assets/
sw.js
.nojekyll
.github/workflows/pages.yml
```

然后执行：

```bash
git status
git add .
git commit -m "Rebuild with V17 Excalidraw and PDF.js viewer"
git push
```

## 4. GitHub Pages

等待仓库 `Actions` 中 Pages 工作流完成，然后访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=17
```

## 5. iPad 更新

1. 完全关闭所有旧 V15/V16 标签页。
2. 完全关闭旧的主屏幕 PWA。
3. 从带 `?v=17` 的地址重新打开。
4. 第一次启动时等待旧版数据迁移完成。
5. 不要在未备份时清除浏览器网站数据。

## 6. 源码开发

源码包需要 Node.js 20.19 或更高版本。

```bash
npm ci
npm run typecheck
npm run dev
```

生产构建：

```bash
npm run build
```

构建结果在 `dist/`。
