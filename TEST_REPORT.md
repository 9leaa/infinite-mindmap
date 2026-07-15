# V18.1 六项问题定位与修复报告

## 问题1：抬笔后笔迹消失

根因是提交顺序错误。`indexInkStroke()` 会忽略等于 `currentStroke` 的对象，而抬笔逻辑此前在清空 `currentStroke` 之前调用 Tile 提交。

修复：先令 `currentStroke = null`，再提交到 Tile。

## 问题2：PDF 页面仍显示加载文字

根因是 PDF 主 Canvas 已插入 DOM 后，仍需等待两个批注 Canvas 初始化、重绘和工具状态更新，最后才隐藏加载层。任一步骤异常都会留下白色遮罩。

修复：主 Canvas 完成后立即隐藏加载层。批注层放入独立错误边界。

## 问题3：PDF 写字时页面移动

根因是批注 Canvas 使用 `touch-action: pan-y pinch-zoom`，并且只处理标准 Pointer Events。iPad 在书写期间仍可能将动作交给滚动容器。

修复：Pencil 会话期间冻结 PDF scrollTop/scrollLeft、关闭 overscroll，并增加 stylus Touch Events 后备通道。

## 问题4：PDF 不能拖到最大

根因是代码明确将最大宽度限制为窗口的 72%。

修复：上限改为约98%，宽度超过82%时隐藏左侧笔记库；拖动监听移动到 window。

## 问题5：节点/子节点行为异常

根因有两个：

1. “节点”按钮在已经选中节点时调用了 `addChildNode()`，与“子节点”重复。
2. `focusTitle(nodeId)` 内部错误使用了未定义的 `node.id`。

修复：节点始终创建根节点；子节点要求父节点；修复标题聚焦变量。

## 问题6：一个节点无法连续连接多个目标

数据模型本身允许一个父节点拥有多个子节点，但界面每完成一次连接就退出连接模式并清空父节点。

修复：完成连接后保留连接模式和父节点，允许连续点击多个目标。

## 自动检查

- 主脚本语法检查通过
- HTML重复ID：0
- DOM缺失引用：0
- 原压力算法测试通过
- 1000笔Tile合成测试通过
- 4页复杂PDF渲染测试通过
- 六项V18.1回归静态测试通过

真实 iPad 的 Pencil、滚动和拖动仍需设备验收。
