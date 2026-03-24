#!/bin/bash
set -e

echo "=========================================="
echo "   ArkCloud 部署腳本 v1.0"
echo "=========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 請先安裝 Node.js"
    exit 1
fi

# 检查 PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ 請先安裝 PostgreSQL"
    exit 1
fi

# 1. 安装后端依赖
echo "📦 安裝後端依賴..."
cd backend
npm install
cd ..

# 2. 安装前端依赖
echo "📦 安裝前端依賴..."
cd frontend
npm install
cd ..

# 3. 构建前端
echo "🔨 構建前端..."
cd frontend
npm run build
cd ..

echo ""
echo "=========================================="
echo "   部署完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 配置數據庫環境變量 (backend/.env)"
echo "2. 配置前端 API 地址 (frontend/.env.local)"  
echo "3. 啟動後端: bash scripts/start-backend.sh"
echo "4. 啟動前端: bash scripts/start-frontend.sh"
echo ""
