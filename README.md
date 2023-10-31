# War Simulator

Battle of armies! In this war simulator project, you can create and manage armies, squads, technologies, and engage in epic battles with various advantages and strengths.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)



# API ENDPOINT:
 ## Auth
- [**Register**](#post-register)
- [**Login**](#post-apiv1authlogin)

## Users
- [Get All Users](#get-apiv1users)
- [Get User by ID](#get-apiv1usersid)
- [Partially Update User](#patch-apiv1usersid)
- [Delete User](#delete-apiv1usersid)
- [Assign Battle](#get-apiv1usersbattleenemyid)
- [Continue to Air Battle](#get-apiv1usersbattleenemyidairbattle)
- [Continue to Surface Battle](#get-apiv1usersbattleenemyidsurfacebattle)

  ## Armies
- [Get All Armies](#get-apiv1armies)
- [Get Army by ID](#get-apiv1armiesid)
- [Create a New Army](#post-apiv1armies)
- [Add Army to User](#patch-apiv1armiesidusersuserid)
- [Partially Update Army](#patch-apiv1armiesid)
- [Delete Army](#delete-apiv1armiesid)

## Squads
- [Get All Squads](#get-apiv1squads)
- [Get Squad by ID](#get-apiv1squadsid)
- [Create a New Squad](#post-apiv1squads)
- [Partially Update Squad](#patch-apiv1squadsid)
- [Delete Squad](#delete-apiv1squadsid)
- [Add Squad to Army](#patch-apiv1squadsidarmiesarmyid)
- [Remove Squad from Army](#patch-apiv1squadsidremove_army)

## Weapons
- [Get All Weapons](#get-apiv1weapons)
- [Get Weapon by ID](#get-apiv1weaponsid)
- [Create a New Weapon](#post-apiv1weapons)
- [Partially Update Weapon](#patch-apiv1weaponsid)
- [Delete Weapon](#delete-apiv1weaponsid)
- [Add Weapon to Squad](#patch-apiv1weaponsidsquadsquadid)
- [Remove Weapon from Squad](#patch-apiv1weaponsidremove_army)

 ## Tanks
- [Get All Tanks](#get-apiv1tanks)
- [Get Tank by ID](#get-apiv1tanksid)
- [Create a New Tank](#post-apiv1tanks)
- [Partially Update Tank](#patch-apiv1tanksid)
- [Delete Tank](#delete-apiv1tanksid)
- [Add Tank to Army](#patch-apiv1tanksidarmiesarmyid)
- [Remove Tank from Army](#patch-apiv1tanksidremove_army)

## Planes
- [Get All Planes](#get-apiv1planes)
- [Get Plane by ID](#get-apiv1planesid)
- [Create a New Plane](#post-apiv1planes)
- [Partially Update Plane](#patch-apiv1planesid)
- [Delete Plane](#delete-apiv1planesid)
- [Add Plane to Army](#patch-apiv1planesidarmiesarmyid)
- [Remove Plane from Army](#patch-apiv1planesidremove_army)

  
- [Diagram for Database](#diagramDB)

## Features

- Create and manage armies with different strengths and advantages.
- Each user have an army, army can have military units, ammount of fuel and ammount of bullets.
- Each army can have single advantage: air, heavyTech, patriotic and minefield.
- Squads can have multiple weapons, squad without weapons cannot participate in battle.
- Add planes and tanks to your armies. Both have fuel requirements, so you cant spam heavy tech.
- Weapons have requirements for bullets.
- Engage in battles between armies with various advantages and strengths.

- ### Advantages in army:

-**air** - each aircraft will have 1.5x strength

-**heavyTech** - each tank will have 1.5x strength

-**minefield** - at the start of the battle each enemy unit (except for planes) will have strength reduction. (tanks will have 0.7x strength, troops 0.9x strength)

-**patriotic** - more men - more strength. Each squad will multiply strength of all squads by 0,05 (max bonus - 2x strength)


## Getting Started

### Prerequisites

Before you start, make sure you have the following prerequisites installed:

- Node.js and npm
- Typescript 
- postgreSQL
- Docker
- Git
- Postman (optional)

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

4. Start the build image with docker
```
docker build -t war-simulator .
```
5. Start the app with

```
docker-compose up
```
### Usage

Once the server is running, you can access the API using the specified endpoints. For detailed API documentation, refer to the API Endpoints section below.

# API Endpoints

Here are some of the available API endpoints:
## Auth:
### POST Register
```POST /api/v1/auth/register```: 

 - ### Request Body

| Parameter    | Type     | Description                   |
| ------------ | ------   | -------------------           |
| `name`       | string   | Name of the user (required)   |
| `password`   | string   | password       (required)     |
| `email`      | string   | User's email  (required)      |

- response 201 Created:
```json
{
    "id": 4,
    "name": "admin",
    "type": "user",
    "email": "admin@gmail.com",
    "password": "test",
    "created_at": "2023-10-26T14:14:22.379Z",
    "updated_at": "2023-10-26T14:14:22.379Z"
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
### ```POST /api/v1/auth/login```: 
 - ### Request Body

| Parameter    | Type     | Description                   |
| ------------ | ------   | -------------------           |
| `name`       | string   | Name of the user (required)   |
| `password`   | string   | password       (required)     |
| `email`      | string   | User's email  (required)      |

- response 200 OK:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjN9.06dgh6b1a7c2dd9477f0d6700043966bba0cb7868d1e1cb977b8e1d66e5eae021e"
}
```

- response 400 Bad Request:
```json
{
"message": "Invalid data"
}
```

 - response 401 Unauthorized:
```json
{
"message": "Wrong username, password, or email"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

## Users:
### ```GET /api/v1/users```: 
  - response 200 OK:
     ```json
    [
     {
        "id": 2,
        "name": "admin",
        "type": "admin",
        "email": "admin@gmail.com",
        "password": "admin",
        "created_at": "2023-10-22T21:06:15.444Z",
        "updated_at": "2023-10-22T21:06:15.444Z"
    },
    {
        "id": 1,
        "name": "user",
        "type": "user",
        "email": "user@gmail.com",
        "password": "user",
        "created_at": "2023-10-22T21:04:32.217Z",
        "updated_at": "2023-10-22T21:04:32.217Z"
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

```/api/v1/users?name=admin```: Get all users with name starts with Mic
- response 200 OK:
```json
[{

        "id": 2,
        "name": "admin",
        "type": "admin",
        "email": "admin@gmail.com",
        "password": "admin",
        "created_at": "2023-10-22T21:06:15.444Z",
        "updated_at": "2023-10-22T21:06:15.444Z"
    },
]
```
  
### ```GET /api/v1/users/:id```: Get a single user by ID.
### Query Parameters

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `id`         | string | User Id (required)             |

 - response 200 OK:
  ```json
{
    "id": 2,
    "name": "admin",
    "type": "admin",
    "email": "admin@gmail.com",
    "password": "admin",
    "created_at": "2023-10-22T21:06:15.444Z",
    "updated_at": "2023-10-22T21:06:15.444Z",
    "army": {
        "id": 2,
        "name": "dagon army",
        "advantage": "heavy_tech",
        "user_id": 2,
        "fuel_amount": 1000,
        "bullets_amount": 600,
        "created_at": "2023-10-29T13:55:21.140Z",
        "updated_at": "2023-10-29T13:55:21.140Z"
    }
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


### ```PATCH /api/v1/users/:id```: Partially update a user's information.

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
    "id": 1,
    "name": "user",
    "type": "user",
    "email": "user@gmail.com",
    "password": "user",
    "created_at": "2023-10-22T21:04:32.217Z",
    "updated_at": "2023-10-22T21:04:32.217Z"
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


### ```DELETE /api/v1/users/:id```: Delete a user.

### Query Parameters
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

### ```GET /api/v1/users/battle/:enemyId``` : Assign a battle with another user. It will take your id from token and your army.
### Query Parameters

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `enemyId`    | string | User Id (required)             |


- response 200 OK:
```json
{
    "msg": "the battle has started! These are stats of you and your enemy (with advantages included in numbers).",
    "msg2": "You can use endpoint /battle/1/airBattle to continue the battle and start Air stage.",
    "battleStats": {
        "yourStats": {
            "yourTanksStrength": 450,
            "yourPlanesAirStrength": 400,
            "yourPlanesSurfaceStrength": 50,
            "yourSquadsStrength": 500,
            "yourAdvantage": "heavy_tech"
        },
        "enemyStats": {
            "enemyTanksStrength": 100,
            "enemyPlanesAirStrength": 598.5,
            "enemyPlanesSurfaceStrength": 120,
            "enemySquadsStrength": 400,
            "enemyAdvantage": "air"
        }
    }
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
"message": "you cannot start battle before you finish previous battle."
}
```
- response 404 Not Found:
```json
{
"message": "Enemy user not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```
### ```GET /api/v1/users/battle/:enemyId/airBattle``` : Continue to air Battle with your enemy.
### Query Parameters

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `enemyId`    | string | User Id (required)             |


- response 200 OK:
```json
{
    "msg": "Your enemy won the air battle! Continue battle with /battle/1/surfaceBattle",
    "airBattleResult": "Defeat",
    "enemySurfacePlaneStrength": 120
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
"message": "Please start battle before going to air battle"
}
```
- response 404 Not Found:
```json
{
"message": "Enemy user not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

### ```GET /api/v1/users/battle/:enemyId/surfaceBattle``` : Continue to surface Battle with your enemy.
### Query Parameters

| Parameter    | Type   | Description                    |
| ------------ | ------ | -------------                  |
| `enemyId`    | string | User Id (required)             |


- response 200 OK:
```json
{
    "msg": "Congratulations! You won! with your str 950 versus enemy str 620. Coin was 0.46857286605119164"
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
"message": "Please finish air battle before going to surface battle"
}
```
- response 404 Not Found:
```json
{
"message": "Enemy user not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

## Armies:

### ```GET /api/v1/armies```: Get a list of armies. (and all of their tech and people)
 - response 200 OK:
     ```json
   [
    {
        "id": 3,
        "name": "army test 2",
        "advantage": "air",
        "user_id": 1,
        "fuel_amount": 700,
        "bullets_amount": 800,
        "created_at": "2023-10-29T22:07:58.509Z",
        "updated_at": "2023-10-29T22:07:58.509Z"
    },
    {
        "id": 2,
        "name": "dagon army",
        "advantage": "heavy_tech",
        "user_id": 2,
        "fuel_amount": 1000,
        "bullets_amount": 600,
        "created_at": "2023-10-29T13:55:21.140Z",
        "updated_at": "2023-10-29T13:55:21.140Z"
    }
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


### ```GET /api/v1/armies/:id```: Get a single army by ID (and all of their tech and people).

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Army Id (required)                        |

 - response 200 OK:
  ```json
     {
    "id": 2,
    "name": "dagon army",
    "advantage": "heavy_tech",
    "user_id": 2,
    "fuel_amount": 1000,
    "bullets_amount": 600,
    "created_at": "2023-10-29T13:55:21.140Z",
    "updated_at": "2023-10-29T13:55:21.140Z",
    "tanks": [
        {
            "id": 2,
            "name": "Abrams",
            "strength": 300,
            "fuel_req": 400,
            "army_id": 2,
            "created_at": "2023-10-29T15:34:05.254Z",
            "updated_at": "2023-10-29T15:34:05.254Z"
        }
    ],
    "planes": [
        {
            "id": 1,
            "name": "F-ZXC",
            "air_strength": 400,
            "surface_strength": 50,
            "fuel_req": 400,
            "army_id": 2,
            "created_at": "2023-10-29T17:05:54.843Z",
            "updated_at": "2023-10-29T17:05:54.843Z"
        }
    ],
    "squads": [
        {
            "id": 1,
            "name": "suicideSquad",
            "weapons": [
                {
                    "name": "Snipers",
                    "strength": 200,
                    "bullets_req": 300
                },
                {
                    "name": "pistols",
                    "strength": 100,
                    "bullets_req": 150
                },
                {
                    "name": "silver edge",
                    "strength": 200,
                    "bullets_req": 300
                }
            ]
        }
    ]
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

### ```POST /api/v1/armies```: Create a new army (id will be created automatically and user_id will be **null** for now).

### Request Body

| Parameter        | Type     | Description                                      |
| ------------     | ------   | --------------------------------------           |
| `name`           | string   | Name of the army (required)                      |
| `advantage`      | string   | Advantage of an army (required)                  |
| `fuelAmmount`    | number   | Fuel ammount (required)                          |
| `bulletsAmmount` | number   | Bullets ammount (required)                       |

 - response 201 Created:
  ```json
{
    "id": 4,
    "name": "dagon ewrarmy",
    "advantage": "minefield",
    "user_id": null,
    "fuel_amount": 555,
    "bullets_amount": 555,
    "created_at": "2023-10-30T21:11:57.420Z",
    "updated_at": "2023-10-30T21:11:57.420Z"
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

### ```PATCH /api/v1/armies/:id/users/:userId```: Add army to user.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Army Id (required)                        |
| `armyId`     | string | User Id (required)                        |

 - response 200 OK:
```json
{
    "id": 2,
    "name": "dagon army",
    "advantage": "heavy_tech",
    "user_id": 2,
    "fuel_amount": 1000,
    "bullets_amount": 600,
    "created_at": "2023-10-29T13:55:21.140Z",
    "updated_at": "2023-10-29T13:55:21.140Z"
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




### ```PATCH /api/v1/armies/:id```: Partially update an army's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Army Id (required)                        |

### Request Body

| Parameter        | Type     | Description                                      |
| ------------     | ------   | --------------------------------------           |
| `name`           | string   | name of the army (optional)                      |
| `advantage`      | string   | advantage of the army(optional)                  |
| `fuelAmmount`    | number   | Fuel ammount (optional)                          |
| `bulletsAmmount` | number   | Bullets ammount (optional)                       |

 - response 200 OK:
  ```json
     {
    "id": 2,
    "name": "dagon army",
    "advantage": "heavy_tech",
    "user_id": 2,
    "fuel_amount": 1000,
    "bullets_amount": 600,
    "created_at": "2023-10-29T13:55:21.140Z",
    "updated_at": "2023-10-29T13:55:21.140Z"
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

### ```DELETE /api/v1/armies/:id```: Delete an army. (when deleting an army, all tanks, planes and squads from this army will have army_id set to NULL)
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


## Squads:

### ```GET /api/v1/squads```: Get a list of squads.
 - response 200 OK:
     ```json
    [
    {
        "id": 1,
        "name": "suicideSquad",
        "army_id": 2,
        "created_at": "2023-10-29T17:35:28.443Z",
        "updated_at": "2023-10-29T17:35:28.443Z"
    },
    {
        "id": 4,
        "name": "melee",
        "army_id": 3,
        "created_at": "2023-10-30T20:17:19.608Z",
        "updated_at": "2023-10-30T20:17:19.608Z"
    }
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

### ```GET /api/v1/squads/:id```: Get a single squad by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | squad Id (required)                       |

 - response 200 OK:
  ```json
     {
    "id": 1,
    "name": "suicideSquad",
    "army_id": 2,
    "created_at": "2023-10-29T17:35:28.443Z",
    "updated_at": "2023-10-29T17:35:28.443Z",
    "weapons": [
        {
            "name": "Snipers",
            "strength": 200,
            "bullets_req": 300
        },
        {
            "name": "pistols",
            "strength": 100,
            "bullets_req": 150
        },
        {
            "name": "silver edge",
            "strength": 200,
            "bullets_req": 300
        }
    ]
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

### ```POST /api/v1/squads```: Create a new squad.

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the squad (required)                     |
| `type`       | string   | Type of the squad (required)                     |

 - response 201 Created:
  ```json
    {
    "id": 4,
    "name": "melee",
    "army_id": null,
    "created_at": "2023-10-30T20:17:19.608Z",
    "updated_at": "2023-10-30T20:17:19.608Z"
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


### ```PATCH /api/v1/squads/:id```: Partially update a squad's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Squad Id (required)                       |

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the squad (optional)                     |
| `type`       | string   | Type of the squad (optional)                     |

 - response 200 OK:
  ```json
   {
    "id": 4,
    "name": "melee",
    "army_id": null,
    "created_at": "2023-10-30T20:17:19.608Z",
    "updated_at": "2023-10-30T20:17:19.608Z"
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


### ```DELETE /api/v1/squads/:id```: Delete a squad.

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

### ```PATCH /api/v1/squads/:id/armies/:armyId```: Add squad to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Squad Id (required)                       |
| `armyId`     | string | Army Id (required)                        |
 
 - response 200 OK:
  ```json
      {
    "id": 4,
    "name": "melee",
    "army_id": 3,
    "created_at": "2023-10-30T20:17:19.608Z",
    "updated_at": "2023-10-30T20:17:19.608Z"
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

### ```PATCH /api/v1/squads/:id/remove_army```: Add squad to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Squad Id (required)                       |
| `armyId`     | string | Army Id (required)                        |
 
 - response 200 OK:
  ```json
      {
    "id": 4,
    "name": "melee",
    "army_id": null,
    "created_at": "2023-10-30T20:17:19.608Z",
    "updated_at": "2023-10-30T20:17:19.608Z"
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


## Weapons:

### ```GET /api/v1/weapons```: Get a list of weapons.
 - response 200 OK:
     ```json
    [
    {
        "id": 2,
        "name": "Snipers",
        "strength": 200,
        "bullets_req": 300,
        "created_at": "2023-10-29T18:37:46.784Z",
        "updated_at": "2023-10-29T18:37:46.784Z"
    },
    {
        "id": 3,
        "name": "pistols",
        "strength": 100,
        "bullets_req": 150,
        "created_at": "2023-10-29T18:44:46.173Z",
        "updated_at": "2023-10-29T18:44:46.173Z"
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

### ```GET /api/v1/weapons/:id```: Get a single weapon by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | weapon Id (required)                      |

 - response 200 OK:
  ```json
     {
    "id": 2,
    "name": "Snipers",
    "strength": 200,
    "bullets_req": 300,
    "created_at": "2023-10-29T18:37:46.784Z",
    "updated_at": "2023-10-29T18:37:46.784Z"
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
"message": "weapon with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

### ```POST /api/v1/weapons```: Create a new weapon.

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the weapon (required)                    |
| `strength`   | number   | strength of the weapon (required)                |
| `bulletReq`  | number   | Bullets requirement of the weapon (required)     |

 - response 201 Created:
  ```json
     {
    "id": 2,
    "name": "Snipers",
    "strength": 200,
    "bullets_req": 300,
    "created_at": "2023-10-29T18:37:46.784Z",
    "updated_at": "2023-10-29T18:37:46.784Z"
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


### ```PATCH /api/v1/weapons/:id```: Partially update a weapon's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | weapon Id (required)                      |

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the weapon (optional)                    |
| `strength`   | number   | strength of the weapon (optional)                |
| `bulletReq`  | number   | Bullets requirement of the weapon (optional)     |

 - response 200 OK:
  ```json
      {
    "id": 2,
    "name": "Snipers",
    "strength": 200,
    "bullets_req": 300,
    "created_at": "2023-10-29T18:37:46.784Z",
    "updated_at": "2023-10-29T18:37:46.784Z"
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
"message": "weapon with that id not found"
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


### ```DELETE /api/v1/weapons/:id```: Delete a weapon.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | weapon Id (required)                      |

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
"message": "weapon with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

### ```PATCH /api/v1/weapons/:id/squads/:squadId```: Add weapons to squads

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Weapon Id (required)                      |
| `squadId`    | string | Squad's Id (required)                     |

 - response 200 OK:
  ```json
{
    "squad_id": 1,
    "weapon_id": 7
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
"message": "squad or weapon with that id not found"
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


## Tanks:

### ```GET /api/v1/tanks```: Get a list of tanks.

- response 200 OK:
     ```json
    [
    {
        "id": 2,
        "name": "Abrams",
        "strength": 300,
        "fuel_req": 400,
        "army_id": 2,
        "created_at": "2023-10-29T15:34:05.254Z",
        "updated_at": "2023-10-29T15:34:05.254Z"
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

### ```GET /api/v1/tanks/:id```: Get a single technology by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required)                        |

 - response 200 OK:
  ```json
     {
    "id": 2,
    "name": "Abrams",
    "strength": 300,
    "fuel_req": 400,
    "army_id": 2,
    "created_at": "2023-10-29T15:34:05.254Z",
    "updated_at": "2023-10-29T15:34:05.254Z"
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
"message": "tank with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


### ```POST /api/v1/tanks```: Create a new technology.

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the tech (required)                      |
| `strength`   | number   | Strength of the tech (required)                  |
| `fuelReq`    | number   | Fuel that army needs to use this tank (required) |
 
 - response 201 Created:
  ```json
      {
    "id": 2,
    "name": "Abrams",
    "strength": 300,
    "fuel_req": 400,
    "army_id": 2,
    "created_at": "2023-10-29T15:34:05.254Z",
    "updated_at": "2023-10-29T15:34:05.254Z"
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


### ```PATCH /api/v1/tanks/:id```: Partially update a technology's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required )                       |

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the tech (optional)                      |
| `strength`   | number   | Strength of the tech (optional)                  |
| `fuelReq`    | number   | Fuel that army needs to use this tank (optional) |

 - response 200 OK:
  ```json
     {
    "id": 2,
    "name": "Abrams",
    "strength": 300,
    "fuel_req": 400,
    "army_id": 2,
    "created_at": "2023-10-29T15:34:05.254Z",
    "updated_at": "2023-10-29T15:34:05.254Z"
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
"message": "tank with that id not found"
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

### ```DELETE /api/v1/tanks/:id```: Delete a technology.

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
"message": "tank with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

### ```PATCH /api/v1/tanks/:id/armies/:armyId```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Tank Id (required)                        |
| `armyId`     | string | Army Id (required)                        |
 
 - response 200 OK:
  ```json
    {
    "id": 5,
    "name": "123",
    "strength": 100,
    "fuel_req": 200,
    "army_id": 4,
    "created_at": "2023-10-30T21:12:12.263Z",
    "updated_at": "2023-10-30T21:12:12.263Z"
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
"message": "army or tank with that id not found"
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

### ```PATCH /api/v1/tanks/:id/remove_army```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Tank Id (required)                        |

 
 - response 200 OK:
  ```json
{
    "id": 2,
    "name": "Abrams",
    "strength": 300,
    "fuel_req": 400,
    "army_id": null,
    "created_at": "2023-10-29T15:34:05.254Z",
    "updated_at": "2023-10-29T15:34:05.254Z"
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
"message": "tank with that id not found"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```



## Planes:

### ```GET /api/v1/planes```: Get a list of planes.

- response 200 OK:
     ```json
    [
    {
        "id": 2,
        "name": "petuh",
        "air_strength": 10,
        "surface_strength": 90,
        "fuel_req": 100,
        "army_id": null,
        "created_at": "2023-10-29T20:10:16.413Z",
        "updated_at": "2023-10-29T20:10:16.413Z"
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

### ```GET /api/v1/planes/:id```: Get a single technology by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required)                        |

 - response 200 OK:
  ```json
  {
    "id": 1,
    "name": "F2",
    "air_strength": 400,
    "surface_strength": 50,
    "fuel_req": 400,
    "army_id": 2,
    "created_at": "2023-10-29T17:05:54.843Z",
    "updated_at": "2023-10-29T17:05:54.843Z"
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
"message": "plane with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```


### ```POST /api/v1/planes```: Create a new technology.

### Request Body

| Parameter            | Type     | Description                                      |
| ------------         | ------   | --------------------------------------           |
| `name`               | string   | Name of the tech (required)                      |
| `airfieldStrength`   | number   | Strength of the tech on air (required)           |
| `surfaceStrength`    | number   | Strength of the tech on surface (required)       |
| `fuelReq`            | number   | Fuel that army needs to use this plane(required) |
 
 - response 201 Created:
  ```json
     {
    "id": 1,
    "name": "F2",
    "air_strength": 400,
    "surface_strength": 50,
    "fuel_req": 400,
    "army_id": 2,
    "created_at": "2023-10-29T17:05:54.843Z",
    "updated_at": "2023-10-29T17:05:54.843Z"
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


### ```PATCH /api/v1/planes/:id```: Partially update a technology's information.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required)                        |

### Request Body

| Parameter            | Type     | Description                                      |
| ------------         | ------   | --------------------------------------           |
| `name`               | string   | Name of the tech (optional)                      |
| `airfieldStrength`   | number   | Strength of the tech on air (optional)           |
| `surfaceStrength`    | number   | Strength of the tech on surface (optional)       |
| `fuelReq`            | number   | Fuel that army needs to use this plane(optional) |

 - response 200 OK:
  ```json
        {
    "id": 1,
    "name": "F2",
    "air_strength": 400,
    "surface_strength": 50,
    "fuel_req": 400,
    "army_id": 2,
    "created_at": "2023-10-29T17:05:54.843Z",
    "updated_at": "2023-10-29T17:05:54.843Z"
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
"message": "plane with that id not found"
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

### ```DELETE /api/v1/planes/:id```: Delete a technology.

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
"message": "plane with that id not found"
}
```
- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```
### ```PATCH /api/v1/planes/:id/armies/:armyId```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | plane Id (required)                       |
| `armyId`     | string | Army Id (required)                        |
 
 - response 200 OK:
  ```json
 {
    "id": 3,
    "name": "gyrocopter",
    "air_strength": 399,
    "surface_strength": 80,
    "fuel_req": 400,
    "army_id": 3,
    "created_at": "2023-10-30T20:16:30.763Z",
    "updated_at": "2023-10-30T20:16:30.763Z"
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
"message": "army or plane with that id not found"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

### ```PATCH /api/v1/planes/:id/remove_army```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | plane Id (required)                       |
 
 - response 200 OK:
  ```json
 {
    "id": 3,
    "name": "gyrocopter",
    "air_strength": 399,
    "surface_strength": 80,
    "fuel_req": 400,
    "army_id": null,
    "created_at": "2023-10-30T20:16:30.763Z",
    "updated_at": "2023-10-30T20:16:30.763Z"
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
"message": "plane with that id not found"
}
```

- response 500 Internal Server Error:
```json
{
"message": "Internal Server Error"
}
```

For more details on how to use these endpoints, refer to the API documentation provided in the project.


### DiagramDB
(use dbdiagram.io):
```
/ Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  name varchar
  type enum
  email varchar
  created_at timestamp
  updated_at timestamp
}


Table armies {
  id integer [primary key]
  name varchar
  advantage enum
  user_id integer
  fuelAmmount integer
  bulletsAmmount integer
  created_at timestamp
  updated_at timestamp
}

Table tanks {
   id integer [primary key]
   name varchar
   strength integer
   fuelReq integer
   army_id integer
   created_at timestamp
   updated_at timestamp
}

Table planes {
  id integer [primary key]
   name varchar
   airFieldStrength integer
   surfaceStrength integer
   fuelReq integer
   army_id integer
   created_at timestamp
   updated_at timestamp
}

Table squads {
   id integer [primary key]
   name varchar
   army_id integer
   created_at timestamp
   updated_at timestamp
}

Table weapons {
  id integer [primary key]
  name varchar
  strength integer
  bulletsReq integer
  created_at timestamp
  updated_at timestamp
}

Table squadsWeapons {
  id integer
  squadId integer
  weaponId integer
  created_at timestamp
  updated_at timestamp
}

Ref: tanks.army_id > armies.id
Ref: planes.army_id > armies.id
Ref: squads.army_id > armies.id
Ref: weapons.id < squadsWeapons.weaponId
Ref: squads.id < squadsWeapons.squadId
Ref: users.id - armies.user_id 
```
