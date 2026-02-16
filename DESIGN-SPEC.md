# MultiVend - Design Specification

## Aesthetic Direction: "Luxury Art Deco"

### Vision
An elegant, sophisticated e-commerce platform that feels premium and trustworthy while avoiding the generic "purple gradient" SaaS look. Inspired by Art Deco geometric patterns combined with modern luxury aesthetics.

---

## 1. PURPOSE & CONTEXT

### Problem Solved
MultiVend is a multi-tenant SaaS marketplace where:
- A superadmin manages the platform and sells their own products
- Tenants (businesses) register and create independent stores
- Customers browse and purchase from multiple tenants

### Users
| User | Needs | Interface |
|------|-------|-----------|
| **Superadmin** | Powerful analytics, tenant management | Dashboard - data-dense but elegant |
| **Tenant Admin** | Store management, orders, products | Dashboard - focused, efficient |
| **Shopper** | Easy browsing, smooth checkout | Storefront - inviting, trustworthy |

---

## 2. TONE: LUXURY ART DECO

### Why This Direction?
1. **Trust & Premium Feel**: E-commerce requires trust. Luxury aesthetics convey professionalism and quality.
2. **Differentiation**: Art Deco is distinctive and memorable - not seen in typical SaaS platforms.
3. **Versatility**: Works equally well for:
   - Dashboard (professional, sophisticated)
   - Storefront (inviting, premium shopping experience)

---

## 3. VISUAL IDENTITY

### Color Palette

#### Light Theme
```css
:root {
  /* Primary - Deep Emerald */
  --color-primary: #1B4D3E;
  --color-primary-light: #2D7A5F;
  --color-primary-dark: #0F2E25;
  
  /* Secondary - Warm Gold */
  --color-secondary: #C9A962;
  --color-secondary-light: #E5D4A1;
  --color-secondary-dark: #9A7F3E;
  
  /* Accent - Terracotta */
  --color-accent: #C75B39;
  --color-accent-light: #E8836A;
  --color-accent-dark: #8B3D27;
  
  /* Neutrals */
  --color-background: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FDFCFA;
  --color-border: #E8E4DD;
  --color-border-strong: #D4CFC6;
  
  /* Text */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #5C5C5C;
  --color-text-muted: #8C8C8C;
  --color-text-inverse: #FFFFFF;
  
  /* Status */
  --color-success: #2D7A5F;
  --color-warning: #D4A017;
  --color-error: #C75B39;
  --color-info: #1B4D3E;
}
```

#### Dark Theme
```css
.dark {
  /* Primary - Lighter Emerald */
  --color-primary: #2D7A5F;
  --color-primary-light: #4A9B7F;
  --color-primary-dark: #1B4D3E;
  
  /* Secondary - Muted Gold */
  --color-secondary: #B8964F;
  --color-secondary-light: #D4C08A;
  --color-secondary-dark: #8B7039;
  
  /* Accent - Coral */
  --color-accent: #E8836A;
  --color-accent-light: #F5A594;
  --color-accent-dark: #C75B39;
  
  /* Neutrals */
  --color-background: #0F0F0F;
  --color-surface: #1A1A1A;
  --color-surface-elevated: #252525;
  --color-border: #333333;
  --color-border-strong: #444444;
  
  /* Text */
  --color-text-primary: #F5F5F5;
  --color-text-secondary: #B0B0B0;
  --color-text-muted: #707070;
  --color-text-inverse: #0F0F0F;
}
```

### Typography

#### Font Selection
```css
/* Display / Headlines - Elegant, geometric */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');

/* Body / UI - Refined, readable */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

/* Accent / Code - Technical precision */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Font Families */
  --font-display: 'Cinzel', serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### Type Scale
```
h1: Cinzel Bold, 48px, -0.02em tracking
h2: Cinzel Semibold, 36px, -0.01em tracking
h3: Cinzel Medium, 24px, 0
h4: Outfit Semibold, 20px, 0
h5: Outfit Medium, 18px, 0
h6: Outfit Medium, 16px, 0
body: Outfit Regular, 16px, 1.5
small: Outfit Regular, 14px, 1.5
caption: Outfit Regular, 12px, 1.4
```

### Spacing System
```css
:root {
  /* Base spacing unit: 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Border Radius
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.25rem;    /* 4px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;
}
```

### Shadows
```css
:root {
  /* Subtle, elegant shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  
  /* Glow effect for accent elements */
  --shadow-gold: 0 0 20px rgba(201, 169, 98, 0.3);
  --shadow-emerald: 0 0 20px rgba(27, 77, 62, 0.3);
}
```

---

## 4. ART DECO DESIGN ELEMENTS

### Geometric Patterns

#### Chevron Pattern (Background)
```css
.chevron-bg {
  background-image: 
    linear-gradient(135deg, transparent 25%, rgba(201, 169, 98, 0.03) 25%, rgba(201, 169, 98, 0.03) 50%, transparent 50%, transparent 75%, rgba(201, 169, 98, 0.03) 75%),
    linear-gradient(45deg, transparent 25%, rgba(201, 169, 98, 0.03) 25%, rgba(201, 169, 98, 0.03) 50%, transparent 50%, transparent 75%, rgba(201, 169, 98, 0.03) 75%);
  background-size: 40px 40px;
}
```

#### Art Deco Border
```css
.art-deco-border {
  border: 2px solid var(--color-secondary);
  position: relative;
}

.art-deco-border::before,
.art-deco-border::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-secondary);
  transition: all 0.3s ease;
}

.art-deco-border::before {
  top: -6px;
  left: -6px;
  border-right: none;
  border-bottom: none;
}

