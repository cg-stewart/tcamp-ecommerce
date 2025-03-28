# T-Camp E-commerce Platform

A modern e-commerce and workshop management platform built with Next.js 14, featuring Role-Based Access Control (RBAC) and a luxurious UI design.

## Features

### Public Access
- 🛍️ Browse and view workshops
- 📝 Submit custom design requests
- 📰 Newsletter signup
- 🤝 Volunteer applications
- 📞 Contact forms

### User Dashboard (Authenticated)
- 🎓 Workshop registration and participation
- 👗 Custom design request tracking
- 👤 User profile management
- 💳 Billing information

### Admin Dashboard
- 🎯 Comprehensive workshop management
- 📊 Newsletter subscriber management
- 🤝 Volunteer coordination
- 👗 Custom design request handling
- 👥 User management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Database**: Supabase with Drizzle ORM
- **UI Components**: 
  - Radix UI (Headless components)
  - Tailwind CSS (Styling)
  - Framer Motion (Animations)
  - AG Grid (Data tables)
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: UploadThing
- **State Management**: SWR for server state

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone https://github.com/cg-stewart/tcamp-ecommerce.git
cd tcamp-ecommerce
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure the following services:
- Clerk (Authentication)
- Supabase (Database)
- UploadThing (File uploads)

5. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

## Project Structure

\`\`\`
├── app/                  # Next.js 14 app directory
│   ├── actions/         # Server actions
│   ├── admin/          # Admin dashboard routes
│   ├── api/            # API routes
│   ├── dashboard/      # User dashboard routes
│   └── ...            # Public routes
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── dashboard/     # Dashboard-specific components
│   └── home/          # Homepage components
├── lib/               # Utilities and configurations
│   ├── db/           # Database schemas and config
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Helper functions
│   └── validations/  # Zod schemas
└── public/           # Static assets
\`\`\`

## Security

The application implements a robust RBAC system:

1. **Middleware Protection**:
   - Admin routes (`/admin/*`)
   - Dashboard routes (`/dashboard/*`)
   - API routes (`/api/*`)

2. **Page-Level Protection**:
   - Server-side authentication checks
   - Role-based access verification
   - Protected API routes

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/my-feature\`
3. Commit your changes: \`git commit -m 'feat: add some feature'\`
4. Push to the branch: \`git push origin feature/my-feature\`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
