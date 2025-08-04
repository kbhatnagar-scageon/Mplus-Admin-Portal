# Pharmacy Admin Portal - Development Guide for Claude

## Project Overview

Building a **multi-persona pharmacy admin dashboard** for Superadmin role with user management, store management, delivery management, and refund management capabilities. Built with Next.js, shadcn/ui, and Tailwind CSS with a focus on **minimalist, elegant design**.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript
- **UI Framework**: shadcn/ui (New York style) - **PRIMARY FOCUS**
- **Styling**: Tailwind CSS v4 with CSS variables
- **Tables**: TanStack Table v8 with shadcn DataTable
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Query (@tanstack/react-query)
- **Charts**: Recharts for analytics
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Backend**: FastAPI (separate, API-agnostic development)
- **Auth**: Mock authentication (Keycloak integration planned)

## Project Context

- **Domain**: Indian pharmacy delivery platform
- **Users**: Store Vendors + Delivery Personnel
- **Integration**: EvitalRx for pharmacy inventory management
- **Localization**: Indian currency (₹), GST compliance, Indian mobile formats
- **Development**: Desktop-first, role-based UI, comprehensive mock data
- **Design Philosophy**: **Minimalist shadcn/ui aesthetic with seamless UX**

---

# CURRENT IMPLEMENTATION STATUS

## ✅ COMPLETED FOUNDATIONS

### ✅ Core Configuration (DONE)

- **tailwind.config.js** - ✅ Configured with Indic font support
- **src/lib/utils.ts** - ✅ Contains formatCurrency (₹), Indian date formatting, mobile validation
- **src/lib/constants.ts** - ✅ Complete with Indian states, user roles, statuses
- **src/types/common.ts** - ✅ Full interfaces for User, Store, Order, Delivery entities
- **components.json** - ✅ shadcn/ui configured with New York style

### ✅ shadcn/ui Components (INSTALLED)

Currently available components:

- ✅ Core: button, input, label, card, table, badge, avatar
- ✅ Layout: dropdown-menu, dialog, form, select, separator, breadcrumb
- ✅ Data: checkbox, radio-group, switch, tabs, popover, calendar
- ✅ Advanced: skeleton, toast, sonner (notifications)

### ✅ Project Structure (ESTABLISHED)

- ✅ **Feature-based architecture** - All modules organized by domain
- ✅ **Mock data layer** - Comprehensive Indian-context data with faker.js
- ✅ **Authentication system** - Mock auth with localStorage persistence
- ✅ **Shared components** - DataTable, PageHeader, LoadingSpinner, EmptyState
- ✅ **Layout system** - DashboardLayout with Sidebar and Header

### ✅ Indian Localization (IMPLEMENTED)

- ✅ **Currency**: ₹ symbol with Indian number formatting (1,00,000)
- ✅ **Phone numbers**: +91 format validation and formatting
- ✅ **Address structure**: State, District, Pincode with INDIAN_STATES constant
- ✅ **Date formatting**: Asia/Kolkata timezone with Intl.DateTimeFormat
- ✅ **GSTIN/Drug License**: Format validation patterns ready

---

# PHASE 2: CURRENT FEATURES STATUS

## ✅ AUTHENTICATION & LAYOUT (WORKING)

### ✅ Authentication System

- **src/lib/auth.ts** - ✅ Mock authentication with realistic delays
- **src/hooks/use-auth.ts** - ✅ Authentication state management
- **src/types/auth.ts** - ✅ Complete auth type definitions
- **Login flow** - ✅ Working with 'password123' for all mock users

### ✅ Layout Components (FUNCTIONAL)

- **src/components/layout/dashboard-layout.tsx** - ✅ Main wrapper with sidebar/header
- **src/components/layout/sidebar.tsx** - ✅ Navigation with role-based menu items
- **src/components/layout/header.tsx** - ✅ User info, logout functionality
- **src/app/(dashboard)/layout.tsx** - ✅ Route layout implementation

## ✅ USER MANAGEMENT MODULE (PARTIALLY COMPLETE)

### ✅ User Types & Data (READY)

- **src/features/users/types/index.ts** - ✅ Complete User interface
- **src/lib/mock-data/users.ts** - ✅ 50+ users with Indian names/phones
- **src/hooks/use-users.ts** - ✅ CRUD operations with React Query

### ✅ User Components (FUNCTIONAL)

- **src/features/users/components/user-table.tsx** - ✅ TanStack table with filters
- **src/features/users/components/user-form.tsx** - ✅ Role-based form fields
- **src/features/users/components/user-filters.tsx** - ✅ Advanced filtering
- **src/app/(dashboard)/users/page.tsx** - ✅ Main listing page

### 🔄 User Pages (IN PROGRESS)

