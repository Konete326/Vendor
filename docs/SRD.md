# Software Requirements Document (SRD)

## Project Name: Bike Jumps Management System

---

## 1. System Context

This document describes the functional and non-functional requirements for the Bike Jumps Management System. It covers the end-to-end workflows from receiving bulk parts, grading and stocking components, assembling jump shocks, and tracking worker production.

---

## 2. Core Functional Requirements

### 2.1 User Authentication

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| AUTH-01 | User registration with name, email, password, optional role | High |
| AUTH-02 | User login with email and password | High |
| AUTH-03 | Session maintained via HTTP-only cookie | High |
| AUTH-04 | User logout clears session cookie | High |
| AUTH-05 | Authenticated user can view their profile | High |
| AUTH-06 | Role-based access control (user, vendor, admin) | High |

### 2.2 Parts Catalog Management

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| PARTS-01 | Add new parts to catalog (name, SKU, category, price, stock) | High |
| PARTS-02 | List all parts with search and category filters | High |
| PARTS-03 | View single part details | High |
| PARTS-04 | Update part information (price, stock, image) | High |
| PARTS-05 | Delete parts from catalog (admin only) | Medium |
| PARTS-06 | Upload part images via Cloudinary | Medium |

### 2.3 Bulk Stock Receiving

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| STOCK-01 | Create bulk stock entry with supplier details | High |
| STOCK-02 | Add multiple parts to a single stock entry | High |
| STOCK-03 | Auto-increment stock levels on entry creation | High |
| STOCK-04 | List all stock entries with filtering | Medium |
| STOCK-05 | View single stock entry details | Medium |

### 2.4 Jump Assembly (POS Workflow)

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| JUMP-01 | Create assembly ticket with bike category | High |
| JUMP-02 | Add multiple parts with quantity and quality grade | High |
| JUMP-03 | Assign worker name to assembly | High |
| JUMP-04 | Calculate total assembly cost automatically | High |
| JUMP-05 | Deduct part quantities from stock on submission | High |
| JUMP-06 | List all assemblies with filtering | High |
| JUMP-07 | Update assembly status to "Ready" | Medium |
| JUMP-08 | Upload assembly images via Cloudinary | Low |

### 2.5 Worker Production Summary

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| WORKER-01 | Track assemblies by worker name | Medium |
| WORKER-02 | Filter assemblies by worker | Medium |
| WORKER-03 | Count completed assemblies per worker | Medium |

---

## 3. API Endpoints Specification

### 3.1 Authentication Endpoints

| Method | Endpoint | Description | Access | Request Body | Response |
|--------|----------|-------------|--------|--------------|----------|
| POST | `/api/auth/register` | Register new user | Public | `{name, email, password, role?}` | User object |
| POST | `/api/auth/login` | Authenticate & set cookie | Public | `{email, password}` | User object |
| POST | `/api/auth/logout` | Clear cookie | Public | - | Success message |
| GET | `/api/auth/profile` | Get logged-in user | Private | - | User object |

### 3.2 Parts Catalog Endpoints

| Method | Endpoint | Description | Access | Query Params | Response |
|--------|----------|-------------|--------|--------------|----------|
| GET | `/api/parts` | List all parts | Private | `search`, `category` | Array of parts |
| POST | `/api/parts` | Create new part | Admin/Vendor | - | Created part |
| GET | `/api/parts/:id` | Get part by ID | Private | - | Part object |
| PUT | `/api/parts/:id` | Update part | Admin/Vendor | Part fields | Updated part |
| DELETE | `/api/parts/:id` | Delete part | Admin | - | Success message |

### 3.3 Bulk Stock Entry Endpoints

| Method | Endpoint | Description | Access | Response |
|--------|----------|-------------|--------|----------|
| POST | `/api/stock` | Create stock entry | Admin/Vendor | Created entry |
| GET | `/api/stock` | List all entries | Private | Array of entries |
| GET | `/api/stock/:id` | Get single entry | Private | Entry object |

### 3.4 Jump Assembly Endpoints

