# Book Library - Deployment Guide

## Pre-Deployment Checklist

### Backend (Django)
- [x] All migrations applied (`python manage.py migrate`)
- [x] Secret key configured via `DJANGO_SECRET_KEY` environment variable
- [x] DEBUG set to `False` in production
- [x] Database credentials secured (PostgreSQL)
- [x] Firebase Admin SDK initialized with credentials
- [x] CORS configuration set for production domains
- [x] Static files configured (run `python manage.py collectstatic`)
- [x] WSGI server configured (Gunicorn or similar)

### Frontend (Next.js)
- [x] Firebase configuration loaded from environment variables
- [x] API URL configured via `NEXT_PUBLIC_API_URL`
- [x] Build optimized (`npm run build`)
- [x] Environment variables set in `.env.local`

### Database
- [x] PostgreSQL database created and accessible
- [x] All migrations applied
- [x] Backup strategy configured

## Environment Variables

### Backend (.env or export)
```
DEBUG=False
DJANGO_SECRET_KEY=<generate-secure-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=booklibrary
DB_USER=postgres
DB_PASSWORD=<secure-password>
DB_HOST=db.example.com
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
FIREBASE_CREDENTIALS=/etc/secrets/firebase-credentials.json
```

### Frontend (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<firebase-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<firebase-app-id>
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Backend Deployment

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
export DJANGO_SECRET_KEY="<generate-with-python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'>"
export DEBUG=False
export ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
export DB_HOST="your-db-host"
export DB_NAME="booklibrary"
export DB_USER="postgres"
export DB_PASSWORD="<secure-password>"
export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
```

### 3. Apply Migrations
```bash
python manage.py migrate
```

### 4. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 5. Run WSGI Server (Gunicorn)
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

Or with systemd service:
```ini
[Unit]
Description=Django App
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/gunicorn config.wsgi:application --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## Frontend Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` with Firebase and API URL variables

### 3. Build
```bash
npm run build
```

### 4. Deploy (Vercel Recommended)
```bash
npm install -g vercel
vercel --prod
```

Or deploy to any Node.js hosting:
```bash
npm run start
```

## Nginx Configuration Example

```nginx
upstream django_app {
    server 127.0.0.1:8000;
}

upstream nextjs_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/private/private.key;

    # Frontend
    location / {
        proxy_pass http://nextjs_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static Files
    location /static/ {
        alias /path/to/backend/staticfiles/;
    }
}
```

## Security Checklist

- [ ] HTTPS enabled (SSL/TLS certificate)
- [ ] Secret key changed from default
- [ ] DEBUG set to False
- [ ] ALLOWED_HOSTS configured correctly
- [ ] CORS origins restricted to your domain
- [ ] Database password secured
- [ ] Firebase credentials stored securely (not in git)
- [ ] Regular database backups configured
- [ ] Rate limiting configured on API
- [ ] CSRF tokens enabled
- [ ] Security headers configured

## Monitoring

- Monitor Django logs for errors
- Monitor database performance
- Track API response times
- Monitor server disk space
- Set up alerts for downtime

## Important Files

- `backend/config/settings.py` - Django settings
- `frontend/lib/api.ts` - API configuration
- `frontend/lib/firebase.js` - Firebase configuration
- `backend/requirements.txt` - Python dependencies
- `frontend/package.json` - Node dependencies

## Database Schema

Tables created by migrations:
- `users_userprofile` - User accounts
- `books_book` - Book catalog
- `reviews_review` - Book reviews (with recommendation field)
- `vocabulary_word` - Vocabulary entries
- And Django built-in tables (auth, sessions, etc.)

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Django Documentation: https://docs.djangoproject.com/
- Next.js Documentation: https://nextjs.org/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
