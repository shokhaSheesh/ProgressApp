# Progress — Seller Admin Panel Specification

This document is the single source of truth for building the Seller Admin web panel. Every section, field, color, and business rule is derived directly from the existing mobile apps. Do not invent features, fields, or statuses not listed here.

---

## 1. Design System

### 1.1 Color Tokens

Use these exact values. They are identical to the mobile app.

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
| Completed order / Delivered withdrawal | `bg-emerald-50` | `text-emerald-600` |
| Pending withdrawal | `bg-amber-50` | `text-amber-600` |
| Processing withdrawal | `bg-blue-50` | `text-blue-600` |
| Out for Delivery withdrawal | `bg-violet-50` | `text-violet-600` |
| Failed withdrawal | `bg-red-50` | `text-red-500` |
| Approved transaction | emerald icon `CheckCircle2` | `text-emerald-500` |
| Rejected transaction | red icon `XCircle` | `text-red-500` |
| Earn bonus transaction | `bg-emerald-50` icon `Gift` | `text-emerald-600` |
| Withdraw transaction | `bg-red-50` icon `ArrowDownToLine` | `text-red-500` |
| Low stock (≤ 10 units) | `bg-orange-50` | `text-orange-600` |
| In stock (> 10 units) | `bg-emerald-50` | `text-emerald-600` |

### 1.3 Typography

- Font: system sans-serif (Inter or equivalent)
- Base size: 16px

| Role | Size | Weight |
|---|---|---|
| Page title | 20–22px | 800 (extrabold) |
| Section heading | 17–18px | 700 (bold) |
| Card title | 14–15px | 700 (bold) |
| Body / table text | 13–14px | 600 (semibold) |
| Label / meta / date | 11–12px | 500–600 |
| Monospace (SKU, ref, phone) | 10–11px | 400, `font-mono` |

### 1.4 Border Radius

| Class | Value | Usage |
|---|---|---|
| `rounded-xl` | 12px | Inputs, small buttons, inline tags |
| `rounded-2xl` | 16px | Cards, panels, list rows |
| `rounded-3xl` | 24px | Hero/balance cards, bottom sheets |
| `rounded-full` | 9999px | Badges, dot status indicators, pills |

### 1.5 Shadows

| Name | Value | Usage |
|---|---|---|
| Card | `0 2px 8px rgba(0,0,0,0.05)` | Standard content cards |
| Wallet/Hero card | `0 4px 16px rgba(37,99,235,0.3)` | Balance card (blue primary) |
| Popover | `0 8px 32px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.08)` | Dropdowns |
| FAB / CTA | `0 4px 20px rgba(37,99,235,0.45)` | Primary action buttons |

---

## 2. Seller Identity & Scope

The Seller Admin panel is scoped to a **single seller account**. All data shown is filtered to that seller's shop. There is no cross-shop visibility.

**Seller account fields:**

```
Seller {
  name:     string   — full name, e.g. "Bekzod Saidov"
  phone:    string   — "+998 91 555 22 11" (login identifier)
  shopName: string   — read-only, e.g. "AutoZone Tashkent" (set by super admin)
  balance:  number   — bonus wallet balance in UZS integer
}
```

The `shopName` field is **not editable** by the seller. It is assigned by super admin. Display it with a "Read only" badge (grey `bg-border` background, `text-muted-foreground`).

---

## 3. Data Models

### 3.1 Product (Seller's catalog view)

A seller sees only products where `product.shop === seller.shopName`.

```
Product {
  id:            number
  name:          string        — product display name
  shop:          string        — always matches seller's shopName
  price:         string        — "45 000" (UZS, space as thousands separator)
  originalPrice: string?       — pre-discount price; omit if no discount
  discount:      number?       — integer %, e.g. 25; omit if none
  img:           string        — primary image URL
  category:      string        — one of the 12 categories (see §3.2)
  sku:           string        — e.g. "BSH-OF-4722" (shared across shops)
  stock:         number        — units available (integer ≥ 0)
  brand:         string        — manufacturer name
  description:   string        — multi-sentence description
}
```

