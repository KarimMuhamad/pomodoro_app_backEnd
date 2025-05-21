# POMODORO TIMER RESTFull API
**Base URL : `/api/v1`** \
**Auth Header : `Bearer <TOKEN>`**\
**Content-Type : `json`**
---
## User API Specs
### GET User Profile
**Endpoint : `GET /users/me`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Response Body : `success (200)`**
```json
{
  "status": 200,
  "message": "Sueccess Get User",
  "data": {
    "id": 1,
    "username": "test",
    "email": "test@dev.com"
  }
}
```
**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Unauthorized"
}
```
**---**

### Update User Profile
**Endpoint : `PATCH /users/me`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Request Body :**

```json
{
  "username": "changeTest",
  "email": "changetest@dev.com",
  "password": "changetest123"
}
```

**Response Body : `success (200)`**
```json
{
  "status": 200,
  "message": "Sueccess Get User",
  "data": {
    "id": 1,
    "username": "changeTest",
    "email": "changetest@dev.com"
  }
}
```
**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Unauthorized"
}
```
**---**
### Delete User Profile
**Endpoint : `DELETE /users/me`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Response Body : `success (200)`**
```json
{
  "status": 200,
  "message": "OK"
}
```
**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Unauthorized"
}
```

---
## User Preferences API Specs
### GET User Preferences
**Endpoint : `GET /users/preferences`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Response Body: succes (200)**

```json
{
  "status": 200,
  "message": "Succesfuly get User Preferences",
  "data": {
    "focusDuration": 1500,
    "shorBreakDuration": 300,
    "longBreakDutation": 900,
    "autoStartFocus": false,
    "autoStartBreak": false
  }
}
```
**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Unauthorized"
}
```

**---**

### UPDATE User Preferences
**Endpoint : `PATCH /users/preferences`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Request Body:**

```json
{
  "focusDuration": 3000,
  "shorBreakDuration": 600,
  "longBreakDutation": 1800,
  "autoStartFocus": true,
  "autoStartBreak": true
}
```

**Response Body: succes (200)**

```json
{
  "status": 200,
  "message": "Succesfuly get User Preferences",
  "data": {
    "focusDuration": 3000,
    "shorBreakDuration": 600,
    "longBreakDutation": 1800,
    "autoStartFocus": true,
    "autoStartBreak": true
  }
}
```
**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Unauthorized"
}
```