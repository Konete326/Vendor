# Claude Development Guide

This document provides comprehensive rules, coding standards, and operational instructions for the Bike Jumps Management System project. All contributors and AI agents MUST follow these guidelines.

---

## 1. Project Overview

**Project:** Bike Jumps Management System  
**Type:** MERN Stack (MongoDB, Express, React, Node.js)  
**Purpose:** Workshop management for motorcycle suspension component assembly

---

## 2. Technology Stack Rules

### 2.1 Version Requirements

| Technology | Required Version | Source |
|------------|------------------|--------|
| Node.js | v18+ | LTS version |
| React | ^19.x | Latest stable |
| Express | ^5.x | Latest stable |
| MongoDB | Atlas (cloud) | Managed service |
| Mongoose | ^9.x | Latest stable |
| Tailwind CSS | ^4.x | Latest stable |
| Vite | ^8.x | Latest stable |

### 2.2 Module System

- All backend files use **ES Modules** (`type: "module"` in package.json)
- Use `import/export` syntax exclusively
- No require() or CommonJS syntax allowed

---

## 3. Backend Coding Standards

### 3.1 File Organization

```
server/
├── config/
│   └── db.js                      # Database connection ONLY
├── controllers/
│   ├── authController.js          # Auth logic
│   ├── partsController.js         # Parts logic
│   ├── stockController.js         # Stock logic
│   └── jumpsController.js         # Assembly logic
├── middleware/
│   ├── authMiddleware.js          # JWT auth protection
│   ├── errorMiddleware.js         # Error handlers
│   └── validationMiddleware.js    # Input validation
├── models/
│   ├── User.js                    # User schema
│   ├── Part.js                    # Part schema
│   ├── StockEntry.js              # Stock schema
│   └── JumpAssembly.js            # Jump schema
├── routes/
│   ├── authRoutes.js              # /api/auth/*
│   ├── partsRoutes.js             # /api/parts/*
│   ├── stockRoutes.js             # /api/stock/*
│   └── jumpsRoutes.js             # /api/jumps/*
└── utils/
    └── generateToken.js           # JWT cookie utility
```

### 3.2 Controller Implementation Pattern

```javascript
export const createResource = async (req, res, next) => {
  try {
    const { field1, field2 } = req.body;
    
    if (!field1 || !field2) {
      res.status(400);
      throw new Error('All fields are required');
    }
    
    const resource = await Resource.create({ field1, field2 });
    
    res.status(201).json({ _id: resource._id, field1, field2 });
  } catch (error) {
    next(error);
  }
};
```

### 3.3 Model Implementation Pattern

```javascript
const schema = new mongoose.Schema({
  field: {
    type: String,
    required: [true, 'Field is required'],
  }
}, {
  timestamps: true
});

schema.methods.instanceMethod = async function() {
  // ...
};

schema.statics.staticMethod = async function() {
  // ...
};

export default mongoose.model('Resource', schema);
```

### 3.4 Middleware Implementation Pattern

```javascript
export const protect = async (req, res, next) => {
  let token;
  
  token = req.cookies.jwt;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};
```

### 3.5 File Size Limits

- Controllers: Maximum 120 lines per file
- Middleware: Maximum 100 lines per file
- Models: Maximum 80 lines per file
- Utils: Maximum 60 lines per file

---

## 4. Frontend Coding Standards

### 4.1 Component Organization

```
client/src/
├── components/
│   ├── common/                    # Reusable: Button, Modal, Input, Card
│   ├── layout/                    # Navbar, Sidebar, Footer
│   ├── parts/                     # PartCard, PartList, PartSearch
│   ├── jumps/                     # JumpTicket, JumpBasket, JumpList
│   └── stock/                     # StockEntryForm, StockList
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Parts.jsx
│   ├── Stock.jsx
│   └── Jumps.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   └── useApi.js
├── services/
│   └── api.js
└── utils/
    └── format.js
```

### 4.2 Component Implementation Pattern

```jsx
function ComponentName({ prop1, prop2 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      {/* JSX content */}
    </div>
  );
}

export default ComponentName;
```

### 4.3 Context Pattern

```jsx
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const value = { user, login, logout, updateUser };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4.4 Service Layer Pattern

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const fetchParts = () => api.get('/parts');
export const createPart = (data) => api.post('/parts', data);
export const updatePart = (id, data) => api.put(`/parts/${id}`, data);

export default api;
```

