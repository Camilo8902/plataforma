# MultiVend - Multi-Tenant SaaS Marketplace Platform

A sophisticated multi-tenant marketplace platform built with Next.js 14, Supabase, and a Luxury Art Deco design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account (for payments)
- Vercel account (for deployment)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration:
     ```bash
     # Option 1: Using Supabase CLI
     supabase db push
     
     # Option 2: Using SQL Editor
     # Copy the contents of supabase/migrations/001_initial_schema.sql
     # and paste it into your Supabase SQL Editor
     ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then fill in your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📋 Database Schema

The migration creates the following tables:

- **plans** - Subscription plans (Basic, Professional, Enterprise)
- **tenants** - Tenant organizations
- **users** - Platform users with roles
- **categories** - Product categories (global and tenant-specific)

### Roles
- `superadmin` - Full platform access
- `tenant_admin` - Tenant management
- `seller` - Product and order management
- `viewer` - Read-only access
- `customer` - Storefront shoppers

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, React
- **Styling:** Tailwind CSS, Custom Art Deco Design System
- **Backend:** Next.js API Routes, Server Actions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe Connect

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (store)/           # Public storefront
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── dashboard/         # Dashboard components
│   └── storefront/        # Storefront components
├── lib/
│   └── supabase/          # Supabase clients
├── types/                 # TypeScript types
└── hooks/                 # Custom React hooks
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📄 License

MIT License - feel free to use this for your own projects.
