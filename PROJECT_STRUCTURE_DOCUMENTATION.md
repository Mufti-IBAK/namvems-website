# NAMVEMS Website - Project Structure & File Documentation
**Project:** Nigerian Association of Muslim Veterinary Medical Students Website  
**Framework:** Next.js 15.4.5 with App Router  
**Generated:** January 3, 2025

---

## Project Overview

The NAMVEMS website is a modern web application built with Next.js 14, featuring an admin dashboard for content management and a public-facing website for members and visitors. The application uses Supabase for authentication, database management, and file storage.

### Technology Stack
- **Frontend:** Next.js 15.4.5 (App Router), React 19.1.0, TypeScript 5
- **Styling:** Tailwind CSS v4 with PostCSS
- **Authentication:** Supabase Auth with role-based access control
- **Database:** Supabase PostgreSQL with SSR support
- **File Storage:** Supabase Storage for file uploads
- **State Management:** React Context API (AuthContext)
- **Form Handling:** Server Actions with Zod validation
- **Animations:** GSAP 3.13.0 with ScrollTrigger
- **Icons:** React Icons 5.5.0 (Font Awesome and others)
- **Date Handling:** date-fns 4.1.0
- **Fonts:** Next.js Google Fonts (Inter, Plus Jakarta Sans)
- **Notifications:** React Hot Toast 2.6.0

---

## Complete Directory Tree

