# Service Catalog Notes

## 1. What is a Service?

A Service represents a bookable tutoring lesson type or package.

Example:
- Math Grade 12 - Online - 60 minutes
- IELTS Speaking 1:1 - Online - 90 minutes
- Physics Grade 10 - Offline - 60 minutes

A Service is not a Booking.
A Service only defines what can be booked.

## 2. MVP Fields

Required MVP fields:

- code
- name
- subject
- description
- durationMinutes
- price
- level
- mode
- isActive

## 3. Field Meaning

- code: unique internal code for the service
- name: display name for students/admin
- subject: subject category, for example Math, English, Physics
- description: short explanation of the lesson/package
- durationMinutes: lesson duration, used later to calculate booking end time
- price: lesson price
- level: target level, for example beginner, grade_12, ielts
- mode: online or offline
- isActive: whether students can book this service

## 4. MVP Scope

In Phase 2, Service only supports basic catalog management.

Included:
- create service
- update service
- list services
- enable/disable service

Not included yet:
- availability calculation
- booking creation
- discount
- package of multiple lessons
- payment
- tutor matching

## 5. Business Rules

- Only active services are visible to students.
- Admin can see both active and inactive services.
- durationMinutes should come from Service, not from client booking input.
- Service must exist before booking can be created in later phases.