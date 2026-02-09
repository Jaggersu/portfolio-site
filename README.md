# 桃園市保全人員職業工會 - 發起人招募表單

## 檔案結構

```
security-union-website/
├── index.html                 # 主要首頁
├── join-founder.html          # 發起人招募表單頁面
├── styles.css                 # 樣式表
├── script.js                  # 主要 JavaScript 檔案
├── founder-form.js            # 表單專用 JavaScript 檔案
├── images/                    # 圖片資料夾
│   └── logo.png              # 工會 Logo
└── README.md                  # 說明文件
```

## 功能說明

### 發起人招募表單 (`join-founder.html`)

**表單欄位：**
- 姓名 (必填)
- 聯絡電話 (必填)
- LINE ID (選填)
- 目前的職業 (必填，下拉選單：保全人員/物業管理/其他)

**功能特色：**
- 專業、乾淨的設計風格
- 使用工會主色調 (深藍色 + 金色)
- 完整的表單驗證
- 載入動畫和錯誤處理
- 響應式設計，支援手機和桌面

### JavaScript 功能

**表單驗證：**
- 即時驗證各欄位
- 清晰的錯誤提示
- 必填欄位檢查

**資料傳送：**
- 使用 Fetch API 傳送到 Google Apps Script
- POST 方法傳送 JSON 格式資料
- 載入狀態顯示

**使用者體驗：**
- 送出時按鈕變暗並顯示「傳送中...」
- 成功後顯示感謝訊息
- 3秒後自動導回首頁
- 失敗時顯示錯誤提示

## 後端 API

**API 網址：**
```
https://script.google.com/macros/s/AKfycbzd0j6hHqQJ8kocguXluFJYO_6zYNzwSqLWp8vDQduBXeCv_YPWfsh7x52Vjw9k8TZJ/exec
```

**傳送格式：**
```json
{
    "type": "founder",
    "姓名": "使用者姓名",
    "電話": "0912345678",
    "LINE_ID": "user_line_id",
    "職業": "保全人員",
    "提交時間": "2026/01/01 12:00"
}
```

## 使用方式

1. **訪問表單：**
   - 從首頁點擊「成為發起人」按鈕
   - 或直接訪問 `join-founder.html`

2. **填寫表單：**
   - 填寫必填欄位（姓名、電話、職業）
   - LINE ID 為選填欄位

3. **送出申請：**
   - 點擊「送出申請」按鈕
   - 等待傳送完成
   - 成功後會顯示感謝訊息並導回首頁

## 技術特色

### 前端技術
- **HTML5** 語意化標籤
- **CSS3** 響應式設計和動畫
- **Vanilla JavaScript** 無需框架依賴
- **Fetch API** 現代化的網路請求

### 設計特色
- **Material Design** 靈感的表單設計
- **微互動** 懸停效果和過渡動畫
- **無障礙** 語意化 HTML 和鍵盤導航
- **SEO 友善** 語意化結構和 meta 標籤

### 安全性
- **表單驗證** 前端和後端雙重驗證
- **XSS 防護** 輸入內容過濾
- **CSRF 防護** 使用 Fetch API 的安全模式

## 瀏覽器支援

- **現代瀏覽器：** Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **行動瀏覽器：** iOS Safari 12+, Chrome Mobile 60+
- **不支援：** Internet Explorer

## 部署說明

1. **上傳檔案：**
   - 將所有檔案上傳到網頁伺服器
   - 確保 `images/logo.png` 存在

2. **測試表單：**
   - 測試表單驗證功能
   - 測試資料傳送到 Google Apps Script
   - 測試響應式設計

3. **設定 Google Apps Script：**
   - 確保後端 API 正常運作
   - 設定適當的權限和限制

## 維護說明

### 定期檢查
- 檢查 API 連線狀態
- 測試表單功能
- 更新安全設定

### 更新內容
- 修改表單欄位：編輯 `join-founder.html`
- 調整樣式：編輯 `styles.css`
- 修改功能：編輯 `founder-form.js`

## 聯絡資訊

如有技術問題或需要修改，請聯絡開發人員。
