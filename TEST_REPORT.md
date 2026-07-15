# 无限画布思维导图 V17：架构、性能与测试报告

## 1. 结论

V17 不是在 V16 单文件上继续修改，而是重新建立了模块化工程：

- 无限画布、自由绘制、选择、缩放、平移和撤销交给 Excalidraw。
- PDF 连续阅读和批注层交给 PDF.js 官方 `PDFViewer` 与 Annotation Editor。
- 笔记元数据、Excalidraw 元素、Excalidraw 文件和 PDF Blob 分开保存。
- 编辑过程中不存在按 3 秒、5 秒或其他固定周期运行的完整快照任务。
- 普通保存只写发生版本变化的 Excalidraw 元素；平移和缩放只更新轻量文档元数据。
- PDF 不参与画布自动保存。

## 2. 主要技术栈

| 模块 | 版本 | 用途 |
|---|---:|---|
| React | 18.3.1 | 应用界面 |
| Excalidraw | 0.18.1 | 无限画布与手写内核 |
| PDF.js | 4.10.38 | 连续 PDF 阅读、批注编辑和保存 |
| idb | 8.0.3 | IndexedDB 封装 |
| fflate | 0.8.2 | ZIP 备份与恢复 |
| TypeScript | 5.9.3 | 类型检查 |
| Vite | 8.1.4 | 构建与代码分割 |

## 3. 画布架构

V17 删除了旧版自研的以下内容：

- 手写 Canvas 重绘器；
- Pointer Events 与 Touch Events 的多通道手势路由；
- 自定义笔画级坐标采样和重绘；
- 自定义选择、缩放、撤销和自由绘制状态机；
- 扩大 Canvas 视口并手动预渲染周边笔迹的方案。

现在由 Excalidraw 统一负责：

- Apple Pencil/触摸/鼠标输入；
- 自由绘制；
- 单指/双指手势；
- 视口裁剪；
- 静态与交互渲染；
- 元素选择、移动和缩放；
- 撤销与重做。

应用层只负责笔记库、思维导图节点语义、PDF 文件卡片、备份和本地存储。

## 4. 增量 IndexedDB

数据库名称：`infinite-mindmap-v17-db`

数据库版本：2

| Store | 内容 |
|---|---|
| `documents` | 标题、时间和轻量 AppState，不嵌入全部元素 |
| `sceneElements` | 每个 Excalidraw 元素一条记录 |
| `sceneFiles` | 每个 Excalidraw 二进制文件一条记录 |
| `pdfs` | PDF 原始或已批注 Blob |
| `settings` | 当前笔记、侧边栏和 PDF 面板宽度 |

保存流程：

1. Excalidraw `onChange` 产生场景。
2. 使用元素 `id/version/versionNonce/isDeleted` 计算修订值。
3. 修订值未变化时，不安排保存。
4. 修改停止约 900ms 后，等待浏览器空闲和无待处理输入。
5. 只向 `sceneElements` 写版本发生变化的元素。
6. 新图片等文件只写一次 `sceneFiles`。
7. 平移、缩放和主题等视图变化只更新轻量 `documents` 记录。

这避免了每完成一笔就结构化克隆整张画布。

### 数据库升级

V17 数据库 v1 曾把完整场景保存在 `documents`。升级到 v2 时，在编辑器打开前一次性把元素和文件拆分到新 Store，然后清空文档记录中的大数组。

V16 旧数据库迁移同样在进入编辑器前执行，不在用户写字过程中后台运行。

## 5. PDF 架构

### 5.1 存储

PDF 始终作为 Blob 独立保存在 `pdfs` Store。画布场景只保存文件卡片中的 `assetId`。

因此：

- 写字不会复制 PDF；
- 移动画布不会写入 PDF；
- 普通场景保存不会解析 PDF；
- 只有打开 PDF 时才读取对应 Blob。

### 5.2 连续阅读

右侧阅读区直接使用 PDF.js 官方 Web Viewer 组件：

- `EventBus`
- `PDFLinkService`
- `PDFFindController`
- `PDFViewer`

页面使用官方渲染队列。测试中的四页 PDF 创建了四个页面节点，但当前附近只有两个 Canvas，说明没有一次栅格化全部页面。

### 5.3 批注

阅读器使用 PDF.js Annotation Editor：

- Ink 钢笔；
- Highlight 高亮；
- FreeText 文字；
- 颜色和粗细参数。

批注修改后进入“待保存”，停止约 12 秒后在空闲期调用公开 API `pdfDocument.saveDocument()`，将批注真正写入新的 PDF Blob。

关闭阅读器时：

- 面板立即执行退出动画，释放画布区域；
- 若有待保存批注，最多等待 6 秒执行保存；
- 随后卸载 PDFViewer 并清理 PDF.js 资源。

## 6. 用户功能

- 多笔记库；
- 新建、切换、复制和删除笔记；
- 新建思维导图节点；
- 为选中节点创建子节点和连接线；
- Excalidraw 原生自由绘制、形状、文本和图片；
- 导入 PDF 并在画布生成文件卡片；
- 左画布、右 PDF 连续阅读；
- PDF 钢笔、高亮和文字批注；
- 下载带批注 PDF；
- ZIP 完整备份和恢复；
- V16 数据一次性迁移；
- 浏览器长任务诊断面板；
- Service Worker 离线缓存。

