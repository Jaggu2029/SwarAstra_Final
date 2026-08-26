# 🤟 SwarAstra — Gujarati Sign Language Learning Platform

> An inclusive, AI-powered educational platform for learning **Gujarati Sign Language (GSL)**, **Mathematics**, and **Science** — designed for deaf and hard-of-hearing students.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **🤟 Sign Language** | Real-time webcam-based GSL sign recognition using MediaPipe + sklearn. Students practice signs and get instant feedback. |
| **📐 Mathematics** | Progressive difficulty levels with dynamically generated arithmetic problems (addition, subtraction, multiplication, division, tables). |
| **🔬 Science** | Multi-level science quizzes covering topics from basic body parts to advanced physics, chemistry, and biology. |
| **🤖 AI Tutor** | Context-aware AI assistant powered by Google Gemini that helps students with doubts across all modules. |
| **📊 Progress Reports** | Detailed analytics dashboard with accuracy trends, module-wise breakdowns, and performance statistics. |
| **👩‍🏫 Teacher Panel** | Teachers can add custom maths and science questions to the platform content. |
| **🌐 Bilingual UI** | Full English and Gujarati (ગુજરાતી) localization support. |

---

## 🏗️ Architecture

```
┌─────────────────────────────┐
│    React Frontend (Vite)    │ ← Deployed on Vercel
│    Tailwind CSS + React 19  │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     │            │
     ▼            ▼
┌─────────┐  ┌──────────────────┐
│ Supabase│  │ Flask ML API     │ ← Deployed on Render (Docker)
│ (Auth + │  │ MediaPipe + sklearn│
│  DB +   │  │ Gemini AI Tutor  │
│ Edge Fn)│  └──────────────────┘
└─────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| **Backend API** | Flask + Gunicorn (Python 3.11) |
| **ML Models** | MediaPipe HandLandmarker + scikit-learn Random Forest |
| **Database** | Supabase (PostgreSQL with Row-Level Security) |
| **AI** | Google Gemini 2.5 Flash (tutor + feedback) |
| **Deployment** | Vercel (frontend) + Render/Docker (backend) |

---

## 📁 Project Structure

```
SwarAstra_Final/
├── src/                        # React frontend source
│   ├── components/             # Reusable UI components
│   │   ├── Header.jsx          # Navigation header with profile dropdown
│   │   ├── SplashScreen.jsx    # Animated intro splash screen
│   │   ├── AITutorWidget.jsx   # Floating AI tutor chat widget
│   │   └── CategoryCard.jsx    # Home page module cards
│   ├── pages/                  # Route pages
│   │   ├── Home.jsx            # Dashboard with module cards
│   │   ├── Login.jsx           # Auth flow (age gate → role → sign in/up)
│   │   ├── SignLanguage.jsx    # Webcam-based sign recognition practice
│   │   ├── Maths.jsx           # Math quiz with progressive levels
│   │   ├── Science.jsx         # Science quiz with progressive levels
│   │   ├── ProgressReport.jsx  # Analytics and progress tracking
│   │   └── TeacherPanel.jsx    # Teacher content management
│   ├── services/               # API and data services
│   │   ├── supabaseClient.js   # Supabase client initialization
│   │   ├── authService.js      # Auth operations (signup/signin/signout)
│   │   ├── signModelService.js # Sign language ML API client
│   │   ├── aiTutor.js          # AI tutor service (Edge Fn → Flask fallback)
│   │   ├── progressService.js  # Progress tracking and sync
│   │   └── contentService.js   # Content fetching from Supabase
│   ├── context/                # React context providers
│   │   ├── SessionContext.jsx  # Auth session + profile state
│   │   ├── ProgressContext.jsx # Progress data state
│   │   └── LocaleContext.jsx   # i18n locale state
│   ├── config/
│   │   └── scienceLevels.config.js  # Science quiz level definitions
│   ├── utils/
│   │   ├── mathGenerator.js    # Dynamic math problem generator
│   │   └── statistics.js       # Progress statistics calculations
│   ├── locales/                # Translations
│   │   ├── en.json             # English strings
│   │   └── gu.json             # Gujarati strings
│   ├── App.jsx                 # Root component with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── SwarAstra/                  # Python ML API backend
│   ├── model_api.py            # Flask REST API (/predict, /ask-tutor, /health)
│   ├── gemini_helper.py        # Google Gemini AI wrapper
│   ├── gsl_classifier.joblib   # Trained sign language classifier model
│   ├── hand_landmarker.task    # MediaPipe hand detection model
│   └── requirements.txt        # Python dependencies
├── supabase/                   # Database schema & functions
│   ├── schema.sql              # Table definitions + RLS policies
│   ├── seed.sql                # Initial seed data
│   ├── insert_signs.sql        # Sign language content data
│   ├── maths_update.sql        # Math content data
│   └── functions/
│       └── ask-tutor/          # Supabase Edge Function (AI tutor)
├── public/                     # Static assets (sign images, logo, icons)
├── Dockerfile                  # Docker config for ML API backend
├── vercel.json                 # Vercel SPA routing config
├── package.json                # Node.js dependencies
└── vite.config.js              # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+
- A **Supabase** project (free tier works)
- A **Google Gemini API key** (for AI tutor features)

### 1. Frontend Setup

```bash
# Clone the repository
git clone <repo-url>
cd SwarAstra_Final

# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SIGN_MODEL_API=http://localhost:5000
EOF

# Start development server
npm run dev
```

### 2. Backend ML API Setup

```bash
cd SwarAstra

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set Gemini API key
set GEMINI_API_KEY=your-gemini-key  # Windows
# export GEMINI_API_KEY=your-gemini-key  # macOS/Linux

# Run the API server
python model_api.py
# Server starts at http://localhost:5000
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL files in order in the Supabase SQL Editor:
   - `supabase/schema.sql` — Creates tables and RLS policies
   - `supabase/seed.sql` — Seeds initial data
   - `supabase/insert_signs.sql` — Adds sign language content
   - `supabase/maths_update.sql` — Adds math content

---

## 🌐 Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |
| `VITE_SIGN_MODEL_API` | URL of the ML API backend | ✅ |

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI tutor | ✅ |
| `PORT` | Server port (default: 5000) | ❌ |

### Production (`.env.production`)

| Variable | Description |
|----------|-------------|
| `VITE_SIGN_MODEL_API` | Production ML API URL (e.g., Render deployment) |

---

## 🐳 Docker Deployment (Backend)

```bash
# Build the Docker image
docker build -t swarastra-api .

# Run the container
docker run -p 5000:5000 -e GEMINI_API_KEY=your-key swarastra-api
```

The Dockerfile uses **gunicorn** as the production WSGI server with 2 workers and a 120-second timeout for ML inference requests.

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns status and available sign classes |
| `POST` | `/predict` | Send an image file, returns predicted sign label + confidence |
| `POST` | `/ask-tutor` | Send a question (JSON), returns AI tutor response |

### Example

```bash
# Health check
curl http://localhost:5000/health

# Predict a sign
curl -X POST -F "image=@hand_sign.jpg" http://localhost:5000/predict

# Ask AI tutor
curl -X POST -H "Content-Type: application/json" \
  -d '{"question": "What is photosynthesis?"}' \
  http://localhost:5000/ask-tutor
```

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint linter |

---

## 📄 License

This project is part of an educational initiative for inclusive learning.
