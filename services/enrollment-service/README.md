# Enrollment Service

The Enrollment Service handles course registration, validation, and enrollment management for the KILIL Education Platform.

## Features

- Course catalog search
- Section scheduling
- Student enrollment management
- Registration validation (time conflicts, prerequisites, capacity)
- Idempotent registration confirmation
- Enrollment swapping

## API Endpoints

### Catalog

- `GET /catalog/courses?query=CS` - Search for courses by code or title
- `GET /sections?termId=2025SP&courseId=CS120` - Get sections for a course in a term

### Student Enrollments

- `GET /student/:personId/enrollments?termId=2025SP` - Get student's enrollments for a term

### Registration

- `POST /registration/validate` - Validate registration (check conflicts, prerequisites, capacity)
- `POST /registration/confirm` - Confirm registration (idempotent by clientRef)
- `POST /enrollments/swap` - Swap enrollments between sections

## Data Models

- Term
- Course
- Prerequisite
- Section
- MeetingTime
- Enrollment
- CompletedCourse
- RegistrationRequest

## Prerequisites

- PostgreSQL database
- Node.js 20+
- pnpm 9+

## Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

### Run Tests

```bash
pnpm test
```

### Run Linting

```bash
pnpm lint
```

### Run Type Checking

```bash
pnpm typecheck
```

## Environment Variables

See `.env.example` for required environment variables.