from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Development: use insecure key. Production: MUST set DJANGO_SECRET_KEY env var
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-dev-key-change-in-production'  # ⚠️ MUST be set in production
)

DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'books',
    'users',
    'reviews',
    'vocabulary',
]

# CorsMiddleware must be first
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

import dj_database_url

# Database configuration - support both production (DATABASE_URL) and development
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=False,
        )
    }
else:
    # Local development with PostgreSQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'booklibrary'),
            'USER': os.environ.get('DB_USER', 'postgres'),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }

CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001'
).split(',')

# Firebase token authentication — no simplejwt needed
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'users.authentication.FirebaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Path to your Firebase service account JSON key
# Download from Firebase Console → Project Settings → Service Accounts
FIREBASE_CREDENTIALS = os.environ.get(
    'FIREBASE_CREDENTIALS',
    str(BASE_DIR / 'firebase-credentials.json')
)

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Production security settings
if not DEBUG:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True') == 'True'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
