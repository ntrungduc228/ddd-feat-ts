# Express TypeScript Clean Architecture REST API Implementation Plan

**Date**: 2025-10-23
**Type**: Feature Implementation
**Status**: Planning
**Context Tokens**: Express + TypeScript REST API with Clean Architecture by feature, using drizzle-orm + PostgreSQL, Docker Compose. Two features: User and Post with CRUD operations. File size limit: <500 lines.

## Executive Summary
Build production-ready Express TypeScript REST API implementing Clean Architecture with feature-based modular design. Each feature (User, Post) has CRUD endpoints organized in domain/application/infrastructure/presentation layers. Uses drizzle-orm for PostgreSQL, Docker Compose for database, with comprehensive testing and security.

## Context Links
- **Related Plans**: None (initial implementation)
- **Dependencies**: PostgreSQL database via Docker, drizzle-orm, Express.js
- **Reference Docs**: Will create `./docs/codebase-summary.md`, `./docs/system-architecture.md`, `./docs/code-standards.md`

## Requirements

### Functional Requirements
- [x] Express TypeScript REST API server
- [x] User CRUD endpoints (id: int, name: string required, email: string required)
- [x] Post CRUD endpoints (id: int, title: string required, content: string required)
- [x] PostgreSQL database with drizzle-orm
- [x] Docker Compose with db service
- [x] Clean Architecture by feature (domain/application/infrastructure/presentation)
- [x] Single-file CRUD implementations per layer (user.usecase.ts, user.repository.ts)

### Non-Functional Requirements
- [x] Files under 500 lines each
- [x] YAGNI, KISS, DRY principles
- [x] Input validation and error handling
- [x] Environment variable configuration
- [x] Database connection pooling
- [x] Proper HTTP status codes
- [x] TypeScript strict mode
- [x] Request/response logging
- [x] CORS configuration

## Architecture Overview

```
Clean Architecture Layers:
┌─────────────────────────────────────────┐
│  Presentation (Routes/Controllers)      │ ← HTTP/API layer
├─────────────────────────────────────────┤
│  Application (Use Cases)                │ ← Business logic orchestration
├─────────────────────────────────────────┤
│  Domain (Entities/Interfaces)           │ ← Business rules & models
├─────────────────────────────────────────┤
│  Infrastructure (DB/External Services)  │ ← External dependencies
└─────────────────────────────────────────┘

Dependency Rule: Inner layers know nothing about outer layers
```

