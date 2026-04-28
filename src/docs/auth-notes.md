# Auth & RBAC Plan

## Roles
- student
- tutor
- admin

## Public routes
- POST /auth/register
- POST /auth/login
- GET /services

## Protected routes
- GET /auth/me
- GET /bookings/my
- POST /bookings

## Admin-only routes
- POST /services
- PATCH /services/:id
- GET /admin/bookings
- PATCH /admin/bookings/:id/assign
- PATCH /admin/bookings/:id/status

## Tutor-only routes
- GET /tutor/bookings