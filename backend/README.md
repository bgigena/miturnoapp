# MiTurnoApp Backend

Node.js + Express + MySQL backend for MiTurnoApp.

## Prerequisites
- Node.js (v18+)
- MySQL Database

## Setup

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Database Setup**:
    - Ensure your MySQL server is running.
    - Create the database and tables using the `miturnoapp.sql` file (located in the project root).
    - You can use a tool like MySQL Workbench or command line:
      ```bash
      mysql -u root -p < ../miturnoapp.sql
      ```

3.  **Environment Variables**:
    - Rename or copy `.env.example` (if exists) or just edit `.env`.
    - Set your database credentials:
      ```
      PORT=3000
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=your_password
      DB_NAME=miturnoapp
      JWT_SECRET=your_jwt_secret
      ```

## Running the Server

- **Development** (with nodemon):
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service (Protected)

### Providers
- `GET /api/providers` - List all providers
- `POST /api/providers` - Create provider profile (Protected)
- `POST /api/providers/:id/services` - Add service to provider

### Clients
- `POST /api/clients` - Create client profile (Protected)

### Appointments
- `GET /api/appointments` - Get appointments (Context aware: Provider gets theirs, Client gets theirs)
- `POST /api/appointments` - Book an appointment
- `PUT /api/appointments/:id/status` - Update status
