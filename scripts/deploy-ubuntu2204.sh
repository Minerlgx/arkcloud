#!/bin/bash
set -e

echo "=========================================="
echo "方舟雲計算 ArkCloud 部署腳本"
echo "適用於 Ubuntu 22.04 LTS"
echo "=========================================="

PROJECT_DIR="/opt/arkcloud"
DB_NAME="arkcloud"
DB_USER="arkcloud"
DB_PASS="ArkCloud2024!"

GREEN='\033[0;32m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }

# 1. 安裝 Node.js 20
log "安裝 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# 2. 安裝 PostgreSQL
log "安裝 PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# 3. 創建數據庫
log "創建數據庫..."
su - postgres -c "psql -c 'DROP DATABASE IF EXISTS $DB_NAME;'"
su - postgres -c "psql -c 'DROP ROLE IF EXISTS $DB_USER;'"
su - postgres -c "psql -c \"CREATE DATABASE $DB_NAME;\""
su - postgres -c "psql -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\""
su - postgres -c "psql -d $DB_NAME -c 'GRANT ALL ON SCHEMA public TO $DB_USER;'"

# 4. 克隆項目
log "克隆項目..."
if [ -d "$PROJECT_DIR" ]; then
    cd $PROJECT_DIR && git pull
else
    mkdir -p $PROJECT_DIR
    git clone https://github.com/Minerlgx/arkcloud.git $PROJECT_DIR
fi

# 5. 後端部署
log "部署後端..."
cd $PROJECT_DIR/backend
npm install
npx prisma generate
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
PORT=3001
NODE_ENV=production
EOF
npx prisma db push
pm2 delete backend 2>/dev/null || true
pm2 start npx --name "backend" -- tsx src/server.ts

# 6. 前端部署
log "部署前端..."
cd $PROJECT_DIR/frontend
npm install
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
rm -rf .next
npm run build
pm2 delete frontend 2>/dev/null || true
pm2 start npm --name "frontend" -- start

# 7. 配置 OpenResty/Nginx
log "配置反向代理..."
if command -v openresty &> /dev/null; then
    cat > /etc/openresty/conf.d/arkcloud.conf << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
NGINX
    openresty -t && systemctl restart openresty
elif command -v nginx &> /dev/null; then
    cat > /etc/nginx/sites-available/arkcloud << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
NGINX
    ln -sf /etc/nginx/sites-available/arkcloud /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
fi

# 8. 開機啟動
log "配置開機啟動..."
pm2 save
pm2 startup

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "前台: http://localhost:3000"
echo "後端: http://localhost:3001"
echo ""
echo "常用命令:"
echo "  pm2 status     - 查看服務狀態"
echo "  pm2 logs       - 查看日誌"
echo "  pm2 restart all - 重啟所有服務"
