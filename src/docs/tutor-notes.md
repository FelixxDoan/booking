# Tutor Foundation Notes

## 1. User vs TutorProfile

User is responsible for authentication, identity, and role.

TutorProfile stores tutor-specific data used for display, admin operations, and future booking assignment.

Do not put tutor-specific fields directly into User unless they are shared by all roles.

## 2. User Fields

User should keep general fields only:

- id
- fullName
- email
- passwordHash
- role
- phone
- status
- createdAt
- updatedAt

## 3. TutorProfile MVP Fields

Required MVP fields:

- id
- userId
- headline
- bio
- subjects
- yearsOfExperience
- teachingModes
- isActive

Optional later fields:

- avatarUrl
- defaultAvailabilityPolicy
- rating
- totalLessons
- education
- certificates

## 4. Tutor List Exposure

For admin:

- tutor id
- user fullName
- user email
- subjects
- teachingModes
- yearsOfExperience
- isActive

For student:

- tutor id
- fullName
- headline
- bio
- subjects
- teachingModes
- yearsOfExperience

Do not expose:
- passwordHash
- internal admin notes
- private contact data unless needed

## 5. MVP Scope

In Phase 2, TutorProfile only supports foundation data.

Included:
- create tutor profile through seed or admin setup
- list tutors
- get tutor basic detail

Not included yet:
- tutor availability calculation
- tutor schedule management
- auto matching
- rating/review
- lesson notes
- payroll