# HR Management Backend Documentation

## Project Overview

Small **Express + Knex + PostgreSQL** backend for HR attendance management.

### Purpose

* Manage HR users
* Manage employees
* Track daily attendance (check-in times)
* Generate attendance reports

## Project Structure

```
HR-MANAGEMENT-BACKEND/
│
├─ node_modules/
├─ src/
│   ├─ config/              # Application config (DB, JWT, etc.)
│   ├─ controllers/         # Express controllers for routes
│   ├─ databases/
│   │   ├─ migrations/      # Knex migration files
│   │   ├─ seeds/           # Knex seed files
│   │   └─ setting.ts       # DB connection configuration
│   ├─ middleware/          # Authentication & custom middleware
│   ├─ models/              # TypeScript models/interfaces
│   ├─ repositories/        # Database access layer
│   ├─ routes/              # Express route definitions
│   ├─ services/            # Business logic
│   ├─ types/               # Custom TS types
│   ├─ utils/               # Utility functions
│   └─ validation/          # Input validation (Joi, etc.)
├─ uploads/                 # File uploads (employee photos)
├─ .env                     # Environment variables (not in repo)
├─ .env.example             # Example environment variables
├─ knexfile.ts              # Knex configuration
├─ package.json
├─ package-lock.json
├─ README.md
└─ postman_collection.json  # Optional: Postman collection
```

## Prerequisites

* Node.js v16+
* npm
* PostgreSQL
* npx knex (installed via devDependencies)

## Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd HR-MANAGEMENT-BACKEND
npm install
```

2. Create `.env` file from `.env.example` and update values.

3. Setup PostgreSQL database and update connection in `.env`.

## Database Commands

### Migrations

```bash
npx knex migrate:latest
```

### Seeders

```bash
npx knex seed:run
```

### Create Migration

```bash
npx knex migrate:make migration_name
```

### Create Seeder

```bash
npx knex seed:make seed_name
```

## Running the App (Development)

```bash
npm run dev
```

## API Endpoints

All endpoints except `/auth/login` are **protected** with JWT Bearer Token.

### Authentication

#### POST `/auth/login`

**Description:** HR user login
**Body:**

```json
{
  "email": "hr@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "HR Admin",
    "email": "hr@example.com"
  }
}
```

### Employees

#### GET `/employees`

**Description:** List all employees
**Query params (optional):**

* `page` — pagination page number
* `limit` — number of records per page
* `search` — search by name (partial match)

**Response:**

```json
[
  {
    "id": 1,
    "name": "Rahim",
    "age": 30,
    "designation": "Developer",
    "hiring_date": "2025-01-01",
    "date_of_birth": "1995-02-15",
    "salary": 50000,
    "photo_path": "uploads/rahim.jpg"
  }
]
```

#### GET `/employees/:id`

**Description:** Get single employee by ID
**Response:**

```json
{
  "id": 1,
  "name": "Rahim",
  "age": 30,
  "designation": "Developer",
  "hiring_date": "2025-01-01",
  "date_of_birth": "1995-02-15",
  "salary": 50000,
  "photo_path": "uploads/rahim.jpg"
}
```

#### POST `/employees`

**Description:** Create a new employee
**Body (multipart/form-data for photo):**

* `name` (required)
* `age` (required)
* `designation` (required)
* `hiring_date` (required)
* `date_of_birth` (required)
* `salary` (required)
* `photo_path` (optional file)

#### PUT `/employees/:id`

**Description:** Update employee details (optional new photo)

#### DELETE `/employees/:id`

**Description:** Delete employee

### Attendance

#### GET `/attendance`

**Description:** List attendance entries
**Query params (optional):**

* `employee_id`
* `date` (YYYY-MM-DD)
* `from` & `to` (date range)

**Example:** `/attendance?employee_id=12&from=2025-08-01&to=2025-08-31`

#### GET `/attendance/:id`

**Description:** Get single attendance entry

#### POST `/attendance`

**Description:** Create or upsert attendance
**Body:**

```json
{
  "employee_id": 1,
  "date": "2026-02-08",
  "check_in_time": "09:30"
}
```

**Behavior:** If `(employee_id, date)` exists, updates `check_in_time` instead of creating duplicate.

#### PUT `/attendance/:id`

**Description:** Update attendance entry

#### DELETE `/attendance/:id`

**Description:** Delete attendance entry

### Reports

#### GET `/reports/attendance`

**Description:** Monthly attendance summary
**Query params:**

* `month` — required, format `YYYY-MM`
* `employee_id` — optional

**Response per employee:**

```json
[
  {
    "employee_id": 1,
    "name": "Rahim",
    "days_present": 20,
    "times_late": 3
  }
]
```

**Late rule:** check-in after 09:45 counts as late.

## Example Queries

* Search employee by name: `/employees?name=rahim`
* Filter attendance: `/attendance?employee_id=12&from=2025-08-01&to=2025-08-31`
* Monthly report: `/reports/attendance?month=2025-08`

## Notes

* `attendance` table: `date` (SQL DATE), `check_in_time` (SQL TIME)
* Unique constraint on `(employee_id, date)`
* JWT authentication applied to all `/employees` and `/attendance` routes
* Employee photos stored in `uploads/`

## Example `.env.example`

```env
PORT=3000
DATABASE_URL=postgres://postgres:password@localhost:5432/hr_db
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```
