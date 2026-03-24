# ArkCloud - 方舟雲計算

> 台灣 AI GPU 雲端伺服器租賃平台

**GitHub**: https://github.com/Minerlgx/arkcloud

---

## 🚀 快速部署

### 方式一：使用部署腳本（一鍵部署）

```bash
# 克隆項目
git clone https://github.com/Minerlgx/arkcloud.git
cd arkcloud

# 一鍵部署
bash scripts/deploy.sh
```

### 方式二：手動部署

#### 1. 安裝依賴

```bash
# 後端
cd backend && npm install && cd ..

# 前端
cd frontend && npm install && cd ..
```

#### 2. 配置環境變量

```bash
# 後端
cp backend/.env.example backend/.env
vim backend/.env

# 前端
cp frontend/.env.local.example frontend/.env.local
vim frontend/.env.local
```

#### 3. 初始化數據庫

```bash
# 創建數據庫
psql -c "CREATE DATABASE arkcloud;"

# 導入表結構
psql -d postgresql://user:password@localhost:5432/arkcloud -f scripts/init-db.sql
```

#### 4. 啟動服務

```bash
# 後端 (端口 3001)
bash scripts/start-backend.sh

# 前端 (端口 3000)
bash scripts/start-frontend.sh
```

---

## 📁 項目結構

```
arkcloud/
├── backend/                    # 後端
│   ├── src/index.js          # API 入口
│   ├── package.json
│   └── .env.example          # 環境變量示例
├── frontend/                   # 前端
│   ├── src/
│   │   ├── app/              # 頁面
│   │   ├── components/      # 組件
│   │   └── lib/             # 工具函數
│   ├── package.json
│   └── .env.local.example    # 環境變量示例
├── scripts/                    # 部署腳本
│   ├── deploy.sh             # 一鍵部署
│   ├── install.sh            # 安裝依賴
│   ├── start-backend.sh      # 啟動後端
│   ├── start-frontend.sh     # 啟動前端
│   └── init-db.sql          # 數據庫初始化
└── README.md
```

---

## ⚙️ 環境變量配置

### 後端 (backend/.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/arkcloud
PORT=3001
```

### 前端 (frontend/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📦 部署腳本說明

| 腳本 | 說明 |
|------|------|
| `bash scripts/deploy.sh` | 完整部署流程（安裝依賴 + 構建） |
| `bash scripts/install.sh` | 只安裝依賴 |
| `bash scripts/start-backend.sh` | 啟動後端服務 |
| `bash scripts/start-frontend.sh` | 啟動前端服務 |
| `psql ... init-db.sql` | 初始化數據庫表 |

---

## 🔐 管理後台

- URL: `http://localhost:3000/admin`
- 管理員郵箱: `liurui@cloudta.com.cn`
- 密碼: （在數據庫中設置）

---

## 🛠️ 技術棧

- **前端**: Next.js 14, React, Tailwind CSS, TypeScript
- **後端**: Express.js, Node.js
- **數據庫**: PostgreSQL
- **端口**: 前端 3000, 後端 3001

---

## 📝 常用命令

```bash
# 開發模式
cd frontend && npm run dev

# 生產構建
cd frontend && npm run build

# 查看 Git 狀態
git status

# 提交代碼
git add . && git commit -m "message" && git push
```

---

## 🔧 故障排除

### 後端無法啟動
```bash
# 檢查數據庫連接
psql $DATABASE_URL -c "SELECT 1;"

# 檢查端口
lsof -i :3001
```

### 前端無法連接後端
```bash
# 確認後端運行
curl http://localhost:3001/api/health

# 檢查環境變量
cat frontend/.env.local
```

### 數據庫問題
```bash
# 重建數據庫
psql -c "DROP DATABASE arkcloud;"
psql -c "CREATE DATABASE arkcloud;"
psql -d $DATABASE_URL -f scripts/init-db.sql
```