```
namvems-website/
├── .gitignore                              # Git ignore configuration
├── .env                                    # Environment variables (git-ignored)
├── .env.example                            # Environment variables template
├── .gitignore                             # Git ignore patterns
├── .hintrc                                # Web development hints configuration
├── COMPREHENSIVE_DEBUG_REPORT.md          # Comprehensive debug documentation
├── ENV_VARIABLES_FIX.md                   # Environment variables fix documentation
├── eslint.config.mjs                      # ESLint configuration (flat config)
├── HOMEPAGE_FIXES_SUMMARY.md              # Homepage fixes documentation
├── NAMVEMS_DEBUG_REPORT.md                # Original debug report
├── next.config.ts                         # Next.js configuration with security headers
├── package.json                           # Project dependencies and scripts
├── package-lock.json                      # Dependency lock file
├── postcss.config.mjs                     # PostCSS configuration for Tailwind v4
├── PROJECT_STRUCTURE_DOCUMENTATION.md     # This file - detailed structure docs
├── PROJECT_SUMMARY_FOR_AI.md              # AI project summary and context
├── README.md                              # Main project documentation
├── tsconfig.json                          # TypeScript configuration (strict mode)
├── TYPESCRIPT_FIXES_SUMMARY.md            # TypeScript fixes documentation
│
├── public/                                # Static assets
│   ├── assets/
│   │   └── logo.png                       # NAMVEMS logo
│   ├── images/
│   │   └── hero/
│   │       └── mosque-nigeria.jpg         # Hero section background image
│   ├── file.svg                          # File icon
│   ├── globe.svg                         # Globe icon
│   ├── next.svg                          # Next.js logo
│   ├── vercel.svg                        # Vercel logo
│   └── window.svg                        # Window icon
│
└── src/                                   # Source code
    ├── app/                               # Next.js 14 App Router pages
    │   ├── (admin)/                       # Admin route group (protected)
    │   │   ├── admin/                     # Admin pages
    │   │   │   ├── events/                # Event management
    │   │   │   │   ├── create/
    │   │   │   │   │   └── page.tsx       # Create new event page
    │   │   │   │   ├── edit/
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx   # Edit specific event page
    │   │   │   │   ├── actions.ts         # Server actions for events
    │   │   │   │   ├── AdminEventCard.tsx # Admin event card component
    │   │   │   │   ├── EventActions.tsx   # Event action buttons component
    │   │   │   │   ├── EventForm.tsx      # Event form component
    │   │   │   │   └── page.tsx           # Events management main page
    │   │   │   ├── resources/             # Resource management
    │   │   │   │   ├── create/
    │   │   │   │   │   └── page.tsx       # Create new resource page
    │   │   │   │   ├── edit/
    │   │   │   │   │   └── [id]/
    │   │   │   │   │       └── page.tsx   # Edit specific resource page
    │   │   │   │   ├── actions.ts         # Server actions for resources
    │   │   │   │   ├── page.tsx           # Resources management main page
    │   │   │   │   ├── ResourceActions.tsx # Resource action buttons component
    │   │   │   │   └── ResourceForm.tsx   # Resource form component
    │   │   │   ├── test/
    │   │   │   │   └── page.tsx           # Admin test page
    │   │   │   ├── users/                 # User management (super admin only)
    │   │   │   │   ├── actions.ts         # Server actions for users
    │   │   │   │   └── page.tsx           # Users management page
    │   │   │   └── page.tsx               # Admin dashboard main page
    │   │   ├── layout.tsx                 # Admin layout with sidebar
    │   │   └── layout-component.tsx       # Admin layout component
    │   │
    │   ├── (public)/                      # Public route group
    │   │   ├── events/                    # Public events pages
    │   │   │   ├── [id]/                  # Individual event pages
    │   │   │   │   ├── register/
    │   │   │   │   │   └── page.tsx       # Event registration page
    │   │   │   │   └── page.tsx           # Event detail page
    │   │   │   └── page.tsx               # Events listing page
    │   │   ├── resources/                 # Public resources pages
    │   │   │   ├── [id]/
    │   │   │   │   └── page.tsx           # Resource detail page
    │   │   │   └── page.tsx               # Resources listing page
    │   │   ├── layout.tsx                 # Public layout with header/footer
    │   │   └── page.tsx                   # Homepage
    │   │
    │   ├── auth/
    │   │   └── callback/
    │   │       └── route.ts               # Supabase auth callback handler
    │   ├── dashboard/
    │   │   └── page.tsx                   # User dashboard (deprecated/unused)
    │   ├── elibrary/
    │   │   └── page.tsx                   # E-library page
    │   ├── login/
    │   │   └── page.tsx                   # Login page
    │   ├── test-role/
    │   │   └── page.tsx                   # Role testing page
    │   ├── favicon.ico                    # Website favicon
    │   ├── globals.css                    # Global CSS styles
    │   └── layout.tsx                     # Root layout
    │
    ├── components/                        # Reusable React components
    │   ├── buttons/                       # Button components
    │   │   ├── IconButton.tsx             # Icon button component
    │   │   ├── PrimaryButton.tsx          # Primary button component
    │   │   └── SecondaryButton.tsx        # Secondary button component
    │   ├── cards/                         # Card components
    │   │   ├── EventCard.tsx              # Public event card component
    │   │   └── ResourceCard.tsx           # Public resource card component
    │   ├── forms/                         # Form components
    │   │   ├── EventForm.tsx              # Public event form component
    │   │   ├── InputField.tsx             # Input field component
    │   │   ├── ResourceForm.tsx           # Public resource form component
    │   │   └── TextArea.tsx               # Text area component
    │   ├── Footer.tsx                     # Website footer component
    │   ├── Header.tsx                     # Website header component
    │   ├── LayoutClient.tsx               # Client-side layout component
    │   └── ParallaxSection.tsx            # Parallax effect component
    │
    ├── context/                           # React Context providers
    │   └── AuthContext.tsx                # Authentication context provider
    │
    ├── hooks/                             # Custom React hooks
    │   └── useGSAPAnimations.ts           # GSAP animation hooks
    │
    ├── lib/                               # Utility libraries and services
    │   ├── constants/
    │   │   └── images.ts                  # Image constants and URLs
    │   ├── services/                      # API service functions
    │   │   ├── eventsService.ts           # Events API service
    │   │   └── resourceService.ts         # Resources API service
    │   ├── supabase/                      # Supabase client configurations
    │   │   ├── admin.ts                   # Admin Supabase client
    │   │   ├── client.ts                  # Client-side Supabase client
    │   │   └── server.ts                  # Server-side Supabase client
    │   └── types/                         # TypeScript type definitions
    │       ├── event.ts                   # Event type definitions
    │       ├── index.ts                   # Main type exports
    │       └── resource.ts                # Resource type definitions
    │
    └── utils/                             # Utility functions (empty/future use)
```

