# Implementation Plan: DRONET Courier Service Web Application

## 1. Project Overview & Objective

**DRONET** is a full-featured, enterprise-grade courier and logistics web application built with **Next.js (App Router)** and **React 19**. The platform facilitates end-to-end parcel delivery operations across Bangladesh (Dhaka and inter-district routes like Chattogram, Sylhet, Barishal, Rajshahi, and Cumilla).

The application caters to three distinct user groups alongside public customers:
1. **Customer**: Book shipments, calculate delivery prices in real-time, pay via online gateways (bKash, Stripe, SSLCommerz), and track parcels in real time.
2. **Provider (Courier Company / Operations)**: Live dispatch control, assigning couriers to parcels, managing delivery fleet (riders/couriers, vehicle types, zones, status), and tracking payment settlements.
3. **Admin**: Platform governance, user moderation (suspend/reactivate accounts), system-wide shipment oversight, and financial reconciliation.
4. **Public Visitor**: Quick parcel tracking by tracking number (e.g. `DRN-8841`), rate calculator, and service overview.

---

## 2. Core Architectural Pillars

- **Next.js App Router**: Hybrid rendering model with React 19 Server Components for layout structure and SEO-optimized public routes, and Client Components for interactive dashboard modules.
- **TanStack Ecosystem (TanStack Query v5 + TanStack Form)**:
  - TanStack Query v5 for declarative server state management, caching, background polling, and optimistic updates.
  - TanStack Form paired with **Zod v4** for type-safe form state and schema validation (e.g., booking shipments, adding couriers).
- **Responsive UI & Modern Aesthetics**:
  - Dark-mode-first aesthetic inspired by the project UI mockups (dark graphite `#0b0f19` and `#0f172a` canvas with subtle grid lines, vibrant emerald/mint green accents `#10b981`, and status-specific badges).
  - Fully mobile-responsive layout featuring collapsible sidebar drawers (`Sheet`), touch-friendly targets, and adaptive table-to-card transformations for mobile viewports.
- **Skeleton Loading & Preview State Management**:
  - Declarative data fetching utilizing React `Suspense` and TanStack Query `useSuspenseQuery`.
  - Bespoke Skeleton loaders (`DoctorApprovalTableLoading` pattern from `nextjs-part7`) replicating exact table and card geometries to eliminate Layout Shifts (CLS).
  - Interactive Preview State Switcher (`[Data | Loading | Empty | Error]`) for UI QA and seamless testing as seen in the mockup specifications.
- **Robust Authentication & Authorization (RBAC)**:
  - Dual-tier protection: Next.js Edge Middleware for early routing redirects and client-side `<AuthGuard>` + `<RoleGuard>` wrappers.
  - Role hierarchy: `CUSTOMER`, `PROVIDER`, `ADMIN`, `SUPER_ADMIN`.
  - Secure credential & OAuth flows: Email/password, OTP verification, Google OAuth (`@react-oauth/google`), and HTTP-only cookie session handling.

---

## 3. Technology Stack & Library Evaluation

### Existing Core Dependencies (from `package.json`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | `16.3.4` | App Router framework, SSR/SSG, edge routing |
| `react` / `react-dom` | `19.2.8` | UI foundation with React 19 Actions & Suspense |
| `@tanstack/react-query` | `^5.102.8` | Server state caching, `useSuspenseQuery`, mutations |
| `@tanstack/react-form` | `^1.33.5` | Controlled, high-performance form state |
| `ofetch` | `^1.5.1` | Lightweight, interceptor-friendly HTTP client |
| `zod` | `^4.5.4` | Schema validation for forms and API contracts |
| `@base-ui/react` & `shadcn` | Latest | Accessible, unstyled UI primitives |
| `tailwindcss` / PostCSS | `^4` | Tailwind CSS v4 engine |
| `tw-animate-css` | `^1.4.0` | CSS utility animations |
| `lucide-react` | `^1.42.0` | Iconography |
| `date-fns` & `react-day-picker` | `^4.4.0` / `^10.0.1` | Date parsing, formatting, calendar pickers |
| `input-otp` | `^1.5.0` | Multi-digit OTP verification inputs |
| `@react-oauth/google` | `^0.13.5` | Google Identity Services OAuth integration |
| `@biomejs/biome` | `2.4.2` | Fast formatting and linting |

