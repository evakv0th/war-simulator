# war-simulator
Battle of armies! Army can have troops, tech and
advantages:
-air - each aircraft will have 1.5x strength
-heavyTech - each tank will have 1.5x strength
-minefield - at the start of the battle each enemy unit (except for planes) will have strength reduction. (tanks will have 0.7x strength, troops 0.9x strength)
-patriotic - more men - more strength. Each squad will multiply strength of all squads by 0,05 (max bonus - 2x strength)

GET user (id, name:string, type: normal | admin, email: string)
GET single user
POST user
PUT user
PATCH user
DELETE user
 
GET army (id, name:string, nation: army, type: normalUser | admin)
POST army
PUT army
PATCH army
DELETE army
 
squad (id, name:string, strength:number, nation: army)
GET squad
GET single squad
POST squad
PUT squad
PATCH squad
DELETE squad

tech (id, name:string, strength:number, nation: army, type: plane |  tank)
GET tech
GET single tech
POST tech
PUT tech
PATCH tech
DELETE tech

battle(id, sideOne[army...], sideTwo:[army...])
POST battle
