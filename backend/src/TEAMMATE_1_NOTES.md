# Teammate 1 package

This zip contains the full starter plus Teammate 1 backend foundation.

Implemented in this package:
- MongoDB connection setup
- User model
- JWT token generation
- Register API
- Login API
- Auth middleware for protected routes
- Health route

Pending for later teammates:
- Frontend auth screens wiring
- Transaction CRUD
- Dashboard, filters, charts

## Test endpoints
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login

## Sample register body
{
  "name": "Khushi Patel",
  "email": "khushi@example.com",
  "password": "secret123"
}

## Sample login body
{
  "email": "khushi@example.com",
  "password": "secret123"
}
