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

### DevOps
- Docker & Docker Compose  
- GitLab CI/CD  
- Nginx  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+  
- Node.js 16+  
- npm  

### Automated Setup (Windows)

```powershell
cd "C:\Users\vaishu\hospital 1"
.\run.ps1

Backend: http://127.0.0.1:5000
Frontend: http://localhost:5173

# ⚙️ Manual Setup
Backend
cd backend
python -m pip install -r requirements.txt
python app.py
Frontend
cd frontend
npm install
npm run dev

#🔐 Mock Credentials for Testing
Role	Username	Password
👨‍💼 Admin	admin	admin123
👨‍⚕️ Doctor	doctor1	doc123
🧑 Patient	patient1	pat123

# 📁 Project Structure
hospital 1/
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   ├── package.json
│   └── vite.config.js


# 🎯 Features in Detail
# 📅 Multi-Step Booking
Select available doctor
Enter patient information
Choose payment method
Confirm booking
#👨‍⚕️ Doctor Features
Queue management
Patient medical histories
Real-time vitals tracking
Appointment rescheduling
#🧑 Patient Features
Personal health profile
Appointment tracking
Care tips & recommendations
Doctor recommendations by specialty
