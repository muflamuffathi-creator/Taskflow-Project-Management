# TaskFlow – Task & Project Management System

A Trello-style task and project management app built with Laravel, MySQL and React.

**Status:** 🚧 In progress

## Tech Stack
- **Backend:** PHP, Laravel, Laravel Sanctum, Eloquent ORM
- **Database:** MySQL
- **Frontend:** React.js (Vite) – planned
- **Tools:** Postman, Git, GitHub

## Features

### Completed
- [ ] User registration and login (Sanctum)
- [ ] Create and manage projects
- [ ] Create, update and delete tasks
- [ ] Task status: To-Do, In Progress, Review, Done

### Planned
- [ ] Task assignment, due dates and priority
- [ ] Roles: Admin and Team Member
- [ ] React Kanban board with drag-and-drop
- [ ] Task filtering
- [ ] React Native mobile app

## Getting Started

1. Clone the repository
```bash
   git clone https://github.com/muflamuffathi-creator/taskflow-project-management.git
   cd taskflow-project-management
```
2. Install dependencies
```bash
   composer install
```
3. Copy `.env.example` to `.env` and set your MySQL database details
4. Generate the app key
```bash
   php artisan key:generate
```
5. Run migrations and seeders
```bash
   php artisan migrate --seed
```
6. Start the server
```bash
   php artisan serve
```

## API Documentation
A Postman collection will be added in the `/docs` folder.

## Author
**Fathima Mufla**
[Portfolio](https://fathima-mufla.netlify.app/) | [LinkedIn](https://www.linkedin.com/in/fathima-mufla) | [GitHub](https://github.com/muflamuffathi-creator)
