# V18.4 GitHub Pages 部署

## 更新前

不要清除浏览器网站数据。旧版完整 JSON 备份如果已经失败，当前笔记通常仍在 IndexedDB 中。

## 完整覆盖

解压 V18.4 部署包，将所有文件复制到仓库根目录。必须保留：

```text
vendor/zip.min.mjs
vendor/LICENSE_ZIPJS
vendor/pdf.mjs
vendor/pdf.worker.mjs
vendor/cmaps/
vendor/standard_fonts/
workers/storage-worker.js
sw.js
```

提交：

```bash
git add -A
git commit -m "V18.4 replace giant JSON backup with streaming ZIP"
git push origin main
```

等待 GitHub Actions 完成后，完全关闭旧标签页，再访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.4
```

## 首次验证

1. 打开旧笔记并确认内容仍然存在。
2. 点击“备份全部笔记”。
3. 确认下载文件扩展名为 `.mindmap-backup.zip`。
4. 不要立即删除原数据。
5. 使用另一浏览器配置或测试环境导入 ZIP，确认节点、手写、PDF、批注和附件均能恢复。
