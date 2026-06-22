# Progress — Super Admin Panel Specification

This document is the single source of truth for building the Super Admin web panel. Every section, field, color, and business rule is derived directly from the existing mobile apps. Do not invent features, fields, or statuses not listed here.

---

## 1. Design System

### 1.1 Color Tokens

Use these exact values. All Tailwind references below map to these tokens.

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#2563EB` | CTA buttons, links, active states, badges |
| `--primary-hover` | `#1D4ED8` | Button hover (blue-700) |
| `--background` | `#F4F5F7` | Page background |
| `--card` | `#FFFFFF` | Card / panel background |
| `--foreground` | `#1A1A1A` | Primary text |
| `--muted-foreground` | `#6B7280` | Secondary / helper text |
| `--border` | `rgba(0,0,0,0.08)` | Card borders, dividers |
| `--muted` | `#F4F5F7` | Input backgrounds, subtle fills |
| `--secondary` | `#EEF2FF` | Tag backgrounds, secondary buttons |
| `--secondary-foreground` | `#1E40AF` | Text on secondary fills |
| `--destructive` | `#EF4444` | Errors, delete actions, rejected status |
| `--success` | `#10B981` | Approve / in-stock / confirmed (emerald-500) |
| `--success-foreground` | `#059669` | Text on success tints (emerald-600) |
| `--warning` | `#F59E0B` | Low stock, pending status (amber-500) |
| `--ring` | `#93C5FD` | Focus ring |

### 1.2 Semantic Color Usage

| Situation | Background | Text |
|---|---|---|
| Completed / Delivered | `bg-emerald-50` | `text-emerald-600` |
| Pending | `bg-amber-50` | `text-amber-600` |
| Processing | `bg-blue-50` | `text-blue-600` |
| Out for Delivery | `bg-violet-50` | `text-violet-600` |
| Failed / Rejected | `bg-red-50` | `text-red-500` |
| Earn bonus | `bg-emerald-50` | `text-emerald-600` |
| Withdraw | `bg-red-50` | `text-red-500` |
| Low stock (≤ 10) | `bg-orange-50` | `text-orange-600` |
| In stock | `bg-emerald-50` | `text-emerald-600` |

### 1.3 Typography

- Font: system sans-serif (Inter or equivalent)
- Base size: 16px
- Scale used across app (reference for admin):

| Role | Size | Weight |
|---|---|---|
| Page title | 22–26px | 800 (extrabold) |
| Section heading | 17–18px | 700 (bold) |
| Card title | 15px | 700 (bold) |
| Body / row text | 13–14px | 600 (semibold) |
| Label / meta | 11–12px | 500–600 |
| Monospace (SKU, ref) | 10–11px | 400, `font-mono` |

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-xl` | 12px | Inputs, small buttons, tags |
| `rounded-2xl` | 16px | Cards, panels |
| `rounded-3xl` | 24px | Bottom sheets, hero cards |
| `rounded-full` | 9999px | Badges, dot indicators, pills |

### 1.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.05)` | Standard card |
| `shadow-sheet` | `0 -8px 40px rgba(0,0,0,0.18)` | Modals / drawers |
| `shadow-fab` | `0 4px 20px rgba(37,99,235,0.45)` | Primary action button |
| `shadow-popover` | `0 8px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.08)` | Dropdowns |
| Wallet card | `0 4px 16px rgba(37,99,235,0.3)` | Balance/wallet hero cards |

---

## 2. Data Models

### 2.1 Product

```
Product {
  id:            number        — unique integer
  name:          string        — product display name
  shop:          string        — seller shop name (FK to Shop.name)
  price:         string        — display price in UZS, formatted "45 000"
  originalPrice: string?       — pre-discount price, omit if no discount
  discount:      number?       — percentage integer (e.g. 25), omit if none
  img:           string        — primary image URL
  category:      string        — one of the 12 categories below
  sku:           string        — stock-keeping unit, e.g. "BSH-OF-4722"
  stock:         number        — units in stock (integer)
  brand:         string        — manufacturer/brand name
  description:   string        — multi-sentence product description
}
```

**Extra images:** keyed by SKU. Each product can have up to 4 image URLs total (1 primary + up to 3 extras).

