# 无限画布思维导图 V18

V18 保留 V16 原有产品和交互，不使用 Excalidraw 作为画布内核。

## 保留功能

- 思维导图节点、父子关系、折叠和分支面板
- 自由文本、图片、PDF 和 Office 附件
- 原悬浮工具栏和纯净模式
- 钢笔、水彩笔、激光笔、橡皮
- Apple Pencil 压感
- 单指平移和双指缩放
- 多笔记管理、IndexedDB、本地备份恢复
- PDF 侧边连续阅读和手写批注

## V18 底层变化

- 768×768 世界坐标静态笔迹 Tile
- 当前笔迹独立交互 Canvas
- 一个 requestAnimationFrame 渲染调度器
- 压力、时间、倾角和方位采样
- 手写和 PDF 批注逐条写入存储 Worker
- 编辑期间不运行旧数据后台迁移
- PDF 当前页高清、相邻页预览、远页回收
- PDF 完整 CMap 与标准字体资源
- PDF 自定义压感批注层和归一化页面坐标

## 源码运行

```bash
npm ci
npm run prepare:vendor
python -m http.server 8080
```

访问 `http://localhost:8080/`。

## 测试

```bash
npm test
```

真实 Apple Pencil 和 iPad WebKit 行为仍需真实设备验收。
