# AssetFlow ERP 🚀

**Live Demo:** [https://odoo-hackathon-2026-gsbi.onrender.com/](https://odoo-hackathon-2026-gsbi.onrender.com/)  
**Admin Credentials:** `admin@assetflow.com` / `admin123`

![Dashboard](assets/Screenshot%20(268).png)
*A comprehensive dashboard showing real-time statistics, active allocations, pending transfers, and maintenance alerts.*

AssetFlow is a modern, high-performance Enterprise Resource Planning (ERP) system focused on organizational asset management, tracking, resource booking, and maintenance. Built for scalability and security, AssetFlow ensures that every asset in your organization—from laptops to vehicles—is strictly accounted for through its entire lifecycle.

---

# 📚 Table of Contents

- [🚀 Introduction](#-introduction)
- [🌍 Overall Vision](#-overall-vision)
- [🎯 Mission](#-mission)
- [⚠️ Problem Statement](#-problem-statement)
- [💡 Solution Overview](#-solution-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🧩 Project Modules](#-project-modules)
- [👥 User Roles & Permissions](#-user-roles--permissions)
- [🔄 Complete Workflow](#-complete-workflow)
- [📂 Project Structure](#-project-structure)
- [🗄️ Database Design](#️-database-design)
- [⚙️ Tech Stack](#️-tech-stack)
- [🛠️ System Design](#️-system-design)
- [🔐 Security Features](#-security-features)
- [📡 API Documentation](#-api-documentation)
- [🧠 Business Rules](#-business-rules)
- [🔄 Asset Lifecycle](#-asset-lifecycle)
- [🔄 Approval Workflows](#-approval-workflows)
- [📊 Dashboard & Analytics](#-dashboard--analytics)
- [🔔 Notification System](#-notification-system)
- [📈 Reports](#-reports)
- [🧪 Testing Strategy](#-testing-strategy)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🚀 Installation Guide](#-installation-guide)
- [⚙️ Environment Variables](#️-environment-variables)
- [🐳 Docker Setup](#-docker-setup)
- [▶️ Running the Application](#️-running-the-application)
- [📱 Screenshots](#-screenshots)
- [🎥 Demo Video](#-demo-video)
- [🌐 Live Demo](#-live-demo)
- [📖 API Reference](#-api-reference)
- [📌 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Team Members](#-team-members)
- [🏆 Achievements](#-achievements)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🚀 Introduction
AssetFlow bridges the gap between IT, HR, and Operations by providing a centralized source of truth for all corporate assets. Whether it's tracking custody, scheduling repairs, or calculating depreciation, AssetFlow automates the heavy lifting.

## 🌍 Overall Vision
The vision for AssetFlow is to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources through a centralized ERP platform. This is not tied to any single industry; any organization with equipment, furniture, vehicles, or shared spaces (offices, schools, hospitals, factories, agencies) can use it. 
The platform aims to reduce manual tracking inefficiencies (spreadsheets, paper logs) by enabling structured asset lifecycles, centralized resource booking, and real-time visibility into who holds what, where it is, and its condition. 

## 🎯 Mission
The mission for the hackathon team is to build a user-centric, responsive application that simplifies asset and resource management for any organization. The platform provides staff with intuitive tools to: 
- Set up departments, asset categories, and the employee directory 
- Register and track assets through their full lifecycle 
- Allocate assets to employees/departments with conflict handling 
- Book shared resources (rooms, vehicles, equipment) without overlaps 
- Run a structured maintenance approval workflow 
- Run structured audit cycles to catch discrepancies 
- Get notified of overdue returns, bookings, and maintenance events 

## ⚠️ Problem Statement
Design and develop an Enterprise Asset & Resource Management System where organizations can: 
- Maintain departments, asset categories, and an employee directory.
- Track assets through a flexible lifecycle (including states: *Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed*).
- Allocate assets to employees/departments, with the system preventing double-allocation of a single asset.
- Book shared/limited resources by time slot, with overlap validation.
- Route maintenance requests through an approval workflow before repair work starts.
- Run scheduled audit cycles with assigned auditors and auto-generated discrepancy reports.
- Surface overdue returns, bookings, and maintenance activity through notifications and a KPI dashboard.

## 💡 Solution Overview
AssetFlow introduces a strict, Role-Based Access Control (RBAC) architecture that maps real-world corporate hierarchy into a digital workflow. It ensures that only authorized personnel can procure, allocate, or dispose of assets, while empowering employees to independently request resources and report maintenance issues.

---

## ✨ Key Features & Modules

### 1. Login / Signup Screen
- **Purpose:** Authenticate users with realistic, non-self-elevating account creation.
- **Functionality:** 
  - Signup creates an Employee account only (no role selection at signup).
  - Admins create/promote Department Heads and Asset Managers from the Employee Directory.
  - Email & password login, forgot password, session validation.

### 2. Dashboard / Home Screen
- **Purpose:** Give every role a real-time operational snapshot.
- **Functionality:**
  - KPI cards: Assets Available, Assets Allocated, Maintenance Today, Active Bookings, Pending Transfers, Upcoming Returns.
  - Overdue returns (past Expected Return Date) highlighted separately from upcoming ones.
  - Quick actions: Register Asset, Book Resource, Raise Maintenance Request.

### 3. Organization Setup Screen (Admin only — 3 tabs)
- **Purpose:** Maintain the master data everything else depends on.
- **Tab A - Department Management:** Create/edit/deactivate department. Assign Department Head, optional Parent Department (for hierarchy), Status (Active/Inactive).
- **Tab B - Asset Category Management:** Create/edit categories (Electronics, Furniture, Vehicles, etc.). Optional category-specific fields (e.g. warranty period for Electronics).
- **Tab C - Employee Directory:** Name, Email, Department, Role, Status (Active/Inactive). Admin promotes an Employee to Department Head or Asset Manager here (this is the only place roles are assigned).

### 4. Asset Registration & Directory Screen
- **Purpose:** Register assets and search/track them centrally.
- **Functionality:**
  - Register: Name, Category, auto-generated Asset Tag (e.g. AF-0001), Serial Number, Acquisition Date, Acquisition Cost (kept for ranking/reports only, not linked to accounting), Condition, Location, photo/documents, "shared/bookable" flag.
  - Search/filter by Asset Tag, Serial Number, QR code, category, status, department, or location.
  - Lifecycle status shown per asset: Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed.
  - Per-asset history: allocation history + maintenance history.

![Assets Management](assets/Screenshot%20(269).png)
*The Asset Management ledger where you can view, search, and filter hardware across the entire organization.*

### 5. Asset Allocation & Transfer Screen
- **Purpose:** Manage who holds what, with explicit conflict rules.
- **Functionality:**
  - Allocate asset to employee/department with optional Expected Return Date.
  - **Conflict rule:** You can't allocate an asset that's already taken. Example: Priya has Laptop AF-0114. If Raj tries to allocate it too, the system blocks it, shows him 'currently held by Priya,' and offers a Transfer Request button instead.
  - **Transfer workflow:** Requested → Approved (by Asset Manager/Department Head) → Re-allocated (history updated automatically).
  - **Return flow:** mark returned, capture condition check-in notes, asset status reverts to Available.
  - Overdue allocations (past Expected Return Date) are auto-flagged and feed the Dashboard + Notifications.

![Allocations](assets/Screenshot%20(270).png)
*The Asset Allocation workflow streamlines the process of assigning laptops and devices to specific employees.*

### 6. Resource Booking Screen
- **Purpose:** Time-slot booking of shared resources with no overlaps.
- **Functionality:**
  - Calendar view of a resource's existing bookings.
  - **Overlap validation:** Two people can't book the same room at overlapping times. Example: Room B2 is booked 9:00–10:00. A request for 9:30–10:30 gets rejected since it overlaps; a request for 10:00–11:00 is fine since it starts right after.
  - Booking status: Upcoming, Ongoing, Completed, Cancelled.
  - Cancel/reschedule; reminder notification before the slot starts.

![Resource Booking](assets/Screenshot%20(271).png)
*An intuitive interface for reserving shared resources like meeting rooms and projectors.*

### 7. Maintenance Management Screen
- **Purpose:** Route repairs through approval before work starts.
- **Functionality:**
  - Raise request: select asset, describe issue, set priority, attach photo.
  - Workflow: Pending → Approved / Rejected (by Asset Manager) → Technician Assigned → In Progress → Resolved.
  - Asset status auto-updates to Under Maintenance on approval and back to Available on resolution.
  - Maintenance history retained per asset.

### 8. Asset Audit Screen
- **Purpose:** Run structured verification cycles instead of a single form.
- **Functionality:**
  - Create an Audit Cycle (scope: department/location, date range).
  - Assign one or more auditors to the cycle.
  - Auditor marks each asset: Verified / Missing / Damaged.
  - System auto-generates a discrepancy report for flagged items.
  - Close Audit Cycle — locks the cycle and updates affected asset statuses (e.g. Lost for confirmed-missing items).
  - Audit history retained per cycle.

### 9. Reports & Analytics Screen
- **Purpose:** Give managers actionable operational insight.
- **Functionality:**
  - Asset utilization trends; most-used vs. idle assets.
  - Maintenance frequency by asset/category.
  - Assets due for maintenance or nearing retirement.
  - Department-wise allocation summary.
  - Resource booking heatmap (peak usage windows).
  - Exportable reports.

![Reports & Analytics](assets/Screenshot%20(272).png)
*Detailed analytics dashboards for Administrators to monitor utilization rates and lifecycle statuses.*

### 10. Activity Logs & Notifications Screen
- **Purpose:** Keep every role informed without digging for updates.
- **Functionality:**
  - Notification examples: Asset Assigned, Maintenance Approved/Rejected, Booking Confirmed/Cancelled/Reminder, Transfer Approved, Overdue Return Alert, Audit Discrepancy Flagged.
  - Full audit log of admin/manager/employee actions (who did what, when).

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% Client Tier
    subgraph Client ["Client (Frontend)"]
        UI["UI Components (React, Tailwind, Shadcn)"]
        Router["Client Routing (TanStack Router)"]
        State["Data Fetching & State (TanStack Query)"]
        
        UI --> Router
        Router --> State
    end

    %% Network
    State --> |RPC Calls via HTTP| API

    %% Server Tier
    subgraph Backend ["Server (Backend)"]
        API["TanStack Server Functions (API)"]
        Middleware["Auth & RBAC Middleware"]
        Services["Business Logic Services"]
        
        API --> Middleware
        Middleware --> Services
        
        subgraph Modules ["Core Modules"]
            Auth["Authentication"]
            Assets["Asset Management"]
            Alloc["Allocation & Booking"]
            Maint["Maintenance & Audit"]
        end
        Services --> Modules
    end

    %% Database Tier
    subgraph DB ["Database Tier"]
        ORM["Prisma ORM"]
        Postgres[(PostgreSQL)]
        
        ORM --> Postgres
    end

    Modules --> ORM

    %% Deployment
    subgraph Infra ["Deployment / Hosting"]
        Nitro["Nitro Server Engine"]
    end
    
    Backend -.-> |Runs on| Nitro
```

The system utilizes a modern full-stack TypeScript architecture. It leverages **TanStack Start** for isomorphic routing and Server Functions, compiled and optimized by **Nitro** to run efficiently in any Node.js or Serverless environment.

## 🎨 UI Mockup (POC)
The original Proof of Concept (POC) mockup driving this architectural vision can be found here: [Excalidraw Mockup (POC)](https://app.excalidraw.com/l/65VNwvy7c4X/5ceOBMjbDby)

---

## 👥 User Roles & Permissions
AssetFlow operates on 4 distinct roles, each mapped to specific permissions:
1.  **ADMIN:** Unrestricted access. Can manage organization structures, view all reports, and promote users.
2.  **ASSET MANAGER:** Responsible for the physical inventory. Can register assets, approve transfers, and resolve audits.
3.  **DEPARTMENT HEAD:** Scoped view. Can view only their department's assets and approve allocations within their team.
4.  **EMPLOYEE:** End-user view. Can view assigned assets, book shared resources, and request maintenance.

---

## 🔄 Complete Workflow
1.  **Initialization:** Admin sets up departments and categories.
2.  **Procurement:** Asset Manager registers new hardware into the system.
3.  **Deployment:** Hardware is allocated to a specific Employee.
4.  **Operation:** Employee uses the asset. If broken, they raise a Maintenance request.
5.  **Audit:** Annually, an Audit is created to verify the asset's existence.
6.  **Retirement:** The asset reaches end-of-life and is marked as Disposed.

---

## 📂 Project Structure
```text
├── prisma/             # Database schema and migrations
├── public/             # Static assets (images, icons)
├── src/
│   ├── components/     # Reusable UI components (Tailwind + Shadcn)
│   ├── lib/            # Utility functions and auth contexts
│   ├── routes/         # TanStack file-based routing
│   ├── server/         # Backend services and DB controllers
│   ├── server-functions.ts # API Endpoints (RPC)
│   └── main.tsx        # Application entry point
├── vite.config.ts      # Build configuration (Nitro setup)
└── package.json        # Dependencies and scripts
```

---

## 🗄️ Database Design

### Database Schema
Built using **Prisma ORM**, the schema is heavily normalized to ensure data integrity.

### Relationships
*   `User` belongs to `Department` (1:N)
*   `Asset` belongs to `AssetCategory` (1:N)
*   `Asset` has many `Allocation` history records (1:N)
*   `MaintenanceRequest` is linked to an `Asset` and reported by a `User`

---

## ⚙️ Tech Stack
*   **Frontend:** React 19, TailwindCSS, Shadcn UI, Lucide Icons, Recharts.
*   **Routing & Data:** TanStack Router, TanStack Query, TanStack Start.
*   **Backend:** Node.js, Nitro (Server bundler), Prisma ORM.
*   **Database:** PostgreSQL.
*   **Styling:** PostCSS, Tailwind Merge.

---

## 🛠️ System Design

### Frontend Architecture
Uses a Single Page Application (SPA) feel with Server-Side Rendering (SSR) capabilities. State is managed via TanStack Router's loader functions, ensuring data is fetched before the UI renders.

### Backend Architecture
Adopts a Remote Procedure Call (RPC) style via TanStack Server Functions. This eliminates the need to write traditional REST boilerplate, allowing seamless type-sharing between client and server.

### Event Flow
UI Action -> TanStack Router invalidation -> Server Function -> Prisma Service -> Database -> UI Updates.

---

## 🔐 Security Features
*   **Middleware Protection:** Every server function validates the JWT token.
*   **Role Validation:** Secondary middleware enforces `hasPermission` checks before executing sensitive database mutations.
*   **Data Scoping:** SQL queries are dynamically scoped (e.g., Employees only see `where: { currentHolderId: user.id }`).
*   **Password Hashing:** Passwords are never stored in plaintext (Bcrypt).

---

## 📡 API Documentation
The system exposes standard endpoints that can be consumed by external applications. An auto-generated OpenAPI (Swagger) interface is available at `/api-docs` for authorized administrators.

---

## 🧠 Business Rules
*   An asset cannot be double-booked for the same time slot.
*   An employee cannot transfer an asset they do not currently hold.
*   Only empty departments can be deleted (Referential Integrity).

---

## 🔄 Asset Lifecycle
`AVAILABLE` -> `ALLOCATED` -> (Optional: `UNDER_MAINTENANCE`) -> `AVAILABLE` -> `RETIRED` -> `DISPOSED`

---

## 🚀 Installation Guide

### Prerequisites
*   Node.js (v20+)
*   PostgreSQL database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/assetflow.git
   cd assetflow
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

---

## ⚙️ Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/assetflow?schema=public"
JWT_SECRET="your_super_secret_key_here"
```

---

## 🐳 Docker Setup
*(Optional: If you wish to containerize the application)*
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## ▶️ Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm run start
```
*Note: The production build uses advanced Nitro optimizations and disables chunk splitting for maximum stability on constrained environments like Render.*

---

## 📱 Screenshots

**Asset Details View:**


---

## 🎥 Demo Video
[Insert Link to YouTube/Loom Demo Video Here]

---

## 🌐 Live Demo
The application is deployed live at: **[Insert Production URL Here]**

---

## 📌 Future Enhancements
*   Mobile Application (React Native) for barcode/QR code scanning.
*   Integration with Active Directory / LDAP for SSO.
*   Automated depreciation calculation using straight-line and MACRS methods.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 👨‍💻 Team
Built with ❤️ by **Team SPectra**.

---

## 🏆 Achievements
*   Built entirely during the Odoo Hackathon 2026.
*   Successfully implemented a highly-complex RPC backend using bleeding-edge TanStack Start technologies.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements
*   [TanStack](https://tanstack.com/) for their incredible ecosystem.
*   [Prisma](https://www.prisma.io/) for simplifying database workflows.
*   [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library.
*   [Lovable](https://lovable.dev) for AI-assisted scaffolding and development.
