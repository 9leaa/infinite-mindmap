# V16.2 GitHub Pages 更新

## 更新前

先执行“备份全部笔记”。

## 必须完整覆盖

使用完整项目包覆盖仓库，尤其要包含：

```text
index.html
sw.js
vendor/pdf.bundle.js
vendor/pdf.worker.min.mjs
```

旧的 `vendor/pdf.min.mjs` 已不再使用。

## Git 命令

```bash
git add .
git commit -m "Update to V16.2 iPad pan and continuous PDF"
git push
```

部署完成后访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=16.2
```

## iPad 更新步骤

1. 等待 GitHub Actions 部署成功。
2. 完全关闭所有旧标签页。
3. 完全关闭主屏幕安装的旧版应用。
4. 重新打开带 `?v=16.2` 的地址。
5. 不要在未备份前清除网站数据。