## 7. 自动检查结果

### 7.1 构建检查

- `npm run typecheck`：通过。
- `npm run build`：通过。
- 构建器：Vite 8.1.4。
- Source Map：正式构建关闭。
- `npm audit`：0 个已知漏洞。

为修复上游依赖审计项，锁定了：

- `lodash-es` 4.18.1；
- Excalidraw 使用的 `nanoid` 3.3.8；
- Mermaid 转换链使用的 `nanoid` 5.0.9。

### 7.2 场景保存与空闲测试

Headless Chromium 合成测试：

1. 页面启动；
2. 新增一个思维导图节点；
3. 等待 12 秒；
4. 记录动画帧间隔和保存状态。

结果：

| 指标 | 结果 |
|---|---:|
| 保存状态 | 已保存 |
| 动画帧 P99 | 约 17ms |
| 大于 100ms 的帧间隔 | 0 |
| 大于 500ms 的帧间隔 | 0 |

测试没有复现旧版每隔数秒冻结约三秒的现象。

PerformanceObserver 中的长任务主要发生在 Excalidraw 首次模块启动阶段；测试开始后的 12 秒空闲窗口没有出现对应的周期性三秒冻结。

### 7.3 100KB PDF 测试

测试文件：

- 108,841 字节；
- 4 页；
- 未压缩随机文本内容。

Headless Chromium 合成结果：

| 指标 | 结果 |
|---|---:|
| 右侧面板可见 | 约 612ms |
| PDFViewer 就绪 | 约 1,139ms |
| 页面节点 | 4 |
| 当前已栅格化 Canvas | 2 |
| 状态 | 4 页 · 连续阅读 |
| 页面错误 | 0 |

测试运行在文件路由模拟环境，PDF Worker 无法通过该模拟域名正常启动，因此 PDF.js 回退到 fake worker。正式 GitHub Pages 会使用构建产物中的独立 Worker；本次容器测试不能替代真实网络和真实 iPad 测试。

### 7.4 PDF 阅读器基本操作

已验证：

- 三页 PDF 连续页面创建；
- 当前附近页面按需 Canvas 渲染；
- 钢笔模式按钮成功切换为 active；
- PDF 面板成功关闭；
- 关闭后阅读区 DOM 完全卸载；
- 页面运行错误为 0。

未验证：

- 真实 Apple Pencil 在 PDF 页面产生墨迹；
- 真实笔迹保存后重新打开 PDF 的恢复结果。

原因是 Chromium 合成 Mouse/Pointer 事件无法完整触发 PDF.js Ink Drawing Session。批注模式、Annotation Editor Layer 和保存代码路径已经接入，但必须在真实 iPad 上完成最终验收。

### 7.5 备份恢复测试

测试步骤：

1. 新增节点；
2. 导入 PDF；
3. 导出 ZIP；
4. 在同一应用重新导入该 ZIP。

结果：

| 指标 | 结果 |
|---|---:|
| 导入前笔记 | 1 |
| 导入后笔记 | 2 |
| 数据库文档 | 2 |
| 场景元素记录 | 4 |
| PDF Blob | 2 |
| 页面错误 | 0 |

导入时会重新生成 PDF ID，并同步修改 PDF 卡片的链接和 `assetId`，避免覆盖现有 PDF。

### 7.6 数据库 v1 → v2 升级测试

预先创建 V17 v1 数据库，其中一个文档嵌入一个完整场景元素。启动 V17 后结果：

| 指标 | 结果 |
|---|---:|
| 数据库版本 | 2 |
| 文档中嵌入元素 | 0 |
| `sceneElements` 记录 | 1 |
| 文档标题恢复 | 正常 |
| 页面错误 | 0 |

## 8. 真实设备验收清单

正式替换旧版前，在 iPad Chrome 上执行：

1. 连续使用 Apple Pencil 书写 30 秒。
2. 书写后等待 5 秒、10 秒和 30 秒，观察性能面板。
3. Pencil 抬起后立即使用手指平移。
4. 反复缩放和平移 3 分钟。
5. 导入 100KB、5MB 和 50MB PDF。
6. 验证连续多页滚动。
7. 在 PDF 中分别测试钢笔、高亮和文字。
8. 点击“保存批注”，关闭并重新打开 PDF。
9. 下载 PDF，并在系统阅读器中确认批注。
10. 备份全部笔记，再在另一浏览器导入。

## 9. 已知边界

1. 本环境没有真实 iPad 和 Apple Pencil，无法声称完成硬件实测。
2. GitHub Pages 首次打开仍需要下载 Excalidraw 主包；后续由 Service Worker 缓存。
3. Excalidraw 自带一些按需图表转换模块，构建目录中文件较多，但不会在普通手写过程中全部执行。
4. 大型完整备份仍需要读取所有 PDF 并压缩 ZIP，该操作本身可能耗时；它不会在后台自动运行。
5. 旧版 V16 迁移是尽力转换，复杂自定义样式可能无法一比一恢复。
