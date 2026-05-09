# Task 2 — Blog Platform API

A RESTful API for a blogging platform built with Node.js, Express, and MongoDB. Users can register, write posts, and comment on posts. Implements relationships between collections using ObjectId references and Mongoose populate.

## Tech Stack
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- bcrypt
- dotenv

## Project Structure

    blog-api/
    ├── models/
    │   ├── User.js
    │   ├── Post.js
    │   └── Comment.js
    ├── controllers/
    │   ├── userController.js
    │   ├── postController.js
    │   └── commentController.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── postRoutes.js
    │   └── commentRoutes.js
    ├── .env
    ├── server.js
    └── package.json

## Setup Instructions

1. Clone the repo
```bash
git clone https://github.com/KainatZahraa/rest-api.git
```

2. Go into the blog-api folder
```bash
cd blog-api
```

3. Install dependencies
```bash
npm install
```

4. Create a `.env` file and add:

    PORT=5001
    MONGO_URI=your_mongodb_atlas_connection_string

5. Run the server
```bash
node server.js
```

Server will run on `http://localhost:5001`

---

## API Endpoints

### User Endpoints

**Register User**
POST `/api/users/register`
```json
{
  "username": "kainat",
  "email": "kainat@example.com",
  "password": "kainat123"
}
```

**Get All Users**
GET `/api/users`

**Get User By ID (with posts)**
GET `/api/users/:id`

---

### Post Endpoints

**Create Post**
POST `/api/posts`
```json
{
  "title": "Getting Started with REST APIs",
  "content": "REST stands for Representational State Transfer...",
  "author": "USER_ID_HERE",
  "tags": ["nodejs", "express", "mongodb"]
}
```

**Get All Posts**
GET `/api/posts`

**Get Post By ID (with comments)**
GET `/api/posts/:id`

**Get Posts By Tag**
GET `/api/posts/tag/:tag`

**Update Post**
PUT `/api/posts/:id`
```json
{
  "title": "Updated Title",
  "content": "Updated content here",
  "tags": ["nodejs", "api"]
}
```

**Delete Post (cascades to comments)**
DELETE `/api/posts/:id`

---

### Comment Endpoints

**Add Comment to Post**
POST `/api/posts/:postId/comments`
```json
{
  "text": "This is a great post!",
  "user": "USER_ID_HERE"
}
```

**Get All Comments for a Post**
GET `/api/posts/:postId/comments`

**Delete Comment**
DELETE `/api/comments/:id`

---

## Schema Design

### User Schema
| Field | Type | Required | Notes |
|---|---|---|---|
| username | String | Yes | Unique |
| email | String | Yes | Unique, valid email format |
| password | String | Yes | Hashed with bcrypt, min 6 chars |
| createdAt | Date | No | Defaults to now |

### Post Schema
| Field | Type | Required | Notes |
|---|---|---|---|
| title | String | Yes | — |
| content | String | Yes | — |
| author | ObjectId | Yes | References User |
| tags | Array | No | Array of strings |
| createdAt | Date | No | Defaults to now |

### Comment Schema
| Field | Type | Required | Notes |
|---|---|---|---|
| text | String | Yes | — |
| post | ObjectId | Yes | References Post |
| user | ObjectId | Yes | References User |
| createdAt | Date | No | Defaults to now |

---

## Relationships

    User ──── Post (one user can have many posts)
    Post ──── Comment (one post can have many comments)
    User ──── Comment (one user can write many comments)

## Key Features
- Password hashing with bcrypt
- Populate method to fetch related documents
- Cascade delete — deleting a post removes all its comments
- Input validation and proper error handling
- HTTP status codes 200, 201, 400, 404, 500

## HTTP Status Codes Used
- 200 — OK
- 201 — Created
- 400 — Bad Request
- 404 — Not Found
- 500 — Internal Server Error