# Project Rules & Coding Standards

This document contains strict coding and formatting rules that any AI Agent MUST follow during development. These rules are mandatory to prevent common AI mistakes and ensure scalable architecture.

---

## 1. Project Structure Rules

### 1.1 Directory Structure

```
vendor/
├── client/                    # React (Vite) Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI elements (max 150 lines/component)
│   │   ├── pages/             # Route-level page views
│   │   ├── context/           # Global state providers (Auth, Theme)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API request layer (axios instances)
│   │   └── utils/             # Helper functions (no comments)
│   └── package.json
├── server/                    # Node.js + Express Backend
│   ├── config/                # Configuration files (db, cloudinary)
│   ├── controllers/           # Business logic handlers (max 120 lines/file)
│   ├── middleware/            # Custom middleware (auth, errors, validation)
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API endpoint definitions
│   ├── utils/                 # Utilities (max 80 lines/file)
│   └── package.json
├── docs/                      # Documentation
└── README.md
```

### 1.2 File Size Limits

- **Frontend Components:** Maximum 150 lines per component
- **Backend Controllers:** Maximum 120 lines per file
- **Backend Middleware:** Maximum 100 lines per file
- **Utility Functions:** Maximum 80 lines per file
- **Split Large Files:** Any file exceeding limits MUST be refactored into smaller modules

---

## 2. Code Quality Standards

### 2.1 No Dummy Code Policy

- Every function MUST be fully functional
- No placeholder data, fake responses, or stub implementations
- All API calls MUST connect to actual endpoints
- Database operations MUST use real models

### 2.2 Security Requirements

- Passwords MUST be hashed before storage (bcryptjs)
- JWT tokens MUST use HTTP-only cookies (never localStorage)
- Input validation MUST be implemented on all endpoints
- CORS MUST be configured for specific origins only
- Environment variables MUST never be hard-coded

### 2.3 Error Handling

- All async operations MUST use try/catch blocks
- Errors MUST be passed to error middleware
- No sensitive data in error responses
- Stack traces hidden in production

---

## 3. Frontend Standards (React + Vite)

### 3.1 Component Structure

```
components/
├── common/            # Reusable UI: Button, Modal, Card, Input
├── layout/            # Navbar, Sidebar, Footer
├── parts/             # PartCard, PartForm, PartList
├── jumps/             # JumpTicket, JumpForm, JumpList
└── stock/             # StockEntry, StockList
```

### 3.2 State Management

- Use React Context for global state (Auth, Theme)
- DO NOT use Redux or Zustand unless specifically needed
- Local component state for UI-only concerns

### 3.3 Styling

- Use Tailwind CSS v4 utility classes exclusively
- No inline styles except for dynamic values
- Dark mode support via `dark:` prefix
- No CSS files - use Tailwind configuration

### 3.4 API Layer

- Create axios instance in `services/api.js`
- Include credentials for cookie support
- Handle token refresh if needed

### 3.5 Icons & Assets

- Use Heroicons or Tabler Icons for consistency
- Professional, premium-looking UI components only
- No generic "AI-generated" aesthetic elements

---

## 4. Backend Standards (Node.js + Express)

### 4.1 Route Structure

Each resource follows this pattern:
```
routes/
├── authRoutes.js        # /api/auth/*
├── partsRoutes.js       # /api/parts/*
├── stockRoutes.js       # /api/stock/*
└── jumpsRoutes.js       # /api/jumps/*
```

### 4.2 Controller Standards

- Each controller handles ONE resource type
- Use async/await, never Promises chains
- Return consistent response format:
  ```javascript
  res.status(200).json({ data: ..., message: ... })
  ```

### 4.3 Model Standards

- Schema definitions in separate files
- Virtual fields for computed properties
- Instance methods for document operations
- Static methods for model-level operations

### 4.4 Middleware Standards

- Authentication: Check JWT from cookie
- Authorization: Check user role
- Validation: Validate request body/params
- Error handling: Format and send errors

---

## 5. Database Standards (MongoDB + Mongoose)

### 5.1 Schema Conventions

- Use plural model names (User, Part, StockEntry, JumpAssembly)
- Include timestamps: `{ timestamps: true }`
- Add indexes for frequently queried fields
- Use virtual populate for nested resources

### 5.2 Query Standards

- Use `.lean()` for read-only queries
- Populate references only when needed
- Use projection to limit returned fields
- Handle CastError for invalid ObjectIds

---

## 6. API Standards

### 6.1 Request/Response Format

**Success Response:**
```json
{
  "_id": "65xxx",
  "name": "Part Name",
  "email": "user@example.com"
}
```

**Error Response:**
```json
{
  "message": "Validation error",
  "stack": "Error stack (dev only)"
}
```

### 6.2 HTTP Methods

- GET: Retrieve data (no request body)
- POST: Create new resource
- PUT: Full update of resource
- PATCH: Partial update of resource
- DELETE: Remove resource

---

## 7. Version Control Standards

### 7.1 Commit Messages

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `docs`: Documentation changes
- `style`: Formatting changes
- `test`: Test additions
- `chore`: Maintenance tasks

Examples:
- `feat(auth): add JWT token generation`
- `fix(parts): correct stock calculation on assembly`
- `docs(readme): update setup instructions`

### 7.2 Branch Strategy

- Main branch: `main` (production ready)
- Development: feature branches from main
- No direct commits to main

---

## 8. Testing Standards

### 8.1 Testing Framework

- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library

### 8.2 Test Coverage Goals

- Controllers: 80%+
- Middleware: 70%+
- Models: 60%+

---

## 9. Operational Guidelines

### 9.1 Development Commands

```bash
# Server
npm run dev       # Start with nodemon
npm start         # Production start

# Client
npm run dev       # Vite dev server
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

### 9.2 Code Quality Checks

- Run lint before every commit
- All tests must pass before merge
- No console.log in production code

---

## 10. Missing Components Checklist

Before considering a feature complete:

- [ ] Controller implemented with error handling
- [ ] Routes defined with proper middleware
- [ ] Mongoose model created with validation
- [ ] Frontend components created
- [ ] API service functions added
- [ ] Input validation implemented
- [ ] Tests written
- [ ] Documentation updated