**Product Variations:** keyed by SKU. Each variation has a `name` (e.g. "Engine Type") and `options` array (e.g. `["Petrol", "Diesel", "Hybrid"]`). Max 2 variations per SKU.

### 2.2 Categories (exhaustive list — do not add or remove)

| Label | Emoji |
|---|---|
| Engine | ⚙️ |
| Brakes | 🔴 |
| Filters | 🔧 |
| Tires | 🛞 |
| Electrical | ⚡ |
| Body Parts | 🚗 |
| Oil & Fluids | 🛢️ |
| Suspension | 🔩 |
| Exhaust | 💨 |
| Accessories | 🪛 |
| Lighting | 💡 |
| Cooling | ❄️ |

### 2.3 Shop (Seller)

```
Shop {
  id:       number
  name:     string        — display name, e.g. "AutoZone Tashkent"
  address:  string        — full street address
  distance: string        — "1.2 km" (from mechanic; calculated field)
  time:     string        — "8 min" (driving estimate; calculated field)
  status:   "open" | "closed"
  products: number        — count of active products
  rating:   number        — float 0–5, e.g. 4.8
  phone:    string        — "+998 XX XXX XX XX"
  x:        number        — % position on map (0–100)
  y:        number        — % position on map (0–100)
}
```

**Existing shops (do not rename):**
- AutoZone Tashkent
- CarParts Express
- SparkMaster Pro
- TireHub Uzbekistan (also referenced as "TireHub Yunusabad" in order data)
- SuspensionKing

### 2.4 Mechanic (User — role: "mechanic")

```
Mechanic {
  name:    string   — full name, e.g. "Akmal Karimov"
  phone:   string   — "+998 90 123 45 67" (used as login identifier)
  region:  string   — one of: Tashkent, Samarkand, Bukhara, Namangan,
                      Andijan, Fergana, Nukus, Termez, Qarshi, Jizzakh
  balance: number   — bonus wallet balance in UZS (integer)
}
```

### 2.5 Seller (User — role: "seller")

```
Seller {
  name:     string   — full name, e.g. "Bekzod Saidov"
  phone:    string   — "+998 91 555 22 11"
  shopName: string   — FK to Shop.name (read-only; set by admin)
  balance:  number   — bonus wallet balance in UZS (integer)
}
```

### 2.6 Mechanic Order (PastOrder)

```
PastOrder {
  ref:        string       — "ORD-YYMM-XXX" format, e.g. "ORD-2206-A47"
  date:       string       — "Jun 18, 2026 · 14:32"
  shopName:   string       — FK to Shop.name
  sellerName: string       — full name of seller who confirmed
  items:      OrderItem[]
  bonus:      number       — UZS bonus credited to mechanic (3% of total)
}

OrderItem {
  id:        number
  name:      string
  img:       string        — image URL
  price:     string        — unit price "45 000"
  qty:       number
  sku:       string?       — shown in mono font
  variation: string?       — e.g. "Diesel · 1 unit"
}
```

### 2.7 Seller Order (SellerOrder)

```
SellerOrder {
  id:            number
  ref:           string       — "TXN-YYMM-XXX" format, e.g. "TXN-2206-A47"
  date:          string       — "Jun 18, 2026 · 14:32"
  mechanic:      string       — full name of buying mechanic
  mechanicPhone: string       — "+998 XX XXX XX XX"
  items:         SellerOrderItem[]
  bonus:         number       — UZS bonus credited to seller (2% of total)
}

SellerOrderItem {
  id:        number
  name:      string
  img:       string
  price:     string        — "45 000"
  qty:       number
  sku:       string?
  variation: string?
}
```

### 2.8 Wallet Transaction (WalletTxn)

```
WalletTxn {
  id:       number
  label:    string       — e.g. "Purchase bonus · AutoZone" or "Withdraw to UzCard"
  date:     string       — "Jun 18, 2026"
  amount:   number       — UZS integer
  kind:     "earn" | "withdraw"
  orderRef: string?      — ref of linked order (earn transactions only)
}
```

### 2.9 Withdrawal Request (WithdrawRequest)

```
WithdrawRequest {
  id:           number
  method:       "card" | "cash"
  amount:       number         — UZS integer
  requestedAt:  string         — "Jun 21, 2026 · 09:14"
  status:       WithdrawStatus
  destination:  string         — card last 4 "•••• 4471" or full address for cash
}

WithdrawStatus = "pending" | "processing" | "out_for_delivery" | "delivered" | "failed"
```

