# POMODORO TIMER RESTFull API
**Base URL : `/api/v1`** \
**Auth Header : `Bearer <TOKEN>`**\
**Content-Type : `json`**
---

## Labels API Specs
### Get All Labels
**Endpoint : `GET /labels`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Response Body : `success (200)`**

```json
{
  "status": 200,
  "message": "succes get all labels",
  "data": [
    {
      "id": 1,
      "name": "test",
      "color": "#000000"
    },
    {
      "id": 2,
      "name": "test2",
      "color": "#000000"
    }
  ]
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

### Get Label By Id
**Endpoint : `GET /labels/:labelId`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Response Body : `success (200)`**

```json
{
  "status": 200,
  "message": "succes get all labels",
  "data": {
    "id": 1,
    "name": "test",
    "color": "#000000"
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

### Create Label
**Endpoint : `POST /labels`**\
**Request Header: `authorization Bearer <TOKEN>`**

**Request Body :**

```json
{
  "name": "test",
  "color": "#000000"
}
```
**Response Body : `success (201)`**

```json
{
  "status": 201,
  "message": "succes create labels",
  "data": {
    "id": 1,
    "name": "test",
    "color": "#000000"
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

### Update Label

**---**

### Delete Label