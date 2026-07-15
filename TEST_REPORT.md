# V18.2 问题定位与审计报告

## 用户现象

在同一 PDF 页面连续画几条近似等长的线时，大部分线正常，部分线只保留起始的一小段。截图还显示顶部状态为 `7/12`，但当前大面积可见页面的页脚是“第6页”。

## 短笔迹根因

### 1. 空 coalesced events

旧代码只要浏览器提供 `getCoalescedEvents()` 就完全使用其结果。iPad WebKit 偶尔会返回空数组，此时这一整个 pointermove 不会产生任何点。

### 2. 缺少 pointerup 最终点

快速短笔画可能只有 pointerdown、少量 pointermove 和 pointerup。旧代码没有记录 pointerup 坐标，因此尾段可能明显缺失。

### 3. lostpointercapture 过早结束

旧版在 `lostpointercapture` 时立即提交笔迹。iPad WebKit 可能在 Pencil 尚未抬起时短暂丢失捕获，于是笔迹只剩前一小段。

### 4. Touch 后备未真正补充 Pointer 流

iPad 通常同时发出 Pointer 和 Touch 事件。旧代码在 Pointer 会话存在时直接跳过 Touch 会话，因此 Pointer 流一旦中断，Touch 后备也无法补点。

### 5. 页面高清升级重设批注 Canvas

当前页从低分辨率升级为高清时，会重新设置批注 Canvas 的尺寸。若升级恰好在书写中完成，实时笔迹层会被清空或重绘。

## 修复

- 新增 `pointerSamplesWithFallback()`
- 空 coalesced 数组回退到原事件
- pointerup 与 touchend 追加最终坐标
- window 级 Pointer 守卫
- lostpointercapture 不再直接提交
- Pointer/Touch 混合采样到同一笔迹
- 当前页渲染升级在抬笔后恢复
- 单点笔迹按圆点绘制并保存
- 主画布同步采用相同安全采样
- 页码依据最大可见面积计算

## 额外发现

### 单点笔迹会被丢弃

旧 PDF 批注要求至少两个点才保存，写中文、英文时的点、短撇或轻触可能消失。现已允许一个点并绘制圆点。

### 页码会提前跳到下一页

旧算法比较页面顶部到固定参考线的距离。当上一页很高、下一页仅露出底部时，下一页可能更接近参考线。现改为比较实际可见高度。

### 主画布也有相同采样隐患

主画布同样直接信任空 coalesced 数组，并且不保存 pointerup 最终坐标。此次一并处理，避免以后在普通画布复现短笔迹。

## 自动检查

- 主应用 JavaScript 语法通过
- Storage Worker JavaScript 语法通过
- 重复 HTML ID：0
- 缺失 DOM 引用：0
- 原有压力算法测试通过
- 1000笔 Tile 合成测试通过
- 4页复杂 PDF 渲染测试通过
- coalesced 空数组与最终坐标单元测试通过
- V18.1 六项回归测试通过
- V18.2 八项回归测试通过

## 真实设备仍需验证

- 快速连续写横、竖、撇、捺各20次
- 慢速长线与快速长线
- 页边缘和页面中间书写
- PDF 预览刚显示后立即书写
- 主画布快速短笔画与单点
- 页面6/7交界处的页码状态