**Extra images:** Each product can have up to 3 additional image URLs beyond the primary, keyed by SKU.

**Product Variations:** Keyed by SKU, shared across all shops selling the same SKU. A variation has:
- `name`: string (e.g. "Engine Type")
- `options`: string[] (e.g. `["Petrol", "Diesel", "Hybrid"]`)
- Max 2 variations per SKU

### 3.2 Categories (exhaustive — do not add or remove)

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

### 3.3 Seller Order

Every confirmed transaction the seller approved via QR scan.

```
SellerOrder {
  id:            number
  ref:           string         — "TXN-YYMM-XXX", e.g. "TXN-2206-A47"
  date:          string         — "Jun 18, 2026 · 14:32"
  mechanic:      string         — full name of the buying mechanic
  mechanicPhone: string         — "+998 XX XXX XX XX"
  items:         SellerOrderItem[]
  bonus:         number         — UZS credited to seller wallet (2% of total)
}

SellerOrderItem {
  id:        number
  name:      string
  img:       string             — image URL
  price:     string             — "45 000" (unit price)
  qty:       number
  sku:       string?            — shown in font-mono
  variation: string?            — e.g. "Petrol · 1 unit" or "Heat 6 · 0.8 mm"
}
```

### 3.4 Transaction Approval Request (IncomingRequest)

When a mechanic scans the seller's QR in the mobile app, this request is generated.

```
IncomingRequest {
  mechanic:      string         — mechanic full name
  mechanicPhone: string         — "+998 XX XXX XX XX"
  ref:           string         — "TXN-YYMM-XXX"
  items:         RequestedItem[]
}

RequestedItem {
  id:    number
  name:  string
  price: string                 — "45 000"
  qty:   number
}
```

- Seller bonus on approval = `Math.round(total × 0.02)` (2%)
- After approval: status shown as "Sale confirmed" with `CheckCircle2` in emerald
- After rejection: status shown as "Request rejected" with `XCircle` in red
- All confirmed requests become `SellerOrder` entries

### 3.5 Wallet Transaction (WalletTxn)

```
WalletTxn {
  id:       number
  label:    string       — e.g. "Sale bonus · Akmal K." or "Withdraw to Click"
  date:     string       — "Jun 18, 2026"
  amount:   number       — UZS integer
  kind:     "earn" | "withdraw"
  orderRef: string?      — TXN ref of linked order (earn only, tappable in mobile)
}
```

**Seller transaction examples:**
- `{ label: "Sale bonus · Akmal K.",   kind: "earn",     amount: 4800,   orderRef: "TXN-2206-A47" }`
- `{ label: "Withdraw to Click",        kind: "withdraw", amount: 150000 }`
- `{ label: "Sale bonus · Dilshod R.", kind: "earn",     amount: 8200,   orderRef: "TXN-2206-C08" }`
- `{ label: "Sale bonus · Sardor Y.",  kind: "earn",     amount: 1760,   orderRef: "TXN-2205-D33" }`

### 3.6 Withdrawal Request (WithdrawRequest)

```
WithdrawRequest {
  id:           number
  method:       "card" | "cash"
  amount:       number         — UZS integer
  requestedAt:  string         — "Jun 21, 2026 · 09:14"
  status:       WithdrawStatus
  destination:  string         — "•••• 4471" for card; full address for cash
}

WithdrawStatus = "pending" | "processing" | "out_for_delivery" | "delivered" | "failed"
```

**Card flow:** pending → processing → delivered  
**Cash flow:** pending → processing → out_for_delivery → delivered  
Cancellation: allowed only while `status === "pending"`

**Withdraw methods available:**
- UzCard or Humo card (masked display "•••• XXXX")
- Cash delivery (full address entered by seller)

### 3.7 Withdraw Form Fields

**Card withdrawal:**
- Card number (16-digit, validated, display masked)
- Card holder name (text)
- Amount (number in UZS)

**Cash withdrawal:**
- Recipient name (pre-filled with seller name, editable)
- Phone (pre-filled with seller phone, editable)
- Full delivery address (textarea)
- Amount (number in UZS)