### Project Structure
```
ddd-feat-ts/
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── domain/
│   │   │   │   ├── user.entity.ts           (~50 lines)
│   │   │   │   └── user.repository.interface.ts (~30 lines)
│   │   │   ├── application/
│   │   │   │   └── user.usecase.ts          (~200 lines - all CRUD)
│   │   │   ├── infrastructure/
│   │   │   │   ├── user.repository.ts       (~250 lines - drizzle impl)
│   │   │   │   └── user.schema.ts           (~40 lines - drizzle schema)
│   │   │   └── presentation/
│   │   │       ├── user.routes.ts           (~80 lines)
│   │   │       ├── user.controller.ts       (~200 lines)
│   │   │       └── user.dto.ts              (~60 lines)
│   │   └── post/
│   │       ├── domain/
│   │       │   ├── post.entity.ts           (~50 lines)
│   │       │   └── post.repository.interface.ts (~30 lines)
│   │       ├── application/
│   │       │   └── post.usecase.ts          (~200 lines)
│   │       ├── infrastructure/
│   │       │   ├── post.repository.ts       (~250 lines)
│   │       │   └── post.schema.ts           (~40 lines)
│   │       └── presentation/
│   │           ├── post.routes.ts           (~80 lines)
│   │           ├── post.controller.ts       (~200 lines)
│   │           └── post.dto.ts              (~60 lines)
│   ├── shared/
│   │   ├── domain/
│   │   │   └── base-entity.ts               (~30 lines)
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   ├── db.config.ts             (~80 lines)
│   │   │   │   ├── db.client.ts             (~60 lines)
│   │   │   │   └── migrations/              (drizzle migrations)
│   │   │   └── http/
│   │   │       ├── error-handler.ts         (~120 lines)
│   │   │       └── response.helper.ts       (~80 lines)
│   │   └── utils/
│   │       ├── logger.ts                    (~100 lines)
│   │       └── validator.ts                 (~80 lines)
│   └── index.ts                             (~150 lines - app setup)
├── docker-compose.yml                       (~40 lines)
├── drizzle.config.ts                        (~30 lines)
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

### Key Components

**User Module**:
- `UserEntity`: Domain model with business rules
- `IUserRepository`: Repository interface (dependency inversion)
- `UserUseCase`: All CRUD business logic (create, findAll, findById, update, delete)
- `UserRepository`: Drizzle-orm implementation
- `UserController`: HTTP request/response handling
- `UserRoutes`: Express route definitions

**Post Module**: Same structure as User

**Shared Components**:
- `DatabaseClient`: Drizzle connection pool & configuration
- `ErrorHandler`: Centralized error handling middleware
- `Logger`: Structured logging (Winston/Pino)
- `Validator`: Request validation utilities

### Data Models

**User Entity**:
```typescript
{
  id: number (auto-increment primary key)
  name: string (required, 1-100 chars)
  email: string (required, unique, email format)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Post Entity**:
```typescript
{
  id: number (auto-increment primary key)
  title: string (required, 1-200 chars)
  content: string (required, 1-5000 chars)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Implementation Phases

### Phase 1: Project Setup & Infrastructure (Est: 0.5 days)

**Scope**: Initialize project, configure TypeScript, Docker, dependencies

**Tasks**:
1. [x] Initialize npm project - file: `package.json`
   - Dependencies: express, drizzle-orm, pg, zod, dotenv, cors, helmet
   - DevDependencies: typescript, @types/*, tsx, drizzle-kit, prettier, eslint
   - Scripts: dev, build, start, db:generate, db:migrate, db:push, db:studio

2. [x] Configure TypeScript - file: `tsconfig.json`
   - strict: true, esModuleInterop: true, skipLibCheck: true
   - outDir: dist, rootDir: src
   - target: ES2022, module: NodeNext

3. [x] Setup Docker Compose - file: `docker-compose.yml`
   - PostgreSQL 16 service
   - Ports: 5432:5432
   - Environment: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
   - Volume: postgres-data
   - Healthcheck configuration

4. [x] Create environment config - files: `.env.example`, `.gitignore`
   - DATABASE_URL, PORT, NODE_ENV
   - Add .env, node_modules, dist to .gitignore

5. [x] Setup Drizzle config - file: `drizzle.config.ts`
   - Schema path, out directory, driver: pg
   - Connection string from env

**Acceptance Criteria**:
- [x] `npm install` completes without errors
- [x] TypeScript compiles successfully
- [x] Docker Compose starts PostgreSQL
- [x] Can connect to database

### Phase 2: Shared Infrastructure (Est: 0.5 days)

**Scope**: Database client, error handling, utilities

**Tasks**:
1. [x] Database client - file: `src/shared/infrastructure/database/db.client.ts`
   - Create drizzle client with connection pool
   - Export db instance
   - Connection error handling

2. [x] Database config - file: `src/shared/infrastructure/database/db.config.ts`
   - Parse DATABASE_URL
   - Pool size configuration
   - SSL configuration for production

3. [x] Base entity - file: `src/shared/domain/base-entity.ts`
   - Common fields: id, createdAt, updatedAt
   - Base interface/type

4. [x] Error handler middleware - file: `src/shared/infrastructure/http/error-handler.ts`
   - Custom error classes: ValidationError, NotFoundError, DatabaseError
   - Global error handler middleware
   - Proper HTTP status mapping

5. [x] Response helper - file: `src/shared/infrastructure/http/response.helper.ts`
   - Standard response format: { success, data, error, message }
   - Success/error response builders

6. [x] Logger utility - file: `src/shared/utils/logger.ts`
   - Console logger with levels
   - Request/response logging
   - Error logging

7. [x] Validator utility - file: `src/shared/utils/validator.ts`
   - Zod schema validators
   - Email validation
   - String length validation

**Acceptance Criteria**:
- [x] Database connection establishes successfully
- [x] Error handler catches and formats errors
- [x] Logger outputs structured logs
- [x] Validators reject invalid input

### Phase 3: User Module Implementation (Est: 1 day)

**Scope**: Complete User CRUD with all layers

**Tasks**:

1. [x] User domain entity - file: `src/modules/user/domain/user.entity.ts`
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements User {
  // Validation methods
  // Business rule: email must be unique
  // Business rule: name 1-100 chars
}
```

2. [x] User repository interface - file: `src/modules/user/domain/user.repository.interface.ts`
```typescript
export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, user: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
```

3. [x] User database schema - file: `src/modules/user/infrastructure/user.schema.ts`
```typescript
// Drizzle schema definition
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
```

4. [x] User repository implementation - file: `src/modules/user/infrastructure/user.repository.ts`
```typescript
export class UserRepository implements IUserRepository {
  constructor(private db: NodePgDatabase) {}

  async create(userData) {
    // INSERT with drizzle
    // Handle unique constraint errors
  }

  async findAll() {
    // SELECT * with drizzle
  }

  async findById(id) {
    // SELECT WHERE id
  }

  async findByEmail(email) {
    // SELECT WHERE email
  }

  async update(id, userData) {
    // UPDATE WHERE id
    // Update updatedAt timestamp
  }

  async delete(id) {
    // DELETE WHERE id
  }
}
```

5. [x] User use cases - file: `src/modules/user/application/user.usecase.ts`
```typescript
export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async createUser(data) {
    // Validate input
    // Check email uniqueness
    // Call repository.create
    // Return created user
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateUser(id, data) {
    // Validate input
    // Check user exists
    // Check email uniqueness if changing
    // Call repository.update
  }

  async deleteUser(id) {
    const result = await this.userRepository.delete(id);
    if (!result) throw new NotFoundError('User not found');
    return result;
  }
}
```

6. [x] User DTOs - file: `src/modules/user/presentation/user.dto.ts`
```typescript
// Zod schemas for request validation
export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255)
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional()
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
```

7. [x] User controller - file: `src/modules/user/presentation/user.controller.ts`
```typescript
export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  create = async (req, res, next) => {
    try {
      const validData = createUserSchema.parse(req.body);
      const user = await this.userUseCase.createUser(validData);
      res.status(201).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  getAll = async (req, res, next) => {
    // GET all users
  }

  getById = async (req, res, next) => {
    // GET user by id from params
  }

  update = async (req, res, next) => {
    // PATCH user by id
  }

  delete = async (req, res, next) => {
    // DELETE user by id
  }
}
```

8. [x] User routes - file: `src/modules/user/presentation/user.routes.ts`
```typescript
const router = express.Router();
const userRepository = new UserRepository(db);
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);

router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);
router.patch('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export default router;
```

**Acceptance Criteria**:
- [x] POST /users creates user with validation
- [x] GET /users returns all users
- [x] GET /users/:id returns single user or 404
- [x] PATCH /users/:id updates user with validation
- [x] DELETE /users/:id deletes user or 404
- [x] Duplicate email returns 400
- [x] Invalid data returns 400 with error details

### Phase 4: Post Module Implementation (Est: 0.5 days)

**Scope**: Complete Post CRUD with all layers (mirror User structure)

**Tasks**:

1. [x] Post domain entity - file: `src/modules/post/domain/post.entity.ts`
```typescript
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

2. [x] Post repository interface - file: `src/modules/post/domain/post.repository.interface.ts`
```typescript
export interface IPostRepository {
  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  findAll(): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  update(id: number, post: Partial<Post>): Promise<Post | null>;
  delete(id: number): Promise<boolean>;
}
```

3. [x] Post database schema - file: `src/modules/post/infrastructure/post.schema.ts`
```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
```

4. [x] Post repository - file: `src/modules/post/infrastructure/post.repository.ts`
   - Implement all CRUD methods with drizzle
   - Handle errors appropriately

5. [x] Post use cases - file: `src/modules/post/application/post.usecase.ts`
   - createPost, getAllPosts, getPostById, updatePost, deletePost
   - Input validation, error handling

6. [x] Post DTOs - file: `src/modules/post/presentation/post.dto.ts`
```typescript
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000)
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(5000).optional()
});
```

7. [x] Post controller - file: `src/modules/post/presentation/post.controller.ts`
   - create, getAll, getById, update, delete methods
   - Error handling with try-catch

8. [x] Post routes - file: `src/modules/post/presentation/post.routes.ts`
```typescript
router.post('/posts', postController.create);
router.get('/posts', postController.getAll);
router.get('/posts/:id', postController.getById);
router.patch('/posts/:id', postController.update);
router.delete('/posts/:id', postController.delete);
```

**Acceptance Criteria**:
- [x] All CRUD operations work for posts
- [x] Validation enforces title/content requirements
- [x] Proper error responses
- [x] Same quality as User module

### Phase 5: Application Setup & Integration (Est: 0.5 days)

**Scope**: Main app setup, middleware, route registration

**Tasks**:

1. [x] Main application - file: `src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import userRoutes from './modules/user/presentation/user.routes';
import postRoutes from './modules/post/presentation/post.routes';
import { errorHandler } from './shared/infrastructure/http/error-handler';
import { logger } from './shared/utils/logger';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

