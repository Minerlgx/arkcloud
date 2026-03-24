# ArkCloud - 方舟雲計算

> 台灣 AI GPU 雲端伺服器租賃平台

## 功能特色

- 🖥️ GPU 伺服器產品展示與部署
- 💳 多種計費方式（月付/季付/年付）
- 👤 會員中心（實例管理、帳單查詢）
- 🔐 安全可靠的用戶認證系統
- 📱 響應式設計

## 技術棧

- **前端**: Next.js 14, React, Tailwind CSS, TypeScript
- **後端**: Express.js, Node.js
- **數據庫**: PostgreSQL
- **API**: RESTful API

## 快速開始

### 1. 克隆項目

```bash
git clone https://github.com/Minerlgx/arkcloud.git
cd arkcloud
```

### 2. 配置環境

```bash
# 複製環境變量示例
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 編輯配置文件
vim backend/.env
vim frontend/.env.local
```

### 3. 初始化數據庫

```bash
# 創建數據庫
createdb arkcloud

# 導入表結構
psql -d postgresql://user:password@localhost:5432/arkcloud -f scripts/init-db.sql
```

### 4. 安裝依賴

```bash
bash scripts/install.sh
```

### 5. 啟動服務

```bash
# 終端1: 啟動後端
bash scripts/start-backend.sh

# 終端2: 啟動前端（開發模式）
cd frontend && npm run dev

# 或啟動前端（生產模式）
bash scripts/start-frontend.sh
```

## 部署腳本

| 腳本 | 說明 |
|------|------|
| `scripts/install.sh` | 安裝所有依賴 |
| `scripts/deploy.sh` | 完整部署流程 |
| `scripts/start-backend.sh` | 啟動後端服務 |
| `scripts/start-frontend.sh` | 啟動前端服務 |

## 項目結構

```
arkcloud/
├── backend/          # 後端代碼
│   ├── src/
│   │   └── index.js  # API 入口
│   └── package.json
├── frontend/         # 前端代碼
│   ├── src/
│   │   ├── app/      # Next.js 頁面
│   │   ├── components/
│   │   └── lib/
│   └── package.json
├── scripts/         # 部署腳本
│   ├── deploy.sh
│   ├── install.sh
│   ├── init-db.sql
│   ├── start-backend.sh
│   └── start-frontend.sh
└── README.md
```

## 管理後台

訪問 `/admin` 進入管理後台

默認管理員: `liurui@cloudta.com.cn`

## License

MIT
