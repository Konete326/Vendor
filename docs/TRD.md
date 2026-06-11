# Technical Requirement Document (TRD)

## Project Name: Bike Jumps Management System

---

## 1. System Architecture & Tech Stack
The system is built as a Single Page Application (SPA) with a decoupled backend API:

- **Frontend**: React (Vite) + Tailwind CSS (v4)
- **Backend**: Node.js + Express.js (ES Modules syntax)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Token (JWT) in HTTP-only Cookie

```
+-----------------------------------------------------------+
|                       React App (Vite)                     |
|            +---------------------------------+            |
|            | Tailwind CSS Theme (Dark/Light) |            |
|            +---------------------------------+            |
+-----------------------------+-----------------------------+
                              |
                     REST HTTP / JSON Cookie
                              |
                              v
+-----------------------------+-----------------------------+
|                     Express.js Backend                    |
|       +---------------------------------------------+     |
|       | Auth, Jump, Part & Bike Routes/Controllers |     |
|       +---------------------------------------------+     |
+-----------------------------+-----------------------------+
                              |
                         Mongoose ODM
                              |
                              v
+-----------------------------+-----------------------------+
|                          MongoDB                          |
+-----------------------------------------------------------+
```

---

## 2. Database Models (Mongoose Schemas)

### 2.1 User Model (`models/User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' }
}
```

### 2.2 Part Model (`models/Part.js`)
```javascript
{
  name: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  category: { type: String, required: true }, // e.g., 'spring', 'damper', 'seal'
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  specs: {
    weightGrams: Number,
    brand: String,
    dimensions: String
  }
}
```

### 2.3 JumpAssembly Model (`models/JumpAssembly.js`)
```javascript
{
  name: { type: String, required: true },
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
  parts: [
    {
      partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
      quantity: { type: Number, default: 1 },
      qualityGrade: { type: String, enum: ['Grade A', 'Grade B', 'Grade C', 'Grade D'], default: 'Grade A' }
    }
  ],
  totalCost: { type: Number, required: true },
  settings: {
    reboundClicks: Number,
    compressionClicks: Number,
    psi: Number
  },
  assembledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  status: { type: String, enum: ['Pending', 'Ready'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
```

### 2.4 Bike Model (`models/Bike.js`)
```javascript
{
  ownerName: { type: String, required: true },
  make: { type: String, required: true }, // e.g., 'Honda', 'Yamaha'
  model: { type: String, required: true }, // e.g., 'CD70', 'CG125'
  category: { type: String, enum: ['70cc', '125cc', '150cc', 'Other'], required: true },
  year: { type: Number }
}
```

### 2.5 Worker Model (`models/Worker.js`)
```javascript
{
  name: { type: String, required: true },
  phone: { type: String },
  salaryPerAssembly: { type: Number, default: 0 }
}
```

---

## 3. Theme Implementation (Tailwind v4)
Tailwind v4 supports dark mode out of the box using class strategies:
- Configure `<html class="dark">` to activate dark styles.
- State switcher hook:
  ```javascript
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };
  ```
- Use utility prefixes like `bg-white dark:bg-slate-900` to handle colors dynamically.
