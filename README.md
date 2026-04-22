# Care Access Portal

This project has:

- A Flask backend in `backend`
- A Vite + React frontend in `frontend`
- Mock login for `Admin`, `Doctor`, and `Patient`
- Admin dashboard with doctor listing and appointment booking

## Quick Start

From the project root:

```powershell
cd "C:\Users\vaishu\hospital 1"
.\run.ps1
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
