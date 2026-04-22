\# Care Access Portal 🏥



A comprehensive healthcare management system that streamlines interactions between patients, doctors, and administrators through a role-based web portal.



\## Overview



Care Access Portal is a full-stack healthcare application designed to simplify appointment booking, medical record management, and doctor-patient interactions. The system provides specialized dashboards for three user types: Admins, Doctors, and Patients.



\## ✨ Key Features



\- \*\*Role-Based Authentication\*\*: Mock login system for Admin, Doctor, and Patient roles

\- \*\*Admin Dashboard\*\*:

&#x20; - Browse 20+ specialist doctors

&#x20; - Multi-step appointment booking workflow

&#x20; - Real-time appointment management

&#x20; 

\- \*\*Doctor Dashboard\*\*:

&#x20; - View appointment queue with priority indicators

&#x20; - Access comprehensive patient medical records

&#x20; - Reschedule appointments

&#x20; 

\- \*\*Patient Portal\*\*:

&#x20; - View upcoming appointments

&#x20; - Track medical history and prescriptions

&#x20; - Find recommended doctors by specialization

&#x20; - Monitor appointment details and clinic location



\- \*\*Payment Integration\*\*: Support for Cash and UPI payment methods

\- \*\*Real-Time Updates\*\*: Live appointment status tracking



\## 🛠️ Tech Stack



\*\*Frontend:\*\*

\- React 18.3.1 - UI framework

\- React Router DOM 6.28.0 - Client-side routing

\- Vite 5.4.10 - Fast build tool

\- CSS3 - Responsive styling



\*\*Backend:\*\*

\- Python 3.x - Server runtime

\- Flask 3.1.0 - Web framework

\- Flask-CORS 5.0.0 - Cross-origin support



\*\*DevOps:\*\*

\- Docker \& Docker Compose - Containerization

\- GitLab CI/CD - Continuous integration

\- Nginx - Production reverse proxy



\## 🚀 Quick Start



\### Prerequisites

\- Python 3.8+

\- Node.js 16+

\- npm



\### Automated Setup (Windows)

```powershell

cd "C:\\Users\\vaishu\\hospital 1"

.\\run.ps1



Backend: http://127.0.0.1:5000

Frontend: http://localhost:5173





Manual Setup



Backend:

cd backend

python -m pip install -r requirements.txt

python app.py



Frontend:

cd frontend

npm install

npm run dev



🔐 Mock Credentials for Testing

Role	Username	Password

Admin	admin		admin123

Doctor	doctor1		doc123

Patient	patient1	pat123



📁 Project Structure



hospital 1/

├── backend/                    # Flask REST API

│   ├── app.py                 # Main application

│   └── requirements.txt        # Python dependencies

├── frontend/                   # React + Vite app

│   ├── src/

│   │   ├── App.jsx            # Main router

│   │   └── components/        # UI components

│   ├── package.json           # NPM dependencies

│   └── vite.config.js         # Vite configuration

├── docker-compose.yml         # Container orchestration

└── .gitlab-ci.yml             # CI/CD pipeline





🎯 Features in Detail

Multi-Step Booking

Select available doctor

Enter patient information (name, age)

Choose payment method (Cash/UPI)

Confirm and complete booking

Doctor Features

Queue management with priority indicators

Comprehensive patient medical histories

Real-time vitals and medication tracking

Appointment rescheduling

Patient Features

Personal health profile

Appointment tracking

Care tips and recommendations

Doctor recommendations by specialty

