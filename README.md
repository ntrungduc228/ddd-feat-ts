# Express TypeScript Clean Architecture REST API

A production-ready REST API built with Express, TypeScript, and Clean Architecture principles.

## Features

- ✅ Clean Architecture by feature (Domain → Application → Infrastructure → Presentation)
- ✅ TypeScript with strict mode
- ✅ Express.js REST API
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Docker Compose for local development
- ✅ Input validation with Zod
- ✅ Comprehensive error handling
- ✅ Security headers with Helmet
- ✅ CORS enabled
- ✅ Structured logging

## Project Structure

```
src/
├── modules/
│   ├── user/
│   │   ├── domain/           # Entities & Repository Interfaces
│   │   ├── application/      # Use Cases (Business Logic)
│   │   ├── infrastructure/   # Repository Implementation & DB Schema
│   │   └── presentation/     # Controllers, Routes, DTOs
│   └── post/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
└── shared/
    ├── domain/               # Base entities
    ├── infrastructure/       # Database client, Error handlers
    └── utils/                # Logger, Validators
```

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start development server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

## API Endpoints

### Health Check

```bash
GET /health
```

### User Endpoints

```bash
# Create user
POST /api/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com"
}

# Get all users
GET /api/users

# Get user by ID
GET /api/users/:id

# Update user
PATCH /api/users/:id
Content-Type: application/json
{
  "name": "John Updated"
}

# Delete user
DELETE /api/users/:id
```

### Post Endpoints

```bash
# Create post
POST /api/posts
Content-Type: application/json
{
  "title": "My First Post",
  "content": "This is the content of my post"
}

# Get all posts
GET /api/posts

# Get post by ID
GET /api/posts/:id

# Update post
PATCH /api/posts/:id
Content-Type: application/json
{
  "title": "Updated Title"
}

# Delete post
DELETE /api/posts/:id
```

## Example Usage

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello World", "content": "This is my first post"}'

# Get all users
curl http://localhost:3000/api/users
```

## Database Commands

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema to database (dev only)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/cleanapi
```

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Custom structured logger

## Architecture

The project follows Clean Architecture principles:

1. **Domain Layer**: Business entities and repository interfaces
2. **Application Layer**: Use cases containing business logic
3. **Infrastructure Layer**: External concerns (database, APIs)
4. **Presentation Layer**: HTTP controllers and routes

Dependency Rule: Inner layers don't depend on outer layers.

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "details": []
}
```

## Validation

Input validation using Zod schemas:

- User: name (1-100 chars), email (valid format, unique)
- Post: title (1-200 chars), content (1-5000 chars)

## Contributing

1. Follow Clean Architecture principles
2. Keep files under 500 lines
3. Follow YAGNI, KISS, DRY principles
4. Write tests for new features
5. Run linting before commit

## License

MIT
