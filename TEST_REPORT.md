# V18.4 ZIP 安全备份修复与测试报告

## 问题根因

旧版完整备份会依次执行：

```text
IndexedDB Blob
→ Base64 Data URL
→ 塞入整个笔记库对象
→ JSON.stringify 全部数据
```

Base64 会增加体积，整个对象序列化还会产生额外字符串副本。附件和 PDF 增长后，浏览器可能抛出 `Invalid string length`，iPad 还可能因内存压力重载页面。

## 修复范围

本版本只重构备份与恢复链路。以下功能未改：

- 自研 Tile 画布
- Apple Pencil 和压力采样
- PDF 页面渲染与批注交互
- 节点与连接
- 富文本
- 工具栏
- Storage Worker 与现有 IndexedDB Store

## 新备份格式

ZIP 中分别保存：

- `manifest.json`：格式版本、文件路径、数量和大小；
- `library.json`：笔记库设置和当前笔记索引；
- `documents/*.json`：节点、自由对象和资产元数据；
- `ink/**/*.json`：受控大小的手写分块；
- `annotations/**/*.json`：按页和大小切分的 PDF 批注；
- `assets/**/*`：原始 PDF、Office 二进制；
- `inline-images/**/*`：从节点和自由对象中提取的图片。

附件使用 ZIP Store Entry 直接写入，不转换 Base64。

## 输出策略

- 支持 File System Access API：ZIP 直接写入用户选择的文件流；
- 不支持该 API：使用 BlobWriter 生成标准 ZIP 下载；
- PDF 与 Office Entry 不重复压缩；
- JSON Entry 使用压缩；
- `bufferedWrite` 关闭，避免把单个大型附件完整缓存在 JavaScript 内存中。

## 恢复策略

- ZIP Entry 开启 CRC 校验；
- 附件恢复后校验实际 Blob 大小；
- 文档、资产 ID 重新映射；
- 手写、附件和 PDF 批注写回各自 IndexedDB Store；
- 任一步失败，回滚本次已写入的文档、笔迹、附件和批注；
- 恢复失败后回到导入前的当前笔记与设置；
- 保留旧版 JSON 导入。

## 自动测试

已执行并通过：

- 主应用 JavaScript 语法；
- zip.js ESM 语法；
- Storage Worker JavaScript 语法；
- 重复 HTML ID：0；
- 缺失 DOM 引用：0；
- 压感算法；
- 1000 笔 Tile 合成；
- 4 页复杂 PDF 渲染；
- Pointer 采样；
- V18.1、V18.2、V18.3 回归；
- V18.4 ZIP 静态回归；
- 8 MiB 二进制 ZIP 写入与读取；
- ZIP CRC 校验；
- Manifest 往返；
- 二进制未 Base64 化验证。

## 真实设备必须验证

- 当前真实笔记库完整备份；
- iPad Safari 大附件备份；
- Mac Chrome 直接写文件；
- ZIP 合并恢复；
- PDF 原文件、页数和批注；
- 备份中途取消；
- 存储空间不足和浏览器重载场景。

自动测试无法替代真实笔记库和真实 iPad 的最终验收。