- **src/app/(dashboard)/users/create/page.tsx** - ⚠️ Basic structure
- **src/app/(dashboard)/users/[id]/page.tsx** - ⚠️ View details page
- **src/app/(dashboard)/users/[id]/edit/page.tsx** - ⚠️ Edit functionality

## 🔄 OTHER MODULES (STRUCTURE READY)

### 🏗️ Store Management (SCAFFOLDED)

- ✅ **Types**: Complete Store interface with Indian compliance
- ✅ **Mock Data**: 30+ pharmacy stores with addresses, licenses
- ✅ **Components**: Basic structure for store-table, store-form, store-approval
- ⚠️ **Pages**: Route structure exists, needs implementation

### 🏗️ Order Management (SCAFFOLDED)

- ✅ **Types**: Complete Order interface with status tracking
- ✅ **Mock Data**: 100+ orders with realistic pharmacy items
- ✅ **Components**: order-table, order-details, prescription-viewer structure
- ⚠️ **Pages**: Route structure exists, needs implementation

### 🏗️ Delivery Management (SCAFFOLDED)

- ✅ **Types**: DeliveryPersonnel interface with vehicle info
- ✅ **Mock Data**: Delivery assignments and tracking data
- ✅ **Components**: delivery-assignment, auto-assignment, tracking structure
- ⚠️ **Pages**: Route structure exists, needs implementation

### 🏗️ Analytics Dashboard (SCAFFOLDED)

- ✅ **Types**: Analytics interfaces for metrics
- ✅ **Mock Data**: Dashboard metrics and trends
- ✅ **Components**: Chart components with Recharts structure
- ⚠️ **Implementation**: Charts need data visualization completion

---

# DEVELOPMENT PRIORITIES

## 🎯 IMMEDIATE NEXT STEPS (shadcn/ui focused)

### Priority 1: Complete User Management

1. **Polish user-table.tsx** - Enhance with shadcn/ui patterns
2. **Complete user-form.tsx** - Role-based validation with elegant design
3. **Implement user detail pages** - Consistent shadcn card layouts
4. **Add bulk operations** - Multi-select with shadcn components

### Priority 2: Store Management Implementation

1. **Store approval workflow** - shadcn dialog components for approval flow
2. **Store form with Indian compliance** - Multi-step form with shadcn tabs
3. **Store performance metrics** - shadcn card-based dashboard

### Priority 3: Order & Delivery Integration

1. **Order status management** - shadcn badge components for status
2. **Delivery assignment interface** - Drag-drop with shadcn components
3. **Prescription image viewer** - shadcn dialog for image display

# SHADCN/UI DESIGN PATTERNS & GUIDELINES

## 🎨 shadcn/ui Minimalist Design Principles

### Core Design Philosophy

- **Subtle elegance**: Clean lines, subtle shadows, minimal borders
- **Consistent spacing**: Use Tailwind's spacing scale (4, 6, 8, 12, 16, 24)
- **Muted color palette**: Rely on neutral grays, subtle accents
- **Typography hierarchy**: Clear text sizes with proper contrast
- **Interactive states**: Smooth hover/focus transitions

### Layout Patterns

#### Card-Based Layouts (Primary Pattern)

```tsx
<Card className="border-border/5 shadow-lg">
  <CardHeader className="border-b border-border/10">
    <CardTitle className="text-lg font-semibold">Section Title</CardTitle>
  </CardHeader>
  <CardContent className="p-6 space-y-4">{/* Content */}</CardContent>
</Card>
```

#### Data Tables (TanStack + shadcn)

- Use `DataTable` component with consistent column definitions
- Implement sorting, filtering, pagination uniformly
- Status badges with consistent color coding
- Row actions via dropdown menus

#### Form Layouts (React Hook Form + Zod)

```tsx
<Form {...form}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
</Form>
```

### Component Consistency Rules

#### Buttons

- **Primary**: `<Button>` for main actions
- **Secondary**: `<Button variant="outline">` for secondary actions
- **Destructive**: `<Button variant="destructive">` for delete operations
- **Icon buttons**: Always include proper ARIA labels

#### Status Indicators

- **Active/Success**: `<Badge variant="default" className="bg-green-100 text-green-700">`
- **Inactive/Warning**: `<Badge variant="secondary" className="bg-yellow-100 text-yellow-700">`
- **Error/Danger**: `<Badge variant="destructive">`

#### Loading States

- **Tables**: Use `<Skeleton>` components in table rows
- **Forms**: Disable buttons with loading spinner
- **Cards**: Show `<LoadingSpinner>` in card content

#### Empty States

- Use `<EmptyState>` component with appropriate icon
- Include clear call-to-action buttons
- Maintain consistent messaging tone

