# Mini Student Management System

This is a full-stack web application built to simulate a real-world student information system. It features user authentication, role-based access control, profile management, and complete CRUD operations for student records.

**Live Demo:** [Link to your deployed Vercel site]

---

## Features

### Core Functionality
- **User Authentication:** Secure user registration and JWT-based login for both students and admins.
- **Role-Based Access Control:** The application has two distinct roles:
  - **Student:** Can view and update their own profile information.
  - **Admin:** Has full access to manage all student data.
- **Profile Management:** Users can update their personal and course-related information, which is persisted in the database.
- **Student Management (Admin):** Admins can perform full CRUD operations on student records:
  - **Create:** Add new students to the system.
  - **Read:** View a paginated and filterable list of all students.
  - **Update:** Edit any student's information.
  - **Delete:** Remove a student from the system.

### Bonus Features Implemented
- **Admin Dashboard:** A summary view for admins showing key statistics like total student count, active students, etc.
- **Pagination & Filtering:** The admin's student list is paginated and can be filtered by status (Active/Graduated) for a better user experience.
- **Real-time Feedback:** The UI provides instant feedback for all actions using toast notifications.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** NextAuth.js (client-side), JWT & bcryptjs (server-side)
- **Deployment:** Frontend on Vercel, Backend on Render (or similar).

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm
- A MongoDB Atlas account

### 1. Frontend Setup

1.  Navigate to the root project directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the root and add the following variables:
    ```
    # A generated secret for NextAuth.js
    NEXTAUTH_SECRET=your_nextauth_secret_here

    # The URL of your running backend server
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

### 2. Backend Setup

1.  Navigate to the `/server` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `/server` directory and add the following variables:
    ```
    # Your MongoDB Atlas connection string
    MONGODB_URI=your_mongodb_connection_string_here

    # A generated secret for signing JWTs
    JWT_SECRET=your_jwt_secret_here
    ```
4.  (Optional but Recommended) Seed the database with a default admin user:
    ```bash
    npm run seed
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```
    The backend API will be available at `http://localhost:5000`.

### Login Credentials for Testing

-   **Admin:**
    -   Email: `admin@test.com`
    -   Password: `admin123`
-   **Student:**
    -   Register a new user through the UI.