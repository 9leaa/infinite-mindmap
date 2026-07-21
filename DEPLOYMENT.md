# V18.4.3 富文本字号稳定修复部署

本版本只修改富文本字号选区和字号工具条状态，不修改画布、PDF、备份或附件生命周期。

完整覆盖仓库后执行：

```bash
git add -A
git commit -m "V18.4.3 fix rich text font size selection and defaults"
git push origin main
```

等待 GitHub Actions 完成，完全关闭旧标签页，再访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.4.3
```

## 验证

1. 新建自由文字，确认字号工具条显示 `22`。
2. 打开节点正文，确认默认显示 `16`。
3. 选中多行或整段文字，打开字号下拉框并选择新字号。
4. 确认全部选中文字都生效。
5. 再新建一个自由文字，确认没有显示上次选择的字号。
