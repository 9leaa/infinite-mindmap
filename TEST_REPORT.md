# V18.4.1 文件选择器错误修复报告

## 现象

```text
Failed to execute 'showSaveFilePicker' on 'Window':
Extension '.mindmap-backup.zip' contains invalid characters.
```

## 根因

File System Access API 的 `types[].accept` 字段接收的是扩展名过滤条件，而不是完整文件名后缀。

错误配置：

```js
"application/zip": [
  ".mindmap.zip",
  ".mindmap-backup.zip",
  ".zip"
]
```

正确配置：

```js
"application/zip": [".zip"]
```

同理，JSON 打开过滤条件应使用 `.json`，而不是 `.mindmap.json`。

## 修复范围

只修改：

- ZIP 保存文件选择器；
- ZIP/JSON 打开文件选择器；
- HTML 文件输入过滤条件；
- 版本号和 Service Worker 缓存名。

未修改：

- ZIP 备份内容；
- ZIP 恢复；
- PDF、画布和 Pencil；
- 节点和富文本；
- IndexedDB 和 Storage Worker。

## 自动检查

- 主应用 JavaScript 语法通过；
- Storage Worker JavaScript 语法通过；
- HTML 重复 ID：0；
- DOM 缺失引用：0；
- 保存选择器只使用 `.zip`；
- 打开选择器只使用 `.zip` 和 `.json`；
- `.mindmap-backup.zip` 和 `.mindmap.zip` 建议文件名保留；
- V18.4 ZIP 导出与恢复关键代码保留。
