# Smart Temperature Monitoring System

Enterprise web application for digital temperature form input, graph visualization, department-based notifications, and configurable system settings.

## Architecture

```
smart-temp-monitoring/
├── frontend/          # React + Vite + TypeScript
├── backend/           # NestJS + TypeScript + Prisma
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Using Docker Compose

```bash
cp .env.example .env
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Swagger Docs: http://localhost:4000/api/docs
- PostgreSQL: localhost:5432

### Manual Setup

#### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

#### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Default Credentials

| Role    | Username     | Password   |
|---------|-------------|------------|
| Admin   | admin       | Admin@123  |
| User    | user.opd    | User@123   |

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS + Headless UI
- React Hook Form + Zod
- Recharts
- Axios + React Query
- React Router v6

### Backend
- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication + RBAC
- Nodemailer
- Bull Queue (Redis)
- Swagger/OpenAPI

## API Documentation

Available at `/api/docs` when the backend is running.

---

## Deployment

Frontend deploy บน **Netlify**, Backend deploy บน **Railway** (รองรับ Docker + PostgreSQL addon)

```
Netlify (Frontend)  ←── VITE_API_URL ───→  Railway (Backend + PostgreSQL)
```

> ทำ Railway ก่อนเสมอ เพราะต้องเอา backend URL ไปใส่ใน Netlify

---

### Step 1 — Push โค้ดขึ้น GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/smart-temp-monitoring.git
git push -u origin main
```

---

### Step 2 — Deploy Backend บน Railway

1. ไปที่ [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. เลือก repo → ตั้ง **Root Directory** = `backend`
3. Railway จะ detect Dockerfile ให้อัตโนมัติ

**เพิ่ม PostgreSQL:**
- ใน Project → **Add service** → **Database → PostgreSQL**
- `DATABASE_URL` จะถูก inject เข้า backend service อัตโนมัติ

**ตั้ง Environment Variables** (Settings → Variables):

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | random string ยาว ๆ (ดูวิธีสร้างด้านล่าง) |
| `JWT_EXPIRATION` | `24h` |

สร้าง JWT_SECRET:
```bash
openssl rand -hex 32
```

4. Deploy เสร็จ → copy URL ของ backend เช่น `https://smart-temp-backend.up.railway.app`

**Run seed หลัง deploy ครั้งแรก** (ผ่าน Railway CLI หรือ Railway Console):
```bash
npx prisma db seed
```

---

### Step 3 — Deploy Frontend บน Netlify

1. ไปที่ [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → เลือก GitHub repo
2. ตั้งค่า Build settings:

| Setting | Value |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

3. ตั้ง Environment Variable — **Site configuration → Environment variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-railway-backend>.up.railway.app/api` |

4. กด **Deploy site**

---

### หลัง Deploy

| Service | URL |
|---|---|
| Frontend | `https://<your-site>.netlify.app` |
| Backend API | `https://<your-backend>.up.railway.app/api` |
| Swagger Docs | `https://<your-backend>.up.railway.app/api/docs` |

> **Auto-deploy:** ทุกครั้งที่ push ขึ้น GitHub ทั้ง Netlify และ Railway จะ build และ deploy ใหม่อัตโนมัติ