---

## File Descriptions

### Root Configuration Files

#### `.gitignore`
Standard Git ignore file excluding:
- `node_modules/` - Dependencies
- `.next/` - Build files
- `.env*` - Environment variables
- Build artifacts and cache files

#### `.hintrc`
Configuration file for webhint, a linting tool that helps identify issues in web projects.

#### `eslint.config.mjs`
ESLint configuration using the new flat config format for Next.js projects with TypeScript support.

#### `next.config.ts`
Next.js configuration file specifying:
- Experimental features
- Image domains
- Build optimizations
- Custom webpack configurations

#### `package.json`
Project metadata and dependencies including:
- **Scripts:** `dev`, `build`, `start`, `lint`
- **Dependencies:** Next.js, React, Supabase, Tailwind CSS, TypeScript
- **DevDependencies:** ESLint, PostCSS

#### `postcss.config.mjs`
PostCSS configuration for Tailwind CSS processing.

#### `tsconfig.json`
TypeScript configuration with:
- Strict type checking enabled
- Path aliases (`@/*` → `src/*`)
- Next.js optimizations

### Public Assets

#### `public/assets/logo.png`
NAMVEMS official logo used in headers and navigation.

#### `public/images/hero/mosque-nigeria.jpg`
Hero section background image featuring a Nigerian mosque.

#### SVG Icons (`public/*.svg`)
Various icons used throughout the application for UI elements.

### Application Pages

#### `src/app/layout.tsx`
**Root Layout Component**
- Provides global HTML structure
- Wraps application in AuthProvider
- Includes Toaster for notifications
- Sets up Inter font family

#### `src/app/(admin)/layout.tsx`
**Admin Layout Component** *(Recently Enhanced)*
- Protected layout requiring admin/super_admin role
- Features responsive sidebar navigation
- Includes mobile menu support
- **Recent Fix:** Added mobile touch handling to prevent pull-to-refresh during file uploads
- **Recent Fix:** Enhanced authentication state management

#### `src/app/(admin)/admin/page.tsx`
**Admin Dashboard Main Page**
- Displays key statistics (users, events, resources)
- Shows recent events and user activity
- Provides quick action buttons
- Uses admin Supabase client for privileged operations

#### `src/app/(admin)/admin/events/page.tsx`
**Events Management Page** *(Recently Fixed)*
- **Previous Issue:** Displayed dashboard content instead of events management
- **Fix Applied:** Completely replaced with proper events management interface
- **New Features:**
  - Grid display of all events using AdminEventCard components
  - Event statistics (total, upcoming, past)
  - Create new event functionality
  - Proper empty state handling

#### `src/app/(admin)/admin/events/AdminEventCard.tsx`
**Admin Event Card Component**
- Displays individual event in admin interface
- Shows event image, title, and date
- Integrates with EventActions for edit/delete functionality
- Includes hover effects and responsive design

#### `src/app/(admin)/admin/events/EventActions.tsx`
**Event Action Buttons Component**
- Provides edit and delete buttons for events
- Handles confirmation dialogs
- Uses React transitions for loading states
- Integrated with toast notifications

#### `src/app/(admin)/admin/events/actions.ts`
**Event Server Actions**
- `upsertEvent()` - Create or update events with file upload
- `deleteEvent()` - Delete events with proper authorization
- File upload handling to Supabase Storage
- Form validation using Zod
- Path revalidation for cache invalidation

