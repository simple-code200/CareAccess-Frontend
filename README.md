# Care Access Portal 🏥
A comprehensive healthcare management system that streamlines interactions between patients, doctors, and administrators through a role-based web portal.

## 📖 Overview

Care Access Portal is a full-stack healthcare application designed to simplify appointment booking, medical record management, and doctor-patient interactions.

The system provides specialized dashboards for:

- 👨‍💼 Admins
- 👨‍⚕️ Doctors
- 🧑 Patients

---

## ✨ Key Features

### 🔐 Role-Based Authentication

Mock login system for:

- Admin
- Doctor
- Patient

### 👨‍💼 Admin Dashboard

- Browse 20+ specialist doctors
- Multi-step appointment booking workflow
- Real-time appointment management

### 👨‍⚕️ Doctor Dashboard

- View appointment queue with priority indicators
- Access comprehensive patient medical records
- Reschedule appointments

### 🧑 Patient Portal

- View upcoming appointments
- Track medical history and prescriptions
- Find recommended doctors by specialization
- Monitor appointment details and clinic location

### 💳 Payment Integration

Supports:

- Cash
- UPI

### 🔄 Real-Time Updates

- Live appointment status tracking

---

## 🧪 Testing & Quality Assurance

### ESLint

- Automated code linting with React-specific rules
- Runs on every push and pull request
- Ensures code quality and consistency

### Unit Testing

- Vitest framework with Happy DOM environment
- React Testing Library for component testing
- Automated test execution in CI/CD pipeline

---

## 🛠️ Tech Stack

### Frontend

- React 18.3.1
- React Router DOM 6.28.0
- Vite 5.4.10
- CSS3

### Backend

- Python 3.x
- Flask 3.1.0
- Flask-CORS 5.0.0

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm

### Automated Setup (Windows)

```powershell
cd "C:\Users\vaishu\hospital 1"
.\run.ps1
<<<<<<< HEAD
```

That script opens two PowerShell windows:

- Backend at `http://127.0.0.1:5000`
- Frontend at `http://127.0.0.1:5173`

## Manual Start

Backend:

```powershell
cd "C:\Users\vaishu\hospital 1\backend"
python -m pip install -r requirements.txt
python app.py
```

Frontend:

```powershell
cd "C:\Users\vaishu\hospital 1\frontend"
npm install
npm run dev
```

## Docker Run

From the project root:

```powershell
cd "C:\Users\vaishu\hospital 1"
docker compose up --build
```

That starts:

- Backend at `http://127.0.0.1:5000`
- Frontend at `http://127.0.0.1:8080`

To stop the containers:

```powershell
docker compose down
```

## GitLab CI + Docker Hub

This repo now includes:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `docker-compose.yml`
- `.gitlab-ci.yml`

Before pushing to GitLab, add these CI/CD variables in your GitLab project:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Then push your code to the `main` branch. The pipeline will:

1. Build the frontend Docker image
2. Build the backend Docker image
3. Push both images to Docker Hub with `latest` and commit SHA tags

Docker Hub image names used by the pipeline:

- `pradyumnajkumar/lib-frontend`
- `pradyumnajkumar/lib-backend`

## Mock Credentials

Use these hardcoded credentials on the login page:

- Admin: `admin` / `admin123`
- Doctor: `doctor1` / `doc123`
- Patient: `patient1` / `pat123`

## Available Backend APIs

- `POST /login`
- `GET /doctors`
- `GET /appointments`
- `POST /book-appointment`

## Notes

- The frontend proxy is already configured in `frontend/vite.config.js`, so requests to `/login`, `/doctors`, `/appointments`, and `/book-appointment` are forwarded to the Flask backend.
- The backend uses mock data only. No database is required.
- If PowerShell blocks the script, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1
```

## If `npm run dev` fails with `spawn EPERM`

Try reinstalling the frontend dependencies:

```powershell
cd "C:\Users\vaishu\hospital 1\frontend"
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```

=======

Backend: http://127.0.0.1:5000
Frontend: http://localhost:5173

````
## ⚙️ Manual Setup

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
python app.py

````

### Frontend

```bash
cd frontend
npm install
npm run dev

```

## 🔐 Mock Credentials for Testing

### Admin : admin / admin123

### Doctor : doctor1 / doc123

### Patient : patient1 / pat123

```

```

## 📁 Project Structure

```bash
hospital 1/
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
   ├── src/
   │   ├── App.jsx
   │   └── components/
   ├── package.json
   └── vite.config.js
```

## 🎯 Features in Detail

### 📅 Multi-Step Booking

- Select an available doctor
- Enter patient information
- Choose payment method
- Confirm booking

### 👨‍⚕️ Doctor Features

- Queue management
- Patient medical histories
- Real-time vitals tracking
- Appointment rescheduling

### 🧑 Patient Features

- Personal health profile
- Appointment tracking
- Care tips & recommendations
- Doctor recommendations by specialty

> > > > > > > 036b74856750ea767b92610a8a577582d6155712
