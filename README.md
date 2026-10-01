# TaskFlow - Agile Project & Task Management System (Trello / Jira Clone)

[![PHP Version](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

A collaborative full-stack project and task management system built with **Laravel REST API** (Sanctum authentication, Eloquent ORM, MySQL migrations & seeders) and **React (Vite)** with an interactive **Kanban Board** featuring drag-and-drop task movements, role-based access control (Admin & Team Member), real-time task filtering, project progress analytics, and a documented Postman API collection.

---

## 🚀 Key Features

### 1. Interactive Kanban Board UI
- **4 Workflow Lanes**: To-Do, In Progress, Review, and Done.
- **Drag-and-Drop Task Updates**: Native drag-and-drop with optimistic UI updates and instant database synchronization (`PATCH /api/tasks/{id}/status`).
- **Dynamic Filtering**: Filter cards by search keyword, priority level (Urgent, High, Medium, Low), or assignee.
- **Task Management Modal**: Create and update title, description, assignee, priority, status, and due date.

### 2. Role-Based Access Control (RBAC)
- **Admin Portal**: Executive dashboard with macro metrics (Total Projects, Tasks Completed, Active Engineers, Priority Distributions), User Management table to promote/demote team members, and full project CRUD capabilities.
- **Team Member Portal**: Personal sprint backlog, overdue task warnings, upcoming 7-day deadlines, and quick 1-click status advances (e.g. *Start Task* or *Mark Done*).

### 3. Project & Roadmap Management
- Grid and List view toggle modes.
- Visual completion progress bars calculated from task completion states.
- Team member avatars and task counts breakdown.

### 4. Robust Backend & Database
- **Laravel 11 REST API** with JSON responses and standardized error codes.
- **Laravel Sanctum** token-based authentication (Bearer Tokens).
- **MySQL Database** with Eloquent relationships:
  - `User`: HasMany projects, BelongsToMany assigned projects, HasMany assigned tasks.
  - `Project`: BelongsTo owner, BelongsToMany members, HasMany tasks.
  - `Task`: BelongsTo project, BelongsTo assignee, BelongsTo creator.
- Pre-configured seeders with rich sample projects and tasks across all stages.

### 5. API Documentation & Postman Collection
- Interactive documentation page directly inside the web application (`/api-docs`).
- Exported **Postman Collection** (`backend/postman/Task_Management_API.postman_collection.json`) with automated variable presets (`{{base_url}}`, `{{auth_token}}`).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend API** | PHP 8.2+, Laravel 11, Laravel Sanctum, Eloquent ORM |
| **Frontend** | React 19, Vite, React Router DOM v7, Axios, Lucide Icons |
| **Styling** | Vanilla CSS, Modern Tailwind CSS, Custom Glassmorphism |
| **Database** | MySQL (XAMPP / Laragon local service) |
| **Tooling** | Composer, Node.js / npm, Postman, Git |

---

## 🔑 Pre-Seeded Demo Accounts

You can test both user roles immediately using 1-click login buttons on the login page or manual credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@taskmanager.com` | `password123` | Full portfolio oversight, project CRUD, role promotion |
| **Team Member** | `john@taskmanager.com` | `password123` | Personal workload, sprint board, task status updates |
| **Team Member** | `jane@taskmanager.com` | `password123` | Sprint board, task status updates |
| **Team Member** | `alex@taskmanager.com` | `password123` | Sprint board, task status updates |
| **Team Member** | `sarah@taskmanager.com` | `password123` | Sprint board, task status updates |

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- **PHP 8.2+** installed (e.g. `C:\xampp\php\php.exe`)
- **MySQL** running locally on port 3306 (XAMPP or Laragon)
- **Node.js 20+** and **npm**
- **Composer** (or `composer.phar`)

### 2. Backend Setup (Laravel)
```bash
# Navigate to backend directory
cd backend

# Copy environment file
cp .env.example .env

# Verify database connection in .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=task_manager_db
# DB_USERNAME=root
# DB_PASSWORD=

# Generate application key
php artisan key:generate

# Run migrations and seed sample projects & tasks
php artisan migrate:fresh --seed --force

# Start the Laravel REST API server (port 8000)
php artisan serve --host=127.0.0.1 --port=8000
```

### 3. Frontend Setup (React + Vite)
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server (port 5173)
npm run dev
```

Open your browser and navigate to: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/login` | Authenticate user & return Sanctum Bearer Token | No |
| `POST` | `/api/register` | Register new user account | No |
| `GET` | `/api/me` | Fetch active user profile | Yes |
| `POST` | `/api/logout` | Revoke active token | Yes |
| `GET` | `/api/projects` | List all visible projects with task counters | Yes |
| `POST` | `/api/projects` | Create a new project workspace (Admin) | Yes |
| `GET` | `/api/projects/{id}` | Project details & nested member/task hierarchy | Yes |
| `PUT` | `/api/projects/{id}` | Update project details and member roster | Yes |
| `DELETE` | `/api/projects/{id}` | Delete project & cascade tasks (Admin) | Yes |
| `GET` | `/api/projects/{id}/tasks` | Get all tasks for a project with status/priority filters | Yes |
| `POST` | `/api/tasks` | Create a new task card | Yes |
| `GET` | `/api/tasks/{id}` | Fetch individual task details | Yes |
| `PUT` | `/api/tasks/{id}` | Update task title, description, priority, assignee | Yes |
| `PATCH` | `/api/tasks/{id}/status` | Drag-and-drop instant status lane update | Yes |
| `DELETE` | `/api/tasks/{id}` | Delete task | Yes |
| `GET` | `/api/dashboard/admin` | Executive KPI analytics and team workload breakdown | Yes (Admin) |
| `GET` | `/api/dashboard/member` | Personal backlog, overdue items, upcoming deadlines | Yes |
| `GET` | `/api/users` | List team members for assignments | Yes |
| `PUT` | `/api/users/{id}/role` | Promote/demote user between admin and member | Yes (Admin) |

---

## 🧪 Postman Collection

The Postman API test collection is located at:
`backend/postman/Task_Management_API.postman_collection.json`

1. Open Postman -> Click **Import**.
2. Select `Task_Management_API.postman_collection.json`.
3. Set your collection variable `base_url` to `http://127.0.0.1:8000`.
4. Run the **Login (Admin)** request to automatically obtain and use your bearer token across all endpoints.

---

## 📜 License
Distributed under the MIT License. Built for modern agile development teams.
