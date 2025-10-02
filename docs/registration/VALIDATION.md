# Registration Validation

This document describes the validation process for course registration in the enrollment service.

## Time Conflict Detection Algorithm

The time conflict detection algorithm checks for scheduling conflicts between sections a student wants to register for and their existing schedule.

### Algorithm

1. For each meeting time in the new sections:
   - Compare with each meeting time in the existing schedule
   - If both meetings are on the same day (`dayOfWeek`)
   - Check if the time ranges overlap:
     ```
     (newStart < existingEnd) AND (newEnd > existingStart)
     ```
   - If overlap exists, record a conflict between the two sections

### Example

Consider two sections:
- Section A: Mon 9:00-11:00 (day=2, start=540, end=660)
- Section B: Mon 10:00-12:00 (day=2, start=600, end=720)

Since they're on the same day and the time ranges overlap (10:00 < 12:00 and 11:00 > 10:00), this is a conflict.

## Prerequisite Resolution

Prerequisite validation ensures students have completed required courses before registering for advanced courses.

### Process

1. For each course in the registration request:
   - Retrieve all prerequisites from the `Prerequisite` model
   - For each prerequisite:
     - Check if the student has a record in `CompletedCourse` for that prerequisite course
     - If not found, add the prerequisite course code to the unmet prerequisites list

### Example

If CS200 requires CS101:
- Student requests to register for CS200
- System checks if student has completed CS101
- If not, CS101 is added to the unmet prerequisites list

## Capacity Check

The capacity check ensures sections are not over-enrolled.

### Process

1. For each section in the registration request:
   - Compare `enrolled` count with `capacity`
   - If `enrolled >= capacity`, add section to the capacity-full list

## Idempotency Behavior

Registration requests are idempotent using the `clientRef` field to prevent duplicate enrollments.

### Process

1. When a registration request is received:
   - Check if a `RegistrationRequest` record exists with the same `clientRef`
   - If found, return the existing registration ID and status
   - If not found, proceed with validation and registration

### Benefits

- Prevents duplicate enrollments if clients retry requests
- Ensures consistent state even with network issues
- Provides reliable confirmation to clients

## Validation Response Structure

The validation endpoint returns a structured response:

```json
{
  "ok": boolean,
  "conflicts": string[],
  "unmetPrereqs": string[],
  "capacityFull": string[],
  "holds": string[]
}
```

- `ok`: True if all validations pass
- `conflicts`: List of time conflict descriptions
- `unmetPrereqs`: List of unmet prerequisite course codes
- `capacityFull`: List of section IDs at capacity
- `holds`: List of administrative holds (e.g., "financial")