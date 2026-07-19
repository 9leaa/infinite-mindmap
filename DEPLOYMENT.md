# V18.4.2 附件生命周期修复部署

## 更新前

不要清除浏览器网站数据。部署后，旧版本遗留的孤立附件会在页面空闲时自动清理。

## 部署

解压完整部署包并覆盖仓库根目录：

```bash
git add -A
git commit -m "V18.4.2 fix deleted asset lifecycle and backup filtering"
git push origin main
```

等待 GitHub Actions 完成，完全关闭旧标签页，再访问：

```text
https://9leaa.github.io/infinite-mindmap/?v=18.4.2
```

## 验证

1. 导入一个测试 PDF。
2. 生成一次备份，确认 ZIP 中包含该 PDF。
3. 删除画布中的全部该 PDF 卡片和页面。
4. 再生成备份，确认 ZIP 中不再包含该 PDF。
5. 刷新或重新打开应用，让启动清理释放旧二进制。
6. 不要在确认新备份可恢复前清除原网站数据。