2. [x] Environment variables - file: `.env.example`
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cleanapi
```

3. [x] Package scripts - file: `package.json`
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

**Acceptance Criteria**:
- [x] Server starts without errors
- [x] GET /health returns 200
- [x] All user routes accessible under /api/users
- [x] All post routes accessible under /api/posts
- [x] Error handling works globally
- [x] CORS configured correctly
- [x] Security headers applied (helmet)

### Phase 6: Database Migrations (Est: 0.25 days)

**Scope**: Generate and run database migrations

**Tasks**:

1. [x] Export all schemas - file: `src/shared/infrastructure/database/schema.ts`
```typescript
export { users } from '../../modules/user/infrastructure/user.schema';
export { posts } from '../../modules/post/infrastructure/post.schema';
```

2. [x] Generate migration
```bash
npm run db:generate
```

3. [x] Review migration SQL files in `drizzle/migrations/`

4. [x] Run migration
```bash
npm run db:push
# or
npm run db:migrate
```

5. [x] Verify tables created in PostgreSQL
```bash
docker exec -it <container> psql -U postgres -d cleanapi -c "\dt"
```

**Acceptance Criteria**:
- [x] Migration files generated
- [x] Tables created in database
- [x] Schema matches entity definitions
- [x] Indexes and constraints applied

### Phase 7: Testing Strategy (Est: 1 day)

**Scope**: Unit tests, integration tests, API tests

**Tasks**:

1. [x] Install test dependencies
   - vitest, @vitest/ui, supertest, @types/supertest

2. [x] Test configuration - file: `vitest.config.ts`

3. [x] Unit tests for User use case - file: `src/modules/user/application/__tests__/user.usecase.test.ts`
   - Test createUser validation
   - Test getUserById not found
   - Test updateUser
   - Test deleteUser
   - Mock repository

4. [x] Unit tests for Post use case - file: `src/modules/post/application/__tests__/post.usecase.test.ts`
   - Similar tests as User

5. [x] Integration tests for User API - file: `src/modules/user/presentation/__tests__/user.routes.test.ts`
   - Test POST /api/users
   - Test GET /api/users
   - Test GET /api/users/:id
   - Test PATCH /api/users/:id
   - Test DELETE /api/users/:id
   - Test validation errors
   - Use supertest + test database

6. [x] Integration tests for Post API - file: `src/modules/post/presentation/__tests__/post.routes.test.ts`
   - Similar tests as User

7. [x] Update package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Testing Strategy**:
- **Unit Tests**: Test business logic in use cases with mocked repositories (70% coverage)
- **Integration Tests**: Test API endpoints with real database (E2E flow)
- **Test Database**: Use separate DATABASE_URL_TEST or in-memory database
- **Fixtures**: Create test data helpers for users/posts
- **Cleanup**: Reset database between tests

**Acceptance Criteria**:
- [x] All tests pass
- [x] Test coverage >70%
- [x] Integration tests cover all endpoints
- [x] Validation errors tested
- [x] Not found scenarios tested

### Phase 8: Documentation & README (Est: 0.25 days)

**Scope**: Project documentation, API documentation

**Tasks**:

1. [x] README.md - file: `README.md`
   - Project description
   - Architecture overview
   - Setup instructions
   - Docker Compose usage
   - Environment variables
   - API endpoints documentation
   - Development workflow
   - Testing instructions

2. [x] Codebase summary - file: `./docs/codebase-summary.md`
   - Project structure
   - Module descriptions
   - Dependencies list
   - Design decisions

3. [x] System architecture - file: `./docs/system-architecture.md`
   - Clean Architecture diagram
   - Layer responsibilities
   - Dependency flow
   - Database schema diagram

4. [x] Code standards - file: `./docs/code-standards.md`
   - TypeScript conventions
   - Naming conventions
   - File organization
   - Error handling patterns
   - Testing standards

**Acceptance Criteria**:
- [x] README clear and complete
- [x] API endpoints documented with examples
- [x] Setup instructions work from scratch
- [x] Architecture documented

## Testing Strategy

### Unit Tests (Use Vitest)
- **User Use Case**:
  - Test createUser with valid/invalid data
  - Test getUserById with existing/non-existing id
  - Test updateUser validation
  - Test deleteUser
  - Mock IUserRepository
- **Post Use Case**: Similar coverage

### Integration Tests (Use Supertest + Test DB)
- **User API**:
  - POST /api/users (201, 400 validation, 400 duplicate email)
  - GET /api/users (200 with array)
  - GET /api/users/:id (200, 404)
  - PATCH /api/users/:id (200, 400, 404)
  - DELETE /api/users/:id (204, 404)
- **Post API**: Similar coverage

### E2E Flow Tests
- Create user → Get user → Update user → Delete user
- Create post → Get post → Update post → Delete post

### Test Coverage Targets
- Use cases: >80%
- Controllers: >70%
- Overall: >70%

## Security Considerations

- [x] Input validation with Zod schemas (prevent injection)
- [x] SQL injection protection via drizzle-orm parameterized queries
- [x] Helmet.js for security headers (XSS, clickjacking protection)
- [x] CORS configuration (restrict origins in production)
- [x] Environment variables for sensitive data
- [x] No sensitive data in error responses
- [x] Email uniqueness constraint (prevent duplicates)
- [x] Request size limits via express.json({ limit: '10mb' })
- [x] Rate limiting (optional, add express-rate-limit if needed)
- [x] PostgreSQL connection SSL in production

## Performance Considerations

- [x] Database connection pooling (drizzle default pool)
- [x] Indexes on email (unique constraint)
- [x] Response compression (add compression middleware if needed)
- [x] Async/await for non-blocking I/O
- [x] Pagination for GET /users and GET /posts (future enhancement)
- [x] Select specific fields instead of SELECT * (optimize queries)
- [x] Database query optimization with drizzle query builder
- [x] Proper HTTP caching headers (future enhancement)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database connection failures | High | Implement retry logic, health checks, connection pool monitoring |
| Unique constraint violations | Medium | Catch unique constraint errors, return proper 400 response |
| Large payload attacks | Medium | Add request size limits, rate limiting |
| Unhandled promise rejections | High | Global error handler, try-catch in all async handlers |
| Schema migration conflicts | Medium | Version control migrations, test migrations in staging |
| TypeScript compilation errors | Low | Strict mode enabled, CI checks before deploy |

## Quick Reference

### Key Commands
```bash
# Development
npm run dev                 # Start dev server with hot reload
npm run build              # Compile TypeScript to dist/
npm run start              # Run production build

