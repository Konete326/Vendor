# Technical Requirement Document (TRD)

## Project Name: Bike Jumps Management System

---

## 1. System Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS v4 | Single Page Application UI |
| Backend | Node.js + Express.js (ES Modules) | REST API Server |
| Database | MongoDB Atlas (Cloud) | Persistent data store |
| ODM | Mongoose | Schema modeling & validation |
| Auth | JWT via HTTP-only Cookie | Secure session management |
| Image Storage | Cloudinary | Cloud-based image upload & retrieval |

### System Interaction Diagram

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

---

## 2. Environment Configuration

### Server (`server/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `PORT` | Port for the API server | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key` |
| `NODE_ENV` | Application mode | `development` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `mycloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefgh...` |

### Client (`client/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Base URL of the Express API | `http://localhost:5000/api` |

---

## 3. Database Models (Conceptual Descriptions)

### 3.1 User Model
Represents an authenticated system user (manager, admin, or vendor).

| Field | Type | Description | Validation |
|---|---|---|---|
| `name` | String | Full name of the user | Required |
| `email` | String | Unique login email | Required, Unique, Valid format |
| `password` | String | Hashed password (bcryptjs) | Required, Min 6 characters |
| `role` | String | Access level | Enum: `user`, `vendor`, `admin` |

---

### 3.2 Part Model
Represents an individual stock component (a spring, damper, valve, etc.).

| Field | Type | Description | Validation |
|---|---|---|---|
| `name` | String | Name of the component | Required |
| `sku` | String | Unique stock-keeping code | Required, Unique |
| `category` | String | Component type | Required (e.g., spring, seal, damper) |
| `price` | Number | Per-unit sale price | Required |
| `stock` | Number | Available quantity | Default: 0 |
| `brand` | String | Manufacturer/brand name | Optional |
| `imageUrl` | String | Cloudinary image URL for this part | Optional |

---

### 3.3 Bulk Stock Entry Model
Tracks incoming shipments of parts from suppliers.

| Field | Type | Description | Validation |
|---|---|---|---|
| `supplierName` | String | Name of the supplier | Required |
| `invoiceRef` | String | Invoice or shipment reference | Optional |
| `totalCost` | Number | Total amount paid for the shipment | Required |
| `receivedAt` | Date | Date the shipment was received | Default: now |
| `items` | Array | List of parts received | Required |
| `items[].partId` | ObjectId | Reference to Part model | Required |
| `items[].quantity` | Number | Quantity received for this part | Required |
| `items[].unitCost` | Number | Per-unit cost at time of purchase | Required |
| `createdBy` | ObjectId | Reference to the User who logged the entry | Required |

---

### 3.4 Jump Assembly Model
Represents a completed or in-progress shock absorber build.

| Field | Type | Description | Validation |
|---|---|---|---|
| `name` | String | Custom name or ticket label for the assembly | Required |
| `bikeCategory` | String | Target motorcycle type | Enum: `70cc`, `125cc`, `150cc`, `Other` |
| `parts` | Array | List of parts used in this assembly | Required |
| `parts[].partId` | ObjectId | Reference to Part model | Required |
| `parts[].quantity` | Number | Quantity of this part used | Default: 1 |
| `parts[].qualityGrade` | String | Grade selected for this part in the build | Enum: `Grade A`, `Grade B`, `Grade C`, `Grade D` |
| `totalCost` | Number | Calculated total cost of all parts used | Required |
| `assembledBy` | String | Name of the worker who built the assembly | Required |
| `status` | String | Assembly completion state | Enum: `Pending`, `Ready` |
| `imageUrl` | String | Optional Cloudinary image of the completed jump | Optional |
| `createdBy` | ObjectId | Reference to the User who created the ticket | Required |

---

## 4. Image Upload Strategy (Cloudinary)
- Images for parts and completed jump assemblies are uploaded directly from the frontend using a **signed upload** approach.
- The Express server generates a signed upload signature using the Cloudinary API Secret.
- The client uses the signature to upload the image directly to Cloudinary (avoids sending large files through the Express server).
- Once uploaded, Cloudinary returns a secure URL that is saved into MongoDB for that record.

---

## 5. Authentication Strategy
- On login, the server generates a JWT signed with the `JWT_SECRET`.
- The token is stored in an **HTTP-only, Secure cookie** — never exposed to JavaScript.
- Protected routes use an `authMiddleware` that reads and verifies the cookie token on every request.
- Role-based protection (admin, vendor, user) restricts write operations on critical routes.

---

## 6. Theme Implementation (Tailwind CSS v4)
- The `<html>` element receives a `dark` CSS class to activate dark mode.
- All component styles use Tailwind's `dark:` prefix for dual-color-scheme support.
- The user's theme preference is persisted in `localStorage` across sessions.
- Toggling is instant with no page reload — achieved through a global React context.
