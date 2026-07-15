# V16.1 GitHub Pages 更新

## 更新前

先在旧版中执行“备份全部笔记”。

## 覆盖文件

解压完整项目包，将全部内容覆盖到现有仓库。不要只替换 `index.html`。

然后执行：

```bash
git add .
git commit -m "Update to V16.1 tablet toolbar and ink overscan"
git push
```

部署完成后访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=16.1
```

## iPad 操作

更新完成后：

1. 完全关闭所有旧 V15/V16 标签页。
2. 完全关闭从主屏幕打开的旧版应用。
3. 重新打开带 `?v=16.1` 的地址。
4. 等页面完成当前笔记初始化后，悬浮工具栏才会出现。

旧标签页可能仍持有 IndexedDB 连接，从而阻止新版数据库打开。
