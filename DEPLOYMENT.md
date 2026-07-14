# GitHub Pages V15.8 更新

将本目录内容覆盖现有仓库，然后执行：

```bash
git add .
git commit -m "Update to V15.8 Blob storage and fast ink"
git push
```

部署后访问：

`https://9leaa.github.io/infinite-mindmap/?v=15.8`

## 第一次升级

旧版 PDF/Office 以 Base64 嵌入笔记库。

第一次打开 V15.8 时会自动迁移到独立 Blob Store。迁移完成后左侧会提示：

`PDF/Office 已迁移到独立 Blob 存储`

该迁移只执行一次。

## 缓存

V15.8 新增本地 PDF.js 文件。GitHub Pages 部署完成后，完全关闭旧标签页或主屏幕应用，再重新打开带 `?v=15.8` 的地址。

清除网站数据前必须先备份全部笔记。
