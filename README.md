# E-Shop — Frontend Overview

A Next.js storefront + admin panel for a full-stack e-commerce app: browsing/
search, cart, wishlist, checkout with COD and eSewa payment, order tracking,
reviews, notifications, and an admin back office.

---

## Tech Stack

- Next.js 16 (App Router) + React 19, TypeScript
- Data fetching/cache: TanStack Query
- Auth/client state: Zustand (persisted to localStorage)
- UI: Tailwind CSS 4 + Radix UI primitives (shadcn-style components), lucide-react icons
- Toasts: Sonner

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Home |
| `/products`, `/products/[slug]` | Catalog browsing, filters/search, product detail |
| `/cart` | Cart |
| `/wishlist` | Wishlist |
| `/checkout` | Address + payment method selection, places COD orders or redirects to eSewa |
| `/checkout/success`, `/checkout/failed` | Post-payment landing pages |
| `/orders`, `/orders/[id]` | Order history and detail (status, payment status/method, cancel) |
| `/account`, `/account/addresses` | Profile and saved addresses |
| `/notifications` | In-app notifications |
| `/login`, `/register` | Auth |
| `/admin` | Admin dashboard |
| `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit` | Product management |
| `/admin/categories` | Category management |
| `/admin/orders` | Order list — status updates, payment status, "Mark Paid" for COD |
| `/admin/users` | User management |

---

## Checkout & payment flow (client side)

- **Cash on Delivery** — the `/checkout` page calls `POST /orders` directly; the order is placed immediately and the user is sent to the order detail page.
- **eSewa** — the `/checkout` page calls `POST /payments/esewa/initiate`, which returns signed form fields, then builds and submits a real hidden `<form>` to eSewa's payment page (eSewa's real public test/dummy sandbox — a signed POST, not a link). No order exists client-side yet at this point. eSewa redirects the browser to `/checkout/success` or `/checkout/failed` once the backend has processed the result.
- Order status and payment status/method are both shown on `/orders/[id]` and, for admins, on `/admin/orders` (with a "Mark Paid" action for pending COD orders).

---

## Structure

```
app/            # Next.js App Router pages (routes above)
components/     # UI (shadcn-style primitives in ui/, feature components elsewhere)
hooks/          # TanStack Query hooks per domain (use-orders, use-cart, use-auth, ...)
api/            # Typed axios wrappers per backend module
store/          # Zustand auth store (persisted, with hydration-safe access)
types/          # Shared TS types mirroring backend DTOs/schemas
utils/          # Formatting helpers (currency, date)
```

---

## Auth handling

Access + refresh JWT pair, stored via a persisted Zustand store (`store/auth-store.ts`). The axios client (`api/client.ts`) auto-attaches the access token to requests and transparently refreshes it on a 401. Components that read auth state before hydration completes (e.g. the navbar) check `hasHydrated` first to avoid a flash of the logged-out state on refresh.

---

## Requirements to run

- Node.js 18+
- Backend running and reachable at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001/api/v1`)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

### Lint

```bash
npm run lint
```

---

## Known gaps / not yet built

- Stripe and Khalti payment options aren't wired into the checkout UI yet (backend doesn't support them either — see the backend overview for the integration pattern to follow)
- Footer "Help" and "Legal" links point to placeholder pages (`/contact`, `/shipping`, `/returns`, `/faq`, `/terms`, `/privacy`, `/cookies` don't exist yet)
