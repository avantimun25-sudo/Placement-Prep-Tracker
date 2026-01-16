# Placement Preparation Tracker

## Overview

A full-stack web application designed to help students track their placement preparation journey. The app provides tools for monitoring skills development, managing job applications, setting daily goals, tracking progress with visual analytics, and accessing expert placement tips.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and cache management
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for data visualization (progress charts, skill analytics)
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful JSON API with type-safe route definitions in `shared/routes.ts`
- **Development**: TSX for direct TypeScript execution without compilation step

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Migrations**: Drizzle Kit manages schema migrations in `/migrations` folder

### Project Structure
```
├── client/          # React frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route page components
│       ├── hooks/        # Custom React hooks for data fetching
│       └── lib/          # Utility functions
├── server/          # Express backend
│   ├── routes.ts    # API endpoint definitions
│   ├── storage.ts   # Database access layer
│   └── db.ts        # Database connection
├── shared/          # Shared types and schemas
│   ├── schema.ts    # Drizzle database schema
│   └── routes.ts    # Type-safe API route definitions
└── migrations/      # Database migrations
```

### Key Design Patterns
- **Shared Schema**: Database schemas and API contracts are defined once in `/shared` and used by both frontend and backend
- **Type Safety**: End-to-end TypeScript with Zod validation ensures consistent data types
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts database operations, making it easy to swap implementations
- **Hooks Pattern**: Custom hooks in `client/src/hooks/` encapsulate data fetching logic using React Query

### Data Models
- **Skills**: Track proficiency levels across technical, aptitude, and soft-skills categories
- **Goals**: Daily checkable tasks with completion status
- **Companies**: Job application pipeline with status tracking (wishlist → applied → interviewing → offer/rejected)
- **Tips**: Curated placement advice organized by category

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- `connect-pg-simple` for session storage

### UI Component Libraries
- Full shadcn/ui component suite (dialogs, accordions, forms, etc.)
- Radix UI primitives for accessible components
- Lucide React for icons

### Key Runtime Dependencies
- `drizzle-orm` + `drizzle-zod`: Database ORM with Zod schema generation
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `recharts`: Charting library for analytics
- `date-fns`: Date manipulation utilities

### Development Tools
- Replit Vite plugins for development experience (error overlay, cartographer)
- esbuild for production server bundling