.art-deco-border::after {
  bottom: -6px;
  right: -6px;
  border-left: none;
  border-top: none;
}
```

#### Sunburst Accent
```css
.sunburst {
  position: relative;
}

.sunburst::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(201, 169, 98, 0.1) 10deg,
    transparent 20deg,
    transparent 40deg,
    rgba(201, 169, 98, 0.1) 50deg,
    transparent 60deg,
    transparent 80deg,
    rgba(201, 169, 98, 0.1) 90deg,
    transparent 100deg
  );
  animation: rotate 20s linear infinite;
}
```

### Decorative Elements

#### Corner Accents
```css
.corner-accent {
  position: relative;
}

.corner-accent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-top: 2px solid var(--color-secondary);
  border-left: 2px solid var(--color-secondary);
}

.corner-accent-bottom-right::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-bottom: 2px solid var(--color-secondary);
  border-right: 2px solid var(--color-secondary);
}
```

#### Divider Lines
```css
.divider-deco {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider-deco::before,
.divider-deco::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-border-strong),
    transparent
  );
}

.divider-deco-icon {
  color: var(--color-secondary);
  font-size: 1.25rem;
}
```

---

## 5. MOTION & ANIMATIONS

### Page Load Reveals
```css
/* Staggered fade-in from bottom */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Stagger delays */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
```

### Micro-interactions
```css
/* Button hover - subtle lift */
.btn-luxury {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-luxury:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 169, 98, 0.25);
}

/* Card hover - elegant reveal */
.card-luxury {
  transition: all 0.4s ease;
}

.card-luxury:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-luxury:hover .card-border-deco {
  opacity: 1;
  transform: scale(1);
}

/* Input focus - golden glow */
.input-luxury:focus {
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.15);
}
```

### Page Transitions
```css
/* Smooth page transitions */
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease-out;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}
```

---

## 6. COMPONENT SPECIFICATIONS

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-emerald);
}
```

#### Secondary Button (Gold Outline)
```css
.btn-secondary {
  background: transparent;
  color: var(--color-secondary-dark);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-secondary);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--color-secondary);
  color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold);
}
```

### Cards

#### Product Card
```css
.product-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  border: 1px solid var(--color-border);
  transition: all 0.4s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-secondary-light);
}

/* Art Deco corner accent on hover */
.product-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 40px 40px 0;
  border-color: transparent var(--color-secondary) transparent transparent;
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover::after {
  opacity: 1;
}
```

#### Dashboard Stat Card
```css
.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  position: relative;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-secondary)
  );
}
```

### Inputs

#### Text Input
```css
.input-luxury {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--text-base);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  transition: all 0.3s ease;
}

.input-luxury::placeholder {
  color: var(--color-text-muted);
}

.input-luxury:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.15);
}
```

### Navigation

#### Top Nav
```css
.nav-luxury {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-2xl);
  color: var(--color-primary);
  letter-spacing: 0.05em;
}

.nav-links {
  display: flex;
  gap: 2rem;
  font-family: var(--font-body);
  font-weight: var(--font-medium);
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-secondary);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## 7. BACKGROUND EFFECTS

### Subtle Grain Texture
```css
.bg-texture {
  position: relative;
}

.bg-texture::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

### Gradient Mesh Background
```css
.bg-mesh {
  background: 
    radial-gradient(at 40% 20%, rgba(27, 77, 62, 0.08) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(201, 169, 98, 0.08) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(199, 91, 57, 0.05) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(27, 77, 62, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(201, 169, 98, 0.08) 0px, transparent 50%),
    var(--color-background);
}
```

---

## 8. DASHBOARD LAYOUT

### Sidebar Navigation
```css
.sidebar {
  width: 280px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-nav {
  padding: 1rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-item:hover {
  background: rgba(27, 77, 62, 0.05);
  color: var(--color-primary);
}

.sidebar-item.active {
  background: rgba(27, 77, 62, 0.1);
  color: var(--color-primary);
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-secondary);
  border-radius: 0 var(--radius-full) var(--radius-full) 0;
}
```

---

## 9. RESPONSIVE BREAKPOINTS

```css
:root {
  /* Mobile first approach */
  --breakpoint-sm: 640px;   /* Small tablets */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}

/* Usage */
@media (min-width: 768px) {
  /* Tablet and up */
}

@media (min-width: 1024px) {
  /* Laptop and up */
}
```

---

## 10. ACCESSIBILITY

### Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Focus indicators visible
- Color contrast ratio minimum 4.5:1
- Screen reader compatible
- Reduced motion support

### Focus States
```css
/* Visible focus indicator */
*:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. IMPLEMENTATION NOTES

### Technical Requirements
- Framework: Next.js 14 with App Router
- Styling: Tailwind CSS + shadcn/ui
- Animations: Framer Motion
- Icons: Lucide React
- Forms: React Hook Form + Zod

### shadcn/ui Customization
The default shadcn/ui components will be customized to match this design system:
- Override CSS variables for colors
- Add Art Deco styled components
- Customize buttons, inputs, cards
- Create new themed components

---

## 12. SUMMARY

### Key Visual Elements
| Element | Description |
|---------|-------------|
| **Primary Color** | Deep Emerald (#1B4D3E) |
| **Secondary Color** | Warm Gold (#C9A962) |
| **Accent Color** | Terracotta (#C75B39) |
| **Display Font** | Cinzel |
| **Body Font** | Outfit |
| **Visual Motif** | Art Deco geometric patterns |

### Differentiation Factor
**The memorable element**: Elegant Art Deco-inspired design with gold accents on deep emerald, creating a sophisticated, premium marketplace feel that stands out from generic SaaS platforms.

---

*Design Specification - MultiVend SaaS Platform*
*Version 1.0 - 2026*