### Recommended Additional Libraries
To deliver the complete courier service experience depicted in the requirements and mockups, the following complementary packages are recommended:

1. **`sonner`**:
   - *Reason*: Lightweight, sleek toast notifications for asynchronous mutation feedback (e.g., "Shipment Created Successfully", "Courier Assigned", "Account Suspended").
2. **`nuqs` (Type-safe search params)**:
   - *Reason*: Syncing table pagination, tab selections (`All`, `Customer`, `Provider`, `Admin`), status filters, and search queries with URL query params for shareable and bookmarkable dashboard states.
3. **`recharts`**:
   - *Reason*: Visualizing 30-day shipment volume trends, delivery success rates, and revenue distribution on the Provider and Admin consoles.
4. **`qrcode.react` & `react-barcode`**:
   - *Reason*: Generating printable parcel labels, barcode tracking tags (`DRN-8841`), and digital drop-off passes.
5. **`canvas-confetti`**:
   - *Reason*: Micro-interaction feedback upon successful shipment creation and payment confirmation.
6. **`leaflet` & `react-leaflet`** *(Optional / Phase 6)*:
   - *Reason*: Interactive map view for tracking parcel routes across Bangladesh hubs.

---

## 4. Architectural Pattern: Lessons from `PH-Healthcare-Nextjs-part-7`

