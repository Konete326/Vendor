# Technical Requirements Document (TRD)

## Project Name: Bike Jumps Management System

---

## 1. System Architecture & Tech Stack

### 1.1 Overall Architecture

```
┌─────────────────────────────────────┐
│         React SPA (Vite)            │
│   Tailwind CSS (Dark / Light Mode)  │
└────────────────┬────────────────────┘
                 │  REST HTTP + Cookie
                 ▼
┌─────────────────────────────────────┐
│       Express.js API Server         │
│  Auth │ Parts │ Jumps │ Workers     │
└──────────────┬──────────────────────┘
               │
       ┌────────┴──────────┐
       │                   │
       ▼                   ▼
┌───────────┐     ┌──────────────┐
│  MongoDB  │     │  Cloudinary  │
│   Atlas   │     │  (Images)    │
└───────────┘     └──────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | React | ^19.2.6 | Component-based UI |
| Frontend | Vite | ^8.0.12 | Build tool & dev server |
| Frontend | Tailwind CSS | ^4.3.0 | Utility-first CSS framework |
| Backend | Node.js | v18+ | JavaScript runtime |
| Backend | Express.js | ^5.2.1 | Web application framework |
| Database | MongoDB Atlas | Latest | NoSQL cloud database |
| ODM | Mongoose | ^9.7.0 | MongoDB object modeling |
| Auth | JWT | ^9.0.3 | Token-based authentication |
| Security | bcryptjs | ^3.0.3 | Password hashing |
| Images | Cloudinary | - | Cloud image storage |

---

## 2. Environment Configuration

### 2.1 Server Environment Variables (`server/.env`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | API server port | `5000` | No (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` | Yes |
| `NODE_ENV` | Application environment | `development` or `production` | No |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `mycloud` | Yes (for image upload) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefgh...` | Yes |

### 2.2 Client Environment Variables (`client/.env`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Base URL of the Express API | `http://localhost:5000/api` | Yes |

---

## 3. Database Models

### 3.1 User Model

Represents authenticated system users with role-based access control.

