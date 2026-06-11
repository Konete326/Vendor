# 🔧 Bike Jumps Management System

A specialized **MERN Stack** workshop management application for tracking, stocking, assembling, and cataloging motorcycle suspension components (locally known as "Jumps"). Designed for mechanics, workshop owners, and retailers who manage individual shock absorber parts at a granular level.

---

## 📁 Project Structure

```
vendor/
├── client/                        # React (Vite) Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI elements
│   │   ├── pages/                 # Route-level page views
│   │   ├── context/               # Global state & theme provider
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API request layer
│   │   └── utils/                 # Helper functions & constants
│   ├── .env                       # Local frontend env variables
│   └── .env.example               # Environment variable template
│
├── server/                        # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/               # Business logic handlers
│   ├── middleware/                # Auth, error handling
│   ├── models/                    # Mongoose data schemas
│   ├── routes/                    # API endpoint routes
│   ├── utils/                     # Utilities (JWT generator etc.)
│   ├── .env                       # Local server env variables
│   └── .env.example               # Environment variable template
│
├── docs/
│   ├── PRD.md                     # Product Requirement Document
│   ├── TRD.md                     # Technical Requirement Document
│   └── SRD.md                     # Software Requirement Document
│
└── README.md                      # You are here!
```

---

## 🔄 System Workflow

```
1. RECEIVE PARTS (Bulk Stocking)
   ┌──────────────────────────────────────┐
   │ Manager logs a Bulk Stock Entry      │
   │ - Supplier name + invoice reference  │
   │ - Parts list with qty & unit cost    │
   │ → Stock levels auto-incremented      │
   └──────────────────────────────────────┘
              ↓
2. CATALOG MANAGEMENT
   ┌──────────────────────────────────────┐
   │ Parts are browsable in the catalog   │
   │ - Searchable by name, category       │
   │ - Each part has a Grade selector     │
   │   (Grade A: Premium / Kabli)         │
   │   (Grade B: Standard / Regular)      │
   │   (Grade C: Second-Hand / Restored)  │
   │   (Grade D: Budget / Local)          │
   └──────────────────────────────────────┘
              ↓
3. ASSEMBLY (POS Interface)
   ┌──────────────────────────────────────┐
   │ Technician opens Assembly Ticket     │
   │ - Select bike category (70cc/125cc)  │
   │ - Add parts + assign Grade per part  │
   │ - Select worker name                 │
   │ - Submit → Stock auto-decremented    │
   │ - Assembly saved as "Pending"        │
   └──────────────────────────────────────┘
              ↓
4. QUALITY CHECK & COMPLETION
   ┌──────────────────────────────────────┐
   │ Manager reviews the assembly         │
   │ - Marks status as "Ready"            │
   │ - Counted towards worker's output    │
   └──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB Atlas (Cloud) + Mongoose |
| **Auth** | JWT in HTTP-only Cookie |
| **Images** | Cloudinary (signed uploads) |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/Konete326/Vendor.git
cd vendor
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Configure Server Environment
Copy the example file and fill in your values:
```bash
cp .env.example .env
```
Set values for: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### 4. Install Client Dependencies
```bash
cd ../client
npm install
```

### 5. Configure Client Environment
```bash
cp .env.example .env
```
Set `VITE_API_URL` to your running API server address.

### 6. Run in Development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

---

## 🎨 UI & Design

- **Dark / Light Theme**: Click the theme toggle button in the navbar to instantly switch between a premium dark mode and a clean bright white mode.
- **POS Screen**: Split-panel interface — left shows the searchable parts catalog, right shows the active assembly ticket basket with worker assignment and grade selections.
- **Responsive**: Fully mobile-friendly from 320px screens up to wide monitors.

---

## 📄 Documentation

| Document | Description |
|---|---|
| [PRD.md](./docs/PRD.md) | Product requirements, user stories, and business workflows |
| [TRD.md](./docs/TRD.md) | Architecture, database models, Cloudinary, and auth strategy |
| [SRD.md](./docs/SRD.md) | API endpoint specifications and system constraints |
| [cloude.md](./cloude.md) | Development guide, coding standards, and operational rules |

---

## 🔐 Security

- Passwords are hashed with **bcryptjs** before storage.
- JWT tokens are stored only in **HTTP-only cookies** — inaccessible to client-side JavaScript.
- All `.env` files are excluded from version control via `.gitignore`.

---

## 📦 Git Notes

- All `node_modules` and local `.env` files are in `.gitignore`.
- `.env.example` files are committed as templates — copy them and fill in your own values.
- Main branch: `main`