**Status flow (card):** pending → processing → delivered  
**Status flow (cash):** pending → processing → out_for_delivery → delivered

### 2.10 Transaction Approval Request (IncomingRequest)

Generated when a mechanic scans a seller QR code.

```
IncomingRequest {
  mechanic:      string         — full name
  mechanicPhone: string         — "+998 XX XXX XX XX"
  ref:           string         — "TXN-YYMM-XXX"
  items:         RequestedItem[]
}

RequestedItem {
  id:    number
  name:  string
  price: string   — "45 000"
  qty:   number
}
```

Seller bonus = `Math.round(total × 0.02)` (2%)  
Mechanic bonus = `Math.round(total × 0.03)` (3%)

### 2.11 Notification

```
Notification {
  id:    number
  type:  "order" | "price" | "promo" | "new"
  title: string
  body:  string
  time:  string   — relative, e.g. "2 min ago", "Yesterday"
  read:  boolean
}
```

### 2.12 Languages Supported

```
{ code: "en", label: "English", native: "English", flag: "🇺🇸" }
{ code: "ru", label: "Russian", native: "Русский",  flag: "🇷🇺" }
{ code: "uz", label: "Uzbek",   native: "O'zbek",   flag: "🇺🇿" }
```

---

## 3. Business Rules

### 3.1 Bonus Logic

- **Mechanic** earns **3%** of order total as wallet bonus on every confirmed purchase
- **Seller** earns **2%** of order total as wallet bonus on every confirmed sale
- Bonuses are credited only after the seller confirms (approves) the transaction
- Bonus reference format: earn transactions link to the order ref (`orderRef` field)

### 3.2 Withdrawal Rules

- Methods: **Card** (UzCard / Humo only — no international cards) and **Cash delivery**
- Card flow: pending → processing → delivered
- Cash flow: pending → processing → out_for_delivery → delivered
- Cancellation allowed only while status = `pending`

### 3.3 Stock Display

- Stock ≤ 10 → show "Low stock" warning (orange)
- Stock = 0 → item not add-able to cart
- Stock shown on all product cards and detail pages

### 3.4 Discount Display

- `discount` field = integer percentage (e.g. `25` for 25% off)
- If present, show `originalPrice` with strikethrough and a red badge showing "25% OFF"
- If absent, show no badge and no strikethrough

### 3.5 Price Format

- All prices in UZS (Uzbek Som)
- Display format: `"45 000"` (space as thousands separator, no decimal)
- When displaying in full: `"45 000 UZS"` or `"45 000 <span>UZS</span>`

### 3.6 Order Reference Formats

- Mechanic orders: `ORD-YYMM-XXX` (e.g. `ORD-2206-A47`)
- Seller transactions: `TXN-YYMM-XXX` (e.g. `TXN-2206-A47`)
- The same transaction shares the same suffix (A47 in both above = same deal)

---

## 4. Super Admin Navigation & Pages

### 4.1 Sidebar Navigation

```
Dashboard        — /admin
Shops            — /admin/shops
Products         — /admin/products
Mechanics        — /admin/mechanics
Sellers          — /admin/sellers
Orders           — /admin/orders       (all mechanic orders)
Transactions     — /admin/transactions (all seller transactions)
Bonuses          — /admin/bonuses      (wallet balances + withdrawal requests)
Notifications    — /admin/notifications
Settings         — /admin/settings
```

### 4.2 Dashboard Page

Metrics cards (read-only KPIs):
- Total active shops
- Total products
- Total registered mechanics
- Total registered sellers
- Total orders (all time)
- Total bonus paid to mechanics (UZS)
- Total bonus paid to sellers (UZS)
- Total pending withdrawal requests

Recent activity feed: last 10 orders/transactions combined, newest first.

### 4.3 Shops Management (`/admin/shops`)

**List view — table columns:**

| Column | Field | Notes |
|---|---|---|
| Name | `shop.name` | |
| Address | `shop.address` | |
| Status | `shop.status` | Badge: open = emerald, closed = red |
| Products | `shop.products` | Integer count |
| Rating | `shop.rating` | Float, show star icon |
| Phone | `shop.phone` | |
| Actions | — | Edit, Toggle status |