# Database
docker-compose up -d       # Start PostgreSQL
docker-compose down        # Stop PostgreSQL
npm run db:generate        # Generate migration from schema
npm run db:push            # Push schema to database (dev)
npm run db:migrate         # Run migrations (production)
npm run db:studio          # Open Drizzle Studio UI

# Testing
npm test                   # Run all tests
npm run test:ui            # Run tests with UI
npm run test:coverage      # Generate coverage report

# Code Quality
npm run lint               # ESLint check
npm run format             # Prettier format
```

### Configuration Files
- `tsconfig.json`: TypeScript compiler configuration
- `drizzle.config.ts`: Drizzle ORM configuration
- `docker-compose.yml`: PostgreSQL container setup
- `.env`: Environment variables (create from .env.example)
- `package.json`: Dependencies and scripts

### API Endpoints

**User Endpoints**:
```
POST   /api/users           - Create user
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user by id
PATCH  /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
```

**Post Endpoints**:
```
POST   /api/posts           - Create post
GET    /api/posts           - Get all posts
GET    /api/posts/:id       - Get post by id
PATCH  /api/posts/:id       - Update post
DELETE /api/posts/:id       - Delete post
```

**Example Request**:
```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "This is the content of my post"}'
```

## Dependencies

### Production Dependencies
```json
{
  "express": "^4.18.2",
  "drizzle-orm": "^0.29.0",
  "pg": "^8.11.3",
  "zod": "^3.22.4",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "winston": "^3.11.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.3.3",
  "@types/express": "^4.17.21",
  "@types/node": "^20.10.0",
  "@types/pg": "^8.10.9",
  "@types/cors": "^2.8.17",
  "tsx": "^4.7.0",
  "drizzle-kit": "^0.20.6",
  "vitest": "^1.0.4",
  "@vitest/ui": "^1.0.4",
  "supertest": "^6.3.3",
  "@types/supertest": "^6.0.2",
  "eslint": "^8.55.0",
  "@typescript-eslint/parser": "^6.15.0",
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "prettier": "^3.1.1"
}
```

## TODO Checklist

### Phase 1: Project Setup
- [ ] Initialize npm project with dependencies
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Setup Docker Compose (docker-compose.yml)
- [ ] Create .env.example and .gitignore
- [ ] Setup Drizzle config (drizzle.config.ts)

### Phase 2: Shared Infrastructure
- [ ] Create database client (db.client.ts)
- [ ] Create database config (db.config.ts)
- [ ] Create base entity (base-entity.ts)
- [ ] Create error handler middleware (error-handler.ts)
- [ ] Create response helper (response.helper.ts)
- [ ] Create logger utility (logger.ts)
- [ ] Create validator utility (validator.ts)

### Phase 3: User Module
- [ ] Create user entity (user.entity.ts)
- [ ] Create user repository interface (user.repository.interface.ts)
- [ ] Create user schema (user.schema.ts)
- [ ] Create user repository implementation (user.repository.ts)
- [ ] Create user use cases (user.usecase.ts)
- [ ] Create user DTOs (user.dto.ts)
- [ ] Create user controller (user.controller.ts)
- [ ] Create user routes (user.routes.ts)

### Phase 4: Post Module
- [ ] Create post entity (post.entity.ts)
- [ ] Create post repository interface (post.repository.interface.ts)
- [ ] Create post schema (post.schema.ts)
- [ ] Create post repository implementation (post.repository.ts)
- [ ] Create post use cases (post.usecase.ts)
- [ ] Create post DTOs (post.dto.ts)
- [ ] Create post controller (post.controller.ts)
- [ ] Create post routes (post.routes.ts)

### Phase 5: Application Setup
- [ ] Create main application file (index.ts)
- [ ] Configure middleware (helmet, cors, body-parser)
- [ ] Register routes
- [ ] Setup error handling
- [ ] Add health check endpoint
- [ ] Test server startup

### Phase 6: Database Migrations
- [ ] Export all schemas (schema.ts)
- [ ] Generate migration (npm run db:generate)
- [ ] Review migration SQL
- [ ] Run migration (npm run db:push)
- [ ] Verify tables in PostgreSQL

### Phase 7: Testing
- [ ] Install test dependencies
- [ ] Configure Vitest
- [ ] Write user use case unit tests
- [ ] Write post use case unit tests
- [ ] Write user API integration tests
- [ ] Write post API integration tests
- [ ] Run all tests and verify coverage

### Phase 8: Documentation
- [ ] Create README.md
- [ ] Create ./docs/codebase-summary.md
- [ ] Create ./docs/system-architecture.md
- [ ] Create ./docs/code-standards.md
- [ ] Document API endpoints with examples

### Final Steps
- [ ] Run lint and fix issues
- [ ] Run tests and ensure all pass
- [ ] Test all API endpoints manually
- [ ] Review code for file size (<500 lines)
- [ ] Commit code with conventional commit
- [ ] Update project documentation

## Unresolved Questions

1. **Pagination**: Should GET /users and GET /posts support pagination? If yes, what strategy (offset-based or cursor-based)?
2. **Authentication**: Is authentication/authorization required for these endpoints? If yes, which strategy (JWT, sessions)?
3. **Rate Limiting**: Should we add rate limiting for API endpoints? What limits?
4. **Soft Delete**: Should DELETE operations be soft deletes (with deletedAt field) or hard deletes?
5. **Logging**: What logging level should be used in production? Should we use structured logging (JSON)?
6. **Foreign Keys**: Should Posts have a userId foreign key to associate with users?
7. **Validation**: Are there any additional business rules for email/name/title/content validation?
8. **Error Codes**: Should errors include custom error codes for client-side handling?
9. **API Versioning**: Should we version the API (/api/v1/users)?
10. **OpenAPI/Swagger**: Should we add API documentation via Swagger/OpenAPI spec?

---

**Next Steps After Approval**:
1. Review and approve this plan
2. Clarify unresolved questions
3. Begin Phase 1 implementation
4. Track progress via TODO checklist
5. Test after each phase
6. Document as we build