#### `src/app/(admin)/admin/resources/ResourceForm.tsx`
**Resource Upload Form** *(Recently Enhanced)*
- **Previous Issue:** Mobile file uploads failed due to authentication reloads
- **Fixes Applied:**
  - Added `e.stopPropagation()` to prevent event bubbling
  - Enhanced mobile file selection logging
  - Added upload state tracking
- Supports file upload with preview
- Server-side validation and processing

#### `src/app/(admin)/admin/resources/actions.ts`
**Resource Server Actions**
- `upsertResource()` - Handle resource creation/updates
- `deleteResource()` - Remove resources with authorization
- File type validation and size limits
- Supabase Storage integration

#### `src/app/(public)/page.tsx`
**Homepage Component**
- Hero section with background image
- Organization statistics
- Latest events and resources display
- Call-to-action sections
- Parallax effects and animations

#### `src/app/(public)/layout.tsx`
**Public Layout Component**
- Header with navigation
- Footer with contact information
- Responsive design
- SEO optimizations

### Components

#### `src/components/cards/EventCard.tsx`
**Public Event Card Component**
- Displays events for public visitors
- Registration functionality
- Responsive card design
- Image handling with fallbacks

#### `src/components/cards/ResourceCard.tsx`
**Public Resource Card Component**
- Shows downloadable resources
- File type icons
- Download functionality
- Responsive layout

#### Form Components (`src/components/forms/`)
- `InputField.tsx` - Reusable input component with validation
- `TextArea.tsx` - Reusable textarea component
- `EventForm.tsx` - Public event form (different from admin version)
- `ResourceForm.tsx` - Public resource form

#### Layout Components
- `Header.tsx` - Main navigation header
- `Footer.tsx` - Website footer with links
- `LayoutClient.tsx` - Client-side layout wrapper
- `ParallaxSection.tsx` - Parallax scrolling effects

### Context and State Management

#### `src/context/AuthContext.tsx`
**Authentication Context Provider** *(Recently Enhanced)*
- Manages user authentication state
- Role-based access control (member, admin, super_admin)
- **Recent Fix:** Optimized authentication state management to prevent unnecessary reloads
- Session persistence and cleanup
- Integration with Supabase Auth

### Hooks

#### `src/hooks/useGSAPAnimations.ts`
**GSAP Animation Hook**
- Provides animation utilities
- Fade-in effects
- Scroll-triggered animations
- Performance optimizations

### Library and Services

#### `src/lib/supabase/`
**Supabase Client Configuration**
- `client.ts` - Client-side Supabase instance
- `server.ts` - Server-side Supabase instance  
- `admin.ts` - Admin-privileged Supabase instance

#### `src/lib/services/`
**API Service Functions**
- `eventsService.ts` - Event-related API calls
- `resourceService.ts` - Resource-related API calls
- Centralized data fetching logic
- Error handling and caching

#### `src/lib/types/`
**TypeScript Type Definitions**
- `event.ts` - Event interface definitions
- `resource.ts` - Resource interface definitions
- `index.ts` - Consolidated type exports
- Ensures type safety across the application

#### `src/lib/constants/`
**Application Constants**
- `images.ts` - Image URLs and alt text constants
- Centralized configuration management

### Styling

#### `src/app/globals.css`
**Global Stylesheet**
- Tailwind CSS imports
- Custom CSS variables
- Component-specific styles
- Animation keyframes
- Responsive design utilities

---

## Key Architectural Decisions

### 1. Next.js 14 App Router
- **File-based routing** with layout nesting
- **Server Components** by default for better performance
- **Route groups** `(admin)` and `(public)` for layout separation
- **Server Actions** for form handling and mutations

### 2. Authentication & Authorization
- **Supabase Auth** for authentication
- **Role-based access control** (RBAC) with three roles:
  - `member` - Basic user access
  - `admin` - Content management access
  - `super_admin` - Full system access including user management

### 3. Data Management
- **Supabase PostgreSQL** for relational data
- **Supabase Storage** for file uploads
- **React Context** for global state management
- **Server-side data fetching** for SEO and performance

