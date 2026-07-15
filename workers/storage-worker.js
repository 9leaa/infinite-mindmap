"use strict";

const DB_NAME = "infinite-mindmap-library-db";
const DB_VERSION = 5;
const LIBRARY_STORE = "library";
const BINARY_STORE = "binary-assets";
const INK_STORE = "ink-strokes";
const PDF_ANNOTATION_STORE = "pdf-annotations";

let dbPromise = null;

function openDatabase() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
        db.createObjectStore(LIBRARY_STORE);
      }
      if (!db.objectStoreNames.contains(BINARY_STORE)) {
        db.createObjectStore(BINARY_STORE);
      }
      if (!db.objectStoreNames.contains(INK_STORE)) {
        const store = db.createObjectStore(INK_STORE, { keyPath: "key" });
        store.createIndex("docId", "docId", { unique: false });
      }
      if (!db.objectStoreNames.contains(PDF_ANNOTATION_STORE)) {
        const store = db.createObjectStore(PDF_ANNOTATION_STORE, {
          keyPath: "key"
        });
        store.createIndex("docId", "docId", { unique: false });
        store.createIndex("assetId", "assetId", { unique: false });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => reject(
      request.error || new Error("无法打开 IndexedDB")
    );
    request.onblocked = () => reject(
      new Error("IndexedDB 被其他页面阻塞")
    );
  });
  return dbPromise;
}

async function transact(storeName, mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    callback(store);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(
      transaction.error || new Error("IndexedDB 事务失败")
    );
    transaction.onabort = () => reject(
      transaction.error || new Error("IndexedDB 事务被中止")
    );
  });
}

const handlers = {
  putLibrary: ({ snapshot, key }) =>
    transact(LIBRARY_STORE, "readwrite", store => {
      store.put(snapshot, key || "main");
    }),
  putStroke: ({ record }) =>
    transact(INK_STORE, "readwrite", store => {
      store.put(record);
    }),
  deleteStroke: ({ key }) =>
    transact(INK_STORE, "readwrite", store => {
      store.delete(key);
    }),
  putPdfAnnotation: ({ record }) =>
    transact(PDF_ANNOTATION_STORE, "readwrite", store => {
      store.put(record);
    }),
  deletePdfAnnotation: ({ key }) =>
    transact(PDF_ANNOTATION_STORE, "readwrite", store => {
      store.delete(key);
    }),
  ping: async () => true
};

self.addEventListener("message", async event => {
  const { id, type, payload } = event.data || {};
  try {
    const handler = handlers[type];
    if (!handler) throw new Error(`未知存储操作：${type}`);
    const result = await handler(payload || {});
    self.postMessage({ id, ok: true, result });
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      error: String(error?.message || error)
    });
  }
});
