# V18.1 部署说明

## 1. 备份

先在当前站点中执行“备份全部笔记”。

## 2. 清理 V17 残留

你当前仓库中仍可能存在 V17 的 `assets/` 和 `VERSION.txt`。在仓库目录执行：

```bash
git rm -r assets 2>/dev/null || true
git rm VERSION.txt 2>/dev/null || true
```

## 3. 覆盖文件

解压 V18.1 部署包，将所有文件复制到仓库根目录。

```bash
git add -A
git commit -m "V18.1 fix ink commit PDF interaction and node connections"
git push origin main
```

## 4. 访问

等待 GitHub Actions 部署完成后，完全关闭旧标签页，再访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.1
```

不要在没有备份时清除 GitHub Pages 的网站数据。
