# V18.4.1 文件选择器热修复部署

本版本只修复 `showSaveFilePicker()` 和 `showOpenFilePicker()` 的扩展名过滤条件。

完整覆盖仓库后执行：

```bash
git add -A
git commit -m "V18.4.1 fix File System Access extension filters"
git push origin main
```

部署完成后完全关闭旧标签页，再访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.4.1
```

生成的完整备份文件仍是：

```text
mindmap-library-YYYY-MM-DD.mindmap-backup.zip
```
