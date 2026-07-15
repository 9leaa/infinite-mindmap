# 无限画布思维导图 V18.2

V18.2 继续使用原项目的自研画布、节点系统和压感笔引擎，不包含 Excalidraw。

## 本次主要修复

### PDF 偶发只写出一小段

根因不是线宽或压感，而是输入采样链存在四个缺口：

1. iPad WebKit 的 `getCoalescedEvents()` 有时存在但返回空数组，旧代码会把当前 `pointermove` 一并丢弃。
2. `pointerup` 的最终坐标没有加入笔迹。
3. `lostpointercapture` 会立即结束笔迹。
4. Pointer Events 已经开始后，Touch Events 后备通道不会再接管同一支 Pencil。

V18.2 改为：

- 空 coalesced 数组自动回退到原始 PointerEvent
- 保存 pointerup 最终坐标
- window 级 pointermove/up/cancel 保护
- lostpointercapture 不再直接截断
- Pointer 与 stylus Touch Events 写入同一条笔迹
- touchend 保存 changedTouches 最终坐标
- 单点和极短笔画也会保存

### PDF 页面升级不再打断书写

当前页从预览升级为高清时，如果 Pencil 正在该页书写，升级任务会暂缓。抬笔后再替换页面和调整批注 Canvas，避免书写过程中 Canvas 被重设尺寸。

### 页码判断

页面状态改为选择当前视口中可见面积最大的页面，避免正文仍主要显示第6页时顶部提前显示 `7/12`。

### 主画布同步修复

主画布也使用了相同的 coalesced 采样方式。V18.2 同步增加空数组回退、pointerup 最终坐标和 lostpointercapture 保护。

## 诊断

控制台执行：

```js
window.__mindmapRuntimeStats()
```

新增字段：

- `pdfPointerSamples`
- `pdfTouchSamples`
- `pdfHybridSessions`
- `pdfDeferredRenders`

## 部署地址

```text
https://9leaa.github.io/infinite-mindmap/?v=18.2
```
