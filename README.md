# Spicy Thrifts POS – Internal Management System

Spicy Thrifts POS is a secure, modern, and efficient Point of Sale and inventory management system designed exclusively for internal staff. It streamlines sales, inventory, and operational workflows for Spicy Thrifts retail operations.

## Features

- **Staff Authentication & Authorization** (Admin & Sales roles)
- **Sales Order Management** (Create, view, and manage orders)
- **Product & Inventory Management** (CRUD for products, categories, variants)
- **Low Stock & Sales Reports**
- **Responsive UI** for desktop and tablet
- **Role-based Dashboards** (Admin & Sales)
- **Secure API** with input validation and error handling
- **Modern UI** with Tailwind CSS and custom branding

## Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** (Configured via `/database/schema.sql`)
- **ORM/Service Layer:** Custom service classes
- **Authentication:** Supabase (see `/lib/supabase`)
- **Validation:** Zod schemas
- **Notifications:** react-hot-toast

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Agbey-Tech/spicy-thrifts-sales.git
cd spicy-thrifts-sales
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

- Copy `.env.example` to `.env.local` and fill in required environment variables (Supabase keys, etc).

### 4. Database Setup

- Review and apply the schema in `/database/schema.sql` to your database.
- (Optional) Seed data using `/database/seed.sql`.

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app.

## Project Structure

- `app/` – Next.js app directory (routes, pages, API)
- `components/` – Reusable UI components
- `core/validation/` – Zod schemas for input validation
- `database/` – SQL schema and seed files
- `lib/` – API, authentication, and utility libraries
- `services/` – Business logic and data access
- `types/` – TypeScript types

## Contributing

This project is proprietary and intended solely for Spicy Thrifts and its authorized internal team.  
**External contributions, forks, or pull requests are not permitted.**  
If you are a team member and need access, please contact the project administrator.

## License

This project is confidential and for internal use by Spicy Thrifts staff only.  
Unauthorized use, distribution, or modification is strictly prohibited.

---

**For technical support, contact:**

- Email: ziglacity@gmail.com
- Phone: +233 592 194 480

**Main website:** [spicythrifts.com](https://spicythrifts.com)
