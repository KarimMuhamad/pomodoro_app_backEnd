# POMODORO TIMER RESTFull API
**Base URL : `/api/v1`** \
**Auth Header : `Bearer <TOKEN>`**\
**Content-Type : `json`**
---
## Auth API Specs
### Register 
**Endpoint : `POST /auth/register`**\
**Request Body :**

```json
{
  "username": "test",
  "email": "test@dev.com",
  "password" : "test123"
}
```
**Response Body : `Succes(201)`**

```json
{
  "status": 201,
  "message": "Successfully Sign Up",
  "data": {
    "id": 1,
    "username": "test",
    "email": "test@dev.com"
  }
}
```
**Response Body: Failed(400)**

```json
{
  "status": 400,
  "errors" : "Invalid Format"
}
```

**---**

### Login
**Endpoint : `POST /auth/login`**\
**Request Body :**

```json
{
  "email" : "test@dev.com",
  "username": "test",
  "password" : "test123"
}
```
**Response Body : `Succes(200)`**

```json
{
  "status": 200,
  "message": "Successfully Logged In",
  "data": {
    "id": 1,
    "username": "test",
    "email": "test@dev.com",
    "token": "jwt token",
    "expiresIn": 3600
  }
}
```

**Set-Cookie Headers :**
- `refreshToken=refreshToken;`
- `HttpOnly;`
- `Secure;`
- `SameSite=Strict;`
- `Path=/api/v1/auth/refresh;`
- `Max-Age=2592000;` // 1 month

**Response Body: Failed(400)**
```json
{
  "status": 400,
  "errors" : "Invalid Format"
}
```
**Response Body: Failed(401)**
```json
{
  "status": 401,
  "errors" : "Invalid Username or Password"
}
```

**---**

### Refresh Token
**Endpoint : `POST /auth/refresh`**\
**Request Header: `Cookie=refreshToken`**\
**Response Body : `Succes(201)`**

```json
{
  "status": 200,
  "message": "Successfully Refresh Token",
  "data": {
    "token": "testNew",
    "expiresIn": 3600
  }
}
```
**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Refresh Token Invalid"
}
```

**---**

### Logout
**Endpoint : `POST /auth/logout`**\
**Request Header: `Authorization= Bearer <TOKEN>`**\
**Response Body : `Succes(200)`**

```json
{
  "status": 200,
  "message": "OK"
}
```

**Set-Cookie Headers :**
- `refreshToken=;`
- `HttpOnly;`
- `Secure;`
- `SameSite=Strict;`
- `Path=/api/v1/auth/refresh;`
- `Max-Age=0;`

**Response Body: Failed(401)**

```json
{
  "status": 401,
  "errors" : "Acces Token Invalid"
}
```

