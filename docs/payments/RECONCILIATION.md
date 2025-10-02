# Payments Reconciliation Specification

## Overview
This document describes the reconciliation format and process for payments processed through the KILIL Education Platform.

## Reconciliation File Format (T+1)
Daily reconciliation files are generated in CSV/JSON format containing all payment transactions for the previous day.

### Fields
| Field | Type | Description |
|-------|------|-------------|
| `txnRef` | String | Unique transaction reference (globally unique) |
| `channel` | String | Payment channel (e.g., "telebirr", "mpesa") |
| `accountId` | String | Student account ID |
| `amountCents` | Integer | Payment amount in cents |
| `fee` | Integer | Processing fee in cents |
| `net` | Integer | Net amount in cents (amountCents - fee) |
| `status` | String | Transaction status ("SETTLED", "PENDING", "REVERSED") |
| `createdAt` | ISO8601 | Timestamp when transaction was initiated |
| `settledAt` | ISO8601 | Timestamp when transaction was settled |
| `reversalRef` | String (optional) | Reference for reversal transaction |

### Example CSV
```csv
txnRef,channel,accountId,amountCents,fee,net,status,createdAt,settledAt,reversalRef
TXN-001,telebirr,ACC-123,50000,500,49500,SETTLED,2025-10-01T10:30:00Z,2025-10-01T10:30:05Z,
TXN-002,mpesa,ACC-456,25000,250,24750,SETTLED,2025-10-01T11:15:00Z,2025-10-01T11:15:03Z,
```

### Example JSON
```json
[
  {
    "txnRef": "TXN-001",
    "channel": "telebirr",
    "accountId": "ACC-123",
    "amountCents": 50000,
    "fee": 500,
    "net": 49500,
    "status": "SETTLED",
    "createdAt": "2025-10-01T10:30:00Z",
    "settledAt": "2025-10-01T10:30:05Z",
    "reversalRef": null
  }
]
```

## Idempotency Guidelines
All payment operations must be idempotent to prevent duplicate processing:

1. **Initiate Payment**: Use `Idempotency-Key` header for all payment initiation requests
2. **Webhook Processing**: Use `txnRef` as unique constraint in database
3. **Reconciliation**: Match transactions by `txnRef` to prevent duplicate settlement

## Webhook Security
When integrating with real Payment Service Providers (PSPs), implement the following security measures:

1. **Signature Verification**: Verify webhook signatures using provider-specific algorithms
2. **IP Whitelisting**: Restrict webhook endpoints to known PSP IP ranges
3. **Timestamp Validation**: Reject requests older than 5 minutes
4. **Payload Integrity**: Validate all required fields are present and correctly formatted

## Error Handling
- Retry failed webhook deliveries with exponential backoff
- Log all reconciliation discrepancies for manual review
- Alert on significant reconciliation mismatches

## Frequency
- **Webhooks**: Real-time processing
- **Reconciliation Files**: Daily (T+1)
- **Exception Reports**: On-demand