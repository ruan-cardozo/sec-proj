# Como rodar o projeto ? 

Pré requisito de ferramentas:

- Docker

Você pode instalar o docker na sua máquina seguindo a documentação:

- https://github.com/codeedu/wsl2-docker-quickstart

Para executar o projeto basta iniciar os containers:

## Antes de iniciar os containers:

1. Você precisa ter o docker instalado.
2. Rodar o seguinte comando docker para criar um network, isso serve para os containers se comunicarem entre eles:
```bash
docker network create cyber-sec
```

## Para o banco de dados

1. Buildar e subir o container do banco de dados com o seguinte comando:
```bash
docker compose -f docker-compose-database.yml up --build
```

2. Quando tiver com o container executar o docker comando:
```bash
docker exec -i cyber-sec-database psql -U node -d cyber-sec-database -c "CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);"
```

## Para o backend

1. Buildar e subir o container do backend com o seguinte comando:

```bash
docker compose -f docker-compose-backend.yml up --build
```

## Para o frontend

1. Buildar e subir o container do backend com o seguinte comando:

```bash
docker compose -f docker-compose-frontend.yml up --build
```

# Após fazer todos esses passos a aplicação deve estar disponível nos seguintes link:

1. Frontend: localhost:5173
2. Backend: localhost:3000
