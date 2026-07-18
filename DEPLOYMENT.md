# V18.3 GitHub Pages 部署

先执行“备份全部笔记”，不要清除网站数据。

解压 V18.3 部署包，将全部文件覆盖到仓库根目录：

```bash
git add -A
git commit -m "V18.3 fix rich text tabs placement auto height and toolbar drag"
git push origin main
```

等待 GitHub Actions 完成后，完全关闭旧标签页，再访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.3
```
