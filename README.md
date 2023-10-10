# War Simulator

Battle of armies! In this war simulator project, you can create and manage armies, squads, technologies, and engage in epic battles with various advantages and strengths.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Armies](#armies)
  - [Squads](#squads)
  - [Tech](#tech)

## Features

- Create and manage armies with different strengths and advantages.
- Organize squads within armies.
- Add planes and tanks to your armies.
- Engage in battles between armies with various advantages and strengths.
- User authentication with role-based access control (normal user or admin).

## Getting Started

### Prerequisites

Before you start, make sure you have the following prerequisites installed:

- Node.js and npm 
- postgreSQL
- Git

### Installation

1. Clone the repository:

```sh
git clone https://github.com/evakv0th/war-simulator.git
```

2. Install dependencies:

```sh
cd war-simulator
npm install
```

3. Configure the application by creating a .env file and specifying environment variables such as database connection settings and JWT secret. 

4. Start the server
```
npm start
```

### Usage

Once the server is running, you can access the API using the specified endpoints. For detailed API documentation, refer to the API Endpoints section below.

# API Endpoints

Here are some of the available API endpoints:

## Users:
```GET /api/v1/users```: Get a list of users. (id, name:string, type: normal | admin, email: string, nation: army)
  - response 200 OK:
     ```json
    [
      {
        "id": 2,
        "name": "Michael Scott",
        "type": "admin",
        "email": "dunder@gmail.com",
        "nation": "blueArmy"
      },
     {
        "id": 4,
        "name": "Pam",
        "type": "user",
        "email": "dunder3@gmail.com",
        "nation": "greenArmy"
      },
    ]
    ```
 - response 401 Unauthorized:
   ```json
    {
      "message": "Authorization Required"
    }
    ```
- response 500 Internal Server Error:
  ```json
    {
      "message": "Internal Server Error"
    }
    ```

To retrieve a list of users sorted by name, you can make a GET request to the `/api/v1/users` endpoint. If you want to sort the results by name, include the `name` query parameter in the request, e.g., `/api/v1/users?name=Mic`.

```/api/v1/users?name=Mic```: Get all users with name starts with Mic
- response 200 OK:
```json
[{
"id": 2,
"name":"Michael Scott",
"type": "admin",
"email": "dunder@gmail.com",
"nation": "blueArmy"
}]
```
  
```GET /api/v1/users/:id```: Get a single user by ID.
### Query Parameters

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `id`         | string | User Id (required)             |

 - response 200 OK:
  ```json
{
"id": 2,
"name":"Michael Scott",
"type": "admin",
"email": "dunder@gmail.com",
"nation": "blueArmy"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 404 Not Found:
```json
{
"message": "user with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```
```POST /api/v1/users```: Create a new user (id will be created automatically).
 

 - ### Request Body

| Parameter    | Type     | Description                   |
| ------------ | ------   | -------------------           |
| `name`       | string   | Name of the user (required)   |
| `type`       | string   | admin or user  (required)     |
| `email`      | string   | User's email  (required)      |
  
- response 201 Created:
```json
{
"id": 3,
"name":"Jim",
"type": "user",
"email": "dunder2@gmail.com",
"nation": ""
}
```
 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


```PATCH /api/v1/users/:id```: Partially update a user's information.

### Query Parameters

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `id`         | string | User Id (required)             |

 - ### Request Body

| Parameter    | Type     | Description                   |
| ------------ | ------   | -------------------           |
| `name`       | string   | Name of the user (optional)   |
| `type`       | string   | admin or user (optional)      |
| `email`      | string   | User's email (optional)       |

 - response 200 OK:
```json
{
"id": 2,
"name":"UpdatedName",
"type": "admin",
"email": "dunder@gmail.com",
"nation": "blueArmy"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```
  - response 404 Not Found:
```json
{
"message": "user with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```PATCH /api/v1/users/:id/army/:armyId```: Add army to user.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | User Id (required)                        |
| `armyId`     | string | Army Id which is added to user (required) |

 - response 200 OK:
```json
{
"id": 2,
"name":"UpdatedName",
"type": "admin",
"email": "dunder@gmail.com",
"nation": "addedArmy"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```
  - response 404 Not Found:
```json
{
"message": "user or army with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


```DELETE /api/v1/users/:id```: Delete a user.

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `id`         | string | User Id (required)             |

 - response 204 No Content:
  ```json
{}
```
 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "user with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

## Armies:

### Advantages in army:

-**air** - each aircraft will have 1.5x strength

-**heavyTech** - each tank will have 1.5x strength

-**minefield** - at the start of the battle each enemy unit (except for planes) will have strength reduction. (tanks will have 0.7x strength, troops 0.9x strength)

-**patriotic** - more men - more strength. Each squad will multiply strength of all squads by 0,05 (max bonus - 2x strength)


```GET /api/v1/armies```: Get a list of armies. (id, name:string, troops: [squads...], tech: [tech...], advantage: air | heavyTech | minefield | patriotic)
 - response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "blueArmy",
        "troops": ["squad1", "squad2"],
        "tech": ["plane1", "tank2"],
        "advantage": "patriotic"
      },
     {
        "id": 2,
        "name": "blackArmy",
        "troops": ["squad3"],
        "tech": ["plane1", "plane2"],
        "advantage": "air"
      },
    ]
    ```
 - response 401 Unauthorized:
   ```json
    {
      "message": "Authorization Required"
    }
    ```
- response 500 Internal Server Error:
  ```json
    {
      "message": "Internal Server Error"
    }
    ```


```GET /api/v1/armies/:id```: Get a single army by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Army Id (required)                        |

 - response 200 OK:
  ```json
{
"id": 2,
"name": "blackArmy",
"troops": ["squad3"],
"tech": ["plane1", "plane2"],
"advantage": "air"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 404 Not Found:
```json
{
"message": "army with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```POST /api/v1/armies```: Create a new army (id will be created automatically).

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the army (required)                      |
| `advantage`  | string   | Advantage of an army (required)                  |

 - response 201 Created:
  ```json
{
"id": 2,
"name": "blackArmy",
"troops": [],
"tech": [],
"advantage": "air"
}
```
 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```POST /api/v1/armies/battles``` : Assign a battle with another army
### Request Body

| Parameter      | Type     | Description                                      |
| ------------   | ------   | --------------------------------------           |
| `yourArmyId`   | string   | id of your army (required)                       |
| `enemyArmyId`  | string   | id of enemy army (required)                      |

- response 200 OK:
```json
{
"message": "Total strength of your units are 50 from squads, 50 from tanks and 50 from planes. With air advantage your total strength is 175. Enemy strength - 200, you lost."
}
```
 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
- response 400 Bad request:
```json
{
"message": "Invalid data. In body you should attack id of your army and id of enemy army."
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```PATCH /api/v1/armies/:id```: Partially update an army's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Army Id (required)                        |

### Request Body

| Parameter      | Type     | Description                                      |
| ------------   | ------   | --------------------------------------           |
| `name`         | string   | name of the army (optional)                      |
| `advantage`    | string   | advantage of the army(optional)                  |

 - response 200 OK:
  ```json
{
"id": 2,
"name": "newName",
"troops": ["squad3"],
"tech": ["plane1", "plane2"],
"advantage": "air"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "army with that id not found"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```DELETE /api/v1/armies/:id```: Delete an army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `armyId`     | string | Army Id (required)                        |

 - response 204 No Content:
```json
{}
```

 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "army with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```PATCH /api/v1/armies/:id/troops/:squadId```: Add squad to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `armyId`     | string | Army Id (required)                        |
| `squadId`    | string | Squad Id (required)                       |
 
 - response 200 OK:
  ```json
{
"id": 2,
"name": "blackArmy",
"troops": ["newSquad"],
"tech": [],
"advantage": "air"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "army or squad with that id not found"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```PATCH /api/v1/armies/:id/tech/:techId```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `armyId`     | string | Army Id (required)                        |
| `techId`     | string | tech Id (required)                        |
 
 - response 200 OK:
  ```json
{
"id": 2,
"name": "blackArmy",
"troops": [],
"tech": ["newTank"],
"advantage": "air"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "army or tech with that id not found"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

## Squads:

```GET /api/v1/squads```: Get a list of squads. (id, name:string, strength:number, nation: army)
 - response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "squadDelta",
        "strength": 150,
        "nation": "blackArmy"
      },
      {
        "id": 2,
        "name": "squadAlpha",
        "strength": 200,
        "nation": "blueArmy"
      },
    ]
    ```
 - response 401 Unauthorized:
   ```json
    {
      "message": "Authorization Required"
    }
    ```
- response 500 Internal Server Error:
  ```json
    {
      "message": "Internal Server Error"
    }
    ```

```GET /api/v1/squads/:id```: Get a single squad by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | squad Id (required)                       |

 - response 200 OK:
  ```json
{
 "id": 1,
"name": "squadDelta",
"strength": 150,
"nation": "blackArmy"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 404 Not Found:
```json
{
"message": "squad with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```POST /api/v1/squads```: Create a new squad.

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the squad (required)                     |
| `strength`   | number   | Strength of the squad (required)                 |

 - response 201 Created:
  ```json
{
 "id": 1,
"name": "squadDelta",
"strength": 150,
"nation": ""
}
```
 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


```PATCH /api/v1/squads/:id```: Partially update a squad's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Squad Id (required)                       |

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the squad (optional)                     |
| `strength`   | number   | Strength of the squad (optional)                 |

 - response 200 OK:
  ```json
{
 "id": 1,
"name": "updatedName",
"strength": 150,
"nation": "blackArmy"
}
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "squad with that id not found"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


```DELETE /api/v1/squads/:id```: Delete a squad.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | squad Id (required)                       |

 - response 204 No Content:
  ```json
{}
```

 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 404 Not Found:
```json
{
"message": "squad with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


## Tech:

```GET /api/v1/tech```: Get a list of technologies. (id, name:string, strength:number, nation: army, type: plane |  tank)

- response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "tank1",
        "strength": 600,
        "nation": "blackArmy",
        "type": "tank",
      },
         {
        "id": 2,
        "name": "plane2",
        "strength": 750,
        "nation": "blueArmy",
        "type": "plane",
      },
    ]
    ```
 - response 401 Unauthorized:
   ```json
    {
      "message": "Authorization Required"
    }
    ```
- response 500 Internal Server Error:
  ```json
    {
      "message": "Internal Server Error"
    }
   ```

```GET /api/v1/tech/:id```: Get a single technology by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required)                        |

 - response 200 OK:
  ```json
 {
        "id": 1,
        "name": "tank1",
        "strength": 600,
        "nation": "blackArmy",
        "type": "tank",
      }
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 404 Not Found:
```json
{
"message": "tech with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


```POST /api/v1/tech```: Create a new technology.

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the tech (required)                      |
| `strength`   | number   | Strength of the tech (required)                  |
| `type`       | number   | plane or tank (required)                         |
 
 - response 201 Created:
  ```json
{
        "id": 3,
        "name": "tank2",
        "strength": 600,
        "nation": "",
        "type": "tank",
      }
```
 - response 401 Unauthorized:
  ```json
{
"message": "Authorization Required"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


```PATCH /api/v1/tech/:id```: Partially update a technology's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required )                       |

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the tech (optional)                      |
| `strength`   | number   | Strength of the tech (optional)                  |

 - response 200 OK:
  ```json
{
        "id": 3,
        "name": "tank700",
        "strength": 700,
        "nation": "",
        "type": "tank",
      }
```
 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
  - response 404 Not Found:
```json
{
"message": "tech with that id not found"
}
```
- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

```DELETE /api/v1/tech/:id```: Delete a technology.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required)                        |

 - response 204 No Content:
  ```json
{}
```

 - response 401 Unauthorized:
```json
{
"message": "Authorization Required"
}
```
- response 404 Not Found:
```json
{
"message": "squad with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```



For more details on how to use these endpoints, refer to the API documentation provided in the project.
