🚀 CareerConnect
Intelligent Job Portal for Students & Recruiters

📋 Overview
CareerConnect is a full-stack MERN application that bridges the gap between students seeking opportunities and recruiters looking for talent. With real-time status tracking and instant notifications, it transforms the traditional job application process.

✨ Key Features

👨‍🎓 For Students
Browse & Apply - Explore curated job listings

Track Applications - Real-time status dashboard

Get Notified - Instant updates on application changes

Smart Dashboard - All your applications in one place

👔 For Recruiters
Post Jobs - Create detailed opportunity listings

Manage Applicants - Review, shortlist, or reject candidates

Analytics - Track application metrics

Streamlined Workflow - Efficient candidate management

⚡ Core Highlights
🔔 Real-time Notifications - No more waiting

📱 Mobile Responsive - Access anywhere, anytime

🔒 Secure Authentication - JWT protected endpoints

🎨 Modern UI - Clean, intuitive interface

🛠️ Technology Stack
Layer	Technology
Frontend	React.js • Redux • Tailwind CSS • Axios
Backend	Node.js • Express.js • MongoDB • Mongoose
Authentication	JWT • Bcrypt • Cookie-based sessions
Tools	Git • GitHub • Postman • VS Code

🚦 Quick Start
1. Clone & Navigate
bash
git clone https://github.com/dynamicshreyashh/CareerConnect.git
cd CareerConnect

3. Backend Setup
bash
cd backend
npm install
# Add your .env file with MongoDB URI & JWT secret
npm start

3. Frontend Setup
bash
cd frontend
npm install
npm start

5. Access
🌐 Frontend: http://localhost:3000

⚙️ Backend API: http://localhost:5000
⚙️ Environment Configuration
Backend (.env)
env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

CLIENT_URL=http://localhost:3000
Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000

🔗 API Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/register	User Registration	Public
POST	/api/auth/login	User Login	Public
GET	/api/jobs	Get All Jobs	Both
POST	/api/jobs	Create New Job	Recruiter
POST	/api/applications	Apply for Job	Student
PUT	/api/applications/:id	Update Status	Recruiter

🤝 Contributing
We welcome contributions! Here's how:<img width="1491" height="872" alt="Screenshot 2025-12-02 160619" src="https://github.com/user-attachments/assets/b9c8fb72-ea58-4255-a199-ff4695fe8945" />


Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m 'Add amazing feature'

Push to branch: git push origin feature/amazing-feature

Open a Pull Request

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

👨‍💻 Author
Shreyash
💼 GitHub Profile
🌐 Portfolio
