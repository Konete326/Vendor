# Product Requirement Document (PRD)

## Project Name: Bike Jumps Management System

---

## 1. Executive Summary & Project Vision
The Bike Jumps Management System is a specialized business management application designed for motorcycle workshops, retailers, and mechanics. It enables tracking, stocking, and assembling individual components that constitute motorcycle suspension and shock absorber systems (commonly called "jumps").

Instead of viewing a suspension shock as a single, bulk product, the system tracks the distinct components (valves, dampers, coils, seals, etc.) that go into building them. The system functions like a Point of Sale (POS) inventory builder, letting users add components to a build list, specify component quality grades, assign an assembly worker, log completed builds, and manage inventory levels.

---

## 2. Business Workflows & Functional Requirements

### 2.1 Bulk Parts Stocking (Inward Inventory)
- **Concept**: Parts are purchased in bulk from suppliers and received as individual components.
- **Workflow**:
  - The manager creates a bulk stock entry record.
  - Registers the supplier, total shipment cost, item names, and bulk quantities.
  - On submission, the stock levels for those individual components increment automatically in the database.

### 2.2 Component Quality Grading
When building or stocking parts, mechanics need to select the grade of each component. Parts are classified into four easy-to-understand qualities:
1. **Grade A (Premium / Kabli)**: Top-tier, highly durable imported or OEM parts.
2. **Grade B (Standard / Regular)**: High-quality, reliable parts for daily passenger use.
3. **Grade C (Second-Hand / Restored)**: Serviced, repaired, or original used parts.
4. **Grade D (Budget / Local)**: Economical, generic local components.

### 2.3 Jump Assembly & Workers Logging
- **Concept**: Workers in the shop assemble jumps by combining different graded components.
- **Workflow**:
  - The technician starts a "New Jump Assembly Ticket" on the POS screen.
  - Selects the target bike category (e.g., 70cc, 125cc, 150cc).
  - Selects the parts to be used and assigns a quality grade to each part.
  - Selects the name of the worker who assembled the jump (simplified profile tracking just by Name).
  - Once completed, the jump is marked as "Ready" for sale or installation.
  - The system logs the completed jump count against that worker for performance tracking.
  - Staged part inventories are automatically decremented.

### 2.4 Displacement Categories
Jumps are built differently depending on the motorcycle's engine capacity. The system organizes bikes and jump assemblies into specific displacement categories:
- **70cc**: Lightweight, commuter-oriented suspensions.
- **125cc**: Standard daily commuter shock systems.
- **150cc**: Heavy-duty or sporty suspension models.
- **Other**: Custom, off-road, or generic custom setups.

### 2.5 Theme Switching
- User can toggle between a high-contrast premium black theme (Dark Mode) and a clean white theme (Light Mode) for ease of view in dark mechanic garages or bright storefronts.

---

## 3. Design & User Experience (UX)
- **Minimalist Aesthetic**: Pure monochromatic design utilizing black, grays, and whites. Green/teal is used strictly to indicate success actions (like a completed assembly checkout).
- **POS Interface**: Two-column layout:
  - Left panel: Searchable grid of individual parts (grouped by spring, damper, seals) with quality selector dropdowns.
  - Right panel: "Assembly Ticket Basket" displaying total cost, weight, and worker selector.
