# Cook by Ugo

Customer ordering website for Cook by Ugo, built from the Figma design. This is the frontend only:
all data is mocked, no payment is taken and no order leaves the browser.

## Stack

- React 19, TypeScript and Vite
- TanStack Router for file-based routes
- TanStack Query for all server state
- Zustand for the cart and UI state
- React Hook Form and Zod for checkout forms
- Tailwind CSS, with colours driven by CSS variables

## Getting started

```bash
npm install
npm run dev
```

| Script          | What it does         |
| --------------- | -------------------- |
| `npm run dev`   | Start the dev server |
| `npm run build` | Type-check and build |
| `npm run lint`  | Run ESLint           |
| `npm test`      | Run unit tests       |

## Project structure

```text
src/
  components/
    brand/      Logo, starburst seal, aso-oke band
    layout/     Header, footers, mobile menu
    ui/         Reusable kit: Button, Chip, fields, Modal, Drawer...
  constants/    Navigation, page content, checkout rules, query keys
  features/     Feature components and their logic: cart, checkout, home, menu
  hooks/        Reusable hooks
  lib/          Small helpers: formatting, class names, query client
  mocks/        Sample data from the design
  routes/       TanStack Router pages
  services/     One folder per domain: `*.api.ts` and `*.queries.ts`
  stores/       Zustand stores
  styles/       Global CSS and design tokens
  types/        Shared TypeScript types
```

## Conventions

- **Colours:** add or change a colour in `src/styles/globals.css`, then expose it in
  `tailwind.config.ts`. Use classes such as `bg-jollof` and never hard-code a hex value.
- **Money:** always whole pence, formatted with `formatPrice`.
- **Data:** components call query hooks from `src/services`, never the mocks directly.

## Connecting the backend

The `*.api.ts` files are the only ones that touch mock data. Replace each method with an Appwrite
call and the query hooks and components stay the same. Then:

- Move price and total calculation to the server. The browser totals are for display only.
- Replace `CardFields` with Stripe's Payment Element. Its mock fields must never go live.
- Replace order polling with Appwrite Realtime.

## Placeholders to replace before launch

- **Allergens:** the lists in `src/mocks/menu.ts` are not verified. Use the kitchen's real data.
- **Delivery:** the £2.99 fee and NE postcode rule in `src/constants/checkout.ts` are assumptions.
- **Contact details:** the phone number, email and WhatsApp number are from the design.
- **Images:** these are screen captures from Figma. Export the originals, and check that each photo
  matches its dish.
- **Time slots:** the options in `SCHEDULED_SLOTS` are a fixed list.
- **Deals:** "Order" adds the deal straight to the cart until the deal builder is designed.
- **Info pages:** Catering, Contact, Delivery areas, Allergens, Privacy and Our story are stubs.
