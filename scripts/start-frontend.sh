#!/bin/bash
set -e

cd frontend

# 检查 .env.local 是否存在
if [ ! -f ".env.local" ]; then
    echo "⚠️  請創建 frontend/.env.local 文件"
    echo "內容: NEXT_PUBLIC_API_URL=http://your-domain.com/api"
    exit 1
fi

echo "🚀 啟動前端服務..."
npm run start
