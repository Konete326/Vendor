# 🏍️ MA Vendor Admin Panel

A comprehensive MERN Stack workshop management and POS application for bike shops and manufacturing units. The system tracks bike categories, raw materials (with quality grading, pricing, and alert thresholds), finished assembly production, POS sales, and outstanding dues (Udhaar).

---

## 📁 Project Structure

```
vendor/
├── client/                        # React (Vite) Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI elements
│   │   ├── pages/                 # Route-level page views (POS, Bikes, Assembly...)
│   │   ├── context/               # Global state & theme provider
│   │   ├── services/              # API request axios layers
│   │   └── utils/                 # Helpers
│   ├── .env                       # Local frontend env variables
│   └── .env.example               # Environment variable template
│
├── server/                        # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                  # MongoDB Atlas connection
│   │   └── cloudinary.js          # Cloudinary SDK settings
│   ├── controllers/               # CRUD and logic controller handlers
│   ├── middleware/                # Auth, image upload, error layers
│   ├── models/                    # Mongoose database schemas (Bike, RawMaterial, Assemble, Sale)
│   ├── routes/                    # Express API endpoints
│   ├── utils/                     # JWT generators and helpers
│   ├── .env                       # Local server env variables
│   └── .env.example               # Environment variable template
│
├── docs/
│   ├── PRD.md                     # Product Requirement Document
│   ├── TRD.md                     # Technical Requirement Document
│   ├── SRD.md                     # Software Requirement Document
│   └── RULES.md                   # Strict development rules
```

---

## 🔄 Core Business Flow

```
1. BIKE CATEGORIES
   ┌──────────────────────────────────────┐
   │ Admin defines bike models            │
   │ - Custom names + image uploads       │
   │ - Serves as master mapping entity    │
   └──────────────────────────────────────┘
              ↓
2. MATERIAL CONFIGURATION
   ┌──────────────────────────────────────┐
   │ Define parts, qualities & price      │
   │ - Map material to a bike & part type │
   │ - Variations (Quality A, B, C, etc.)  │
   │ - Quantities, prices & alert bounds  │
   └──────────────────────────────────────┘
              ↓
3. PRODUCTION & ASSEMBLY
   ┌──────────────────────────────────────┐
   │ Technicians assemble parts           │
   │ - Select active tab (Front, Rear...) │
   │ - Select quality per component       │
   │ - Submit → Raw stock decremented     │
   │ - Merges/saves finished assemblies   │
   └──────────────────────────────────────┘
              ↓
4. POS QUICK SALE
   ┌──────────────────────────────────────┐
   │ Sell parts or finished assemblies    │
   │ - Add items to cart (live images)    │
   │ - Select Cash, Online, or Partial    │
   │ - Tracks customer names & due bills  │
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
| **Images** | Cloudinary (signed stream uploads) |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Configure Server Environment
Create your `.env` file from the committed template:
```bash
cp .env.example .env
```
Fill in values for `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Configure Client Environment
```bash
cp .env.example .env
```
Set `VITE_API_URL` to your Express server URL.

### 5. Run in Development
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 🎨 UI & Design Details

- **Dark / Light Theme**: Built-in responsive theme toggling. Custom thin scrollbars dynamically adapt theme colors on scrollable containers.
- **Sticky Form Sidebar:** Layouts on New Assembly and POS pages keep forms/carts fixed to the screen while catalog cards scroll.
- **Live Widgets:** The dashboard widgets present real-time revenue, total invoices, outstanding due metrics, recent invoices logs, and low-stock indicators.