**Create / Edit shop form fields:**

- Name (text, required)
- Address (text, required)
- Phone (text, "+998 XX XXX XX XX" format)
- Status (toggle: open / closed)
- Map position X (number 0–100, % on map)
- Map position Y (number 0–100, % on map)

Fields NOT editable by admin (calculated): `distance`, `time`, `products`, `rating`

### 4.4 Products Management (`/admin/products`)

**List view — table columns:**

| Column | Field | Notes |
|---|---|---|
| Image | `product.img` | Thumbnail 40×40 |
| Name | `product.name` | |
| SKU | `product.sku` | `font-mono` |
| Brand | `product.brand` | |
| Category | `product.category` | |
| Shop | `product.shop` | |
| Price | `product.price` | UZS |
| Original Price | `product.originalPrice` | UZS, blank if none |
| Discount | `product.discount` | %, blank if none |
| Stock | `product.stock` | Orange if ≤ 10 |
| Actions | — | Edit, Delete |

**Filters:** Category (dropdown), Shop (dropdown), In Stock only (toggle), Has Discount (toggle)

**Create / Edit product form fields:**

- Name (text, required)
- Brand (text, required)
- SKU (text, required, unique per product — not per shop)
- Category (dropdown — 12 categories exactly as listed in §2.2)
- Shop (dropdown — existing shops only)
- Price (number → formatted as "45 000", required)
- Original Price (number → formatted, optional)
- Discount % (integer 0–100, optional — only shown if original price set)
- Stock (integer, required)
- Description (textarea, required)
- Primary image URL (text, required)
- Extra image URLs (up to 3 additional URLs)

**Variations section** (on edit only, keyed by SKU):
- Each variation: Name (text) + Options (comma-separated or tag input)
- Max 2 variations per SKU
- Variations are shared across all shops selling the same SKU

### 4.5 Mechanics Management (`/admin/mechanics`)

**List view — table columns:**

| Column | Field |
|---|---|
| Name | `mechanic.name` |
| Phone | `mechanic.phone` |
| Region | `mechanic.region` |
| Wallet Balance | `mechanic.balance` UZS |
| Total Orders | count from PastOrders |
| Actions | View, Edit, Deactivate |

**Edit mechanic form fields:**
- Name (text)
- Phone (text)
- Region (dropdown — 10 regions: Tashkent, Samarkand, Bukhara, Namangan, Andijan, Fergana, Nukus, Termez, Qarshi, Jizzakh)

**Wallet balance:** read-only in edit form; adjustable only via Bonuses page.

### 4.6 Sellers Management (`/admin/sellers`)

**List view — table columns:**

| Column | Field |
|---|---|
| Name | `seller.name` |
| Phone | `seller.phone` |
| Shop | `seller.shopName` |
| Wallet Balance | `seller.balance` UZS |
| Total Sales | count from SellerOrders |
| Actions | View, Edit, Deactivate |

**Edit seller form fields:**
- Name (text)
- Phone (text)
- Shop (dropdown — existing shops only, read-only once set — show badge "Read only")

### 4.7 Mechanic Orders (`/admin/orders`)

**List view — table columns:**

| Column | Field | Notes |
|---|---|---|
| Ref | `order.ref` | `font-mono` |
| Date | `order.date` | |
| Shop | `order.shopName` | |
| Seller | `order.sellerName` | |
| Items | count of items | |
| Total | sum of `price × qty` | UZS |
| Bonus | `order.bonus` | UZS, emerald |
| Status | always "Completed" | Emerald badge |

**Order detail view:**
- Ref + date in header
- Seller info card: shop name, seller name
- Items list: thumbnail, name, SKU (`font-mono`), variation, `price × qty`
- Summary: subtotal, 3% mechanic bonus (emerald), total

### 4.8 Seller Transactions (`/admin/transactions`)

**List view — table columns:**

| Column | Field | Notes |
|---|---|---|
| Ref | `order.ref` | `font-mono`, "TXN-" prefix |
| Date | `order.date` | |
| Mechanic | `order.mechanic` | |
| Mechanic Phone | `order.mechanicPhone` | |
| Items | count | |
| Total | sum of `price × qty` | UZS |
| Bonus | `order.bonus` | UZS, emerald (2%) |
| Status | always "Completed" | Emerald badge |

