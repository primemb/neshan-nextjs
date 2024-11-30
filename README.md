# Project Setup and Development Guide

## Overview

This is a [Next.js](https://nextjs.org/) project bootstrapped with `create-next-app`, designed to provide a robust web application framework with modern development practices.

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (recommended version: 18.x or later)
- npm, Yarn, pnpm, or Bun package manager
- Git
- A code editor (VS Code, WebStorm, etc.)

## Project Configuration

### Environment Setup

1. Create a `.env` file in the project root directory
2. Copy the contents from `.env.example`
3. Fill in the necessary environment variables with your specific configuration

   ```bash
   # Example configuration
   NEXT_PUBLIC_NESHAN_MAP_KEY=web.******
   NESHAN_API_KEY=service.******
   DATABASE_URL="postgres://*****"
   ```

### Database Migrations

Initialize or update the database schema:

```bash
npx prisma db push
```

This command applies any pending database schema changes defined in your Prisma schema.

## Development Workflow

### Running the Development Server

Start the development server using your preferred package manager:

```bash
# npm
npm run dev

# Yarn
yarn dev

# pnpm
pnpm dev

# Bun
bun dev
```

### Accessing the Application

Once the server is running, open [http://localhost:3000](http://localhost:3000) in your web browser.

## Additional Development Commands

- `npm run build`: Create a production build
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality
- `npx prisma studio`: Open Prisma Studio for database management

## Best Practices

- Always work on a feature branch
- Keep `.env` files out of version control
- Regularly update dependencies
- Use TypeScript for type safety
- Follow consistent code formatting

## Troubleshooting

- Ensure all environment variables are correctly set
- Verify database connection strings
- Check Node.js and package manager versions
- Clear npm/yarn cache if experiencing dependency issues
