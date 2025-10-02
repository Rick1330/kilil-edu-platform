# KILIL Education Platform - Payments System

## Overview

This document explains the payment processing contract for the KILIL Education Platform's billing system.

## Internal Payment Processing Contract

The billing service exposes an internal endpoint for processing payments received from external payment providers:

```
POST /internal/payment-received
```

### Request Body

```json
{
  "accountId": "string",
  "amountCents": "number",
  "channel": "string",
  "txnRef": "string"
}
```

### Idempotency

The payment processing endpoint is idempotent. If a payment with the same `txnRef` has already been successfully processed (status=SETTLED), the endpoint will return a 200 OK response without making any changes to the database.

### Processing Flow

1. Check if a Payment record exists with the provided `txnRef`
2. If the Payment exists and status is SETTLED:
   - Return 200 OK immediately (idempotent behavior)
3. Otherwise:
   - Create or update the Payment record with status=SETTLED
   - Create a Receipt record linked to the Payment
   - Update the Account balance (decrement by amountCents)
   - Return 200 OK

### Response

```json
{
  "id": "string",
  "accountId": "string",
  "amountCents": "number",
  "channel": "string",
  "txnRef": "string",
  "status": "SETTLED"
}
```

### Error Handling

- If the Account does not exist, returns a 404 Not Found error
- If there are insufficient funds, returns a 400 Bad Request error
- Database errors return a 500 Internal Server Error

## Data Model

### Account

- `id`: UUID
- `personId`: String (reference to user)
- `balanceCents`: Integer (current balance in cents)
- `currency`: String (default: ETB)
- `createdAt`: DateTime

### Payment

- `id`: UUID
- `accountId`: String (reference to Account)
- `amountCents`: Integer (amount in cents)
- `channel`: String (payment channel, e.g., "Telebirr", "M-Pesa")
- `txnRef`: String (unique transaction reference)
- `status`: Enum (PENDING, SETTLED, REVERSED)
- `createdAt`: DateTime

### Receipt

- `id`: UUID
- `paymentId`: String (reference to Payment)
- `accountId`: String (reference to Account)
- `amountCents`: Integer (amount in cents)
- `channel`: String (payment channel)
- `settledAt`: DateTime

### Charge

- `id`: UUID
- `accountId`: String (reference to Account)
- `amountCents`: Integer (amount in cents, positive for charges)
- `type`: String (charge type)
- `createdAt`: DateTime