| Method | Endpoint | Description | Access | Query Params | Response |
|--------|----------|-------------|--------|--------------|----------|
| POST | `/api/jumps` | Create assembly | Private | - | Created jump |
| GET | `/api/jumps` | List assemblies | Private | `status`, `worker`, `category` | Array of jumps |
| GET | `/api/jumps/:id` | Get single jump | Private | - | Jump object |
| PUT | `/api/jumps/:id/status` | Update status | Admin/Vendor | `{status}` | Updated jump |

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| API Response Time | Endpoints respond in under 200ms | Average response time |
| Page Load Time | Initial page load under 2 seconds | Measured on 3G connection |
| Search Performance | Search results in under 100ms | Filtered query performance |

### 4.2 Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Password Storage | bcryptjs hashing with salt rounds 10 |
| Session Security | HTTP-only, Secure, SameSite cookies |
| Token Expiration | JWT expires in 30 days |
| Input Validation | Mongoose schema validation + express validation |
| Error Handling | No sensitive data in error responses |

### 4.3 Usability Requirements

| Requirement | Details |
|-------------|---------|
| Responsiveness | Mobile-first, responsive from 320px to 1920px |
| Theme Support | Dark/Light mode with instant toggle |
| Accessibility | Semantic HTML, keyboard navigation support |
| Browser Support | Modern browsers (Chrome, Firefox, Safari, Edge) |

### 4.4 Scalability Requirements

| Requirement | Details |
|-------------|---------|
| Database Scaling | MongoDB Atlas horizontal scaling support |
| Horizontal Scaling | Stateless API server (multiple instances) |
| Caching Strategy | Future Redis integration planned |

---

## 5. Data Validation Rules

### 5.1 User Validation

- `name`: Required, string
- `email`: Required, unique, valid email format
- `password`: Required, minimum 6 characters
- `role`: Enum values only ('user', 'vendor', 'admin')

### 5.2 Part Validation

- `name`: Required, string
- `sku`: Required, unique
- `category`: Required, enum
- `price`: Required, positive number
- `stock`: Integer >= 0

### 5.3 Stock Entry Validation

- `supplierName`: Required, string
- `totalCost`: Required, positive number
- `items`: Required, array with min 1 item
- Each item must have valid `partId`, `quantity`, `unitCost`

### 5.4 Jump Assembly Validation

- `name`: Required, string
- `bikeCategory`: Required, enum
- `parts`: Required, array with min 1 part
- `assembledBy`: Required, string
- `status`: Enum ('Pending', 'Ready')

---

## 6. Error Handling Specification

### 6.1 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server | Unhandled errors |

### 6.2 Error Response Format

```json
{
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

---

## 7. Testing Requirements

### 7.1 Backend Testing

- Unit tests for controllers and middleware
- Integration tests for API endpoints
- Test framework: Jest (to be configured)

### 7.2 Frontend Testing

- Component unit tests
- End-to-end testing with React Testing Library
- Test framework: Vitest/Jest (to be configured)

---

## 8. Deployment Requirements

### 8.1 Environment Variables

All environment variables must be configurable via `.env` files.

### 8.2 Build Process

- Client: `npm run build` generates production-ready assets
- Server: Direct execution with Node.js (ES Modules)

### 8.3 Process Management

- Use PM2 or similar for production process management
- Automatic restart on failure
- Log management and monitoring

---

## 9. Missing Components & Improvements Needed

### 9.1 Current Gaps

| Component | Status | Priority |
|-----------|--------|----------|
| Part Model | Not implemented | High |
| Stock Model | Not implemented | High |
| Jump Model | Not implemented | High |
| Parts Routes | Not implemented | High |
| Stock Routes | Not implemented | High |
| Jump Routes | Not implemented | High |
| Cloudinary Upload | Not implemented | Medium |
| Input Validation Middleware | Not implemented | High |
| Testing Setup | Missing | High |
| Logging Infrastructure | Basic (morgan) | Medium |
| Rate Limiting | Not implemented | Medium |
| API Documentation | Not implemented | Medium |

### 9.2 Recommended Additions

- **Jest** for backend testing
- **Vitest** for frontend testing
- **express-validator** for request validation
- **helmet** for security headers
- **express-rate-limit** for DDoS protection
- **morgan** request logging (already installed)
- **swagger** for API documentation