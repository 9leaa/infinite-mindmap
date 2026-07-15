# V18 GitHub Pages 部署说明

## 更新前

在现有正式版本中先执行“备份全部笔记”。未备份时不要清除网站数据。

## 部署

解压完整部署包，用其中全部内容覆盖仓库根目录：

```bash
git add -A
git commit -m "V18 custom tile canvas and pressure PDF annotations"
git push origin main
```

等待 GitHub Actions 完成后访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18
```

## 必须上传

```text
workers/
vendor/
vendor/cmaps/
vendor/standard_fonts/
.github/workflows/
```

不能只上传 `index.html`。缺少 CMap 或字体资源时，部分 PDF 可能出现文字或元素不完整。

## iPad 更新步骤

1. 等待 Pages 部署成功。
2. 完全关闭旧标签页和旧主屏幕应用。
3. 重新打开带 `?v=18` 的地址。
4. 先用测试笔记验证书写、平移和 PDF。
5. 未完成备份前不要清除网站数据。
