# Software Requirement Document (SRD)

## Project Name: Bike Jumps Management System

---

## 1. System Context
This document describes the functional and non-functional requirements for the Bike Jumps Management System. It covers the end-to-end workflows from receiving bulk parts, grading and stocking components, assembling jump shocks, and tracking worker production.

---

## 2. Core Functional Requirements

### 2.1 User Authentication
- Users must register with a Name, Email, and Password.
- Users must log in with valid credentials to access the system.
- Session is maintained using a secure HTTP-only cookie.
- Users can log out, which clears the session cookie.
- A logged-in user can view their own profile details.

### 2.2 Parts Catalog Management
- Managers can add new parts to the catalog (name, SKU, category, price, stock, image).
- All users can browse and search the parts list with filters (by category, quality grade).
- Managers can update part details including price and stock quantity.
- Managers can delete a part from the catalog.

### 2.3 Bulk Stock Receiving
- When a shipment arrives from a supplier, the manager logs a Bulk Stock Entry.
- Each entry specifies the supplier name, invoice reference, total shipment cost, and a list of individual parts with quantities and unit cost.
- On successful submission, the stock count for each listed part is incremented automatically.

### 2.4 Jump Assembly (POS Workflow)
- Technician opens a new Assembly Ticket from the POS interface.
- Selects the bike category (70cc, 125cc, 150cc, Other).
- Adds components from the parts catalog to the ticket, selecting quantity and quality grade for each.
- Selects the worker's name who performed the physical assembly.
- On saving, the system:
  - Calculates total assembly cost.
  - Deducts part quantities from stock.
  - Saves the assembly record with status "Pending".
- Manager or admin marks the assembly as "Ready" when the physical build is verified.

### 2.5 Worker Production Summary
- The system maintains a log of all assemblies and their associated worker names.
- Users can filter completed assemblies by worker name to view production output.

---

## 3. API Endpoints Specification

### 3.1 Authentication Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user account | Public |
| POST | `/api/auth/login` | Authenticate and set session cookie | Public |
| POST | `/api/auth/logout` | Clear session cookie | Public |
| GET | `/api/auth/profile` | Get currently logged-in user details | Private |

---

### 3.2 Parts Catalog Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/parts` | List all parts (supports search & filter queries) | Private |
| POST | `/api/parts` | Add a new part to the catalog | Admin / Vendor |
| GET | `/api/parts/:id` | Get details of a single part | Private |
| PUT | `/api/parts/:id` | Update part details, price, or stock | Admin / Vendor |
| DELETE | `/api/parts/:id` | Remove a part from the catalog | Admin |

---

### 3.3 Bulk Stock Entry Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/stock` | Log a new bulk parts shipment entry | Admin / Vendor |
| GET | `/api/stock` | List all stock entry records | Private |
| GET | `/api/stock/:id` | Get details of a specific shipment record | Private |

---

### 3.4 Jump Assembly Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/jumps` | Create a new jump assembly ticket | Private |
| GET | `/api/jumps` | List all assemblies (filter by status, worker, category) | Private |
| GET | `/api/jumps/:id` | Get full details of a single assembly with populated parts | Private |
| PUT | `/api/jumps/:id/status` | Update assembly status to Ready | Admin / Vendor |

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | List endpoints should respond in under 200ms |
| Security | All write routes are JWT-protected via HTTP-only cookie |
| Responsiveness | Fully responsive from mobile (320px) to desktop (1920px) |
| Scalability | MongoDB Atlas allows horizontal scaling as data grows |
| Image Storage | All images stored on Cloudinary — no local file serving |
| Theme | UI supports Dark and Light modes with instant toggle |
