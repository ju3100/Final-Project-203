# Vanuatu Smart Transport

## Project Information

**Project Name:** Vanuatu Smart Transport

**Course:** ITDI203 Front-End and Backend

**Project Group:** Team G3

### Team Members

* Junior Chris Kavick
* Brown Tamata
* Ralph Theophile

---

# Project Overview

Vanuatu Smart Transport is a cloud-based transportation management system designed to simplify trip scheduling, booking management, and transport coordination across Vanuatu.

The application supports three user roles:

* **Passengers** – Search and book available trips.
* **Drivers** – Manage assigned trips and update transport information.
* **Administrators** – Manage users, trips, bookings, and monitor system activities.

The system is developed using a modern web architecture with a React frontend, Node.js/Express backend, PostgreSQL database, and cloud deployment through Render.

---

# Key Features

### Passenger Features

* User registration and login
* Browse available trips
* Book transport services
* View booking history
* Offline access using IndexedDB

### Driver Features

* Driver authentication
* Create and manage trips
* Real-time location updates using Socket.IO

### Administrator Features

* Manage users
* Manage trips
* Manage bookings
* View transport statistics and reports
* Monitor overall system activity

---

# System Architecture

## Frontend

Technology:

* React.js
* React Router
* IndexedDB

Responsibilities:

* User interface
* Trip management screens
* Booking management
* Offline data caching

Location:

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── api/
    └── utils/
```

Important Files:

* `src/api/APIBook.js`
* `src/utils/indexDB.js`

---

## Backend

Technology:

* Node.js
* Express.js
* Socket.IO //Browser sends request → server responds//
* PostgreSQL

Responsibilities:

* Authentication
* User management
* Trip management
* Booking management
* Real-time communication

Location:

```text
backend/
└── server.js
```

---

## Database

Database Management System:

* PostgreSQL

### Users Table

```sql
users(
    id,
    username,
    email,
    password_hash,
    role,
    contact
)
```

### Trips Table

```sql
trips(
    id,
    type,
    driver_id,
    pickup_location,
    destination_location,
    trip_time,
    start_time,
    end_time,
    capacity,
    booked,
    status,
    bus_size,
    vehicle_type,
    availability,
    contact,
    email,
    location
)
```

### Bookings Table

```sql
bookings(
    id,
    trip_id,
    user_id,
    vehicle,
    price,
    passengers,
    status
)
```

---

# Development Workflow

The project follows a GitHub-based development workflow:

1. Developers create feature branches.
2. Changes are committed and pushed to GitHub.
3. Pull Requests are created for review.
4. Code is merged into the main branch.
5. Render automatically deploys the latest version.

---

# Installation Guide

## Prerequisites

Install:

* Node.js
* npm
* PostgreSQL
* Git

---

## Clone Repository

```bash
git clone <repository-url>
cd vanuatu-smart-transport
```

---

## Frontend Setup

```bash
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DB_USER=postgres
DB_PASSWORD=Unvtest!@25
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vanuatu_transport
PORT=5001
```

Start backend server:

```bash
node server.js
```

Backend runs on:

```text
http://localhost:5001
```

---

# Deployment

Platform:


# API Overview

## Authentication

### Register User


---

### Login

```http
POST /login
```

---

## Trips

### Get All Trips

```http
GET /trips
```

### Create Trip

```http
POST /trips
```

---

## Bookings

### Create Booking

```http
POST /bookings
```

### Get User Bookings

```http
GET /bookings
```

---

# Test Accounts

### Administrator

| Username   | Password |
| ---------- | -------- |
| Admintest | Admin@123 |

### Passenger

| Username       | Password     |
| -------------- | ------------ |
| Passengertest | Passenger@123 |

### Driver

| Username    | Password  |
| ----------- | --------- |
| Drivertest | Driver@123 |

---


# Future Improvements

* Mobile application support
* GPS tracking integration
* Online payment gateway
* SMS notifications
* Advanced analytics dashboard
* Route optimization

---

# Conclusion

Vanuatu Smart Transport demonstrates the implementation of cloud computing technologies through a full-stack web application. The project integrates React, Node.js, PostgreSQL, GitHub, and Render to provide a scalable and accessible transportation management solution for passengers, drivers, and administrators.
