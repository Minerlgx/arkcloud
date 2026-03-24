#!/bin/bash
set -e

cd backend

# 检查 .env 是否存在
if [ ! -f ".env" ]; then
    echo "⚠️  請創建 backend/.env 文件"
    exit 1
fi

echo "🚀 啟動後端服務..."
PORT=${PORT:-3001} node src/index.js
