# 无限画布思维导图 V16

V16 是一次稳定架构重构，而不是继续为 V15 增加补丁。

核心变化：

- 每条手写笔迹独立写入 IndexedDB。
- PDF 批注按笔画独立写入。
- PDF/Office 原文件使用独立 Blob Store。
- 结构元数据保存不再携带全部笔迹和 PDF 批注。
- 手写撤销改为笔画级命令。
- 画布平移使用 GPU 位图移动，结束后只重绘一次。
- Pencil 与手指只使用 Pointer Events。
- PDF 默认使用浏览器原生快速阅读。
- PDF.js 只在用户主动进入批注模式时加载。
- 提供待保存、保存中、已保存和保存失败状态。

详细设计、测试数据和限制见：

`V16_ARCHITECTURE_AND_PERFORMANCE_AUDIT.md`