---

## 4. Business Rules

### 4.1 Bonus Logic

- Seller earns **2%** of each confirmed order total
- Bonus is credited automatically after seller confirms (approves) the transaction
- Each `earn` transaction has an `orderRef` linking back to the originating order
- Mechanic earns 3% (shown in mechanic app only — for context, do not display to seller)

### 4.2 Price Format

- All prices in UZS (Uzbek Som)
- Format: `"45 000"` (space as thousands separator, no decimal, no currency inline)
- Full label: `"45 000 UZS"`

### 4.3 Discount Rules

- `discount` = integer percentage (e.g. `25` means 25% off)
- Only show discount badge if `discount` field is present and > 0
- If discount present: show `originalPrice` with `line-through` style; show `discount`% badge in red
- If no discount: no badge, no strikethrough

### 4.4 Stock Rules

- Stock ≤ 10: show "Low stock" label in orange (`text-orange-600 bg-orange-50`)
- Stock = 0: product not add-able to cart (mechanic side); seller must update stock
- Stock is displayed on catalog cards and product detail

### 4.5 Transaction Ref Formats

- All seller transactions: `TXN-YYMM-XXX` (e.g. `TXN-2206-A47`)
- `YY` = 2-digit year, `MM` = 2-digit month, `XXX` = 3-char alphanumeric ID

---

## 5. Navigation & Pages

### 5.1 Sidebar Navigation

```
Dashboard     — /seller
My Catalog    — /seller/catalog
Orders        — /seller/orders
Bonus Wallet  — /seller/wallet
Bonus History — /seller/history
Settings      — /seller/settings
```

No cross-shop data, no mechanics management, no notifications management.

### 5.2 Dashboard Page (`/seller`)

**Greeting header:**
- Time-aware greeting: "Good morning" (< 12:00), "Good afternoon" (12–18:00), "Good evening" (≥ 18:00)
- Seller first name
- Today's date: `{Weekday}, {Month} {Day}` — e.g. "Monday, June 22"

**Bonus wallet card:**
- Background: `bg-primary` (`#2563EB`)
- Shadow: `0 4px 16px rgba(37,99,235,0.3)`
- Fields shown: label "Bonus balance", `balance` formatted as UZS, "Withdraw" shortcut button (navigates to Bonus Wallet page)
- Wallet icon (`Wallet`) in white in top-right corner of card

**This-month stats (3 KPI cards in a row):**

| Card | Icon | Value | Unit | Color |
|---|---|---|---|---|
| Orders | `ClipboardList` | total count | "total" | `text-primary` / `bg-primary/8` |
| Revenue | `Receipt` | sum of all `price × qty` | "UZS" | `text-violet-600` / `bg-violet-50` |
| Bonus | `Gift` | sum of `order.bonus` | "UZS" | `text-emerald-600` / `bg-emerald-50` |

Card layout (each KPI card):
- Top row: icon (in colored 24×24 rounded square) + label name side by side
- Bottom: value (bold colored) + unit (small muted below)

**Recent orders (last 3):**
- Each row: Wrench icon avatar (primary/8 bg), mechanic name + item count + date, total UZS + chevron
- Tapping a row opens the order detail page
- Order detail fields: see §5.4

### 5.3 Catalog Management (`/seller/catalog`)

**List view — grid of product cards (2 columns on mobile, flexible on desktop):**

