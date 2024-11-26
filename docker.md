# Docker Commend

Docker Build
docker run --rm -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules --env-file ${PWD}/.env.development -p 5501:5501 -e NODE_ENV=development auth-service:dev

## Run PgSQL with Docker

step 1: docker pull postgres

### Creating Presistent volumes for ensure that the data remains intect even if the container stops or crashes.

step 2: docker volume create authpgdata

#### for cheack Docker volume

-> docker volume ls

step 3: docker run --rm --name authpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v authpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres
