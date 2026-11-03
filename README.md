# Cook by Ugo

Customer ordering website for Cook by Ugo, built from the Figma design. Menu, prices and orders come
from the [API](https://github.com/idungstanley/api-cooked-by-ugo).

## Stack

- React 19, TypeScript and Vite
- TanStack Router for file-based routes
- TanStack Query for all server state
- Zustand for the cart and UI state
- React Hook Form and Zod for checkout forms
- Tailwind CSS, with colours driven by CSS variables

## Getting started

Start the API first, then:

```bash
npm install
cp .env.example .env
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
- **Data:** components call query hooks from `src/services`. Only `*.api.ts` files call the API.

## Before launch

- **Card payments:** replace `CardFields` with Stripe's Payment Element, using the `clientSecret`
  the API returns. The fields here are placeholders and send nothing. In production a card order
  stays unpaid until this is done, and the page tells the customer to pay on delivery.
- **Allergens:** the seeded lists are not verified. Update them in the admin dashboard.
- **Contact details:** the phone number, email and WhatsApp number are from the design.
- **Images:** these are screen captures from Figma. Export the originals, and check that each photo
  matches its dish.
- **Deals:** "Order" adds the deal straight to the cart until the deal builder is designed.
- **Info pages:** Catering, Contact, Delivery areas, Allergens, Privacy and Our story are stubs. The
  API already accepts catering enquiries at `POST /api/public/enquiries`.

## Deploying

Set `VITE_API_URL` to `https://api.cookedbyugo.com` before building, then publish `dist`. Every path
must serve `index.html`. Netlify reads this from `public/_redirects`, and other hosts need a rewrite
rule from `/*` to `/index.html`.
