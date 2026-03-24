# ArkCloud 部署指南

## 系統要求

- Ubuntu 22.04 LTS 或更高版本
- 最低 2GB RAM
- 20GB 磁盤空間

## 1Panel 安裝

```bash
curl -sSL https://resource.1panel.cn/quick/start.sh -o quick_start.sh && sudo bash quick_start.sh
```

## 1Panel 配置

### 1. 安裝 Docker
在 1Panel 應用商店中安裝 Docker

### 2. 安裝 Node.js
在 1Panel 應用商店中安裝 Node.js (v20.x)

### 3. 安裝 PostgreSQL
在 1Panel 應用商店中安裝 PostgreSQL 15+

#### 創建數據庫
```bash
# 通過 1Panel 的數據庫管理界面創建：
# 數據庫名：arkcloud
# 用戶名：arkcloud
# 密碼：[設置強密碼]
```

### 4. 安裝 Nginx
在 1Panel 應用商店中安裝 Nginx（反向代理）

## 部署應用

### 1. 克隆項目

```bash
cd /www
git clone https://github.com/Minerlgx/arkcloud.git
cd arkcloud
```

### 2. 配置環境變量

```bash
# 複製環境變量模板
cp backend/.env.example backend/.env

# 編輯環境變量
nano backend/.env
```

主要配置項：
```
DATABASE_URL="postgresql://arkcloud:[密碼]@[主機]:5432/arkcloud"
NEXTAUTH_SECRET="[生成隨機密鑰]"
NEXTAUTH_URL="https://arkcloud.top"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

### 3. 安裝依賴

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 4. 初始化數據庫

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. 配置反向代理

在 1Panel 中創建反向代理：
- 域名：arkcloud.top
- 協議：http
- 目標地址：http://127.0.0.1:3000
- SSL：啟用（Let's Encrypt）

### 6. 啟動應用

#### 使用 PM2 進程管理器

```bash
# 安裝 PM2
npm install -g pm2

# 啟動後端
cd backend
pm2 start npm --name "arkcloud-api" -- start

# 啟動前端
cd ../frontend
pm2 start npm --name "arkcloud-web" -- start

# 保存 PM2 配置
pm2 save
pm2 startup
```

### 7. 配置自動啟動

```bash
pm2 install ubuntu-autostart
```

## SSL 證書配置

在 1Panel 中為 arkcloud.top 申請 Let's Encrypt 免費證書

## 更新部署

```bash
cd /www/arkcloud
git pull

# 更新前端
cd frontend && npm install && npm run build

# 更新後端
cd ../backend && npm install && npx prisma db push

# 重啟服務
pm2 restart all
```

## 常見問題

### 數據庫連接失敗
- 檢查 PostgreSQL 是否運行
- 確認防火牆開放 5432 端口
- 驗證 DATABASE_URL 配置正確

### 端口被佔用
```bash
lsof -i :3000
lsof -i :3001
```

### 清理 PM2 日誌
```bash
pm2 flush
```

## 技術支援

如需幫助，請聯繫：support@arkcloud.top