### 4. Component Architecture
- **Separation of concerns** between public and admin components
- **Reusable UI components** in `/components`
- **Form handling** with server actions
- **Type safety** throughout the application

### 5. File Upload Strategy
- **Server-side processing** for security
- **File type validation** and size limits
- **Supabase Storage** integration
- **Mobile optimization** with enhanced event handling

---

## Recent Enhancements & Bug Fixes

### 1. Sidebar Navigation Fix ✅
**Issue:** "Manage Events" button showed dashboard content instead of events management.
**Solution:** Replaced `/src/app/(admin)/admin/events/page.tsx` with proper events management interface.

### 2. Mobile File Upload Enhancement ✅  
**Issue:** File uploads failed on mobile devices due to authentication reloads.
**Solutions:**
- Added event propagation prevention in `ResourceForm.tsx`
- Enhanced mobile touch handling in admin layout
- Improved upload state management

### 3. Authentication Optimization ✅
**Issue:** Unnecessary re-authentication during file operations.
**Solution:** Optimized AuthContext and admin layout for better stability.

---

## Development Guidelines

### File Organization
- **Pages** go in `/src/app` following Next.js 14 App Router conventions
- **Reusable components** go in `/src/components`
- **Business logic** goes in `/src/lib/services`
- **Type definitions** go in `/src/lib/types`

### Naming Conventions
- **PascalCase** for components and types
- **camelCase** for functions and variables
- **kebab-case** for file names when containing multiple words
- **SCREAMING_SNAKE_CASE** for constants

### Code Quality Standards
- **TypeScript strict mode** enabled
- **ESLint** configuration for code consistency
- **Component documentation** with JSDoc comments
- **Error handling** with proper user feedback

---

## Security Considerations

### 1. Authentication & Authorization
- **Row Level Security** (RLS) in Supabase
- **Role verification** on both client and server
- **Protected routes** with proper redirects

### 2. File Upload Security
- **Server-side validation** of file types and sizes
- **Sanitized file names** to prevent path traversal
- **Storage bucket policies** for access control

### 3. Data Validation
- **Input sanitization** with Zod schemas
- **SQL injection protection** through Supabase ORM
- **CSRF protection** through server actions

---

## Performance Optimizations

### 1. Next.js Optimizations
- **Static generation** where possible
- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Bundle analysis** and optimization

### 2. Database Optimizations
- **Proper indexing** on frequently queried fields
- **Query optimization** with selected fields only
- **Connection pooling** through Supabase

### 3. Frontend Optimizations
- **Lazy loading** of non-critical components
- **Optimized animations** with GSAP
- **Efficient state management** with React Context
- **Memoization** of expensive computations

---

## Deployment & Infrastructure

### Current Setup
- **Vercel** for hosting and deployment
- **Supabase** for backend services
- **Domain management** through Vercel
- **SSL certificates** automatically managed

### Environment Configuration
- **Development** - Local with Supabase development instance
- **Production** - Vercel deployment with Supabase production instance
- **Environment variables** managed through Vercel dashboard

---

## Future Development Recommendations

### 1. Testing Implementation
- **Unit tests** with Jest and React Testing Library
- **Integration tests** for critical user flows
- **E2E tests** with Playwright
- **Test coverage** reporting

### 2. Performance Monitoring
- **Real User Monitoring** (RUM) with Vercel Analytics
- **Error tracking** with Sentry
- **Performance metrics** monitoring
- **Core Web Vitals** optimization

### 3. Feature Enhancements
- **Real-time notifications** with Supabase Realtime
- **Advanced search** and filtering
- **Offline support** with service workers
- **Mobile app** development with React Native

### 4. Security Enhancements
- **Content Security Policy** (CSP) implementation
- **Rate limiting** for API endpoints
- **Advanced file scanning** for uploads
- **Security headers** optimization

---

**Documentation Generated:** August 27, 2025  
**Last Updated:** After recent bug fixes and enhancements  
**Maintained By:** NAMVEMS Development Team
