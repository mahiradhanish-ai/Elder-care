# ElderCare Connect – Smart Elderly Care & Medication Management Platform

ElderCare Connect is a full-stack healthcare web application designed to help elderly individuals manage their daily medications, healthcare routines, and doctor appointments while enabling authorized family members and caretakers to collaboratively monitor adherence and receive real-time alerts.

---

## Architecture & Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React icons, Recharts
- **Backend**: Node.js, Express.js REST API, JWT authentication, bcrypt password hashing, Role-based Access Control (RBAC)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Scheduling & Notifications**: Node-Cron (running on Asia/Kolkata IST), Nodemailer SMTP
- **Deployment**: Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

---

## Directory Structure

```text
eldercare-connect/
├── .env.example
├── .gitignore
├── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── backend/
    ├── config/
    │   └── db.js
    ├── controllers/
    ├── jobs/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    ├── app.js
    ├── package.json
    └── server.js
```

---

## Getting Started (Phase 1)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
