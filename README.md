# ccvlog操作流程
1. 把xlsx放到對應的資料夾
2. step1namelist.py 注意要抓的月份
3. step2xtj.py

## 網頁結構（重構後）
- 側邊欄由 `sidebar-config.json` 與 `js/sidebar.js` 驅動；新增年度或群組時請編輯 `sidebar-config.json`，再執行 `python build_pages.py` 重新產生各年度/群組的 HTML。
- 共用腳本：`js/common.js`（側欄開關）、`js/sidebar.js`（側欄渲染）、`js/main.js`（圖表與表格）。
