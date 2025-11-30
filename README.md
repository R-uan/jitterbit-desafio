# Jitterbit Order Management API

A RESTful API built with Node.js, Express, TypeScript, and PostgreSQL for managing orders and user authentication.

## Features

- 🔐 JWT-based authentication
- 📦 Order management with items
- 🗄️ PostgreSQL database with Prisma ORM
- 📝 API documentation with Swagger
- 🐳 Fully Dockerized setup
- 🔒 Password hashing with bcrypt

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI
- **Containerization:** Docker & Docker Compose

## Project Structure

```
jitterbit/
├── src/
│   ├── controllers/      # Request handlers
│   ├── repositories/     # Database operations
│   ├── routes/           # API routes
│   ├── common/           # Helper, config files
│   ├── middlewares/      # Authentication, etc.
│   ├── entities/         # TypeORM entities (if applicable)
│   ├── database/         # Database configuration
│   └── main.ts           # Application entry point
│
├── prisma/
│   └── schema.prisma     # Database schema
├── flake.nix             # Nix developer shell
├── docker-compose.yml    # Docker services configuration
├── Dockerfile            # Container build instructions
└── package.json          # Dependencies and scripts
```

## Getting Started

### Using Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/R-uan/jitterbit-desafio.git
   cd jitterbit
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the API:**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Create new user account | ❌ |
| POST | `/auth/signin` | Sign in and get JWT token | ❌ |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/order` | Create a new order | ✅ |
| GET | `/order/list` | Get all orders | ✅ |
| GET | `/order/:orderId` | Get order by ID | ✅ |
| PATCH | `/order/:orderId` | Update order | ✅ |
| DELETE | `/order/:orderId` | Delete order | ✅ |

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Authentication Flow

1. **Sign Up:**
   ```bash
   curl -X POST http://localhost:3000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword",
       "firstName": "John",
       "lastName": "Doe"
     }'
   ```

2. **Sign In:**
   ```bash
   curl -X POST http://localhost:3000/auth/signin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword"
     }'
   ```

3. **Use Token:**
   ```bash
   curl -X GET http://localhost:3000/order/list \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### Creating an Order

```bash
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 1000,
    "dataCriacao": "2025-01-15T10:30:00Z",
    "items": [
      {
        "idItem": "1",
        "valorItem": 500,
        "quantidadeItem": 2
      }
    ]
  }'
```

## Database Schema

### User
- `userId` (PK, auto-increment)
- `email` (unique)
- `passwordHash`
- `firstName`
- `lastName`

### Order
- `orderId` (PK, string)
- `userId` (FK → User)
- `value`
- `creationDate`

### Item
- `productId` (PK, composite)
- `orderId` (PK, composite, FK → Order)
- `quantity`
- `price`

## Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# Access database
docker-compose exec pgdb psql -U postgres -d order_db
```

# Checklist
- [x] Criar um novo pedido.
  - Method: POST
  - Endpoint: `/order`
- [x] Listar todos os pedidos.
  - Method: GET
  - Endpoint: `/order/list`
- [x] Obter os dados do pedido passando por parâmetro na URL o número do pedido.
  - Method: GET
  - Endpoint: `/order/{orderId}`
- [x] Atualizar o pedido passando por parâmetro na url o número do pedido que será atualizado.
  - Method: PATCH
  - Endpoint: `/order/{orderId}`
- [x] Delete o pedido passando por parâmetro na url o número do pedido que será deletado.
  - Method: DELETE
  - Endpoint: `/order/{orderId}`

#### Notes
Por que tudo escrito em inglês?
- Os materiais de aprendizado que eu consumo são 95% na língua inglesa, então meu raciocínio também segue esse padrão.
- Esteticamente melhor por não ter acentos gramaticais.
