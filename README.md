# AI-Powered Multi-Model Interview Preparation Platform

A full-stack MERN application for AI-powered interview preparation and practice.

## 🚀 Features

### Authentication
- User Signup & Login with JWT
- Strong password validation (8+ chars, uppercase, lowercase, number, special char)
- Forgot Password with email reset link (15-minute expiry)
- Welcome email on signup via Nodemailer

### Landing Page
- Modern, responsive design with cream/white background
- Hero section with AI interview illustration
- Features, How It Works, Advantages sections
- Call-to-Action and Footer

### Dashboard & Interview Modules
- **HR Interview** — 25 common HR questions with AI evaluation
- **Technical Interview** — 10 IT roles, 20 questions each (200 total)
- **Behavioral Interview** — 22 situational questions (STAR method)
- **Coding Interview** — 3 difficulty levels, multi-language editor (Python/Java/C)
- **JAM Session** — 15 topics, 60-second timer, fluency evaluation
- **Group Discussion** — AI participants, real-time chat simulation
- **Puzzle Games** — 12 pattern/logical/lateral thinking puzzles
- **Aptitude Round** — 60 questions (Quantitative/Logical/Verbal), timer, explanations
- **Resume Analyzer** — ATS scoring, keyword analysis, improvement suggestions
- **AI Resources** — Curated YouTube, W3Schools, GeeksForGeeks links

### User Profile
- Editable profile: name, phone, address, education, skills, projects, experience

### Performance Dashboard
- Session history, average scores, skill analytics, progress tracking

---

## 📁 Project Structure

```
ai interview/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User schema with bcrypt
│   │   └── InterviewSession.js
│   ├── routes/
│   │   ├── auth.js           # Signup, Login, Forgot/Reset Password
│   │   ├── user.js           # Profile CRUD
│   │   └── interview.js      # Session save, history, stats
│   ├── middleware/auth.js     # JWT verification
│   ├── utils/email.js         # Nodemailer utilities
│   ├── server.js              # Express entry point
│   ├── .env                   # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── hero-illustration.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login, Signup, ForgotPassword, ResetPassword
│   │   │   ├── landing/       # Hero, Features, HowItWorks, Advantages, CTA, Footer
│   │   │   ├── dashboard/     # Layout, Sidebar, Overview, Profile, Performance
│   │   │   │   └── interviews/ # All 10 interview modules
│   │   │   └── common/        # Navbar
│   │   ├── context/AuthContext.jsx
│   │   ├── styles/            # index.css, auth.css, landing.css, dashboard.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for Nodemailer)

### 1. Clone/Setup

The project is located at: `C:\Users\sivasankar\ai interview`

### 2. Configure Backend Environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/ai-interview?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate.

### 3. Install Backend Dependencies

```bash
cd "C:\Users\sivasankar\ai interview\backend"
npm install
```

### 4. Install Frontend Dependencies

```bash
cd "C:\Users\sivasankar\ai interview\frontend"
npm install
```

### 5. Run the Application

**Start Backend** (Terminal 1):
```bash
cd "C:\Users\sivasankar\ai interview\backend"
npm start
```
Server runs on `http://localhost:5000`

**Start Frontend** (Terminal 2):
```bash
cd "C:\Users\sivasankar\ai interview\frontend"
npm run dev
```
Frontend runs on `http://localhost:3000`

### 6. Open in Browser

Navigate to `http://localhost:3000`

---

## 🎨 Design Theme

| Property | Value |
|---|---|
| Background | White / Light Cream (`#FFFDF7`) |
| Primary Color | `#21A4C0` |
| Accent Color | `#E6B800` |
| Text | Black (`#1a1a1a`) |
| Font | Poppins (Google Fonts) |
| Style | Minimal, Modern, Professional |

---

## 🚀 Deployment (Railway)

### Backend Deployment
1. Connect your GitHub repository to Railway.
2. Railway will detect the `package.json` in the `backend` folder (you may need to set the **Root Directory** to `backend` in Railway settings).
3. Add the following **Environment Variables** in Railway:
   - `PORT=5000`
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (your secure key)
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL` (the URL of your deployed frontend)

### Frontend Deployment
1. Connect the same GitHub repository to a new Railway project.
2. Set the **Root Directory** to `frontend`.
3. Railway will detect the Vite configuration and build automatically.
4. Set the **Build Command** to `npm run build` and **Start Command** to `npm run preview` or let Railway serve the `dist` folder.
5. Add the **Environment Variable**:
   - `VITE_API_URL` (the URL of your deployed backend)

---

## 🔧 Tech Stack

- **Frontend**: React.js, Vite, React Router, Axios, Vanilla CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Nodemailer
- **Database**: MongoDB Atlas
