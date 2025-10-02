#!/bin/bash

# Test endpoints for the enrollment service

echo "Testing Enrollment Service Endpoints"
echo "==================================="

# Test catalog search
echo "1. Testing catalog search:"
curl -X GET "http://localhost:4003/api/catalog/courses?query=CS" \
  -H "Content-Type: application/json"
echo -e "\n"

# Test sections endpoint
echo "2. Testing sections endpoint:"
curl -X GET "http://localhost:4003/api/sections?termId=2025SP&courseId=CS120" \
  -H "Content-Type: application/json"
echo -e "\n"

# Test student enrollments
echo "3. Testing student enrollments:"
curl -X GET "http://localhost:4003/api/student/demo-user-123/enrollments?termId=2025SP" \
  -H "Content-Type: application/json"
echo -e "\n"

# Test registration validation
echo "4. Testing registration validation:"
curl -X POST "http://localhost:4003/api/registration/validate" \
  -H "Content-Type: application/json" \
  -d '{"personId": "demo-user-123", "termId": "2025SP", "sectionIds": ["sec-1", "sec-2"]}'
echo -e "\n"

# Test registration confirmation
echo "5. Testing registration confirmation:"
curl -X POST "http://localhost:4003/api/registration/confirm" \
  -H "Content-Type: application/json" \
  -d '{"personId": "demo-user-123", "termId": "2025SP", "sectionIds": ["sec-1", "sec-2"], "clientRef": "test-ref-123"}'
echo -e "\n"

# Test enrollment swap
echo "6. Testing enrollment swap:"
curl -X POST "http://localhost:4003/api/enrollments/swap" \
  -H "Content-Type: application/json" \
  -d '{"personId": "demo-user-123", "termId": "2025SP", "fromSectionId": "sec-1", "toSectionId": "sec-2"}'
echo -e "\n"

echo "All endpoint tests completed."