We will follow the established architectural conventions from [PH-Healthcare-Nextjs-part-7](file:///e:/courier-service-nextjs/PH-Healthcare-Nextjs-part-7):

```
PH-Healthcare Architectural Blueprint:
├── src/lib/apiClient.ts           --> Centralized ofetch instance with credentials: 'include'
├── src/api/*.api.ts               --> Pure API fetchers grouped by resource
├── src/hooks/*.hook.ts            --> TanStack Query & Mutation hooks wrapping API functions
├── src/routes/*.routes.ts         --> Navigation manifests per role (Admin, Provider, Customer)
├── src/providers/                 --> Composed React context providers (Query, Auth, UI)
├── src/components/auth/           --> AuthGuard, RoleGuard, AccessDenied, AuthLoading
├── src/components/dashboard/      --> DashboardShell, DashboardSidebar, Role switcher
├── src/components/modules/        --> Domain-specific modules with Suspense and Skeletons
└── src/app/(dashboard)/layout.tsx --> AuthGuard wrapper for all authenticated segments
```

### Applied to Courier Service:
- **`src/lib/apiClient.ts`**: Standardized HTTP client handling `NEXT_PUBLIC_API_BASE_URL`, token injection, automatic refresh handling, and error response normalizations.
- **Decoupled API & Query Hooks**:
  - `src/api/auth.api.ts` $\rightarrow$ `src/hooks/auth.hook.ts` (`useLogin`, `useGetMe`, `useRegistration`)
  - `src/api/shipment.api.ts` $\rightarrow$ `src/hooks/shipment.hook.ts` (`useSuspenseGetShipments`, `useCreateShipment`, `useUpdateShipmentStatus`)
  - `src/api/courier.api.ts` $\rightarrow$ `src/hooks/courier.hook.ts` (`useSuspenseGetCouriers`, `useAssignCourier`, `useAddCourier`)
  - `src/api/payment.api.ts` $\rightarrow$ `src/hooks/payment.hook.ts` (`useSuspenseGetPayments`, `useInitiatePayment`)
- **Declarative Route Guards**:
  - `(dashboard)/layout.tsx`: Enforces authentication via `<AuthGuard>`.
  - `(dashboard)/customer/layout.tsx`: Enforces `roles={["CUSTOMER"]}`.
  - `(dashboard)/provider/layout.tsx`: Enforces `roles={["PROVIDER"]}`.
  - `(dashboard)/admin/layout.tsx`: Enforces `roles={["ADMIN", "SUPER_ADMIN"]}`.

---

## 5. Directory & File Structure Plan

```text
src/
├── api/
│   ├── index.ts
│   ├── auth.api.ts                 # Login, register, verify-otp, getMe, logout, googleAuth
│   ├── shipment.api.ts             # List, details, create, assign, update status, track
│   ├── courier.api.ts              # Fleet list, add courier, update availability/status
│   ├── payment.api.ts              # Payment transactions, payment intent creation, history
│   └── user.api.ts                 # Admin user management, suspend, reactivate
├── app/
│   ├── (public)/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx            # Landing page with instant tracking input & hero
│   │   │   └── track/[id]/page.tsx # Public tracking timeline view
│   │   └── (authentication)/
│   │       ├── login/page.tsx      # Sign in (Credentials + Google OAuth)
│   │       ├── register/page.tsx   # Register (Role selection: Customer vs Provider)
│   │       ├── verify/page.tsx     # OTP verification screen
│   │       └── layout.tsx          # Auth centered card layout
│   ├── (dashboard)/
│   │   ├── layout.tsx              # AuthGuard wrapper
│   │   ├── customer/
│   │   │   ├── layout.tsx          # RoleGuard: CUSTOMER + DashboardShell
│   │   │   ├── page.tsx            # Customer Dashboard (Stats + Recent Shipments)
│   │   │   ├── new/page.tsx        # Create Shipment Form + Live Price Calculator
│   │   │   └── shipments/page.tsx  # My Shipments List & Tracking Timeline
│   │   ├── provider/
│   │   │   ├── layout.tsx          # RoleGuard: PROVIDER + DashboardShell
│   │   │   ├── page.tsx            # Live Operations Control & Courier Workload
│   │   │   ├── shipments/page.tsx  # Dispatch Table (Assign Courier & Status Update)
│   │   │   ├── couriers/page.tsx   # Fleet Roster, Zones, Availability, Add Courier
│   │   │   └── payments/page.tsx   # Payment Transactions & Settlements
│   │   └── admin/
│   │       ├── layout.tsx          # RoleGuard: ADMIN, SUPER_ADMIN + DashboardShell
│   │       ├── page.tsx            # Platform Overview Metrics & Activity
│   │       ├── users/page.tsx      # Account Moderation (Search, Filter, Suspend/Reactivate)
│   │       ├── shipments/page.tsx  # Platform-wide Read-only Shipment Ledger
│   │       └── payments/page.tsx   # Financial Audit & Gateway Performance
│   ├── favicon.ico
│   ├── globals.css                 # Dark grid background, CSS variables, Tailwind tokens
│   └── layout.tsx                  # Root layout with Providers & Toaster
├── assets/
│   └── icons/ / svg/               # Dronet logo, vehicle icons, payment gateway badges
├── components/
│   ├── auth/
│   │   ├── access-denied.tsx       # 403 Forbidden display
│   │   ├── auth-guard.tsx          # Authentication gatekeeper
│   │   ├── auth-loading.tsx        # Loading spinner / brand animation
│   │   └── role-guard.tsx          # Role verification gatekeeper
│   ├── dashboard/
│   │   ├── dashboard-header.tsx    # Breadcrumb, search, notifications, user profile
│   │   ├── dashboard-shell.tsx     # Responsive layout frame with SidebarInset
│   │   ├── dashboard-sidebar.tsx   # Role-aware collapsible navigation sidebar
│   │   └── role-switcher.tsx       # Mockup demo role switcher (Customer/Provider/Admin)
│   ├── modules/
│   │   ├── customer/
│   │   │   ├── shipment-form.tsx           # Multi-step booking form
│   │   │   ├── price-summary-card.tsx      # Dynamic rate calculation card
│   │   │   ├── my-shipments-table.tsx      # Customer shipment table with Suspense
│   │   │   └── shipment-timeline-modal.tsx # Parcel journey stepper modal
│   │   ├── provider/
│   │   │   ├── dispatch-table.tsx          # Shipments table with Assign & Update triggers
│   │   │   ├── assign-courier-dialog.tsx   # Courier allocation popup
│   │   │   ├── status-update-dialog.tsx    # Shipment status transition dialog
│   │   │   ├── couriers-table.tsx          # Fleet table with vehicle, zone, active deliveries
│   │   │   └── add-courier-dialog.tsx      # Form to onboard a new courier rider
│   │   ├── admin/
│   │   │   ├── users-table.tsx             # User list with suspend/reactivate actions
│   │   │   ├── admin-shipments-table.tsx   # All shipments read-only table
│   │   │   └── admin-payments-table.tsx    # All payments audit table
│   │   └── shared/
│   │       ├── preview-state-controls.tsx  # Switcher for [Data | Loading | Empty | Error]
│   │       ├── stat-card.tsx               # Metric summary card with badge indicators
│   │       ├── status-badge.tsx            # Color-coded status pills
│   │       └── table-skeleton.tsx          # Reusable parameterized skeleton table
│   └── ui/                                 # Base UI & Shadcn primitives
│       ├── button.tsx, input.tsx, table.tsx, dialog.tsx, sheet.tsx, tabs.tsx,
│       ├── skeleton.tsx, badge.tsx, card.tsx, select.tsx, separator.tsx
├── hooks/
│   ├── index.ts
│   ├── auth.hook.ts
│   ├── shipment.hook.ts
│   ├── courier.hook.ts
│   ├── payment.hook.ts
│   ├── debounce.hook.ts
│   └── use-mobile.ts
├── lib/
│   ├── apiClient.ts                # Configured ofetch client
│   ├── pricing.ts                  # Tariff calculator (Inside/Outside Dhaka, weight, speed)
│   └── utils.ts                    # cn(), formatBDT(), formatDate()
├── middleware.ts                   # Edge authentication & path protection
├── providers/
│   ├── index.tsx                   # Aggregated provider wrapper
│   ├── query.provider.tsx          # QueryClient configuration
│   └── google-auth.provider.tsx    # Google OAuth provider
├── routes/
│   ├── index.ts
│   ├── customer.routes.ts
│   ├── provider.routes.ts
│   └── admin.routes.ts
├── types/
│   ├── index.ts
│   ├── auth.type.ts
│   ├── user.type.ts
│   ├── shipment.type.ts
│   ├── courier.type.ts
│   └── payment.type.ts
└── validation/
    ├── auth.validation.ts
    ├── shipment.validation.ts
    └── courier.validation.ts
```

---

## 6. Detailed Feature & Screen Breakdown

### A. Customer Portal
1. **Customer Dashboard (`/customer`)**:
   - **Metrics Bar**:
     - *Active Shipments*: Count with week-over-week trend.
     - *In Transit*: Parcels currently moving with today's arrival count.
     - *Delivered (30D)*: Completed deliveries with on-time percentage (e.g. 97%).
     - *Spent (30D)*: Total courier expenditure in Bangladeshi Taka (`৳ 6,840`).
   - **Recent Shipments Table**: Latest 5 shipments with Tracking ID, Route, Receiver, Courier, Payment Method, Charge, and Status Badge.
   - **Quick Action**: Prominent `+ New shipment` button redirecting to `/customer/new`.

2. **Create Shipment Wizard (`/customer/new`)**:
   - **Sender Details**: Full Name, Phone (Bangladeshi format), Pickup Address (Street, Area, City).
   - **Receiver Details**: Full Name, Phone, Delivery Address.
   - **Parcel Parameters**:
     - Category (Documents, Electronics, Clothing, Fragile, General).
     - Weight in KG (numeric input with dynamic step increments).
     - Delivery Zone: Toggle between `Inside Dhaka` vs `Outside Dhaka`.
     - Speed Selection: Toggle between `Standard` vs `Express`.
     - Special instructions note for the courier.
   - **Live Delivery Price Breakdown (Sticky Sidebar Card)**:
     - Base Fare (e.g. ৳ 60 Inside Dhaka / ৳ 120 Outside Dhaka).
     - Extra Weight Charge (e.g. ৳ 30/kg beyond initial 1kg).
     - Express Surcharge (e.g. ৳ 50).
     - Total: Live reactive sum (`৳ 150`).
     - Gateway acceptance note: *Online payment only · bKash, Stripe, SSLCommerz*.
     - Action button: `Continue to payment` $\rightarrow$ triggers payment modal / redirect.

3. **My Shipments (`/customer/shipments`)**:
   - Search bar filtering by Tracking ID, Receiver Name, or City.
   - Tab filters: `All`, `Active`, `Delivered`, `Issues`.
   - Preview State Switcher (`Data`, `Loading`, `Empty`, `Error`) for visual fidelity validation.
   - Clickable shipment row opens the **Tracking Timeline Drawer** displaying:
     - Step 1: Created $\rightarrow$ Step 2: Courier Assigned $\rightarrow$ Step 3: Picked Up $\rightarrow$ Step 4: In Transit $\rightarrow$ Step 5: Out for Delivery $\rightarrow$ Step 6: Delivered (with timestamps and location tags).

---

### B. Provider (Operations & Fleet) Portal
1. **Provider Dashboard (`/provider`)**:
   - **Operational KPIs**:
     - *Active Shipments*: Total volume currently in circulation (e.g. 128).
     - *Awaiting Courier*: High-priority unassigned queue (e.g. 9) with "Assign now" call-to-action.
     - *Out for Delivery*: Parcels with riders on the final mile (with delayed counter).
     - *Today's Revenue*: Total collection for the current day across payment gateways (`৳ 82,400`).
   - **Dispatch Snapshot Table**: Real-time incoming parcels.
   - **Couriers Workload Panel**: Live list of active couriers showing currently assigned load (e.g., Rakib Hasan: 6 active, Sadia Afrin: 4 active).

2. **Shipment Dispatch Management (`/provider/shipments`)**:
   - Search by ID, receiver, or destination hub.
   - Table displaying: Tracking ID, Route, Receiver, Assigned Courier, Payment Method, Charge, Status.
   - **Interactive Actions**:
     - `Assign` Button: Opens modal listing available on-duty couriers in the relevant zone; updates shipment state upon selection.
     - `Update` Button: Modal to advance the parcel state (`Picked Up` $\rightarrow$ `In Transit` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered` or mark as `Delivery Failed` / `Returned` with reason).

3. **Fleet / Couriers Management (`/provider/couriers`)**:
   - **Fleet Status Overview**: Available (Ready to assign), On Delivery (On the road), Off Duty (Not assignable).
   - **Add Courier Action**: `+ Add courier` button opening a modal to onboard new delivery personnel (Name, Phone, Zone, Vehicle type).
   - **Fleet Roster Table**:
     - ID (e.g. `C-101`), Name, Phone, Delivery Zone (Dhaka North, Dhaka South, Barishal, Khulna), Vehicle (Motorbike, Bicycle, Van), Active Deliveries, Lifetime Delivered count, Live Status toggle dropdown (`Available` / `On delivery` / `Off duty`).

4. **Provider Payments Reconciliation (`/provider/payments`)**:
   - Settlement cards: Collected amount, Processing transactions, Failed attempts, Cancelled transactions.
   - Filtering by Gateway (`All`, `bKash`, `Stripe`, `SSLCommerz`) and Status (`Successful`, `Processing`, `Failed`, `Cancelled`).
   - Transaction ledger with TXN number, associated Shipment DRN, Customer name, Amount, and Date.

---

### C. Admin Portal
1. **Admin Console Overview (`/admin`)**:
   - Macro KPIs: Total Users (with weekly growth), Providers (with pending reviews count), Total Shipments (30D), and Gross Platform Volume (`৳ 8.42L`).
   - Platform-wide latest shipments stream and real-time payment feed.

2. **User Moderation Console (`/admin/users`)**:
   - Tab filter by account role: `All`, `Customer`, `Provider`, `Admin`.
   - Search input by name or email.
   - User table: User ID, Name, Email, Role badge, Join date, Status badge (`Active` / `Suspended`).
   - Single-click action: `Suspend` (for active abusive accounts) or `Reactivate` (for suspended accounts) with optimistic cache updates.

3. **All Shipments (`/admin/shipments`)**:
   - Read-only audit log across all courier providers in the country.
   - Filter by status: `All`, `Active`, `Delivered`, `Issues`.

4. **All Payments (`/admin/payments`)**:
   - Financial transparency log tracking revenue collection across all gateways.

---

### D. Public & Authentication Portal
1. **Landing Page (`/`)**:
   - Modern dark hero section featuring **Track Your Parcel** input field:
     - User enters `DRN-8841` and immediately gets routed to `/track/DRN-8841` without needing to log in.
   - Live Rate Estimator calculator preview.
   - Service features: Express drone & ground courier network, cash-free digital payments.
2. **Authentication Pages (`/login`, `/register`, `/verify`)**:
   - Role-aware onboarding (Register as Customer or Courier Partner).
   - Social authentication with Google OAuth (`@react-oauth/google`).
   - OTP input screen via `input-otp` for verifying phone/email accounts.
   - Demo Role-Switching toolbar (as seen in mockups) to seamlessly test Customer, Provider, and Admin views during development and presentation.

---

## 7. Data Models & TypeScript Types

```typescript
// src/types/user.type.ts
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

// src/types/shipment.type.ts
export type ShipmentStatus =
  | "CREATED"
  | "PAYMENT_CONFIRMED"
  | "COURIER_ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNED";

export type DeliveryZone = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
export type DeliverySpeed = "STANDARD" | "EXPRESS";
export type PaymentMethod = "bKash" | "Stripe" | "SSLCommerz";

export interface Shipment {
  id: string;
  trackingId: string; // e.g. "DRN-8841"
  sender: {
    name: string;
    phone: string;
    address: string;
  };
  receiver: {
    name: string;
    phone: string;
    address: string;
  };
  route: string; // e.g. "Dhaka → Chattogram"
  parcelType: string;
  weightKg: number;
  zone: DeliveryZone;
  speed: DeliverySpeed;
  charge: number; // in BDT (৳)
  paymentMethod: PaymentMethod;
  paymentStatus: "SUCCESSFUL" | "PROCESSING" | "FAILED" | "CANCELLED";
  status: ShipmentStatus;
  courierId?: string;
  courierName?: string;
  notes?: string;
  timeline: {
    status: ShipmentStatus;
    timestamp: string;
    location: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// src/types/courier.type.ts
export type VehicleType = "Motorbike" | "Bicycle" | "Van";
export type CourierStatus = "Available" | "On delivery" | "Off duty";

export interface Courier {
  id: string; // e.g. "C-101"
  name: string;
  phone: string;
  zone: string; // e.g. "Dhaka North", "Dhaka South", "Barishal"
  vehicle: VehicleType;
  activeDeliveries: number;
  totalDelivered: number;
  status: CourierStatus;
}

// src/types/payment.type.ts
export interface PaymentTransaction {
  id: string;
  transactionId: string; // e.g. "TXN-50231"
  shipmentTrackingId: string;
  customerName: string;
  method: PaymentMethod;
  amount: number;
  status: "Successful" | "Processing" | "Failed" | "Cancelled";
  date: string;
}
```

---

## 8. Authentication & Authorization Implementation Architecture

### 1. Unified HTTP Client (`src/lib/apiClient.ts`)
```typescript
import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dronet.delivery/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include", // Transmit HTTP-only cookies
  onRequest({ options }) {
    // Optional Bearer token fallback if cookies are not utilized
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
  },
  onResponseError({ response }) {
    if (response.status === 401 && typeof window !== "undefined") {
      // Trigger redirect to login on unauthenticated responses
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
  },
});

export default apiClient;
```

### 2. Guard Strategy (Following `nextjs-part7`)
- **`AuthGuard` (`src/components/auth/auth-guard.tsx`)**:
  - Leverages `useGetMe()` hook from TanStack Query.
  - While `isPending`, renders `<AuthLoading />` with the DRONET pulsating logo.
  - If `isError` or user is null, securely redirects via `router.replace("/login")`.
  - When verified, renders the child tree.
- **`RoleGuard` (`src/components/auth/role-guard.tsx`)**:
  - Receives `roles: UserRole[]`.
  - Checks if `user.role` matches one of the allowed roles.
  - If unauthorized, renders `<AccessDenied />` (with a friendly message and a button to return to the user's appropriate portal).
- **Next.js Middleware (`src/middleware.ts`)**:
  - Decodes session cookie at edge runtime to prevent flash-of-unauthorized-content for protected routes (`/admin/*`, `/provider/*`, `/customer/*`).

---

## 9. Skeleton Loading, Suspense & State Preview Design

### Skeleton Strategy
To prevent cumulative layout shift and provide a buttery-smooth user experience:
1. **Granular Skeletons**:
   - `StatCardSkeleton`: Pulsing card matching the height and badge placeholders of dashboard metrics.
   - `TableSkeleton`: Configurable row and column counts simulating table headers, rows, badges, and action buttons.
   - `FormSkeleton`: Loading placeholders for multi-field shipment booking forms.
2. **React 19 Suspense Boundaries**:
   - All server queries use `useSuspenseQuery` wrapped inside `<Suspense fallback={<TableSkeleton columns={7} rows={6} />}>`.
   - Data changes (e.g. search term, tab filters, pagination) transition smoothly using React's `useTransition`.

### Interactive Preview State Switcher
As visible in the project screenshots (`PREVIEW STATE: [Data] [Loading] [Empty] [Error]`), every major data module will include an integrated state test controller:
- **`Data`**: Displays live queried or mocked server data.
- **`Loading`**: Forces the `<TableSkeleton />` display for design verification.
- **`Empty`**: Renders the empty state illustration (e.g., `<SearchX /> No shipments found`).
- **`Error`**: Renders the error boundary recovery widget with a retry button.

---

## 10. Pricing & Tariff Logic

Located in `src/lib/pricing.ts`:
```typescript
export interface CalculatePriceParams {
  zone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
  speed: "STANDARD" | "EXPRESS";
  weightKg: number;
}

export function calculateDeliveryPrice({
  zone,
  speed,
  weightKg,
}: CalculatePriceParams) {
  const basePrice = zone === "INSIDE_DHAKA" ? 60 : 120;
  const excessWeight = Math.max(0, weightKg - 1);
  const extraWeightCharge = Math.ceil(excessWeight) * 30; // ৳ 30 per extra kg
  const expressCharge = speed === "EXPRESS" ? 50 : 0;
  
  const total = basePrice + extraWeightCharge + expressCharge;

  return {
    basePrice,
    extraWeightCharge,
    expressCharge,
    total,
  };
}
```

---

## 11. Step-by-Step Implementation Roadmap

### Phase 1: Environment & Project Foundation
- [ ] Initialize the Next.js project with TypeScript, React 19, and Tailwind CSS v4.
- [ ] Configure `biome.json` for code quality, formatting, and linting.
- [ ] Configure `globals.css` with dark palette tokens (`background: #0b0f19`, `card: #111827`, `accent: #10b981`, grid backgrounds).
- [ ] Install and verify core dependencies (`@tanstack/react-query`, `@tanstack/react-form`, `ofetch`, `zod`, `lucide-react`, `sonner`, `nuqs`, etc.).

### Phase 2: Core Infrastructure & API Layer
- [ ] Implement `src/lib/apiClient.ts` with base URL and error handling.
- [ ] Set up `src/providers/` (`QueryProvider`, `GoogleAuthProvider`, `TooltipProvider`, `Toaster`).
- [ ] Create domain API fetchers: `auth.api.ts`, `shipment.api.ts`, `courier.api.ts`, `payment.api.ts`, `user.api.ts`.
- [ ] Create corresponding TanStack Query and Mutation hooks in `src/hooks/`.
- [ ] Define route configurations: `src/routes/admin.routes.ts`, `src/routes/provider.routes.ts`, `src/routes/customer.routes.ts`.

### Phase 3: Authentication & Security System
- [ ] Build `<AuthGuard>` and `<RoleGuard>` components.
- [ ] Implement `src/middleware.ts` for edge path protection.
- [ ] Create `/login` page with credentials form and Google OAuth button.
- [ ] Create `/register` page with customer vs provider account types.
- [ ] Create `/verify` page with multi-digit OTP input via `input-otp`.
- [ ] Build demo Role Switcher floating widget to facilitate switching between Customer, Provider, and Admin portals.

### Phase 4: Shared Dashboard Shell & Layout System
- [ ] Build `DashboardShell` and `DashboardSidebar` utilizing `@base-ui` / shadcn sidebar components.
- [ ] Implement responsive mobile navigation with slide-over drawers.
- [ ] Build universal UI components: `StatCard`, `StatusBadge`, `TableSkeleton`, `PreviewStateControls`.

### Phase 5: Customer Portal Implementation
- [ ] Build `/customer` dashboard (Active Shipments, In Transit, Delivered, Spent metrics + Recent table).
- [ ] Build `/customer/new` shipment creation wizard with TanStack Form, Zod validation, and live price calculation sidebar.
- [ ] Build `/customer/shipments` with search, tab filters, skeleton loading, and Tracking Timeline drawer.

### Phase 6: Provider Fleet & Dispatch Portal Implementation
- [ ] Build `/provider` live operations dashboard (Active shipments, Awaiting courier, Out for delivery, Today's revenue, Couriers workload list).
- [ ] Build `/provider/shipments` dispatch table with `Assign Courier` and `Update Status` modal dialogs.
- [ ] Build `/provider/couriers` fleet management (Available/On delivery/Off duty cards, roster table, and `+ Add courier` dialog).
- [ ] Build `/provider/payments` transaction reconciliation table with gateway filters (bKash, Stripe, SSLCommerz).

### Phase 7: Admin Governance Portal Implementation
- [ ] Build `/admin` console overview (Users, Pending providers, Total shipments, Gross volume, and activity streams).
- [ ] Build `/admin/users` moderation table with search, role tabs, and one-click `Suspend` / `Reactivate` mutations.
- [ ] Build `/admin/shipments` read-only global shipment ledger.
- [ ] Build `/admin/payments` platform audit console.

### Phase 8: Public Portal, Polish & Optimization
- [ ] Build public landing page (`/`) with instant parcel tracking lookup and pricing calculator.
- [ ] Build public tracking timeline page (`/track/[id]`).
- [ ] Audit responsive layouts on mobile, tablet, and desktop screens.
- [ ] Verify skeleton loading across all tables and test with Preview State controls.
- [ ] Optimize bundle size, fonts, and Core Web Vitals (LCP, CLS, FID).
