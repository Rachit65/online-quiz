# Online Quiz and MCQ Platform

This project is a complete full-stack quiz system with:

- React frontend in `client/`
- Node.js + Express backend in `server/`
- MongoDB with Mongoose
- JWT authentication
- Student and teacher roles

## Project Folder Structure

```text
New project/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       │   └── axiosInstance.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── QuestionEditor.jsx
│       │   └── QuizCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── AttemptQuizPage.jsx
│       │   ├── CreateQuizPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── ResultPage.jsx
│       ├── styles/
│       │   └── index.css
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── attemptController.js
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── quizController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Question.js
│   │   ├── Quiz.js
│   │   ├── Result.js
│   │   └── User.js
│   ├── routes/
│   │   ├── attemptRoutes.js
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── quizRoutes.js
│   │   └── resultRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

## Backend API Summary

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Quizzes

- `GET /api/quizzes`
- `POST /api/quizzes`
- `GET /api/quizzes/:id`
- `PUT /api/quizzes/:id`
- `DELETE /api/quizzes/:id`

### Questions

- `POST /api/questions/:quizId`
- `PUT /api/questions/:questionId`
- `DELETE /api/questions/:questionId`

### Attempts and Results

- `GET /api/attempts/:quizId/start`
- `POST /api/attempts/:quizId/submit`
- `GET /api/results/me`
- `GET /api/results/quiz/:quizId/me`
- `GET /api/results/quiz/:quizId`

## How To Run

### 1. Backend setup

```bash
cd server
npm install
copy .env.example .env
```

Update `.env` with your MongoDB connection string and JWT secret.

Then start the backend:

```bash
npm run dev
```

### 2. Frontend setup

Open another terminal:

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

### 3. Open the app

Visit:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## Demo Flow

1. Register as a teacher
2. Create a quiz
3. Add MCQ questions
4. Register as a student
5. Attempt the quiz with the timer
6. Submit and view score
7. Login again as teacher to review student results
