# 📸 Picora

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-blue?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📸 About Picora

**Picora** is a full-stack **Photo and Video Storage Platform** built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**.

It provides a centralized platform for users to upload, store, organize, and manage their photos and videos. Users can create albums, mark favorite media, manage deleted items through a trash system, and search their media collection.

The platform uses ImageKit for media storage, delivery, and image processing.

This project focuses on:

- Photo and video uploads
- Cloud-based media storage
- Media organization through albums
- Favorite media management
- Trash and permanent deletion
- Media searching and filtering
- Secure user authentication
- Storage statistics
- Responsive user interfaces

A portfolio-ready full-stack web application designed to simplify photo and video management.

---

## ✨ Features

### 👤 User Features

- User registration and login
- Secure authentication using JWT
- Upload multiple photos and videos
- View uploaded media
- Search media by title and detected objects
- Filter media by type (images and videos)
- Mark and manage favorite media
- Create and manage albums
- Add media to albums
- Remove media from albums
- View individual album details
- Move media to trash
- Restore deleted media
- Permanently delete individual media
- Empty trash
- View storage statistics
- Responsive user interface

---

### 🖼️ Media Management

- Cloud-based media storage using ImageKit
- Separate storage folders for photos and videos
- Image thumbnail generation
- Video thumbnail generation
- Image transformations
- Automatic image tagging using Google Auto-Tagging
- Media information management
- Multiple file uploads
- Media organization and retrieval

---

### 📁 Album Management

- Create albums with custom titles and descriptions
- Add multiple photos and videos to albums
- Remove media from albums
- View all created albums
- View individual album details
- Delete albums
- Prevent duplicate album titles
- Validate selected media before adding to albums

---

### 🗑️ Trash Management

- Move media to trash
- View trashed media
- Restore media from trash
- Permanently delete individual media
- Empty all trashed media
- Automatically remove deleted media references from albums

---

### 🔐 Authentication & Security

- JWT-based authentication
- Secure user registration and login
- Password hashing using bcrypt
- Protected API routes
- User-specific media access
- User-specific album management
- Request validation
- Authentication middleware

---

## 🛠️ Technologies Used

### Frontend (Client)

- React.js
- Vite
- Tailwind CSS
- JavaScript
- Axios
- React Router DOM
- Lucide React
- React Hot Toast
- React Loader Spinner
- ImageKit React SDK

### Backend (Server)

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- REST APIs
- Multer
- ImageKit Node.js SDK
- Dotenv
- CORS

### Development Tools

- Git
- GitHub
- Postman
- MongoDB Compass
- Visual Studio Code
- ESLint
- Nodemon

---

## ⚙️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/PrethigahShanmugarajah/Picora.git
cd Picora
```

### 2. Backend Setup (Server)

```bash
cd Server
npm install
npm run server
```

The backend server will run using Nodemon.

### 3. Client Setup

Open a new terminal:

```bash
cd Client
npm install
npm run dev
```

The frontend application will start using Vite.

---

## 🔑 Environment Variables

Configure the environment variables required by the application before running the project.

### 📂 Server (.env)

```env
PORT=
MONGODB_URI=
PROJECT_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

### 📂 Client (.env)

```env
VITE_BASE_URL=
VITE_IMAGEKIT_URL_ENDPOINT=
VITE_IMAGEKIT_ID=
```

> **Note:** These are example placeholders. Verify the environment variables used by your actual Client and Server code, and add any missing variables. Never commit real credentials, API keys, or secret keys to GitHub.

---

## 👨‍💻 Author

**Prethigah Shanmugarajah (2020/2021)** </br>
Department of Software Engineering </br>
Faculty of Computing </br>
Sabaragamuwa University of Sri Lanka </br>

---
