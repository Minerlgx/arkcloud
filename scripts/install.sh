#!/bin/bash
set -e

echo "🚀 開始安裝依賴..."

# 安装后端依赖
echo "📦 安裝後端依賴..."
cd backend
npm install
cd ..

# 安装前端依赖
echo "📦 安裝前端依賴..."
cd frontend
npm install
cd ..

echo "✅ 依賴安裝完成！"
