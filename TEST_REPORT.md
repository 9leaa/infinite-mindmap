# V18 架构与测试报告

## 产品边界

V18 以 V16.2 的界面、工具和数据模型为基线。代码中没有引入 Excalidraw，也没有用 Excalidraw 替换工具栏、节点、画笔、撤销或数据模型。

借鉴的仅是静态/交互分层、可见区域处理、帧合并和增量更新思想。

## 周期卡顿处理

V18 已停止：

- 编辑期间自动迁移旧文档
- 定时完整手写快照
- 手写后的定时整库保存
- `setInterval` 周期任务
- 平移时重绘全部历史笔迹

每条手写和 PDF 批注通过 Dedicated Worker 独立写入 IndexedDB。页面还提供 Long Tasks 监测：

```js
window.__mindmapDiagnostics
window.__mindmapRuntimeStats()
```

## 分块画布

- Tile：768×768 世界坐标
- 预加载：当前视口外一圈
- 平板上限：36 个 Tile
- 桌面上限：64 个 Tile
- 屏幕外 Tile 自动释放
- 新增和擦除仅标记相关 Tile
- 当前笔迹保留在独立交互 Canvas
- Tile、当前笔迹、激光和关系线共用一个 rAF 调度器

## 压感

采样保留：

```text
x / y / smoothed pressure / raw pressure / timestamp
tiltX / tiltY / altitudeAngle / azimuthAngle
```

主画布和 PDF 批注共用非线性压力曲线与速度修正。PDF 使用页面归一化坐标。

## PDF

项目包含 PDF.js 4.10.38 的：

- 主模块与 Worker
- Adobe CMaps
- 标准字体
- Image decoder 资源
- Apache 2.0 License

策略：

- 当前页高清
- 当前页前后两页预览
- 当前页前后五页元数据
- 当前页前后十二页之外释放 PageProxy
- 新页面完整渲染后原子替换旧 Canvas
- 已完成批注和正在书写批注使用两个 Canvas
- 批注模式中 Pencil 书写，手指仍可纵向滚动和双指缩放

## 自动测试

### 语法与结构

- 主应用 JavaScript：通过
- 存储 Worker JavaScript：通过
- HTML ID：221
- DOM 引用：221
- 重复 ID：0
- 缺失引用：0
- Excalidraw 引用：0
- `setInterval`：0
- 自动后台迁移调度器：0

### 压感和坐标

- 低压力模拟线宽：1.574
- 高压力模拟线宽：9.514
- 高低压力线宽比：约 6.04
- PDF 中心点正确映射到 `(0.5, 0.5)`
- 压力、时间和倾角数据保留

### Tile 合成测试

生成 1000 条、每条 40 个采样点的模拟笔迹：

- 索引 Tile：24
- 测试视口 Tile：9
- 绘制笔迹引用：750
- 9 个 Tile 总渲染时间：约 150ms

该结果是 Node Canvas 合成测试，不是 iPad 帧率测试。

### PDF 完整性测试

测试 PDF：

- 112,607 字节
- 4 页
- 嵌入字体、文本、矢量路径、透明图形和位图

结果：

- 总 PDF 操作符：396
- 提取文本项：20
- 4 页均成功完整渲染为 PNG
- 总 PNG 数据：749,854 字节

### 浏览器自动化限制

容器 Chromium 因 DBus、网络命名空间和浏览器策略限制，在本地 HTTP 页面启动时超时。因此没有声称完成真实浏览器端到端测试。

## 真实 iPad 必测

1. 连续书写 60 秒，检查性能状态。
2. 轻压和重压线宽。
3. Pencil 抬起后立即单指平移。
4. 500–1000 条笔迹后的跨区域移动。
5. 100KB、5MB 和复杂中文 PDF。
6. PDF 当前页完整性和相邻页预加载。
7. 批注模式下 Pencil 写字、手指滚动。
8. 缩放和改变面板宽度后批注位置。
9. 关闭重开后的笔迹与批注恢复。

## 边界

- 主应用仍保留单 HTML 形态，维护成本较高。
- 网页无法拥有 Notability 的原生 PDFKit、Metal 和系统 Pencil 管线。
- 首次冷启动 PDF 仍需解析约 345KB 主模块并启动约 1.4MB Worker。
- 超复杂 PDF 首次高清页耗时取决于页面内容，而不只取决于文件大小。
- Apple Pencil 的最终结论只能由真实设备给出。
