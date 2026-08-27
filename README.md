# LectureFlow — Online Lecture Scheduling System

A full-stack web app for managing courses, instructors, and lecture schedules from a single dashboard. Built as a MERN stack project with role-based access for admins and instructors.

The idea is simple: an admin creates courses, adds lectures, and assigns them to instructors — while the system automatically checks for scheduling conflicts so no instructor ends up double-booked. Instructors get their own dashboard where they can see exactly what's on their plate.

---

## Live Links

- **Frontend:** https://online-lecture-scheduling-frontend.onrender.com
- **Backend API:** https://online-lecture-scheduling-backend-kgcl.onrender.com

> Note: this is hosted on Render's free tier, so the backend may take 20–30 seconds to wake up if it's been idle for a while. If the first login attempt seems to hang, that's why — just give it a moment and try again.

---

## Demo Credentials

**Admin**
```
Email: admin@gmail.com
Password: 123456
```

**Instructor**
```
Email: rahul@gmail.com
Password: 123456
```
```
Email: simran@gmail.com
Password: simran123
```
```
Email: ajay@gmail.com
Password: ajay123
```
```
Email: priya@gmail.com
Password: priya123
```

---

## Features

**Admin**
- Login with JWT-based authentication
- Create, update, and delete courses (name, level, description, image)
- View all registered instructors
- Schedule lectures — pick a course, an instructor, a date, start/end time, and a room
- Automatic conflict detection: the system won't let you double-book an instructor for the same date and time
- Edit or delete any lecture
- Dashboard overview with live counts of courses, instructors, and lectures

**Instructor**
- Login with the same secure flow, redirected to their own dashboard
- View only the lectures assigned to them, with course name, date, time, and room

**General**
- Role-based routing (admin and instructor land on different dashboards after login)
- Clean, consistent UI across all pages
- Fully responsive layout

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router for navigation
- Axios for API calls
- Plain CSS (no framework) — custom design system

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

**Deployment**
- Frontend: Render (Static Site)
- Backend: Render (Web Service)
- Database: MongoDB Atlas

---

## Project Structure

```
online-lecture-scheduling/
│
├── backend/
│   ├── src/
│   │   └── app.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   └── lecture.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── course.model.js
│   │   └── lecture.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   └── lecture.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── InstructorDashboard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Running It Locally

### 1. Clone the repo

```bash
git clone https://github.com/shubhamshrivastav1/online-lecture-scheduling.git
cd online-lecture-scheduling
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

Start the server:

```bash
npm run dev
```

Backend runs on `http://localhost:8000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

> If you're running both locally, make sure the API URLs in the frontend point to `http://localhost:8000` instead of the deployed Render URL.

---

## API Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/instructors` | Admin | List all instructors |
| GET | `/api/courses` | Authenticated | Get all courses |
| POST | `/api/courses` | Admin | Create a course |
| PUT | `/api/courses/:id` | Admin | Update a course |
| DELETE | `/api/courses/:id` | Admin | Delete a course |
| GET | `/api/lectures` | Admin | Get all lectures |
| GET | `/api/lectures/my-lectures` | Instructor | Get lectures assigned to the logged-in instructor |
| POST | `/api/lectures` | Admin | Create a lecture (checks for instructor conflicts) |
| PUT | `/api/lectures/:id` | Admin | Update a lecture |
| DELETE | `/api/lectures/:id` | Admin | Delete a lecture |

---


## Author

**Shubham Shivendrakumar Shrivastav**
📧 ssk06112000@gmail.com
📱 8104042167
