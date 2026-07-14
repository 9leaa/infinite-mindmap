# GitHub Pages 部署与数据说明

## 部署

将本目录全部内容上传到 GitHub 仓库根目录。

仓库中已包含：

`.github/workflows/pages.yml`

在 GitHub 中打开：

`Settings → Pages → Source → GitHub Actions`

推送到 main 分支后即可部署。

## 浏览器存储

V15 使用 IndexedDB，而不是 localStorage 保存完整笔记。

优点：

- 可保存更多手写内容。
- 可保存更多图片和笔记。
- 不会因为几 MB 的 localStorage 上限而迅速报错。
- 首次打开会自动迁移旧版本本地数据。

注意：

- IndexedDB 仍与设备、浏览器和网站地址绑定。
- 从本地 HTML 切换到 GitHub Pages 地址，属于不同来源。
- 应先在旧地址“备份全部笔记”，再在新地址导入。
- 清除浏览器网站数据仍会删除笔记，因此仍需定期备份。

## 跨设备同步

当前推荐手动同步：

1. 旧设备备份全部笔记。
2. 将备份文件放入云盘。
3. 新设备导入完整笔记库。

后续自动同步需要登录、云数据库、离线队列和冲突解决。