---

# IMPLEMENTATION STANDARDS

## 🔧 Code Quality & Patterns

### TypeScript Standards

- **Strict mode**: No `any` types allowed
- **Interface definitions**: Export all interfaces from feature types
- **Generic types**: Use proper generics for reusable components
- **Zod schemas**: Define validation schemas for all forms

### Component Architecture

```tsx
// Feature Component Pattern
interface ComponentProps {
  // Props interface with proper typing
}

export function ComponentName({ ...props }: ComponentProps) {
  // React Query hooks for data
  // Local state management
  // Event handlers
  // Return JSX with shadcn components
}
```

### File Organization

- **Components**: One component per file, named exports
- **Hooks**: Custom hooks in dedicated files with `use-` prefix
- **Types**: Centralized in `types/index.ts` per feature
- **Utils**: Helper functions in feature `utils/` directories

### Error Handling

- **API errors**: Use React Query error boundaries
- **Form validation**: Zod schema validation with proper error messages
- **Loading states**: Always provide loading feedback
- **Fallback UI**: Graceful degradation for failed states

---

# TESTING APPROACH

## 🧪 Testing Strategy

### Current Testing Setup

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Coverage**: `npm run test:coverage` for coverage reports
- **Watch mode**: `npm run test:watch` for development

### Testing Priorities

1. **User interactions**: Form submissions, table operations
2. **API integration**: Mock API responses and error states
3. **Validation logic**: Zod schema validation
4. **Component rendering**: Props handling and conditional rendering

### Test File Locations

- **Unit tests**: Co-located with components in `tests/` folders
- **Integration tests**: Feature-level testing in each module
- **Mock data**: Comprehensive mocks in `lib/mock-data/`

---

# DEVELOPMENT WORKFLOW

## 🚀 Development Commands

### Available Scripts

```bash
pnpm run dev          # Start development server with Turbopack
pnpm run build        # Production build
pnpm run lint         # ESLint checking
pnpm run test         # Run test suite
pnpm run test:coverage # Test coverage report
pnpm run test:watch   # Watch mode for TDD
```

### Quality Checks

- **TypeScript**: Strict mode enabled, no compilation errors
- **ESLint**: Next.js recommended rules + custom configurations
- **Prettier**: Automatic code formatting with Tailwind plugin
- **Testing**: Maintain test coverage above 80%

---

# FEATURE IMPLEMENTATION GUIDES

## 👥 USER MANAGEMENT MODULE (Current Focus)

### Implementation Status
- ✅ **Types & Interfaces**: Complete User interface with role-based fields
- ✅ **Mock Data**: 50+ realistic Indian users with proper formatting
- ✅ **Hooks**: React Query integration for CRUD operations
- ✅ **Table Component**: TanStack table with sorting/filtering
- 🔄 **Form Components**: Role-based validation (needs completion)
- ⚠️ **Detail Pages**: Basic structure exists, needs shadcn polish

### Next Implementation Steps

#### 1. Enhanced User Table (user-table.tsx)
```tsx
// Implement consistent shadcn patterns:
- Status badges with proper color coding
- Action dropdowns with edit/delete options
- Row selection for bulk operations
- Export functionality with CSV download
- Responsive design for mobile views
```

#### 2. User Form Completion (user-form.tsx)
```tsx
// Focus areas:
- Role-based conditional fields (store selection for vendors)
- Indian phone number validation (+91 format)
- Vehicle information for delivery personnel
- Coverage areas multi-select for delivery
- Zod schema validation with proper error handling
```

#### 3. User Detail Pages
```tsx
// Pages to complete:
- src/app/(dashboard)/users/[id]/page.tsx - Profile view
- src/app/(dashboard)/users/[id]/edit/page.tsx - Edit form
- src/app/(dashboard)/users/create/page.tsx - Creation form

// Use consistent Card layouts:
<Card>
  <CardHeader>
    <CardTitle>User Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* User information in clean grid layout */}
  </CardContent>
</Card>
```

### User Management Features to Implement

#### Bulk Operations
- Multi-select rows with checkboxes
- Bulk activate/deactivate users
- Bulk export selected users
- Confirmation dialogs for destructive actions

#### Advanced Filtering
- Role-based filtering (Store Vendor, Delivery Personnel)
- Status filtering (Active, Inactive, Pending)
- Date range filters for creation/update dates
- Search across name, email, phone fields

#### Audit Trail
- Track user creation and modification history
- Display last login information
- Store admin actions (activate/deactivate)
- Integration with activity logging

## 🏪 STORE MANAGEMENT MODULE (Next Priority)

