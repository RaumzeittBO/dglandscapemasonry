# GreenScape Luxury — Premium Landscaping Landing Page

A luxury, animated, mobile-first landing page built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **GSAP** animations.

## Getting Started

```bash
npm run dev    # Start development server (http://localhost:3000)
npm run build  # Production build
npm start      # Start production server
```

---

## How to Customize

### 1. Change Phone Number / WhatsApp / Company Name

Edit the single config file:

```
src/config/siteConfig.ts
```

Update these fields:

| Field                   | Description                          |
| ----------------------- | ------------------------------------ |
| `companyName`           | Your business name                   |
| `phoneDisplay`          | Display format: `+1 (555) 123-4567`  |
| `phoneE164`             | International format: `+15551234567` |
| `whatsappNumberE164`    | WhatsApp number: `15551234567`       |
| `defaultWhatsAppMessage`| Pre-filled WhatsApp message          |
| `serviceAreas`          | Array of city names                  |

All components read from this file — no need to edit individual components.

### 2. Replace the Logo

1. Place your logo SVG at `/public/logo.svg`
2. In `src/components/FinalCTA.tsx`, find the footer section and replace the text logo with:

```tsx
import Image from "next/image";
// ...
<Image src="/logo.svg" alt={siteConfig.companyName} width={180} height={40} />
```

### 3. Add Real Before/After Photos

1. Add your images to `/public/images/` (e.g., `before-garden.jpg`, `after-garden.jpg`)
2. Edit `src/data/projects.ts`:

```ts
{
  id: 1,
  title: "Complete Garden Redesign",
  tag: "Residential",
  beforeSrc: "/images/before-garden.jpg",  // ← your real image
  afterSrc: "/images/after-garden.jpg",     // ← your real image
},
```

3. Supported formats: `.jpg`, `.png`, `.webp`
4. Recommended size: at least **800×600px**, max **2000px** wide

### 4. Add Google Maps Embed

1. Go to [Google Maps](https://maps.google.com), search for your business
2. Click **Share → Embed a map → Copy HTML**
3. Open `src/components/LocationMap.tsx`
4. Replace the placeholder `<div>` with the iframe (see the TODO comment in the file)

### 5. Add a Hero Background Image

1. Place your image at `/public/images/hero.jpg` (recommended: 1920×1080, dark/moody landscape)
2. In `src/components/Hero.tsx`, replace the gradient background div with:

```tsx
import Image from "next/image";
// ...
<Image src="/images/hero.jpg" alt="" fill className="object-cover" priority />
```

---

## Performance Tips

- **Use WebP format** for all images (50-70% smaller than JPEG)
- **Compress images** before uploading (use [Squoosh](https://squoosh.app/))
- **Max widths**: Keep max width ~1600px for gallery images. Avoid huge original camera files.
- All images already use `next/image` for automatic optimization
- Below-the-fold images use `loading="lazy"` automatically

---

## Admin & Deployment Notes

- **Domain and email setup are separate steps** (DNS + email provider).

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles + Tailwind theme
│   ├── layout.tsx           # Root layout + fonts + SEO
│   └── page.tsx             # Main landing page
├── components/
│   ├── AnimationProvider.tsx # Lenis smooth scroll wrapper
│   ├── BeforeAfterSlider.tsx # Draggable before/after comparison
│   ├── FinalCTA.tsx         # Final CTA + Footer
│   ├── Hero.tsx             # Hero section with GSAP text reveal
│   ├── LocationMap.tsx      # Google Maps placeholder
│   ├── Portfolio.tsx        # Before/After project grid
│   ├── Process.tsx          # 3-step process timeline
│   ├── ServiceAreas.tsx     # Service areas city list
│   ├── Services.tsx         # 6 service cards
│   ├── StickyContactButton.tsx # Floating WhatsApp/Call button
│   └── Testimonials.tsx     # Customer testimonials carousel
├── config/
│   └── siteConfig.ts        # ★ Central config (phone, name, areas)
├── data/
│   └── projects.ts          # Before/After project data
└── hooks/
    └── useGsapAnimations.ts # GSAP animation utilities
```
