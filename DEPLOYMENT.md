# GitHub Pages V15.6 更新

用本包内容覆盖现有仓库，然后执行：

```bash
git add .
git commit -m "Update to V15.6 PDF side reader"
git push
```

部署完成后访问：

`https://9leaa.github.io/infinite-mindmap/?v=15.6`

## PDF.js

完整 PDF 阅读器使用 PDF.js CDN。首次打开 PDF 时需要联网加载 PDF.js。

PDF 文件、批注和阅读笔记仍保存在当前设备的 IndexedDB 中。

## 从 V15.4 / V15.5 升级

之前已经逐页展开到画布中的 PDF 页面不会被自动删除，仍可以继续使用。

V15.6 新导入的 PDF 会使用新的“文件卡片 + 右侧阅读器”模式。
