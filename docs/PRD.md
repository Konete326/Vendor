# Product Requirement Document (PRD)

## Project Name: Bike Jumps Management System

---

## 1. Executive Summary & Project Vision
The Bike Jumps Management System is a specialized tool designed for bike repair shops, manufacturers, and enthusiasts to manage, catalog, and track individual components of bicycle shock/jump systems (suspensions, forks, rear shocks, linkages, and jump metrics). 

Rather than treating a bike suspension or jump assembly as a single entity, this system handles them like a **POS (Point of Sale)** inventory system, allowing users to add, customize, and stack different components (valves, springs, damper cartridges, seals, oils, etc.) that make up a complete jump shock setup.

---

## 2. Goals & Objectives
- **Granular Component Tracking**: Break down bike jump systems into individual sub-parts.
- **POS-Like Interface**: A fast, interactive scanner-like or select-to-add interface to build jump systems out of individual parts.
- **Unified Inventory**: Keep track of parts availability, part numbers, and custom tuning attributes.
- **Premium User Experience**: Clean, modern, decent black-and-white aesthetic with seamless toggle between dark and light themes.

---

## 3. Core Features & User Stories

### 3.1 User Authentication
* **Story**: As a workshop owner, I want to log in securely so that I can manage my inventory safely.
* **Scope**: Register, Login, HTTP-only cookie JWT auth, profile management.

### 3.2 POS Component Registry (The Parts Builder)
* **Story**: As a technician, I want to quickly add individual components (damper, coil, seals) to a custom jump assembly using a POS-style selector.
* **Scope**:
  - Searchable list of items/parts (by brand, type, size).
  - Quick action buttons to add parts to a active "Jump Assembly Ticket".
  - Ability to adjust quantities, see total weight, cost, and compatibility status.

### 3.3 Bike & Jump Assemblies Management
* **Story**: As a rider/technician, I want to associate a completed jump configuration with a specific bicycle model.
* **Scope**:
  - CRUD operations for Bikes.
  - Linking multiple jump assemblies to a bike profile.
  - Adding performance tune metrics (Rebound speed, compression settings, rider weight).

### 3.4 Theme Toggle
* **Story**: As a user, I want a toggle to change between a premium dark mode and a clean light mode.
* **Scope**: Black-and-white theme toggler utilizing Tailwind CSS class styling.

### 3.5 Bike Displacement Categories
* **Story**: As a workshop owner, I want to filter and categorize assemblies according to the engine displacement capacity of the bikes (e.g., 70cc, 125cc, 150cc) so that the correct setups are paired.
* **Scope**: Support classification tags/filters for common displacements (70cc, 125cc, 150cc, and custom CC).

### 3.6 Component Quality Grades
* **Story**: As a quality controller, I want to track 4 distinct quality grades of individual jump parts (e.g., Grade A/B/C/D) within the same assembly, as parts vary when ordered in bulk.
* **Scope**: Record quality grade selections on the POS interface for each part selected.

### 3.7 Worker Production Logs
* **Story**: As a manager, I want to log which worker assembled a particular jump setup and track the count of completed ready assemblies.
* **Scope**: Association of assemblies with worker profiles; list tracking of completed status.

---

## 4. Design & UX Guidelines
- **Color Scheme**: Mono-chromatic / minimal (pure blacks, high-contrast grays, and whites). Minimalist accents like teal or bright green only for successes/actions.
- **Animations**: Soft hover scales, smooth transitions on theme toggle, and elegant slide-in drawers for the POS side-panel.
- **Layout**: Split-screen dashboard for the POS view (Left: Parts Catalog; Right: Assembly Checkout/Ticket).
