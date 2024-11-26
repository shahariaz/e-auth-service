# Docker Commands

## Docker Build

```sh
docker run --rm -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules --env-file ${PWD}/.env.development -p 5501:5501 -e NODE_ENV=development auth-service:dev
```

## Run PostgreSQL with Docker

### Step 1: Pull PostgreSQL Image

```sh
docker pull postgres
```

### Step 2: Create Persistent Volumes

Creating persistent volumes ensures that the data remains intact even if the container stops or crashes.

```sh
docker volume create authpgdata
```

#### Check Docker Volumes

```sh
docker volume ls
```

### Step 3: Run PostgreSQL Container

```sh
docker run --rm --name authpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v authpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres
```
