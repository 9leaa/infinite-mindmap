# V18.2 GitHub Pages 部署

## 1. 先备份

在现有版本中执行“备份全部笔记”。

## 2. 完整覆盖

将 V18.2 部署包中的全部文件覆盖到仓库根目录。PDF vendor 资源虽然与 V18.1 相同，也应保留完整目录。

```bash
git add -A
git commit -m "V18.2 fix Pencil sample truncation and PDF page tracking"
git push origin main
```

## 3. 更新访问

等待 GitHub Actions 完成，完全关闭旧标签页，然后访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.2
```

不要在未备份时清除网站数据。
