# Deploying Django Backend to Render

## Prerequisites

1. GitHub account with repository pushed
2. Render account (https://render.com)
3. Django backend code ready
4. Firebase credentials file

---

## Step 1: Prepare Django for Render

### 1.1 Create `render.yaml` Configuration

Create a `render.yaml` file in `backend/` folder:

```yaml
services:
  - type: web
    name: book-library-backend
    env: python
    region: oregon
    plan: starter
    buildCommand: ./build.sh
    startCommand: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2
    envVars:
      - key: DEBUG
        value: "False"
      - key: PYTHON_VERSION
        value: "3.11"
      - key: DJANGO_SECRET_KEY
        generateValue: true
      - key: ALLOWED_HOSTS
        value: book-library-backend.onrender.com
      - key: PORT
        value: "8000"

  - type: pserv
    name: book-library-db
    env: postgres
    region: oregon
    plan: starter
    ipAllowList: []
    databaseName: booklibrary
    user: booklibrary
```

### 1.2 Create `build.sh` Script

Create `build.sh` in `backend/` folder:

```bash
#!/bin/bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

Make it executable:
```bash
chmod +x build.sh
```

### 1.3 Update `requirements.txt`

Add these to `backend/requirements.txt`:

```
gunicorn==23.0.0
whitenoise==6.7.0
python-decouple==3.8
```

### 1.4 Update Django Settings for Render

Add to `backend/config/settings.py`:

```python
# For Render deployment
import dj_database_url

# Use dj-database-url for DATABASE_URL
if 'DATABASE_URL' in os.environ:
    DATABASES['default'] = dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )

# Static files configuration for Render
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CSRF and security settings for production
if not DEBUG:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
```

### 1.5 Add to `backend/requirements.txt`:

```
dj-database-url==2.2.0
```

---

## Step 2: Connect Render to GitHub

1. Push code to GitHub:
```bash
git add .
git commit -m "Add backend Render configuration"
git push origin main
```

2. In Render dashboard, when connecting the repo:
   - Select your GitHub repository
   - **Important**: Set the Root Directory to `backend/`
   - This ensures Render looks for render.yaml in the backend folder

---

## Step 3: Create Render Services

### 3.1 Create PostgreSQL Database

1. Go to https://render.com/dashboard
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name**: `book-library-db`
   - **Database**: `booklibrary`
   - **User**: `booklibrary` (not postgres - reserved in Render)
   - **Region**: Same as backend (Oregon)
   - **Version**: 15+
4. Click **Create Database**
5. Save the connection string

### 3.2 Create Web Service for Backend

1. Click **New +** → **Web Service**
2. Select your GitHub repository
3. Fill in:
   - **Name**: `book-library-backend`
   - **Environment**: `Python 3`
   - **Region**: `Oregon`
   - **Branch**: `main`
   - **Root Directory**: `backend`  ← Important!
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
   - **Plan**: `Starter` (recommended for always-on service)

4. Click **Advanced** and set environment variables

---

## Step 4: Configure Environment Variables

In Render dashboard for your web service, set these environment variables:

```
DEBUG=False
DJANGO_SECRET_KEY=<generate-secure-key>
ALLOWED_HOSTS=book-library-backend.onrender.com,yourdomain.com
DATABASE_URL=<paste-from-PostgreSQL-service>
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://your-frontend.vercel.app
FIREBASE_CREDENTIALS=/etc/config/firebase-credentials.json
```

### To Generate Secure Secret Key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## Step 5: Upload Firebase Credentials

### Option A: Store as Environment Variable (Recommended for Render)

1. Encode Firebase credentials:
```bash
cat backend/firebase-credentials.json | base64
```

2. Create environment variable `FIREBASE_CREDENTIALS_B64` with the base64 content

3. Update `backend/config/settings.py`:
```python
import json
import base64

if 'FIREBASE_CREDENTIALS_B64' in os.environ:
    creds_b64 = os.environ.get('FIREBASE_CREDENTIALS_B64')
    creds_json = base64.b64decode(creds_b64).decode('utf-8')
    creds_dict = json.loads(creds_json)
    # Use creds_dict with Firebase Admin SDK
    import firebase_admin
    from firebase_admin import credentials
    cred = credentials.Certificate(creds_dict)
    firebase_admin.initialize_app(cred)
else:
    # Local development
    cred = credentials.Certificate(os.environ.get('FIREBASE_CREDENTIALS', 'firebase-credentials.json'))
    firebase_admin.initialize_app(cred)
```

### Option B: Use Render's File System (Limited)

Contact Render support for persistent storage options.

---

## Step 6: Deploy

1. Render automatically deploys when you push to GitHub
2. Check deployment logs in Render dashboard
3. Wait for build to complete (2-5 minutes)

---

## Step 7: Test Deployment

### Check Backend Health:
```bash
curl https://book-library-backend.onrender.com/api/
```

### Check CORS:
```bash
curl -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  https://book-library-backend.onrender.com/api/
```

### Run Migrations (if needed):
```bash
# Via Render dashboard:
# 1. Go to "Shell" tab in your service
# 2. Run: python backend/manage.py migrate
```

Or use Render's built-in management:
```bash
# Add to render.yaml:
postBuildCommand: python backend/manage.py migrate
```

---

## Step 8: Connect Frontend

Update `frontend/.env.local` or Vercel environment:

```
NEXT_PUBLIC_API_URL=https://book-library-backend.onrender.com/api
```

---

## Troubleshooting

### Cold Starts
- Free tier services sleep after 15 mins of inactivity
- Upgrade to Paid plan for always-on service

### Database Connection Issues
```bash
# Check DATABASE_URL format
# Should be: postgresql://user:password@host:5432/database
```

### Static Files Not Loading
```bash
# Run in Render shell:
python backend/manage.py collectstatic --noinput
```

### Firebase Credentials Error
- Verify base64 encoding/decoding
- Check file permissions
- Test locally first: `python -c "import firebase_admin; print('OK')"`

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` with exact frontend URL
- Include https:// protocol
- No trailing slashes

---

## Important Environment Variables Summary

| Variable | Value | Required |
|----------|-------|----------|
| `DEBUG` | `False` | Yes |
| `DJANGO_SECRET_KEY` | 50+ char random string | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ALLOWED_HOSTS` | Backend domain | Yes |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs (comma-separated) | Yes |
| `FIREBASE_CREDENTIALS_B64` | Base64 encoded JSON | Yes |

---

## Monitoring & Logs

1. **View Logs**: Dashboard → Service → Logs tab
2. **Set Up Alerts**: Render dashboard → Service settings
3. **Monitor Performance**: Check response times

---

## Cost Optimization

- **Free Tier**: $0/month (with limitations)
  - Cold starts (15 min inactivity)
  - Limited resources

- **Starter Plan**: $7/month
  - Always-on
  - Better performance
  - Recommended for production

- **PostgreSQL**: $7/month (Starter)
  - Free tier: 90 days then $15/month

---

## Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Update API URL in frontend
4. Test authentication flow
5. Monitor logs for errors

---

## Useful Links

- Render Docs: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
- Gunicorn Docs: https://docs.gunicorn.org/
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