Each card shows:
- Product image (with discount badge if `discount` present — red, top-left)
- No "Like" / wishlist button (seller view only)
- Product name (bold, 2-line clamp)
- Stock count ("X in stock") in muted text
- Original price with strikethrough (if `originalPrice` present)
- Current price in primary blue + "UZS" in muted
- Add to Cart / qty stepper (for seller's own use — not core to admin, but present in mobile)

**Filters / Search:**
- Search bar (tapping opens full-screen search overlay)
- Category filter pills (horizontal scroll) — show only categories present in seller's products
- Active category toggles to filter grid

**Search overlay fields:**
- No categories shown: show full category list (one per row) with emoji + name + ChevronRight
- With query: autocomplete product names from seller's catalog
- With selected category/name: filtered product grid + sort/filter panel

**Sort options:** Price: Low to High, Price: High to Low, Discount only, In Stock only

**Filter panel fields:**
- Sort by (radio): Price Low→High, Price High→Low
- Discount only (toggle)
- In Stock only (toggle)
- Price range slider (0 → max price in seller's catalog)

**Product detail page fields shown:**
- Image carousel (primary + up to 3 extra images)
- Discount badge (if applicable)
- Product name (large, bold)
- SKU (`font-mono`, muted, small)
- Brand
- Category
- Price (large primary) + original price strikethrough
- Stock count with color (orange if ≤ 10, emerald if > 10)
- Description (full text)
- Variations section (if SKU has variations): each variation shown as horizontal option pills, one variation group at a time
- Qty counter + Add to Cart button (min-width 150px on mobile)
- Similar products section (same category, seller's shop only, 2-column grid, no like button)

**Create / Edit product form fields:**
- Name (text, required)
- Brand (text, required)
- SKU (text, required — shared across shops, variations follow SKU)
- Category (dropdown — all 12 categories)
- Price (number → "45 000" format, required)
- Original Price (number, optional)
- Discount % (integer, optional — shown only when original price is set)
- Stock (integer, required)
- Description (textarea, required)
- Primary image URL (required)
- Extra image URLs (up to 3)
- Variations (up to 2 per SKU): variation name + options (add/remove options)

### 5.4 Orders Page (`/seller/orders`)

Only completed orders are shown. There is no pending/processing order status on the seller side.

**List view — each order row shows:**
- Order ref (`font-mono`, "TXN-" prefix)
- Date ("Jun 18, 2026 · 14:32")
- Mechanic name + Wrench icon
- Mechanic phone
- Stacked product thumbnails (up to 3, then "+N more" indicator)
- Order total (UZS)
- "Completed" badge (emerald: `bg-emerald-50 text-emerald-600`)

**Order detail page:**

Header:
- Back button (ChevronLeft)
- Title "Order Details"
- Ref in muted text below title
- "Completed" badge top-right (emerald)

Mechanic info card:
- Wrench icon (primary color, in `bg-primary/8` rounded square)
- Mechanic full name (bold)
- Mechanic phone
- Clock icon + order date/time

Items list (each item row):
- Product thumbnail (square, rounded-xl)
- Product name (bold, 1-line clamp)
- SKU (`font-mono`, muted/70, small)
- Variation string (if present, muted small) — e.g. "Petrol · 1 unit"
- Price × quantity ("45 000 UZS × 2")

Order summary card:
- Subtotal: sum of all `price × qty`
- Sales bonus label: "3% sales bonus" (emerald `Gift` icon) — this is the seller's 2% bonus amount
- Total received: subtotal + bonus (or just subtotal, bonus is separate)

> Note: In mobile the summary shows "Subtotal", "2% sales bonus" (emerald), and "Total received". Keep exactly this structure.

### 5.5 Bonus Wallet Page (`/seller/wallet`)

**Hero card:**
- Background: `bg-primary` (#2563EB)
- Shadow: `0 4px 20px rgba(37,99,235,0.35)`
- Label: "Available bonus balance" (white/70)
- Amount: `balance` formatted as UZS (white, 32px bold)
- Sub-label: "Earn 2% on every confirmed sale" (white/60, small)

**Withdraw button:**
- Full width, below hero card
- Background: `bg-primary hover:bg-blue-700`
- Icon: `ArrowDownToLine`
- Text: "Withdraw Bonus"
- Shadow: `0 4px 16px rgba(37,99,235,0.35)`
- Tapping opens withdraw method bottom sheet

**Withdraw method sheet:**
- Title: "Withdraw Bonus"
- Sub: "Choose how you'd like to receive your funds"
- Two options: Card (UzCard / Humo) and Cash delivery

**Card withdrawal flow fields:**
- Card number (16-digit input)
- Cardholder name
- Amount to withdraw (UZS)

**Cash withdrawal flow fields:**
- Recipient name (pre-filled: seller name)
- Phone (pre-filled: seller phone)
- Delivery address (textarea)
- Amount to withdraw (UZS)

**After submit:** request enters `WithdrawRequest` with status `"pending"`

### 5.6 Bonus History Page (`/seller/history`)

Two tabs: **History** and **Requests**

**History tab:**

Grouped by month. Each group shows:
- Month label (e.g. "Jun 2026")
- Group net total (emerald if positive, red if negative)

Each transaction row:
- Icon: `Gift` in `bg-emerald-50 text-emerald-600` for earn; `ArrowDownToLine` in `bg-red-50 text-red-500` for withdraw
- Label: e.g. "Sale bonus · Akmal K."
- Order ref below label in `font-mono` muted text (only if `orderRef` present on earn transactions)
- Date below ref
- Amount: `+{fmtUZS(amount)}` in emerald for earn, `−{fmtUZS(amount)}` in red for withdraw
- ChevronRight icon if transaction is tappable (earn + has orderRef)
- Tapping an earn row with `orderRef` opens the linked order detail page (back returns to history)

**Filter (funnel icon in header):**
- From date (date picker)
- To date (date picker)
- Applied filter shows as a chip with Clock icon; "Clear" link removes it

**Requests tab:**

Each request card shows:
- Method badge: "card" or "cash" pill
- Amount (UZS, bold)
- Requested at timestamp
- Destination (masked card "•••• 4471" or address)
- Status badge (color per §1.2)
- Progress stepper showing current position in flow

**Card stepper steps:** Pending → Processing → Delivered  
**Cash stepper steps:** Pending → Processing → Out for Delivery → Delivered

Pending requests tab shows a red badge count on the "Requests" tab label.

### 5.7 Settings Page (`/seller/settings`)

This is the seller's profile page. Sections and items exactly as in mobile:

**General section:**
- My Information
- Bonus Wallet (navigates to wallet page)
- Bonus History (navigates to history page)

**Settings section:**
- Language (opens language picker sheet)

**Support section:**
- FAQ
- About App

**Bottom:** Log out button (red border, red text, `LogOut` icon)

**My Information sub-page fields:**
- Full name (editable text input)
- Phone number (editable tel input)
- Shop name (**read-only** — grey background `#F4F5F7`, "Read only" badge in grey)
- Save button (top-right of header): shows "Saved ✓" in emerald briefly after tap

**Language picker sheet:**
- Three options with flag + native name: English 🇺🇸, Русский 🇷🇺, O'zbek 🇺🇿
- Selected option: `border-primary bg-primary/5`, check mark in blue circle
- Unselected: `border-border bg-background`

**FAQ items (exact text — do not change or add):**

1. Q: "How do I earn bonus points?"  
   A: "You earn 3% bonus on every completed purchase. Bonuses are credited to your wallet automatically once the seller confirms the transaction."

2. Q: "How long does cash delivery take?"  
   A: "Cash delivery requests are processed within 1–2 business days. You can track the status of your request in Bonus History → Requests tab."

3. Q: "Can I cancel a withdrawal request?"  
   A: "Withdrawal requests can be cancelled while they are still in Pending status. Once processing has started, cancellation is no longer available."

4. Q: "What cards are supported for transfer?"  
   A: "We support UzCard and Humo cards issued by Uzbekistan banks. International cards are not currently supported."

5. Q: "How do I find a specific auto part?"  
   A: "Use the search bar on the main page to search by part name, model, or category. You can also filter by price range to narrow down results."

6. Q: "What happens if an item is out of stock?"  
   A: "Out-of-stock items are marked in the catalog. You can still view product details but cannot add them to your cart."

7. Q: "How do I contact support?"  
   A: "For any issues not covered here, please reach out through the Help section or call our support line at +998 71 000 00 00 (Mon–Sat, 9:00–18:00)."

**About App sheet:**
- App logo: "P" monogram, `bg-primary`, shadow `0 8px 32px rgba(37,99,235,0.35)`, white bold text
- App name: "Progress" (extrabold)
- Subtitle: "Auto Parts Marketplace"
- Version: "Version 1.0.0" in grey pill

---

## 6. UI Component Patterns

### 6.1 Card

```html
<div class="bg-card rounded-2xl border border-border p-4"
     style="box-shadow: 0 2px 8px rgba(0,0,0,0.04)">
```

### 6.2 Section Label

```html
<p class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
  GENERAL
</p>
```

### 6.3 Menu Row (profile sections)

```html
<button class="w-full flex items-center gap-3.5 px-4 py-3.5 text-left
               hover:bg-[#F9FAFB] transition-colors border-t border-border">
  <!-- colored icon square 36×36 rounded-xl -->
  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white {color}">
    {icon}
  </div>
  <p class="flex-1 text-[14px] font-semibold text-foreground">{label}</p>
  <ChevronRight size={16} class="text-muted-foreground" />
</button>
```

### 6.4 Menu Icon Colors (per section item)

| Item | Icon | Bg Color |
|---|---|---|
| My Information | `UserCircle` | `bg-blue-500` |
| Bonus Wallet | `Wallet` | `bg-emerald-500` |
| Bonus History | `BarChart2` | `bg-violet-500` |
| Language | `Globe` | `bg-sky-500` |
| FAQ | `HelpCircle` | `bg-indigo-500` |
| About App | `Info` | `bg-slate-500` |

### 6.5 Hero / Balance Card

```html
<div class="rounded-2xl p-4 bg-primary text-white"
     style="box-shadow: 0 4px 16px rgba(37,99,235,0.3)">
  <p class="text-white/70 text-[11px]">Bonus balance</p>
  <p class="text-[26px] font-bold">326 500 <span class="text-[13px] opacity-70">UZS</span></p>
</div>
```

### 6.6 Read-Only Field

```html
<div class="bg-[#F4F5F7] rounded-2xl border border-border px-4 py-3.5">
  <p class="text-[11px] text-muted-foreground font-medium mb-1.5">Shop name</p>
  <div class="flex items-center justify-between">
    <p class="text-[15px] font-semibold text-foreground">AutoZone Tashkent</p>
    <span class="text-[10px] font-semibold text-muted-foreground bg-border px-2 py-0.5 rounded-md">
      Read only
    </span>
  </div>
</div>
```

### 6.7 Primary Button

```html
<button class="w-full bg-primary text-white rounded-2xl py-3.5 text-[14px] font-semibold
               flex items-center justify-center gap-2 hover:bg-blue-700
               active:scale-[0.98] transition-all"
        style="box-shadow: 0 4px 16px rgba(37,99,235,0.35)">
```

### 6.8 Danger Button (Log out)

```html
<button class="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl
               border-2 border-red-100 bg-red-50 text-red-500 font-semibold
               text-[14px] hover:bg-red-100 transition-colors active:scale-[0.98]">
  <LogOut size={16} /> Log out
</button>
```

### 6.9 Status Badge

```html
<span class="text-[11px] font-semibold px-2.5 py-1 rounded-xl {bg-color} {text-color}">
  Completed
</span>
```

### 6.10 Monospace Reference Text

```html
<p class="text-[10px] font-mono text-muted-foreground/70">TXN-2206-A47</p>
```

---

## 7. Seller Profile (Identity Section)

The seller's avatar in the profile hub:
- Initials: first character of `seller.name`
- Background: `bg-emerald-500` with shadow `0 4px 20px rgba(16,185,129,0.35)`
- Size: 80×80 rounded-3xl (in mobile profile hub)
- Role badge below name: "Seller" — `text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[11px] font-semibold`

---

## 8. What This Panel Does NOT Include

- Managing other sellers or shops (scoped to own shop only)
- Viewing mechanic accounts or their orders directly
- Sending notifications (read-only notification history at most)
- Changing the assigned shop name (read-only, managed by super admin)
- QR scan / approval flow (mobile app only — seller approves via phone)
- Map / distance features (mechanic app only)
- Dark mode (light mode only)
- Mechanic bonus logic (3% is mechanic-side only; seller only sees their 2%)
