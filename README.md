# CareerConnect

CareerConnect is a role-aware job platform for students and recruiters, built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

Students can browse openings, search and filter by role/location/work type, save jobs, apply once per job, update their candidate profile, attach a resume, and track application statuses. Recruiters can create employer profiles, publish jobs under a company they own, edit or delete their own postings, see applicants and their resumes, and move applications through a hiring pipeline.

## Stack

- **Frontend:** React 18, Vite, React Router, Redux Toolkit + Persist, Tailwind CSS, Radix UI, Lucide, Axios.
- **Backend:** Node.js, Express, Mongoose, JWT cookie authentication, bcrypt, Multer.
- **File uploads:** Cloudinary (profile photos, company logos and resumes).
- **Data:** MongoDB.

## Run locally

Use two terminals from the repository root.

### 1. Backend API

    cd backend
    cp .env.example .env
    # Set MONGODB_URI and JWT_SECRET in backend/.env
    npm install
    npm run dev

The API defaults to http://localhost:5000. Visit http://localhost:5000/health to check that the server is running. If you use another port, update PORT and the frontend API URL.

### 2. Frontend

    cd frontend
    cp .env.example .env
    npm install
    npm run dev

Open the Vite URL shown in the terminal (normally http://localhost:5173).

### Environment variables

backend/.env:

| Variable | Required | Purpose |
|---|---|---|
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Long random secret for signing sessions |
| PORT | No | API port (defaults to 5000) |
| CLIENT_URL | Recommended | Primary frontend origin, e.g. http://localhost:5173 |
| CLIENT_URLS | No | Comma-separated extra allowed frontend origins |
| CLOUDINARY_CLOUD_NAME | For uploads | Cloudinary cloud name |
| CLOUDINARY_API_KEY | For uploads | Cloudinary API key |
| CLOUDINARY_API_SECRET | For uploads | Cloudinary API secret |

frontend/.env:

| Variable | Required | Purpose |
|---|---|---|
| VITE_API_BASE_URL | For production | API base, including /api/v1; local default is http://localhost:5000/api/v1 |

Never commit .env files, connection strings, JWT secrets, or Cloudinary keys.

## Deploying the hosted frontend

The frontend and API are separate services. Deploy the backend as a Node service and connect it to MongoDB; configure its environment variables and add the hosted frontend origin to CLIENT_URL (or CLIENT_URLS). Then set this variable in the frontend hosting dashboard and redeploy the frontend:

    VITE_API_BASE_URL=https://YOUR-API-DOMAIN.example/api/v1

Use the real API URL supplied by your host. Production authentication cookies are configured for HTTPS and cross-origin credentials. The backend only allows explicitly configured origins, so the frontend domain must match exactly.

## Roles and core flows

### Student
1. Sign up with the Student account type and sign in with the same type.
2. Browse public listings and search/filter openings.
3. Open a job detail page, save it for later, and apply once.
4. Maintain profile details, skills and resume.
5. Review application status: Pending, Under Review, Shortlisted, Interview, Accepted or Rejected.

### Recruiter
1. Sign up with the Recruiter account type and sign in.
2. Add a company profile and optionally complete logo, website, location and description.
3. Publish a job associated with a company owned by the recruiter.
4. Edit/delete own postings, inspect applicants, open submitted resumes, and update application status.

Role-restricted operations are checked by the backend as well as hidden/guarded in the UI; frontend route guards are not treated as security boundaries.

## API outline

- POST /api/v1/user/register, POST /api/v1/user/login, POST /api/v1/user/logout, GET /api/v1/user/me
- POST /api/v1/user/profile/update
- GET /api/v1/user/saved-jobs, POST /api/v1/user/save-job/:id, DELETE /api/v1/user/save-job/:id
- GET /api/v1/job/get, GET /api/v1/job/get/:id
- POST /api/v1/job/post, GET /api/v1/job/getadminjobs, PUT /api/v1/job/:id, DELETE /api/v1/job/:id
- POST /api/v1/application/apply/:id, GET /api/v1/application/check/:id, GET /api/v1/application/get
- GET /api/v1/application/:id/applicants, POST /api/v1/application/status/:id/update
- POST /api/v1/company/register, GET /api/v1/company/get, GET /api/v1/company/get/:id, PUT /api/v1/company/update/:id, DELETE /api/v1/company/delete/:id

Most account-specific endpoints require the signed token cookie and the appropriate role.

## Existing MongoDB job records

Existing job documents are not overwritten by the application. Public job browsing reads from the existing jobs collection and populates each job's company reference. For recruiter-owned editing and applicant management, job records should include valid MongoDB references in company and created_by; each company should have a userId owner. Keep a database backup before changing imported data or model indexes.

## Checks

    # Frontend production build
    cd frontend
    npm run build
    npm run lint

    # Backend start (requires the environment above)
    cd ../backend
    npm start

There is no committed test database or external service secret. End-to-end authentication, persistence, file upload, and application flows must be verified against your configured MongoDB/Cloudinary environment before production use.