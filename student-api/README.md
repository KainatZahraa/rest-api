Here's your README for Task 1:

```markdown
# Task 1 — Student Management System API

A RESTful API built with Node.js, Express, and MongoDB to manage student records for a university.

## Tech Stack
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv

## Project Structure
```
student-api/
├── models/
│   └── Student.js
├── controllers/
│   └── studentController.js
├── routes/
│   └── studentRoutes.js
├── .env
├── server.js
└── package.json
```

## Setup Instructions

1. Clone the repo
```bash
git clone https://github.com/KainatZahraa/rest-api.git
```

2. Go into the student-api folder
```bash
cd student-api
```

3. Install dependencies
```bash
npm install
```

4. Create a `.env` file and add:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

5. Run the server
```bash
node server.js
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Create Student
```
POST /api/students
```
Body:
```json
{
  "rollNumber": "21-CS-105",
  "name": "Ali Hassan",
  "email": "ali.hassan@university.edu",
  "department": "Computer Science",
  "cgpa": 3.78,
  "enrollmentYear": 2021
}
```

### Get All Students
```
GET /api/students
```

### Filter by Department
```
GET /api/students?department=Computer Science
```

### Pagination
```
GET /api/students?page=1&limit=2
```

### Search by Name
```
GET /api/students/search?name=ali
```

### Get Student by ID
```
GET /api/students/:id
```

### Full Update
```
PUT /api/students/:id
```

### Partial Update
```
PATCH /api/students/:id
```

### Deactivate Student
```
PATCH /api/students/:id/deactivate
```

### Delete Student
```
DELETE /api/students/:id
```

---

## Student Schema

| Field | Type | Required | Notes |
|---|---|---|---|
| rollNumber | String | Yes | Unique |
| name | String | Yes | — |
| email | String | Yes | Unique, valid email format |
| department | String | Yes | — |
| cgpa | Number | No | Between 0.0 and 4.0 |
| enrollmentYear | Number | Yes | — |
| isActive | Boolean | No | Defaults to true |

---

## HTTP Status Codes Used
- 200 — OK
- 201 — Created
- 400 — Bad Request
- 404 — Not Found
- 500 — Internal Server Error
```

---

Create a file called `README.md` inside your `student-api` folder, paste this in, save it, commit and push to GitHub. Then we'll start Task 2!