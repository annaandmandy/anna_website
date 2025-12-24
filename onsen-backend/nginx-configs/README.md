# Nginx Site Configuration for SWAG

This directory contains the nginx site configuration files that will be deployed to the SWAG reverse proxy.

## File: api.conf

This configuration proxies requests from `api.hsiangyuhuang.com` to the `onsen-backend` Spring Boot service running on port 8081.

### Features:
- ✅ SSL/TLS support (handled by SWAG with Let's Encrypt)
- ✅ WebSocket support for your GameWebSocketController
- ✅ Proper proxy headers for IP forwarding
- ✅ HTTP to HTTPS redirect

## Deployment

This file is automatically deployed by GitHub Actions (`.github/workflows/deploy.yml`):

1. On push to `main` branch, GitHub Actions builds and pushes the Docker image
2. SSH into DigitalOcean server
3. Pull latest code with `git reset --hard origin/main`
4. Copy `nginx-configs/api.conf` → `nginx/config/nginx/site-confs/api`
5. Restart containers with `docker compose up -d`

## Manual Deployment

If you need to deploy manually:

```bash
ssh root@your-droplet-ip
cd /root/anna_website/onsen-backend

# Pull latest changes
git pull origin main

# Copy nginx config
mkdir -p nginx/config/nginx/site-confs
cp nginx-configs/api.conf nginx/config/nginx/site-confs/api

# Restart services
docker compose restart nginx
```

## Troubleshooting

### Check if config is loaded:
```bash
docker exec nginx-gateway cat /config/nginx/site-confs/api
docker exec nginx-gateway nginx -t
```

### Check SWAG logs:
```bash
docker logs nginx-gateway --tail 50
```

### Test backend connectivity:
```bash
docker exec nginx-gateway wget -O- http://onsen-backend:8081/api/rules/current
```

### SSL Certificate Issues

If you see "self-signed certificate" errors:
- Wait 5-10 minutes for SWAG to obtain Let's Encrypt certificate
- Ensure DNS `api.hsiangyuhuang.com` points to your droplet IP
- Check certbot logs: `docker logs nginx-gateway | grep -i certbot`
