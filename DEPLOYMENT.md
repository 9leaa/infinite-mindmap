# GitHub Pages V15.4 更新

用本包内容覆盖现有仓库，然后执行：

```bash
git add .
git commit -m "Update to V15.4 dual toolbar and PDF annotation"
git push
```

等待 GitHub Actions 完成部署。

## PDF 注意事项

PDF 页面渲染使用 PDF.js CDN：

- 首次打开 PDF 时需要联网。
- 浏览器成功加载后通常会缓存相关资源。
- PDF 原文件数据保存在当前设备 IndexedDB 中。
- 大型电子书应分批导入页码范围，避免一次创建数百个页面对象。

## Office 文件

DOC/DOCX/PPT/PPTX 当前作为附件保存在笔记库。

需要直接逐页批注时，请先在系统或 Office 中导出为 PDF，再导入应用。

## 更新后仍显示旧版

Service Worker 可能仍在使用旧缓存：

1. 先备份全部笔记。
2. 关闭浏览器标签页或主屏幕应用。
3. 重新打开项目地址。
4. 必要时访问 `?v=15.4`。
