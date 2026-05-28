# DEPLOYMENT GUIDE - GitHub to Vultr

## Overview
Code → GitHub → GitHub Actions → Auto-deploy to Vultr → qani.io Live

---

## STEP 1: Setup GitHub Repository

### Create Repo
1. Go to github.com
2. New Repository
3. Name: `qani-platform`
4. Private (recommended)
5. Initialize with README

### Clone Locally
```bash
git clone https://github.com/your-username/qani-platform.git
cd qani-platform
```

---

## STEP 2: Create GitHub Secrets

**Go to:** Settings → Secrets and variables → Actions

Add these secrets:

```
VULTR_SSH_KEY = [your private SSH key]
VULTR_HOST = 139.180.181.11
VULTR_USER = root
DATABASE_PASSWORD = [secure password]
JWT_SECRET = [random secure string]
OPENAI_API_KEY = sk-proj-xxxxx-REPLACE-WITH-KEY
SENDGRID_API_KEY = SG.xxxxx-REPLACE-WITH-KEY
```

---

## STEP 3: Create GitHub Actions Workflow

Create file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vultr

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vultr
        env:
          DEPLOY_KEY: ${{ secrets.VULTR_SSH_KEY }}
          DEPLOY_HOST: ${{ secrets.VULTR_HOST }}
          DEPLOY_USER: ${{ secrets.VULTR_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST 'cd /var/www/qani && git pull origin main && npm install && npm run build && pm2 restart qani-backend qani-frontend'
```

---

## STEP 4: Setup Vultr Server

### SSH into Vultr
```bash
ssh root@139.180.181.11
```

### Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Docker (optional)
apt install -y docker.io

# Verify installations
node --version
npm --version
git --version
psql --version
```

### Setup PostgreSQL
```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE qani_production;
CREATE USER qani_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE qani_production TO qani_user;
EOF
```

### Clone Repository
```bash
cd /var/www
git clone https://github.com/your-username/qani-platform.git qani
cd qani
```

### Setup Environment Files
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with production values
nano .env

# Frontend
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local
nano .env.local
```

### Install Dependencies
```bash
cd /var/www/qani/backend
npm install
npm run build

cd /var/www/qani/frontend
npm install
npm run build
```

### Run Database Migrations
```bash
cd /var/www/qani/backend
npx prisma migrate deploy
```

### Start with PM2
```bash
# Start backend
pm2 start "npm start" --name "qani-backend" --cwd /var/www/qani/backend

# Start frontend
pm2 start "npm start" --name "qani-frontend" --cwd /var/www/qani/frontend

# Save PM2 config
pm2 save

# Enable PM2 on restart
pm2 startup
```

### Setup Nginx Reverse Proxy
```bash
apt install -y nginx

# Create Nginx config
cat > /etc/nginx/sites-available/qani << 'EOF'
server {
    listen 80;
    server_name qani.io www.qani.io;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name qani.io www.qani.io;

    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/qani.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/qani.io/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Backend
    location /api/v1 {
        proxy_pass http://localhost:5000/api/v1;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/qani /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Setup SSL Certificate (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx

certbot certonly --standalone -d qani.io -d www.qani.io
```

### Setup Firewall
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## STEP 5: Update DNS Records in Vultr

**Go to:** Vultr Console → DNS

Update A record:
```
qani.io  A  139.180.181.11
```

Update CNAME (if needed):
```
www  CNAME  qani.io
```

---

## STEP 6: Test Deployment

### Push Code to GitHub
```bash
cd qani-platform
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### GitHub Actions Should Trigger
- Check Actions tab in GitHub
- Watch the deployment progress
- Should deploy within 2-5 minutes

### Verify Live
```
https://qani.io
```

Should show the application.

---

## STEP 7: Setup Monitoring

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs qani-backend
pm2 logs qani-frontend

# Restart if needed
pm2 restart qani-backend
pm2 restart qani-frontend
```

### Check Application Health
```bash
curl https://qani.io/api/v1/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-05-27T10:00:00Z"
}
```

---

## STEP 8: Setup Backups

### Database Backup Script
```bash
# Create backup script
cat > /usr/local/bin/backup-qani.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/qani"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump qani_production | gzip > $BACKUP_DIR/qani_$DATE.sql.gz
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

# Make executable
chmod +x /usr/local/bin/backup-qani.sh

# Schedule daily backup (crontab)
0 2 * * * /usr/local/bin/backup-qani.sh
```

---

## TROUBLESHOOTING

### Application not starting
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs qani-backend

# Restart
pm2 restart qani-backend
```

### Database connection failed
```bash
# Check PostgreSQL
systemctl status postgresql

# Check connection
psql -U qani_user -d qani_production -h localhost
```

### SSL certificate expired
```bash
certbot renew
```

### High memory usage
```bash
# View process memory
ps aux | grep node

# Restart service
pm2 restart qani-backend
```

---

## PRODUCTION CHECKLIST

- [ ] DNS pointing to Vultr IP
- [ ] SSL certificate installed
- [ ] Database configured
- [ ] Environment variables set
- [ ] GitHub Actions working
- [ ] Auto-deployment tested
- [ ] Monitoring active
- [ ] Backups scheduled
- [ ] Firewall configured
- [ ] Application health check passing

**Deployment Complete!** 🚀

