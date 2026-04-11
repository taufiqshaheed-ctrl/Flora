#!/bin/bash
# deploy.sh — Run this on your Hostinger KVM2 VPS after uploading the project
# Usage: bash deploy.sh

set -e

PROJECT_DIR="/var/www/flora"
NGINX_CONF="/etc/nginx/sites-available/flora"

echo "==> Installing system dependencies..."
apt-get update -qq
apt-get install -y curl nginx

echo "==> Installing Node.js 22 via nvm..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  source "$NVM_DIR/nvm.sh"
  nvm install 22
  nvm use 22
  nvm alias default 22
fi

echo "==> Installing PM2..."
npm install -g pm2

echo "==> Installing MongoDB..."
if ! command -v mongod &>/dev/null; then
  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-8.0.list
  apt-get update -qq
  apt-get install -y mongodb-org
  systemctl enable mongod
  systemctl start mongod
fi

echo "==> Setting up project directory..."
mkdir -p "$PROJECT_DIR"
cp -r . "$PROJECT_DIR/"
cd "$PROJECT_DIR"

echo "==> Installing backend dependencies..."
cd backend
npm ci --omit=dev
mkdir -p uploads

echo "==> Building frontend..."
cd ../frontend
npm ci
npm run build

echo "==> Configuring Nginx..."
cp "$PROJECT_DIR/nginx.conf" "$NGINX_CONF"
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/flora
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Starting backend with PM2..."
cd "$PROJECT_DIR/backend"
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup | tail -1 | bash   # auto-start on server reboot

echo ""
echo "==> Done! Your app is running."
echo "    Frontend: http://yourdomain.com"
echo "    Backend:  http://127.0.0.1:5001"
echo ""
echo "Next steps:"
echo "  1. Point your domain DNS A record to this server IP"
echo "  2. Run: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "  3. Update backend/.env with production values"
