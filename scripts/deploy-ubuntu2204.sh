#!/bin/bash
set -e

echo "=========================================="
echo "方舟雲計算 ArkCloud 部署腳本"
echo "適用於 Ubuntu 22.04 LTS"
echo "=========================================="

# 變量設置
PROJECT_DIR="/opt/arkcloud"
NODE_VERSION="20"
DOMAIN="arkcloud.top"

# 顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# 1. 更新系統
log "更新系統軟件包..."
apt update && apt upgrade -y

# 2. 安裝基本依賴
log "安裝基本依賴..."
apt install -y curl wget git unzip ufw fail2ban

# 3. 安裝 Node.js 20.x
log "安裝 Node.js ${NODE_VERSION}..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs
node -v
npm -v

# 4. 安裝 PM2 (進程管理器)
log "安裝 PM2..."
npm install -g pm2

# 5. 安裝 PostgreSQL 14
log "安裝 PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 啟動並設置 PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# 創建數據庫和用戶
su - postgres -c "psql -c \"CREATE DATABASE arkcloud;\""
su - postgres -c "psql -c \"CREATE USER arkcloud WITH PASSWORD 'ArkCloud2024!';\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE arkcloud TO arkcloud;\""
su - postgres -c "psql -d arkcloud -c \"GRANT ALL ON SCHEMA public TO arkcloud;\""

# 6. 安裝 Nginx
log "安裝 Nginx..."
apt install -y nginx

# 7. 安裝 Certbot (SSL 證書)
log "安裝 Certbot..."
apt install -y certbot python3-certbot-nginx

# 8. 克隆項目
log "克隆項目..."
if [ -d "$PROJECT_DIR" ]; then
    warn "項目目錄已存在，正在更新..."
    cd $PROJECT_DIR
    git pull
else
    mkdir -p $PROJECT_DIR
    git clone https://github.com/Minerlgx/arkcloud.git $PROJECT_DIR
fi

# 9. 安裝後端依賴
log "安裝後端依賴..."
cd $PROJECT_DIR/backend
npm install

# 10. 配置後端環境變量
log "配置後端環境變量..."
cat > $PROJECT_DIR/backend/.env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://arkcloud:ArkCloud2024!@localhost:5432/arkcloud
JWT_SECRET=arkcloud_jwt_secret_key_2024_production
CORS_ORIGIN=https://arkcloud.top
ENVEOF

# 11. 初始化數據庫
log "初始化數據庫..."
cd $PROJECT_DIR/backend
npx prisma generate
npx prisma db push

# 12. 部署後端
log "部署後端服務..."
pm2 delete arkcloud-backend 2>/dev/null || true
pm2 start npm --name "arkcloud-backend" -- start
pm2 save
pm2 startup

# 13. 安裝前端依賴
log "安裝前端依賴..."
cd $PROJECT_DIR/frontend
npm install

# 14. 配置前端環境變量
cat > $PROJECT_DIR/frontend/.env.production << 'ENVEOF'
NEXT_PUBLIC_API_URL=https://arkcloud.top/api
ENVEOF

# 15. 構建前端
log "構建前端..."
npm run build

# 16. 配置 Nginx
log "配置 Nginx..."
cat > /etc/nginx/sites-available/arkcloud << 'NGINXEOF'
server {
    listen 80;
    server_name arkcloud.top www.arkcloud.top;

    client_max_body_size 100M;

    # 前端靜態文件
    location / {
        root /opt/arkcloud/frontend/.next;
        try_files $uri $uri/ /index.html;
    }

    # API 代理到後端
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 上傳文件
    location /uploads {
        alias /opt/arkcloud/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js 靜態資源
    location /_next {
        root /opt/arkcloud/frontend/.next;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

# 啟用站點
ln -sf /etc/nginx/sites-available/arkcloud /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 17. 配置防火牆
log "配置防火牆..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 18. 獲取 SSL 證書
log "獲取 SSL 證書..."
certbot --nginx -d arkcloud.top -d www.arkcloud.top --noninteractive --agree-tos -m admin@arkcloud.top

# 19. 配置 PM2 開機啟動
log "配置開機啟動..."
pm2 save
systemctl enable pm2-root

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "後端服務: http://127.0.0.1:3001"
echo "前端網站: https://arkcloud.top"
echo "管理後台: https://arkcloud.top/admin"
echo ""
echo "常用命令:"
echo "  pm2 status          - 查看服務狀態"
echo "  pm2 logs            - 查看日誌"
echo "  pm2 restart all     - 重啟所有服務"
echo "  certbot renew       - 更新 SSL 證書"
echo ""
