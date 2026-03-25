#!/bin/bash
set -e

PROJECT_DIR="/opt/arkcloud"
GREEN='\033[0;32m'
NC='\033[0m'
log() { echo -e "${GREEN}[INFO]${NC} $1"; }

# PostgreSQL - 刪除並重建數據庫和用戶
log "設置 PostgreSQL..."
su - postgres -c "psql -c 'DROP DATABASE IF EXISTS arkcloud;'" 2>/dev/null || true
su - postgres -c "psql -c 'DROP ROLE IF EXISTS arkcloud;'" 2>/dev/null || true
su - postgres -c "psql -c \"CREATE DATABASE arkcloud;\""
su - postgres -c "psql -c \"CREATE USER arkcloud WITH PASSWORD 'ArkCloud2024!';\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE arkcloud TO arkcloud;\""
su - postgres -c "psql -d arkcloud -c \"GRANT ALL ON SCHEMA public TO arkcloud;\""

log "完成！"
