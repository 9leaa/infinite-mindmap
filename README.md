# 无限画布思维导图 V17

V17 是一次完整重构：

- Excalidraw 负责无限画布、手写、触摸、平移、缩放、选择和撤销。
- PDF.js 官方 PDFViewer 负责连续阅读与 Annotation Editor。
- IndexedDB 使用增量元素存储，普通保存不再写入整张场景。
- PDF Blob 与画布数据完全分离。
- 支持多笔记、思维导图节点、PDF 文件卡片、ZIP 备份恢复和 V16 迁移。

## 环境

- Node.js 20.19 或更高版本
- npm 10 或更高版本

## 开发

```bash
npm ci
npm run typecheck
npm run dev
```

## 构建

```bash
npm run build
```

构建结果位于 `dist/`。

## 核心目录

```text
src/App.tsx                    主应用与 Excalidraw 集成
src/components/PdfWorkspace.tsx  PDF.js Viewer 与批注
src/db.ts                      增量 IndexedDB
src/backup.ts                  ZIP 备份恢复
src/legacy.ts                  V16 一次性迁移
src/excalidraw-utils.ts        节点、子节点和 PDF 卡片
public/sw.js                   离线缓存
```

## 测试和限制

完整测试数据、架构说明和未验证项见：

`V17_ARCHITECTURE_PERFORMANCE_TEST_REPORT.md`
