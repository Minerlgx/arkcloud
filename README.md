# ArkCloud - 方舟雲計算

方舟雲計算科技有限公司官方網站

## 🏢 關於公司

- **公司名稱**：方舟雲計算科技有限公司
- **統一編號**：60345307
- **代表人**：週若傑
- **登記地址**：桃園市中壢區龍平里龍東路 116號(1樓)
- **核准設立日期**：2026-03-09

## 🌟 服務項目

AI 雲端運算 GPU 伺服器租賃服務

## 🚀 技術棧

### 前端
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- next-intl (i18n)

### 後端
- Next.js API Routes
- Prisma ORM
- NextAuth.js

### 數據庫
- PostgreSQL

### 部署
- Ubuntu 22.04+
- 1Panel
- PM2
- Nginx

## 📁 項目結構

```
arkcloud/
├── frontend/          # 前端應用
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   ├── components/  # React 組件
│   │   ├── lib/      # 工具函數
│   │   ├── messages/  # 國際化文案
│   │   └── styles/   # 全局樣式
│   └── ...
├── backend/          # 後端應用
│   ├── prisma/      # Prisma Schema
│   └── ...
└── DEPLOY.md        # 部署指南
```

## 🌐 國際化

支持繁體中文 (zh-TW) 和英文 (en)

## 📦 安裝

```bash
# 克隆項目
git clone https://github.com/Minerlgx/arkcloud.git
cd arkcloud

# 安裝前端依賴
cd frontend && npm install

# 安裝後端依賴
cd ../backend && npm install
```

## 🔧 配置

1. 複製環境變量配置
2. 配置數據庫連接
3. 設置支付接口

詳見 [DEPLOY.md](DEPLOY.md)

## 🚀 部署

詳見 [DEPLOY.md](DEPLOY.md)

## 📄 許可證

Proprietary - All Rights Reserved
