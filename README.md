# 无限画布思维导图 V16.2

## 1. iPad 选择钢笔后无法使用手指平移

V16.1 把接触宽度超过 48px 的触摸判断为手掌。iPad 上正常手指经常超过这个值，因此手指在进入平移逻辑前就被拦截。

V16.2 已修改：

- 删除单指平移中的 48px 和 64px 接触面积拦截。
- Apple Pencil 继续使用 Pointer Events。
- iPad Chrome/Safari 增加 Touch Events 专用手指平移通道。
- Pencil 触摸通过 `touchType=stylus`、接触半径、压力和当前落笔状态过滤。
- Pencil 抬起后，手指移动约 4px 即开始平移。
- iPad 上的 Touch Events 和 Pointer Events 不会同时移动画布。

## 2. PDF 阅读方式更换

V16.1 的右侧“快速阅读”使用 iframe 嵌入浏览器原生 PDF。iPad Chrome 实际使用 WebKit，这种嵌入方式可能只显示一页、吞掉滚动和关闭手势。

V16.2 不再使用 PDF iframe。

现在流程：

1. 打开 PDF 后加载项目内的 PDF.js。
2. 显示连续多页列表。
3. 第一页立即优先渲染。
4. 第二页随后预加载。
5. 其他页面靠近阅读区域时再创建 Canvas。
6. 阅读模式和批注模式共用同一份已解析 PDF。
7. 切换到批注模式不会重新加载整份 PDF。
8. 右上角始终显示“系统打开”和“×”关闭按钮。

## 3. PDF.js 加载方式

V16.1 使用动态 ESM：

`import("./vendor/pdf.min.mjs")`

V16.2 改为经典脚本：

`vendor/pdf.bundle.js`

这样避开 iPad WebKit 上动态导入主模块失败的问题。

Worker 继续使用：

`vendor/pdf.worker.min.mjs`

若 Worker 模式失败，会自动尝试兼容模式。引擎加载和 PDF 解析均有超时，不再无限停留在“启动中”。

## 4. PDF 退出与错误恢复

- 关闭按钮位于 PDF 面板最高层，不在可横向滚动的工具栏内部。
- PDF 仍在加载时也可以立即关闭。
- 关闭会使当前加载会话失效；旧异步任务完成后不会再次打开面板。
- 加载失败会显示明确错误、重新加载和系统打开按钮。
- Service Worker 会提前缓存 PDF 引擎文件。
