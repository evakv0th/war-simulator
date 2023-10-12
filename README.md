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
  - [Weapons](#weapons)
  - [Tanks](#tanks)
  - [Planes](#planes)
- [Diagram for Database](#diagramDB)

## Features

- Create and manage armies with different strengths and advantages.
- Each user have an army, army can have military units, ammount of fuel and ammount of bullets.
- Each army can have single advantage: air, heavyTech, patriotic and minefield.
- Organize squads within armies, squads can have 2 types: sabotage and combat.
- Squads can have multiple weapons, squad without weapons cannot participate in battle.
- Add planes and tanks to your armies. Both have fuel requirements, so you cant spam heavy tech.
- Weapons have requirements for bullets.
- Engage in battles between armies with various advantages and strengths.

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
```GET /api/v1/users```: 
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


```GET /api/v1/armies```: Get a list of armies. (and all of their tech and people)
 - response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": 1,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500,
        "tanks": ["tank1", "tank2"],
        "planes": ["plane1", "plane2"],
        "squads": ["squad1", "squad2"]
      },
     {
        "id": 2,
        "name": "blackArmy",
        "advantage": "air",
        "userId": 2,
        "fuelAmmount": 1300,
        "bulletsAmmount": 100,
        "tanks": ["tank1", "tank2"],
        "planes": ["plane1", "plane2"],
        "squads": ["squad1", "squad2"]
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


```GET /api/v1/armies/:id```: Get a single army by ID (and all of their tech and people).

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Army Id (required)                        |

 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": 1,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500,
        "tanks": ["tank1", "tank2"],
        "planes": ["plane1", "plane2"],
        "squads": ["squad1", "squad2"]
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

```POST /api/v1/armies```: Create a new army (id will be created automatically and user_id will be **null** for now).

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
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": null,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500
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
"message": "Invalid data. In body you should attach id of your army and id of enemy army."
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

| Parameter        | Type     | Description                                      |
| ------------     | ------   | --------------------------------------           |
| `name`           | string   | name of the army (optional)                      |
| `advantage`      | string   | advantage of the army(optional)                  |
| `fuelAmmount`    | number   | Fuel ammount (optional)                          |
| `bulletsAmmount` | number   | Bullets ammount (optional)                       |

 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": 1,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500
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

```PATCH /api/v1/armies/:id/squads/:squadId```: Add squad to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `armyId`     | string | Army Id (required)                        |
| `squadId`    | string | Squad Id (required)                       |
 
 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": null,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500,
        "squads": ["newSquad"]
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

```PATCH /api/v1/armies/:id/tanks/:tankId```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `armyId`     | string | Army Id (required)                        |
| `tankId`     | string | Tank Id (required)                        |
 
 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": null,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500,
        "tanks": ["newTanks"]
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

```PATCH /api/v1/armies/:id/planes/:planeId```: Add tech to Army.
### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `armyId`     | string | Army Id (required)                        |
| `planeId`    | string | plane Id (required)                       |
 
 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "blueArmy",
        "advantage": "patriotic",
        "userId": null,
        "fuelAmmount": 1000,
        "bulletsAmmount": 500,
        "planes": ["newPlane"]
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

```GET /api/v1/squads```: Get a list of squads.
 - response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "squadDelta",
        "type": "sabotage",
        "armyId": 1,
        "weapons": ["weapon1"]
      },
      {
        "id": 2,
        "name": "squadBeta",
        "type": "combat",
        "armyId": 2,
        "weapons": ["weapon1", "weapon2"]
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
        "type": "sabotage",
        "armyId": 1,
        "weapons": ["weapon1"]
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
| `type`       | string   | Type of the squad (required)                     |

 - response 201 Created:
  ```json
      {
        "id": 1,
        "name": "squadDelta",
        "type": "sabotage",
        "armyId": null,
        "weapons": []
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
| `type`       | string   | Type of the squad (optional)                     |

 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "newNameSquad",
        "type": "sabotage",
        "armyId": 1,
        "weapons": ["weapon1"]
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

```PATCH /api/v1/squads/:id/weapons/:weaponsId```: Add weapons to squads

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | Squad Id (required)                       |
| `weaponsId`  | string | Weapon's Id (required)                    |

 - response 200 OK:
  ```json
      {
        "id": 1,
        "name": "newNameSquad",
        "type": "sabotage",
        "armyId": 1,
        "weapons": ["newWeapon"]
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

## Weapons:

```GET /api/v1/weapons```: Get a list of weapons.
 - response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "Ak-47",
        "strength": 200,
        "bulletReq": 100
      },
       {
        "id": 2,
        "name": "Sniper Rifles",
        "strength": 300,
        "bulletReq": 150
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

```GET /api/v1/weapons/:id```: Get a single weapon by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | weapon Id (required)                      |

 - response 200 OK:
  ```json
      {
        "id": 2,
        "name": "Sniper Rifles",
        "strength": 300,
        "bulletReq": 150
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

```POST /api/v1/weapons```: Create a new weapon.

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
        "name": "Sniper Rifles",
        "strength": 300,
        "bulletReq": 150
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


```PATCH /api/v1/weapons/:id```: Partially update a weapon's information.

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
        "name": "Sniper Rifles",
        "strength": 300,
        "bulletReq": 150
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


```DELETE /api/v1/weapons/:id```: Delete a weapon.

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


## Tanks:

```GET /api/v1/tanks```: Get a list of tanks.

- response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "tank1",
        "strength": 600,
        "fuelReq": 200,
        "armyId": 1
      },
        {
        "id": 2,
        "name": "tank2",
        "strength": 340,
        "fuelReq": 100,
        "armyId": 2
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

```GET /api/v1/tanks/:id```: Get a single technology by ID.

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
        "fuelReq": 200,
        "armyId": 1
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


```POST /api/v1/tanks```: Create a new technology.

### Request Body

| Parameter    | Type     | Description                                      |
| ------------ | ------   | --------------------------------------           |
| `name`       | string   | Name of the tech (required)                      |
| `strength`   | number   | Strength of the tech (required)                  |
| `fuelReq`    | number   | Fuel that army needs to use this tank (required) |
 
 - response 201 Created:
  ```json
      {
        "id": 1,
        "name": "tank1",
        "strength": 600,
        "fuelReq": 200,
        "armyId": null
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


```PATCH /api/v1/tanks/:id```: Partially update a technology's information.

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
        "id": 1,
        "name": "updatedTank",
        "strength": 600,
        "fuelReq": 250,
        "armyId": 1
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

```DELETE /api/v1/tanks/:id```: Delete a technology.

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

## Planes:

```GET /api/v1/planes```: Get a list of planes.

- response 200 OK:
     ```json
    [
      {
        "id": 1,
        "name": "plane1",
        "airfieldStrength": 600,
        "surfaceStrength": 100,
        "fuelReq": 200,
        "armyId": 1
      },
       {
        "id": 2,
        "name": "plane2",
        "airfieldStrength": 200,
        "surfaceStrength": 100,
        "fuelReq": 170,
        "armyId": 1
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

```GET /api/v1/planes/:id```: Get a single technology by ID.

### Query Parameters

| Parameter    | Type   | Description                               |
| ------------ | ------ | -------------                             |
| `id`         | string | tech Id (required)                        |

 - response 200 OK:
  ```json
     {
        "id": 1,
        "name": "plane1",
        "airfieldStrength": 600,
        "surfaceStrength": 100,
        "fuelReq": 200,
         "armyId": 1
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


```POST /api/v1/planes```: Create a new technology.

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
        "name": "plane1",
        "airfieldStrength": 600,
        "surfaceStrength": 100,
        "fuelReq": 200,
         "armyId": null
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


```PATCH /api/v1/planes/:id```: Partially update a technology's information.

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
        "name": "plane1",
        "airfieldStrength": 600,
        "surfaceStrength": 100,
        "fuelReq": 200,
        "armyId": 1
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

```DELETE /api/v1/planes/:id```: Delete a technology.

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

For more details on how to use these endpoints, refer to the API documentation provided in the project.


### DiagramDB
(use dbdiagram.io):
```
// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  name varchar
  type enum
  email varchar
}


Table armies {
  id integer [primary key]
  name varchar
  advantage enum
  user_id integer
  fuelAmmount integer
  bulletsAmmount integer
}

Table tanks {
   id integer [primary key]
   name varchar
   strength integer
   fuelReq integer
   army_id integer
}

Table planes {
  id integer [primary key]
   name varchar
   airFieldStrength integer
   surfaceStrength integer
   fuelReq integer
   army_id integer
}

Table squads {
   id integer [primary key]
   name varchar
   type enum
   army_id integer
}

Table weapons {
  id integer [primary key]
  name varchar
  strength integer
  bulletsReq integer
}

Table squadsWeapons {
  id integer
  squadId integer
  weaponId integer
}

Ref: tanks.army_id > armies.id
Ref: planes.army_id > armies.id
Ref: squads.army_id > armies.id
Ref: weapons.id < squadsWeapons.weaponId
Ref: squads.id < squadsWeapons.squadId
Ref: users.id - armies.user_id 
```
