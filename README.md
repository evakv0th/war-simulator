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
  - [Battles](#battles)

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

User Endpoints:

## Users:
```GET /api/v1/users```: Get a list of users. (id, name:string, type: normal | admin, email: string, nation: army)
  - response 200:
  ```[{ id: 2, name: "Michael Scott", type: "admin", email: "dunder@gmail.com", nation: blueArmy}, ...]```

```GET /api/v1/users/:id```: Get a single user by ID.

```POST /api/v1/users```: Create a new user.

```PUT /api/v1/users/:id```: Update a user's information.

```PATCH /api/v1/users/:id```: Partially update a user's information.

```DELETE /api/v1/users/:id```: Delete a user.

## Armies:

```GET /api/v1/armies```: Get a list of armies. (id, name:string, troops: [squads...], tech: [tech...], advantage: air | heavyTech | minefield | patriotic)

```GET /api/v1/armies/:id```: Get a single army by ID.

```POST /api/v1/armies```: Create a new army.

```POST /api/v1/armies/battles/:armyId``` : Assign a battle with another army

```PUT /api/v1/armies/:id```: Update an army's information.

```PATCH /api/v1/armies/:id```: Partially update an army's information.

```DELETE /api/v1/armies/:id```: Delete an army.

### Advantages in army:

-**air** - each aircraft will have 1.5x strength

-**heavyTech** - each tank will have 1.5x strength

-**minefield** - at the start of the battle each enemy unit (except for planes) will have strength reduction. (tanks will have 0.7x strength, troops 0.9x strength)

-**patriotic** - more men - more strength. Each squad will multiply strength of all squads by 0,05 (max bonus - 2x strength)

## Squads:

```GET /api/v1/squads```: Get a list of squads. (id, name:string, strength:number, nation: army)

```GET /api/v1/squads/:id```: Get a single squad by ID.

```POST /api/v1/squads```: Create a new squad.

```PUT /api/v1/squads/:id```: Update a squad's information.

```PATCH /api/v1/squads/:id```: Partially update a squad's information.

```DELETE /api/v1/squads/:id```: Delete a squad.

## Tech:

```GET /api/v1/tech```: Get a list of technologies. (id, name:string, strength:number, nation: army, type: plane |  tank)

```GET /api/v1/tech/:id```: Get a single technology by ID.

```POST /api/v1/tech```: Create a new technology.

```PUT /api/v1/tech/:id```: Update a technology's information.

```PATCH /api/v1/tech/:id```: Partially update a technology's information.

```DELETE /api/v1/tech/:id```: Delete a technology.


For more details on how to use these endpoints, refer to the API documentation provided in the project.
