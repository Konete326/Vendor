# Product Requirements Document (PRD)

## Project Name: Bike Jumps Management System

---

## 1. Executive Summary & Project Vision

The Bike Jumps Management System is a specialized business management application designed for motorcycle workshops, retailers, and mechanics. It enables tracking, stocking, and assembling individual components that constitute motorcycle suspension and shock absorber systems (commonly called "jumps").

Instead of viewing a suspension shock as a single, bulk product, the system tracks the distinct components (valves, dampers, coils, seals, etc.) that go into building them. The system functions like a Point of Sale (POS) inventory builder, letting users add components to a build list, specify component quality grades, assign an assembly worker, log completed builds, and manage inventory levels.

---

## 2. Business Objectives

### 2.1 Primary Goals
- Digitize manual workshop inventory management processes
- Streamline the assembly workflow with component-level tracking
- Provide real-time stock visibility for individual motorcycle shock components
- Enable quality grading and traceability of assembled products
- Track worker productivity and production output

### 2.2 Success Metrics
- Reduction in manual inventory errors by 90%
- Decrease in time-to-assemble by 25%
- Real-time stock accuracy maintained at 99%+
- User adoption rate of 80% within first month of deployment

---

## 3. Stakeholders

| Role | Description | Responsibilities |
|------|-------------|----------------|
| Workshop Manager | Primary system administrator | Manages parts catalog, stock entries, user accounts |
| Technician/Mechanic | Assembly line worker | Creates assembly tickets, views parts catalog |
| Admin | System owner | Full access, can delete/modify all records |
| Vendor | Supplier/partner | Can view stock, create entries, update assemblies |

---

## 4. Business Workflows & Functional Requirements

### 4.1 Bulk Parts Stocking (Inward Inventory)

**User Story:** As a Workshop Manager, I want to log incoming bulk parts shipments so that inventory levels are automatically updated.

| Step | Action | System Response |
|------|--------|-----------------|
| 1 | Manager navigates to Stock Entry page | Form loads with empty item list |
| 2 | Enter supplier details and invoice reference | Fields validated for required input |
| 3 | Add parts to the shipment | Each part requires SKU selection and quantity |
| 4 | Specify unit cost for each part | Total cost calculated automatically |
| 5 | Submit the entry | Stock levels for each part increment, entry saved |

### 4.2 Component Quality Grading

Parts are classified into four grades for pricing and quality tracking:

| Grade | Label | Description | Use Case |
|-------|-------|-------------|----------|
| Grade A | Premium / Kabli | Top-tier, highly durable imported or OEM parts | High-end motorcycles, warranty work |
| Grade B | Standard / Regular | High-quality, reliable parts for daily passenger use | Standard commuter bikes |
| Grade C | Second-Hand / Restored | Serviced, repaired, or original used parts | Budget builds, restoration projects |
| Grade D | Budget / Local | Economical, generic local components | Entry-level repairs, cost-sensitive customers |

### 4.3 Jump Assembly & Workers Logging

**User Story:** As a Technician, I want to create an assembly ticket with selected parts and quality grades so that completed jumps are tracked against my name.

| Step | Action | System Response |
|------|--------|-----------------|
| 1 | Technician opens "New Assembly Ticket" from POS | Empty basket created |
| 2 | Select bike category (70cc, 125cc, 150cc, Other) | Category saved to ticket |
| 3 | Add parts from catalog to ticket | Part added with grade selector |
| 4 | Assign quality grade to each part | Price adjusts based on grade |
| 5 | Select worker name from dropdown | Worker assigned to ticket |
| 6 | Submit ticket | Stock decremented, ticket saved as "Pending" |

### 4.4 Displacement Categories

| Category | Description | Typical Use |
|----------|-------------|-------------|
| 70cc | Lightweight, commuter-oriented suspensions | Small motorcycles, scooters |
| 125cc | Standard daily commuter shock systems | Most common street bikes |
| 150cc | Heavy-duty or sporty suspension models | Performance-oriented motorcycles |
| Other | Custom, off-road, or generic custom setups | Specialized applications |

---

## 5. Design & User Experience (UX)

### 5.1 Visual Design
- **Minimalist Aesthetic:** Pure monochromatic design utilizing black, grays, and whites
- **Accent Color:** Green/teal used strictly to indicate success actions
- **Typography:** Clean, readable fonts optimized for workshop environments

### 5.2 Layout Structure
- **POS Interface:** Two-column layout
  - Left panel: Searchable grid of individual parts grouped by category
  - Right panel: "Assembly Ticket Basket" with total cost, weight, and worker selector

### 5.3 Theme Switching
- User can toggle between Dark Mode (premium black) and Light Mode (clean white)
- Theme preference persisted in localStorage
- Instant toggle without page reload via React context

---

## 6. User Stories

### 6.1 Authentication
- As a user, I want to register an account so that I can access the system
- As a user, I want to log in securely so that my session is protected
- As a user, I want to log out so that my session is cleared
- As a user, I want to view my profile so that I can verify my account details

### 6.2 Parts Management
- As a manager, I want to add parts to the catalog so that they are available for assembly
- As a user, I want to search parts by name/SKU so that I can find components quickly
- As a manager, I want to update part prices so that pricing stays current
- As a manager, I want to delete obsolete parts so that the catalog stays clean

### 6.3 Stock Management
- As a manager, I want to log bulk stock entries so that inventory stays accurate
- As a user, I want to view stock history so that I can track purchases
- As a user, I want to search stock entries by supplier so that I can find specific shipments

### 6.4 Assembly Management
- As a technician, I want to create assembly tickets so that I can track my work
- As a user, I want to view all assemblies so that I can track production
- As a manager, I want to mark assemblies as "Ready" so that they can be sold/installed

---

## 7. Success Criteria

| Requirement | Acceptance Criteria | Priority |
|-------------|---------------------|----------|
| User Authentication | Registration, login, logout, profile all functional | High |
| Parts CRUD | Create, read, update, delete parts in catalog | High |
| Stock Entry | Bulk stock entries update inventory correctly | High |
| Assembly Workflow | POS interface creates and saves assemblies | High |
| Quality Grading | Four grades supported and priced correctly | Medium |
| Worker Tracking | Assemblies linked to workers for reporting | Medium |
| Dark/Light Theme | Theme toggle works without reload | Low |

---

## 8. Out of Scope

- Customer-facing portal or e-commerce features
- Financial reporting beyond stock cost tracking
- Multi-location inventory synchronization
- Mobile app (responsive web only)
- Barcode scanning (future enhancement)