**Transaction detail view:**
- Mechanic info card: Wrench icon, name, phone, clock + date
- Items list: thumbnail, name, SKU (`font-mono`), variation, `price × qty`
- Summary: subtotal, 3% sales bonus label (emerald "2% sales bonus"), total received

### 4.9 Bonuses Management (`/admin/bonuses`)

Two tabs: **Wallet Balances** and **Withdrawal Requests**

**Wallet Balances tab — table:**

| Column | Notes |
|---|---|
| User | Name |
| Role | Mechanic / Seller badge |
| Shop | Seller only |
| Balance | UZS |
| Actions | Manual adjust (add/deduct) |

**Withdrawal Requests tab — table:**

| Column | Field | Notes |
|---|---|---|
| User | name | |
| Role | mechanic / seller | |
| Method | `request.method` | card / cash badge |
| Amount | `request.amount` | UZS |
| Requested | `request.requestedAt` | |
| Destination | `request.destination` | masked card or address |
| Status | `request.status` | Colored badge (see §1.2) |
| Actions | — | Advance status, Mark failed |

**Status badge colors:**

| Status | Style |
|---|---|
| pending | amber bg/text |
| processing | blue bg/text |
| out_for_delivery | violet bg/text |
| delivered | emerald bg/text |
| failed | red bg/text |

**Status transitions** (admin can only move forward, never backward):
- Card: pending → processing → delivered
- Cash: pending → processing → out_for_delivery → delivered
- Admin can mark any non-delivered request as `failed`

### 4.10 Notifications (`/admin/notifications`)

**Notification types (exhaustive):**

| Type | Usage |
|---|---|
| `order` | Order shipped / delivered |
| `price` | Price drop on a product |
| `promo` | Flash sale / seasonal promotion |
| `new` | New products added to a category |

**Create notification form:**
- Type (dropdown — 4 types above)
- Title (text, required)
- Body (text, required)
- Target role: All / Mechanics only / Sellers only

**List view columns:** Title, Body, Type (badge), Sent to, Sent at, Read rate

### 4.11 Settings (`/admin/settings`)

- Platform name (text) — currently "Progress"
- Support phone (text) — "+998 71 000 00 00"
- Support hours (text) — "Mon–Sat, 9:00–18:00"
- Mechanic bonus rate % (number, currently 3)
- Seller bonus rate % (number, currently 2)
- App version (text, read-only) — "1.0.0"

---

## 5. UI Component Patterns

### 5.1 Status Badge

```
<span class="text-[11px] font-semibold px-2.5 py-1 rounded-xl {bg} {text}">
  {label}
</span>
```

### 5.2 Card

```
<div class="bg-card rounded-2xl border border-border p-4"
     style="box-shadow: 0 2px 8px rgba(0,0,0,0.04)">
```

### 5.3 Section Label

```
<p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
  SECTION TITLE
</p>
```

### 5.4 Primary Button

```
<button class="bg-primary text-white rounded-xl py-3.5 text-[14px] font-semibold
               hover:bg-blue-700 active:scale-[0.98] transition-all
               flex items-center justify-center gap-2">
```

### 5.5 Input Field

```
<input class="w-full bg-[#F4F5F7] text-foreground placeholder-muted-foreground
              rounded-xl px-4 py-3.5 text-sm font-normal border border-transparent
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all" />
```

### 5.6 Danger / Log-out Button

```
<button class="border-2 border-red-100 bg-red-50 text-red-500 font-semibold
               rounded-2xl py-3.5 hover:bg-red-100 transition-colors active:scale-[0.98]">
```

### 5.7 Monospace Reference Text (SKU / order ref)

```
<p class="text-[10px] font-mono text-muted-foreground/70">{sku}</p>
```

---

## 6. Auth

Super admin authenticates with email + password (separate from mobile app credentials). Mobile app uses phone + OTP. Do not reuse the mobile auth flow in admin.

---

## 7. What This Panel Does NOT Manage

- QR scan flow (mobile only)
- Map rendering (mobile only)
- OTP delivery (handled by backend)
- Real-time GPS / distance calculation
- Dark mode (mobile CSS has dark tokens defined; admin panel light-mode only)
