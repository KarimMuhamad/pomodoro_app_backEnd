# POMODORO TIMER RESTFull API
**Base URL : `/api/v1`** \
**Auth Header : `Bearer <TOKEN>`**\
**Content-Type : `json`**
---
## Pommodoro Session API Specs
### Create Session
**Endpoint: `POST /session`**

**Request Body:**
```json
{
  "labelId": 1,
  "duration": 1500,
  "hour": 14,
  "type": "FOCUS"
}
```

**Response Body:**
```json
{
  "status": 201,
  "message": "Successfully created session",
  "data": {
    "id": 1,
    "userId": 1,
    "labelId": 1,
    "duration": 1500,
    "startTime": "2023-06-01T14:00:00.000Z",
    "endTime": null,
    "hour": 14,
    "type": "FOCUS",
    "isCompleted": false
  }
}
```

### Update Session
**Endpoint: `PATCH /session/:sessionId`**

**Request Body:**
```json
{
  "endTime": "2023-06-01T14:25:00.000Z",
  "isCompleted": true
}
```

**Response Body:**
```json
{
  "status": 200,
  "message": "Successfully updated session",
  "data": {
    "id": 1,
    "userId": 1,
    "labelId": 1,
    "duration": 1500,
    "startTime": "2023-06-01T14:00:00.000Z",
    "endTime": "2023-06-01T14:25:00.000Z",
    "hour": 14,
    "type": "FOCUS",
    "isCompleted": true
  }
}
```