```javascript
{
  name: String,        // Required, user's full name
  email: String,         // Required, unique, lowercase
  password: String,      // Required, bcrypt hashed, min 6 chars
  role: String,          // Enum: 'user', 'vendor', 'admin', default: 'user'
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

**Indexes:**
- Unique index on `email`
- Index on `role` for query performance

### 3.2 Part Model

Represents individual stock components (springs, dampers, valves, seals, etc.)

```javascript
{
  name: String,            // Required, part name
  sku: String,               // Required, unique stock-keeping unit
  category: String,            // Enum: spring, seal, damper, valve, etc.
  price: Number,             // Required, base price
  gradePrices: {             // Optional, per-grade pricing
    gradeA: Number,
    gradeB: Number,
    gradeC: Number,
    gradeD: Number
  },
  stock: Number,             // Default: 0, available quantity
  brand: String,             // Optional, manufacturer name
  imageUrl: String,          // Optional, Cloudinary URL
  createdBy: ObjectId,     // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique index on `sku`
- Index on `category` for filtering

### 3.3 Bulk Stock Entry Model

Tracks incoming shipments from suppliers.

```javascript
{
  supplierName: String,    // Required
  invoiceRef: String,      // Optional, reference number
  totalCost: Number,       // Required, total shipment cost
  receivedAt: Date,        // Default: now
  items: [{
    partId: ObjectId,      // Reference to Part
    quantity: Number,      // Required
    unitCost: Number       // Required
  }],
  createdBy: ObjectId,     // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 Jump Assembly Model

Represents completed or in-progress shock absorber builds.

```javascript
{
  name: String,              // Required, ticket label
  bikeCategory: String,        // Enum: 70cc, 125cc, 150cc, Other
  parts: [{
    partId: ObjectId,          // Reference to Part
    quantity: Number,          // Default: 1
    qualityGrade: String       // Enum: Grade A, Grade B, Grade C, Grade D
  }],
  totalCost: Number,         // Calculated sum
  assembledBy: String,       // Worker name
  status: String,              // Enum: Pending, Ready
  imageUrl: String,            // Optional, Cloudinary URL
  createdBy: ObjectId,         // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. API Endpoints

### 4.1 Authentication Endpoints

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | `/api/auth/register` | Register new user | Public | `{name, email, password, role?}` |
| POST | `/api/auth/login` | Authenticate user | Public | `{email, password}` |
| POST | `/api/auth/logout` | Clear session cookie | Public | - |
| GET | `/api/auth/profile` | Get user profile | Private | - |

### 4.2 Parts Catalog Endpoints

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|------------|
| GET | `/api/parts` | List parts with search/filter | Private | Query: `search`, `category` |
| POST | `/api/parts` | Add new part | Admin/Vendor | Part object |
| GET | `/api/parts/:id` | Get single part | Private | - |
| PUT | `/api/parts/:id` | Update part | Admin/Vendor | Part fields to update |
| DELETE | `/api/parts/:id` | Delete part | Admin | - |

### 4.3 Bulk Stock Entry Endpoints

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------|
| POST | `/api/stock` | Create bulk stock entry | Admin/Vendor | Stock entry object |
| GET | `/api/stock` | List stock entries | Private | Query: `supplier`, `date` |
| GET | `/api/stock/:id` | Get single entry | Private | - |

### 4.4 Jump Assembly Endpoints

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------|
| POST | `/api/jumps` | Create assembly ticket | Private | Jump object |
| GET | `/api/jumps` | List assemblies | Private | Query: `status`, `worker`, `category` |
| GET | `/api/jumps/:id` | Get single assembly | Private | - |
| PUT | `/api/jumps/:id/status` | Update status | Admin/Vendor | `{status: "Ready"}` |

---

## 5. Security Implementation

### 5.1 Authentication Strategy

- **JWT in HTTP-only Cookie:** Token stored in secure, HTTP-only cookie
- **Token Expiration:** 30 days
- **Cookie Settings:**
  - `httpOnly: true` - Inaccessible to JavaScript
  - `secure: true` - HTTPS only in production
  - `sameSite: 'strict'` - CSRF protection
  - `maxAge: 30 days`

### 5.2 Password Security

- **Hashing Algorithm:** bcrypt with salt rounds of 10
- **Minimum Length:** 6 characters enforced
- **No Plaintext Storage:** Passwords never stored in plain text

### 5.3 CORS Configuration

- Credentials enabled for cookie support
- Origin restricted to configured `CLIENT_URL`

---

## 6. Image Upload Strategy (Cloudinary)

### 6.1 Upload Flow

```
1. Frontend requests signed upload signature from /api/upload/signature
2. Server generates signature using Cloudinary API secret
3. Frontend uploads image directly to Cloudinary using signature
4. Cloudinary returns secure URL
5. URL saved to database with part/jump record
```

### 6.2 Benefits

- Reduced server bandwidth usage
- Faster uploads with direct cloud transfer
- Automatic image optimization by Cloudinary
- CDN delivery for all images

---

## 7. Theme Implementation

### 7.1 Tailwind CSS Dark Mode

- Dark mode activated via `className="dark"` on HTML element
- All styles use `dark:` prefix for dark variants
- Theme state managed via React context

### 7.2 Theme Persistence

- Theme preference stored in `localStorage`
- Initialized from storage on app load
- No page reload required for switching

---

## 8. Error Handling Architecture

### 8.1 Centralized Error Handling

- `notFound` middleware for 404 errors
- `errorHandler` middleware for all other errors
- Mongoose `CastError` handling for invalid ObjectId
- Stack traces hidden in production

---

## 9. Deployment Architecture

### 9.1 Production Build

**Server:**
- Run as Node.js process
- No build step required (ES Modules)

**Client:**
- `npm run build` generates static assets in `dist/`
- Serve via Express static middleware or CDN

### 9.2 Hosting Recommendations

| Component | Recommended Platform |
|-----------|-------------------|
| Frontend | Vercel, Netlify, or Express static serve |
| Backend | Render, Railway, or Heroku |
| Database | MongoDB Atlas |
| Images | Cloudinary |

---

## 10. Future Considerations

- Redis caching for frequently accessed parts catalog
- WebSocket integration for real-time stock updates
- Analytics dashboard for business insights
- Barcode scanning for quick part lookup
- Export/import functionality for bulk operations