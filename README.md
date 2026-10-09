# DRONET - Courier & Logistics Platform (Frontend)

Next-generation courier, parcel delivery, and fleet management web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TanStack Query**.

Connected to the backend API at [`E:/courier-and-logistic`](file:///e:/courier-and-logistic).

---

## 🚀 Key Features & Portals

1. **Customer Portal (`/customer`)**:
   - Live parcel tracking and history across Bangladesh.
   - Dynamic delivery price calculator (Inside Dhaka vs Outside Dhaka, weight, speed).
   - Multi-step shipment booking wizard (`/customer/new`).
   - Digital payment integration (bKash, Stripe, SSLCommerz).

2. **Provider Portal (`/provider`)**:
   - Live dispatch operations control.
   - Courier fleet roster (`/provider/couriers`) with vehicle types, zones, and status toggles.
   - Instant courier assignment and status progression (`/provider/shipments`).
   - Daily revenue and settlement breakdown (`/provider/payments`).

3. **Admin Console (`/admin`)**:
   - Platform-wide telemetry (Total users, 30-day shipment volume, gross payments).
   - User moderation (`/admin/users`) with single-click suspend/reactivate toggles.
   - Read-only audit log for all shipments and financial transactions.

4. **Public & Auth Services**:
   - Instant public tracking by Tracking Number (e.g. `DRN-8841`) from the homepage without login.
   - Role-aware onboarding (`Customer` vs `Provider`).
   - 6-digit OTP verification via `input-otp`.
   - Embedded demo portal switcher for instant QA and presentation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Package Manager**: `pnpm`
- **Data Fetching & Caching**: `@tanstack/react-query` v5 (`useSuspenseQuery`, mutations)
- **Forms & Validation**: `@tanstack/react-form` + `zod`
- **HTTP Client**: `ofetch` with credentials and authorization interceptors
- **Styling**: Tailwind CSS v4 + `@base-ui/react` + `shadcn`
- **Linter & Formatter**: Biome 2.4

---

## 🏃 Getting Started

### 1. Environment Setup
Ensure your `.env` is configured with the backend API:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_sample
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Architecture & Implementation Plan
For detailed architecture, data schemas, and the 8-phase implementation guide, refer to [`implementaiton_plan.md`](./implementaiton_plan.md).
