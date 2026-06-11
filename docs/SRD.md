# Software Requirement Document (SRD)

## Project Name: Bike Jumps Management System

---

## 1. System Requirements & Context
This document specifies the software requirements for the Bike Jumps Management System. The system manages cataloging components, assembly creations, and bike associations.

---

## 2. Functional Requirements & Use Cases

### 2.1 Use Case 1: POS Parts Management
- **Primary Actor**: Technician / Vendor
- **Description**: Add parts to catalog, edit stock levels, view prices.
- **System Action**: Provide REST API to perform CRUD operations on `/api/parts`.

### 2.2 Use Case 2: Jump Assembly Creation (POS style checkout)
- **Primary Actor**: Technician
- **Description**: Select multiple parts, customize quantities, assign tuning metrics, and save to a Bike model.
- **System Action**: Create transaction endpoint `/api/jumps` which calculates total cost, deducts items from parts inventory, and links to target Bike.

### 2.3 Use Case 3: Theme Toggle
- **Primary Actor**: End User
- **Description**: Switch between White Theme and Black Theme.
- **System Action**: Change HTML class tag to toggle theme styling instantly.

---

## 3. API Endpoints Specification

### 3.1 Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Set session cookie
- `POST /api/auth/logout` - Clear session cookie
- `GET /api/auth/profile` - Fetch current user payload

### 3.2 Parts Catalog
- `GET /api/parts` - Fetch and filter list of parts
- `POST /api/parts` - Add new part (admin/vendor only)
- `PUT /api/parts/:id` - Edit spec, price or stock (admin/vendor only)
- `DELETE /api/parts/:id` - Remove part from inventory

### 3.3 Jump Assemblies
- `POST /api/jumps` - Create new jump assembly configuration
- `GET /api/jumps` - Retrieve configurations
- `GET /api/jumps/:id` - Retrieve specific configuration with populated parts list

### 3.4 Bikes
- `POST /api/bikes` - Create bike record
- `GET /api/bikes` - List all bikes (with filtering by category: 70cc, 125cc, 150cc)
- `GET /api/bikes/:id` - Retrieve bike details with history of jumps configurations

### 3.5 Workers
- `POST /api/workers` - Register new worker profile
- `GET /api/workers` - List all workers
- `GET /api/workers/:id/stats` - Fetch production metrics (ready jump count and wages due) for a specific worker
- `PUT /api/jumps/:id/status` - Mark jump assembly as 'Ready' (updating status and counting towards worker tally)

---

## 4. Non-Functional Constraints
- **Performance**: API responses for list fetches should resolve in < 200ms.
- **Security**: Prevent unauthorized actions by checking JWT payload via HTTP-only cookie in requests.
- **Responsiveness**: Entire layout must adapt from mobile screens to wide monitors cleanly.
