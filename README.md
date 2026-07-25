# 🎓 SDMS – Student Dropout Management System

A responsive full-stack web application to **reduce student dropout rates** across Primary, Secondary, Higher Secondary, and Higher Education stages in India. Built with HTML/CSS/JS frontend and Flask (Python) backend with MySQL database support.

---

## 📸 Screenshots

| Homepage | Student Dashboard | Admin Dashboard |
|----------|-------------------|-----------------|
| Hero section with animated stats | Progress tracking, resources, counseling | Student records, analytics, GCS uploads |

---

## ✨ Features

### 🏠 Homepage
- Mission statement and project overview
- **Tabbed stage sections** – Primary, Secondary, Higher Secondary, Higher Education
- Dropout statistics with interactive **Chart.js** graphs (bar, line, doughnut)
- Causes and solutions for each education stage
- Animated counters, scroll animations, floating dashboard preview
- Dual login portals (Student & Admin/Mentor)

### 🎓 Student Portal
- **Progress Tracking** – Subject-wise scores, attendance charts
- **Resource Library** – Downloadable study materials
- **Counseling** – Book sessions with available counselors
- **Scholarships** – View eligibility and application status
- **Notifications** – Alerts for attendance, sessions, approvals
- **Profile** – View personal and academic information

### 📊 Admin / Mentor Portal
- **Dashboard Overview** – KPI cards (total students, at-risk, dropouts, retention rate)
- **Student Records** – Searchable and filterable data table with 8 demo records
- **Analytics** – Yearly dropout trends, causes doughnut chart, stage-wise breakdown
- **Interventions** – Track active interventions with outcomes
- **Upload Reports** – Drag & drop file upload to Google Cloud Storage
- **Dropout Causes** – Detailed cause-by-stage analysis table
- **Add Student** – Form to register new students
- **Settings** – Configure alert thresholds and GCS connection

---

## 🗂 Project Structure

```
sdms/
├── frontend/                    # Static frontend (works by double-clicking index.html)
│   ├── index.html               # Homepage with all sections
│   ├── student_login.html       # Student login page
│   ├── admin_login.html         # Admin/Mentor login page
│   ├── student_dashboard.html   # Student dashboard (7 pages)
│   ├── admin_dashboard.html     # Admin dashboard (8 pages)
│   ├── css/
│   │   └── style.css            # Complete design system (~800 lines)
│   └── js/
│       ├── main.js              # Core logic – API, Auth, UI interactions
│       └── charts.js            # Chart.js visualizations (7 chart types)
│
├── backend/                     # Flask REST API
│   ├── app.py                   # App factory, blueprint registration
│   ├── config.py                # Environment-based configuration
│   ├── models.py                # SQLAlchemy models (User, Student, DropoutCause, UploadedFile)
│   └── routes/
│       ├── __init__.py
│       ├── auth.py              # Login, register, current user
│       └── student.py           # Student profile, progress, scholarships
│
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Option 1: Frontend Only (No Server Needed)

The frontend works **standalone** — just double-click to open:

1. Navigate to `sdms/frontend/`
2. **Double-click `index.html`** → Opens homepage in browser
3. Click "Student Login" or "Admin Login"
4. Enter **any email/password** → Demo mode activates automatically
5. Explore the full dashboard experience

> **Note:** Charts require internet (Chart.js loaded from CDN). All links use relative paths so everything works via `file://` protocol.

### Option 2: Full Stack (Flask + MySQL)

#### Prerequisites
- Python 3.8+
- MySQL 5.7+ or MariaDB
- pip

#### Setup

```bash
# 1. Clone or navigate to the project
cd sdms/backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install flask flask-cors flask-jwt-extended flask-sqlalchemy pymysql python-dotenv

# 4. Create MySQL database
mysql -u root -p -e "CREATE DATABASE sdms_db;"

# 5. Configure environment (create .env file in backend/)
echo SECRET_KEY=your-secret-key > .env
echo JWT_SECRET_KEY=your-jwt-secret >> .env
echo DB_USER=root >> .env
echo DB_PASSWORD=yourpassword >> .env
echo DB_HOST=localhost >> .env
echo DB_NAME=sdms_db >> .env

# 6. Run the server
python app.py
```

Open http://localhost:5000 — Flask serves the frontend automatically.

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, JavaScript (ES6+)      |
| Styling    | Custom CSS with CSS Variables        |
| Charts     | Chart.js 4.4.3 (CDN)               |
| Fonts      | Google Fonts (Inter, Outfit)        |
| Backend    | Flask (Python)                      |
| Database   | MySQL with SQLAlchemy ORM           |
| Auth       | JWT (flask-jwt-extended)            |
| Storage    | Google Cloud Storage (GCS)          |
| API        | RESTful JSON API                    |

---

## 📡 API Endpoints

| Method | Endpoint               | Description                  | Auth |
|--------|------------------------|------------------------------|------|
| POST   | `/api/auth/login`      | Login, returns JWT token     | No   |
| POST   | `/api/auth/register`   | Register new user            | No   |
| GET    | `/api/auth/me`         | Get current user info        | Yes  |
| GET    | `/api/student/profile` | Student profile data         | Yes  |
| GET    | `/api/student/progress`| Academic progress & grades   | Yes  |
| GET    | `/api/student/scholarships` | Available scholarships  | Yes  |
| GET    | `/api/student/notifications` | Student notifications  | Yes  |
| GET    | `/api/health`          | Health check                 | No   |

---

## 🎨 Design Features

- **Corporate professional look** with blue/indigo color palette
- **Glassmorphism** effects with backdrop blur
- **Responsive design** – works on desktop, tablet, and mobile
- **Scroll animations** (fade-up, fade-in via IntersectionObserver)
- **Animated counters** with ease-out effect
- **Dark sidebar** dashboard layout
- **Toast notifications** for user feedback
- **Modal dialogs** for forms
- **Drag & drop** file upload zone

---

## 🔐 Demo Mode

The frontend includes a **demo mode** that activates when the Flask backend is not running:

- Login with **any email and password**
- All dashboard data is pre-populated with realistic sample data
- Charts render with demo datasets
- File uploads show success toasts (no actual upload)
- Toast notifications simulate real-time feedback

This allows you to explore the full application without setting up a database.

---

## 📊 Education Stage Data

| Stage             | Dropout Rate | 5-Year Reduction | Key Cause     |
|-------------------|-------------|------------------|---------------|
| Primary (1-8)     | 8.2%        | ↓32%             | Financial     |
| Secondary (9-10)  | 16.7%       | ↓25%             | Exam pressure |
| Higher Sec (11-12)| 22.4%       | ↓22%             | Fees/coaching |
| Higher Edu (UG+)  | 14.1%       | ↓23%             | Loan burden   |

---

## 📝 License

This project is for educational purposes. Built as part of a student project to demonstrate full-stack web development with a focus on social impact.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

> Built with ❤️ to keep every student in school.