### 4.5 Component Size Limits

- Components: Maximum 150 lines per file
- Pages: Maximum 200 lines per file
- Context/Hooks: Maximum 100 lines per file
- Services: Maximum 80 lines per file

---

## 5. UI/UX Standards

### 5.1 Tailwind CSS v4 Rules

- Use `@import "tailwindcss"` in index.css
- Dark mode via `className="dark"` on HTML element
- All colors use CSS variables (no hardcoded colors)
- Responsive design: mobile-first approach

### 5.2 Color Palette

| Use Case | Color |
|----------|-------|
| Primary Background | `bg-slate-900` (dark), `bg-slate-50` (light) |
| Card Background | `bg-slate-800` (dark), `bg-white` (light) |
| Text Primary | `text-white` (dark), `text-slate-900` (light) |
| Text Secondary | `text-slate-400` |
| Accent/Success | `text-teal-400`, `bg-teal-500` |
| Error/Danger | `text-red-400`, `bg-red-500` |

### 5.3 No Native Dialogs

```javascript
// BAD - Never use these
alert('Message');
confirm('Are you sure?');

// GOOD - Use custom modal components
<Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
  <ConfirmationDialog onConfirm={handleAction} />
</Modal>
```

---

## 6. Security Standards

### 6.1 Authentication Flow

1. User registers/logs in
2. Server generates JWT
3. JWT stored in HTTP-only cookie
4. Cookie automatically sent on subsequent requests
5. Protected routes read cookie and verify token

### 6.2 Password Security

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 6.3 Role-Based Access

```javascript
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as admin'));
  }
};
```

---

## 7. Environment Variables

### 7.1 Server (.env)

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

### 7.2 Client (.env)

```
VITE_API_URL=http://localhost:5000/api
```

---

## 8. Development Workflow

### 8.1 Daily Commands

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 8.2 Before Commit Checklist

- [ ] All lint checks pass (`npm run lint` in client)
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] All new files under size limits
- [ ] Environment variables documented

---

## 9. API Standards

### 9.1 Response Format

```json
// Success
{
  "_id": "65xxx",
  "name": "Item Name"
}

// Error
{
  "message": "Error description"
}
```

### 9.2 Status Codes

- 200: Successful GET/PUT
- 201: Resource created (POST)
- 400: Validation error
- 401: Not authenticated
- 403: Not authorized
- 404: Not found
- 500: Server error

---

## 10. Missing Components to Implement

### 10.1 High Priority

| Component | File Location | Estimated Lines |
|-----------|--------------|-----------------|
| Part Model | `server/models/Part.js` | ~40 lines |
| StockEntry Model | `server/models/StockEntry.js` | ~45 lines |
| JumpAssembly Model | `server/models/JumpAssembly.js` | ~50 lines |
| Parts Controller | `server/controllers/partsController.js` | ~120 lines |
| Stock Controller | `server/controllers/stockController.js` | ~120 lines |
| Jumps Controller | `server/controllers/jumpsController.js` | ~120 lines |
| Parts Routes | `server/routes/partsRoutes.js` | ~30 lines |
| Stock Routes | `server/routes/stockRoutes.js` | ~30 lines |
| Jumps Routes | `server/routes/jumpsRoutes.js` | ~30 lines |
| Validation Middleware | `server/middleware/validationMiddleware.js` | ~80 lines |

### 10.2 Medium Priority

| Component | File Location |
|-----------|--------------|
| Cloudinary utils | `server/utils/cloudinary.js` |
| Auth Context | `client/src/context/AuthContext.jsx` |
| Theme Context | `client/src/context/ThemeContext.jsx` |
| API service | `client/src/services/api.js` |
| Common components | `client/src/components/common/` |

---

## 11. Testing Standards

### 11.1 Backend Testing (Recommended Packages)

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

### 11.2 Frontend Testing (Recommended Packages)

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

---

## 12. Code Review Checklist

Before finalizing any feature:

- [ ] All files under line limits
- [ ] No comments in code
- [ ] No dummy/placeholder code
- [ ] Proper error handling
- [ ] Input validation implemented
- [ ] Tests written (if applicable)
- [ ] Documentation updated