# Novella — Stories That Stay Yours

A personal reading companion to organise your book collection, track reading progress, write private notes, build a vocabulary list, and maintain reading streaks — all in one place.

**Live:** [novella-library.vercel.app](https://novella-library.vercel.app)
**API:** [book-library-sv8u.onrender.com](https://book-library-sv8u.onrender.com)

---

## Features

- **Book library** — add books with title, author, page count, cover image, and status (Reading / Completed / Want to Read)
- **Quick status actions** — one-tap "Start Reading" and "Mark as Completed" buttons on each card
- **Notes** — write private per-book notes with word count tracking
- **Reviews** — rate books 1–5 stars and write a review
- **Vocabulary** — save words discovered while reading, with optional meaning, example sentence, and book link
- **Reading stats** — total books, pages read, streaks, and more
- **Cover image upload** — paste a URL, browse from device, or take a photo (uploaded to Cloudinary)
- **Feedback** — floating feedback button powered by Formspree
- **Auth** — email/password and Google OAuth via Firebase
- **Fully responsive** — works on mobile, tablet, and desktop

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Auth | Firebase Auth JS SDK v12 |
| HTTP | Axios with auto-attached Firebase ID token |
| Image uploads | Cloudinary (unsigned preset) |
| Fonts | Outfit, Manrope, Share Tech (Google Fonts) |
| Deployment | Vercel |

### Backend
| | |
|---|---|
| Framework | Django 6 + Django REST Framework 3.16 |
| Database | PostgreSQL (psycopg3) |
| Auth | Firebase Admin SDK — verifies Bearer tokens, no sessions/JWT |
| CORS | django-cors-headers |
| Server | Gunicorn |
| Deployment | Render |

---

## Project Structure

```
book-library/
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── page.js            # Landing page
│   │   ├── auth/
│   │   │   ├── signin/        # Sign-in page
│   │   │   └── signup/        # Sign-up page
│   │   └── dashboard/
│   │       ├── layout.js      # Auth guard + sidebar/topbar shell
│   │       ├── page.js        # Book library
│   │       ├── notes/         # Notes page
│   │       └── vocabulary/    # Vocabulary page
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── BookCard.js
│   │   │   ├── BookModal.js
│   │   │   ├── NotesPanel.js
│   │   │   ├── StatsBar.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Topbar.js
│   │   │   └── FeedbackButton.js
│   │   └── (landing page components)
│   ├── context/AuthContext.js # Firebase auth state
│   ├── lib/
│   │   ├── firebase.js        # Firebase init
│   │   └── api.ts             # Axios + token interceptor
│   └── .env.example
│
└── backend/                   # Django API
    ├── books/                 # Book CRUD
    ├── users/                 # UserProfile + Firebase auth
    ├── reviews/               # Book reviews
    ├── vocabulary/            # Vocabulary words
    ├── config/                # Django settings, URLs
    ├── requirements.txt
    └── .env.example
```

---

## API Endpoints

All endpoints require a Firebase ID token: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/books/` | List / create books |
| GET/PATCH/DELETE | `/api/books/{id}/` | Retrieve / update / delete a book |
| GET/POST | `/api/reviews/` | List / create reviews |
| GET/PATCH/DELETE | `/api/reviews/{id}/` | Retrieve / update / delete a review |
| GET/POST | `/api/vocabulary/` | List / create vocabulary words |
| GET/PATCH/DELETE | `/api/vocabulary/{id}/` | Retrieve / update / delete a word |
| GET/PATCH | `/api/users/me/` | Get / update authenticated user profile |

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and fill in environment variables
cp .env.example .env

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Backend (`backend/.env`)

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True

# PostgreSQL (local dev)
DB_NAME=booklibrary
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Production — use DATABASE_URL instead of individual DB_* vars
# DATABASE_URL=postgresql://user:password@host/dbname

CORS_ALLOWED_ORIGINS=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1

# Firebase Admin SDK
# Local: path to downloaded service account JSON
FIREBASE_CREDENTIALS=firebase-credentials.json
# Production: base64-encoded service account JSON
# Generate: python -c "import base64; print(base64.b64encode(open('firebase-credentials.json','rb').read()).decode())"
FIREBASE_CREDENTIALS_BASE64=
```

### Frontend (`frontend/.env.local`)

```env
# Firebase — from Firebase Console → Project Settings → Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Cloudinary — from cloudinary.com dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Formspree — from formspree.io
NEXT_PUBLIC_FORMSPREE_ID=
```

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com), connect your GitHub repo
2. Set **Root Directory** to `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
5. Add a **PostgreSQL** database service and set `DATABASE_URL` in the web service environment
6. Add all required environment variables (see above), including `FIREBASE_CREDENTIALS_BASE64`

### Frontend → Vercel

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set **Framework Preset** to **Next.js**
4. Add all `NEXT_PUBLIC_*` environment variables
5. Deploy

**After deploying both:**
- Add your Vercel URL to Firebase Console → Authentication → **Authorized domains**
- Update `CORS_ALLOWED_ORIGINS` on Render to include your Vercel URL

---

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Sign-in methods → **Email/Password** and **Google**
3. Go to **Project Settings** → **Your apps** → register a Web app → copy the config into `NEXT_PUBLIC_FIREBASE_*` vars
4. Go to **Project Settings** → **Service Accounts** → **Generate new private key** → save as `backend/firebase-credentials.json`

---

## Cloudinary Setup (cover image uploads)

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings** → **Upload** → **Upload presets** → **Add upload preset**
3. Set **Signing mode** to `Unsigned`, note the preset name
4. Copy your **Cloud name** from the dashboard
5. Add both to your frontend env vars

---

## License

MIT
