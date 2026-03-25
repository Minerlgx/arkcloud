#!/bin/bash
set -e

echo "=========================================="
echo "方舟雲計算 ArkCloud 部署腳本"
echo "適用於 Ubuntu 22.04 LTS"
echo "=========================================="

# 變量設置
PROJECT_DIR="/opt/arkcloud"
DOMAIN="arkcloud.top"

# 顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# 1. 安裝 Node.js 20.x
log "安裝 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v

# 2. 安裝 PM2
log "安裝 PM2..."
npm install -g pm2

# 3. 安裝 PostgreSQL
log "安裝 PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# 創建數據庫
log "創建數據庫..."
su - postgres -c "psql -c \"CREATE DATABASE arkcloud;\""
su - postgres -c "psql -c \"CREATE USER arkcloud WITH PASSWORD 'ArkCloud2024!';\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE arkcloud TO arkcloud;\""
su - postgres -c "psql -d arkcloud -c \"GRANT ALL ON SCHEMA public TO arkcloud;\""

# 4. 克隆項目
log "克隆項目..."
if [ -d "$PROJECT_DIR" ]; then
    warn "項目目錄已存在，正在更新..."
    cd $PROJECT_DIR
    git pull
else
    mkdir -p $PROJECT_DIR
    git clone https://github.com/Minerlgx/arkcloud.git $PROJECT_DIR
fi

# 5. 後端
log "部署後端..."
cd $PROJECT_DIR/backend
npm install

cat > $PROJECT_DIR/backend/.env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://arkcloud:ArkCloud2024!@localhost:5432/arkcloud
JWT_SECRET=arkcloud_jwt_secret_2024_production
CORS_ORIGIN=https://arkcloud.top
ENVEOF

npx prisma generate
npx prisma db push

pm2 delete arkcloud-backend 2>/dev/null || true
pm2 start npm --name "arkcloud-backend" -- start

# 6. 前端
log "部署前端..."
cd $PROJECT_DIR/frontend
npm install

cat > $PROJECT_DIR/frontend/.env.production << 'ENVEOF'
NEXT_PUBLIC_API_URL=https://arkcloud.top/api
ENVEOF

npm run build

# 7. Nginx
log "配置 Nginx..."
apt install -y nginx

cat > /etc/nginx/sites-available/arkcloud << 'NGINXEOF'
server {
    listen 80;
    server_name arkcloud.top www.arkcloud.top;

    client_max_body_size 100M;

    location / {
        root /opt/arkcloud/frontend/.next;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next {
        root /opt/arkcloud/frontend/.next;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/arkcloud /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 8. SSL
log "獲取 SSL 證書..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d arkcloud.top -d www.arkcloud.top --noninteractive --agree-tos -m admin@arkcloud.top

# 9. 防火牆
log "配置防火牆..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 10. 開機啟動
pm2 save
systemctl enable pm2-root

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "後端: http://127.0.0.1:3001"
echo "前台: https://arkcloud.top"
echo "管理: https://arkcloud.top/admin"
echo ""
echo "命令: pm2 status | pm2 logs | pm2 restart all"
echo ""
