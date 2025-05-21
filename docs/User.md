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