### Current Status
- ✅ **Store Interface**: Complete with Indian compliance fields (GSTIN, Drug License)
- ✅ **Mock Data**: 30+ pharmacy stores with realistic Indian addresses
- ✅ **Component Structure**: Basic scaffolding for table/form/approval components
- ⚠️ **Implementation**: Needs completion with shadcn/ui patterns

### Key Features to Implement

#### Store Approval Workflow (Priority Feature)
```tsx
// Store approval process with shadcn Dialog components:
- Pending store registrations dashboard
- Document verification interface
- Approval/rejection workflow with comments
- Status change notifications with toast
```

#### Indian Compliance Features
```tsx
// Regulatory compliance for Indian pharmacy stores:
- Drug license validation (DL-[STATE]-[NUMBER]-[YEAR])
- GSTIN validation with 15-digit format checking
- Operating hours with timezone support
- Service area mapping with multi-select
```

## 📦 ORDER & DELIVERY MANAGEMENT MODULE

### Current Status
- ✅ **Order Interface**: Complete with prescription support, status tracking
- ✅ **Mock Data**: 100+ orders with realistic Indian pharmacy items
- ✅ **Delivery Types**: Vehicle-based delivery personnel assignment
- ⚠️ **Implementation**: Component structure exists, needs completion

### Key Features to Implement

#### Order Status Management
```tsx
// Order lifecycle with shadcn Badge components:
- Status progression: PENDING → ASSIGNED → PICKED_UP → DELIVERED
- Prescription image viewer with shadcn Dialog
- Real-time status updates with optimistic UI
```

#### Delivery Assignment System
```tsx
// Assignment logic with drag-drop interface:
- Manual assignment of orders to delivery personnel
- Auto-assignment based on coverage areas
- Workload balancing across delivery team
```

## 📊 ANALYTICS DASHBOARD MODULE

### Current Status
- ✅ **Analytics Types**: Metrics interfaces for dashboard data
- ✅ **Mock Data**: Comprehensive metrics and trends data
- ✅ **Chart Components**: Recharts integration structure
- ⚠️ **Implementation**: Chart visualization needs completion

### Key Metrics to Visualize
- **Order Trends**: Daily/weekly/monthly volumes with line charts
- **Store Performance**: Revenue and rating comparisons
- **Delivery Metrics**: Success rates and timing analytics
- **User Activity**: Registration and engagement trends

---

# DEVELOPMENT BEST PRACTICES

## 🎯 shadcn/ui Focus Areas

### Consistent UI Patterns
- **Card layouts**: Use for all major content sections
- **Data tables**: Uniform sorting, filtering, pagination
- **Form validation**: Zod schemas with proper error display
- **Status indicators**: Consistent badge color coding
- **Loading states**: Skeleton components and spinners

### Mobile Responsiveness
- **Table responsive**: Stack columns on mobile
- **Form layouts**: Single column on small screens
- **Navigation**: Collapsible sidebar for tablets
- **Touch targets**: Adequate button sizes for mobile

### Accessibility Standards
- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order and shortcuts
- **Color contrast**: Meet WCAG 2.1 AA standards
- **Screen readers**: Semantic HTML structure

---

# IMMEDIATE ACTION ITEMS

## 🚀 Next Sprint Goals

### Week 1: Complete User Management
1. Polish user-table.tsx with proper shadcn styling
2. Complete user-form.tsx with role-based validation
3. Implement user detail and edit pages
4. Add bulk operations with confirmation dialogs

### Week 2: Store Management Foundation  
1. Implement store approval workflow
2. Create Indian compliance validation
3. Build store performance metrics dashboard
4. Add store-to-user relationship management

### Week 3: Order & Delivery Integration
1. Complete order status management
2. Build delivery assignment interface
3. Implement prescription viewer
4. Add real-time status updates

### Week 4: Analytics & Polish
1. Complete dashboard analytics with charts
2. Add export functionality across modules
3. Implement comprehensive search
4. Performance optimization and testing

---

# PROJECT GUIDELINES

## 💡 Development Philosophy

Focus on **progressive enhancement** with shadcn/ui's minimalist aesthetic:

1. **Start Simple**: Basic CRUD operations with clean UI
2. **Add Polish**: Smooth animations, loading states, error handling  
3. **Enhance UX**: Bulk operations, advanced filtering, export features
4. **Optimize**: Performance, accessibility, mobile responsiveness

## 🔧 Quality Standards

- **TypeScript Strict**: No `any` types, proper interfaces
- **Component Consistency**: Reusable patterns across features
- **Error Boundaries**: Graceful failure handling
- **Testing Coverage**: Maintain above 80% test coverage
- **Performance**: Virtual scrolling for large datasets

Remember: **Prioritize user experience with maintainable, elegant code**. Use shadcn/ui components consistently to create a cohesive, professional admin interface.
