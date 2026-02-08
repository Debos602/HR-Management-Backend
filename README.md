# HR Management Backend

Small Express + Knex + PostgreSQL backend for simple HR attendance management.

**Contents**
- Project overview
- Prerequisites
- Setup
- Database: migrations & seeds
- Running the app
- API endpoints (attendance-focused)
- Notes & next steps


**Project Overview**
- Server: Node.js + Express
- Database: PostgreSQL via Knex
- Purpose: Manage users, employees and attendance records (check-in times)


**Prerequisites**
- Node.js (v16+ recommended)
- npm 
- PostgreSQL
- `npx knex` available (installed by project devDependencies)


**Setup**
1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file or otherwise provide environment variables required by the project (example keys used by knex/DB connection). Check `knexfile.ts` and `src/databases/setting.ts` for expected configuration.

3. Configure your PostgreSQL database and update the connection settings.


**Database: migrations & seeds**
Run migrations and seeds with Knex:

```bash
npx knex migrate:latest --knexfile knexfile.ts
npx knex seed:run --knexfile knexfile.ts
```

The repo contains migration files under `src/databases/migrations` and initial seed(s) under `src/databases/seeds`.


**Run the app (development)**
Start the server (project scripts may vary):

```bash
npm run dev
```

(If you use `ts-node` or `ts-node-dev`, ensure the dev script in `package.json` is configured.)


**API: Attendance endpoints**
All endpoints are under the authentication middleware by default. Adjust tokens/headers accordingly.

- GET /attendance
	- Query parameters (all optional):
		- `employee_id` (number) — filter by employee id
		- `date` (YYYY-MM-DD) — returns attendance rows for that date
		- `from` (YYYY-MM-DD) and `to` (YYYY-MM-DD) — date range
		- `include_absent` (true|1) — when combined with a single `date`, returns all employees and their attendance (present/absent) for that date
	- Examples:
		- List all attendance rows: `GET /attendance`
		- Filter by employee: `GET /attendance?employee_id=5`
		- Single-date records: `GET /attendance?date=2026-01-14`
		- Range: `GET /attendance?from=2026-01-01&to=2026-01-31`
		- Include absent employees for a date: `GET /attendance?date=2026-01-14&include_absent=true`

- POST /attendance
	- Body: `{ "employee_id": number, "date": "YYYY-MM-DD", "check_in_time": "HH:MM" }`
	- Creates or updates a check-in for the employee on that date.

- GET /attendance/:id
	- Get a single attendance record by id

- GET /attendance/employee/:employeeId
	- Get attendance history for a given employee

- PUT /attendance/:id
	- Update an attendance record (partial updates accepted)

- DELETE /attendance/:id
	- Delete an attendance record

- GET /attendance/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
	- Get attendance report between two dates


**Notes & implementation details**
- The `attendance` table stores `date` (SQL DATE) and `check_in_time` (SQL TIME). Unique constraint is on `(employee_id, date)`.
- The controller and service include a new `include_absent` flow that performs a left-join between `employees` and `attendance` to return all employees for a given date, marking `status` as `present` or `absent`.
- Authentication is applied to the attendance routes via `src/routes/attendance.ts`.


**Next steps / suggestions**
- Add API documentation (Swagger/OpenAPI) for clarity and testing.
- Add example `.env.example` and document required env vars.
- Add integration tests for the attendance routes.


If you'd like, I can:
- Add a small Postman collection example for the attendance flows,
- Run a quick smoke test calling the `/attendance` endpoints,
- Or refine the README content and add a `.env.example` file.
