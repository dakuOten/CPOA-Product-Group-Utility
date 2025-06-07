# Product Grouping Widget Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Build Process](#build-process)
6. [Architecture & Components](#architecture--components)
7. [API Integration](#api-integration)
8. [Features](#features)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Development Guidelines](#development-guidelines)

---

## Overview

The Product Grouping Widget is a React-based application designed to integrate with Zoho CRM as a custom widget. It allows users to manage and group products within deal records, providing an intuitive interface for product management operations.

### Key Features
- Product grouping with alphabetic categorization
- Real-time data synchronization with Zoho CRM
- Modern toast notifications for user feedback
- Responsive table-based interface
- Auto-scroll for large product lists
- Error handling and validation

---

## System Requirements

### Development Environment
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **TypeScript**: v5.0.0 or higher
- **Git**: Latest version

### Runtime Environment
- **Zoho CRM**: Widget integration platform
- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)

### Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.6.2",
  "vite": "^6.3.5",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.513.0",
  "zod": "^3.24.1"
}
```

---

## Project Structure

```
product_grouping/
├── public/                          # Static assets
│   └── vite.svg                    # Vite logo
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── toast.tsx          # Toast notification system
│   │   │   ├── button.tsx         # Button component
│   │   │   ├── card.tsx          # Card layout component
│   │   │   └── ...               # Other UI components
│   │   ├── pmRequestContract/     # PM Request specific components
│   │   │   ├── PMRequestForm.tsx  # Main product form
│   │   │   ├── PMRequestHeader.tsx # Header with actions
│   │   │   └── ...               # Other PM components
│   │   └── ...                   # Other components
│   ├── hooks/                     # Custom React hooks
│   │   ├── useProductManagement.ts # Product management logic
│   │   ├── use-toast.ts          # Toast notification hook
│   │   └── ...                   # Other hooks
│   ├── services/                  # API and external services
│   │   ├── zohoApi.ts            # Zoho CRM API integration
│   │   └── zohoClient.ts         # Zoho client utilities
│   ├── types/                     # TypeScript type definitions
│   │   ├── global.d.ts           # Global type declarations
│   │   ├── product.ts            # Product-related types
│   │   └── zoho.ts               # Zoho-specific types
│   ├── utils/                     # Utility functions
│   │   └── dataHelpers.ts        # Data manipulation helpers
│   ├── providers/                 # Context providers
│   │   └── ZohoProviderModern.tsx # Zoho context provider
│   └── ...                       # Other source files
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # Project readme
```

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd product_grouping
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (if needed):
```env
# Add any environment variables here
VITE_API_BASE_URL=your_api_url
```

### 4. Development Server
```bash
npm run dev
```
This starts the development server at `http://localhost:5173`

---

## Build Process

### Development Build
```bash
npm run dev
```
- Starts Vite development server
- Enables hot module replacement
- Provides source maps for debugging

### Production Build
```bash
npm run build
```
- Compiles TypeScript to JavaScript
- Bundles and optimizes assets
- Generates production-ready files in `dist/` directory

### Build Output
```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].css   # Compiled and minified CSS
│   └── index-[hash].js    # Compiled and minified JavaScript
└── ...
```

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

---

## Architecture & Components

### Core Architecture

The application follows a modern React architecture with:

1. **Component-Based Structure**: Modular, reusable components
2. **Custom Hooks**: Business logic separated from UI components
3. **Context Providers**: Global state management
4. **Service Layer**: API interactions and external integrations
5. **Type Safety**: Full TypeScript implementation

### Key Components

#### 1. PMRequestHeader.tsx
```typescript
// Header component with refresh and close functionality
interface PMRequestHeaderProps {
  onRefresh?: () => void;
}
```
**Features:**
- Refresh data button
- Close widget button (Zoho integration)
- Responsive card layout
- Toast notifications

#### 2. PMRequestForm.tsx
```typescript
// Main product management form
interface ProductFormData {
  id: string;
  name: string;
  type: string;
  quantity: number;
  // ... other properties
}
```
**Features:**
- Table-based product display
- Sticky header for navigation
- Auto-scroll for large lists
- Product grouping input
- Real-time validation

#### 3. Toast System
```typescript
// Enhanced toast notifications with icons
interface ToastVariants {
  default: string;
  destructive: string;
  success: string;
  warning: string;
}
```
**Features:**
- Icon-based notifications
- Auto-dismiss functionality
- Multiple variants (success, error, warning)
- Accessible design

### Custom Hooks

#### useProductManagement.ts
Central hook for product operations:
```typescript
export function useProductManagement() {
  return {
    products,
    editableProducts,
    handleProductGroupingChange,
    updateSingleProductGrouping,
    handleSubmitForm,
    isApiAvailable
  };
}
```

#### use-toast.ts
Toast notification management:
```typescript
export function useToast() {
  return {
    toast,
    dismiss,
    toasts
  };
}
```

---

## API Integration

### Zoho CRM Integration

The widget integrates with Zoho CRM through two main mechanisms:

#### 1. Zoho CRM API (ZOHO.CRM.API)
```typescript
// API structure for updating products
const apiData = {
  id: dealId,
  Subform_1: [
    {
      Product_Type: "string",
      Is_Contract: boolean,
      Product_Grouping: "string",
      Quantity: number,
      Terms: "string",
      Pricing: number,
      Total_Pricing: "string",
      Vendor: "string",
      Products: "product_id"
    }
  ]
};
```

#### 2. Zoho Client SDK ($Client)
```typescript
// Widget lifecycle management
$Client.close({ exit: true }); // Close widget
```

### API Functions

#### updateProductSubformArray()
Updates the entire product array in Zoho CRM:
```typescript
async function updateProductSubformArray(
  dealId: string,
  products: ProductFormData[]
): Promise<ZohoUpdateResponse>
```

#### validateProductData()
Validates product data before submission:
```typescript
function validateProductData(
  products: ProductFormData[]
): string[]
```

---

## Features

### 1. Product Management
- **View Products**: Display all products in a deal
- **Group Products**: Assign alphabetic grouping (A-Z)
- **Real-time Updates**: Instant API synchronization
- **Validation**: Input validation with user feedback

### 2. User Interface
- **Responsive Design**: Works on desktop and mobile
- **Table Layout**: Clean, organized product display
- **Sticky Headers**: Navigation remains visible while scrolling
- **Auto-scroll**: Handles large product lists gracefully

### 3. Notifications
- **Toast Notifications**: User-friendly status messages
- **Error Handling**: Graceful error management
- **Success Feedback**: Confirmation of successful operations

### 4. Data Management
- **Type Safety**: Full TypeScript implementation
- **Data Validation**: Zod schema validation
- **Error Recovery**: Automatic retry mechanisms

---

## Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Zoho CRM Widget Deployment
1. **Upload Files**: Upload `dist/` contents to Zoho CRM
2. **Widget Configuration**: Configure widget in Zoho CRM settings
3. **Permissions**: Ensure proper API permissions
4. **Testing**: Test in Zoho CRM environment

### 3. Widget Configuration
```javascript
// Widget configuration in Zoho CRM
{
  "name": "Product Grouping Widget",
  "version": "1.0.0",
  "description": "Manage product groupings in deals",
  "files": ["index.html", "assets/*"],
  "permissions": ["ZohoCRM.modules.deals.READ", "ZohoCRM.modules.deals.UPDATE"]
}
```

---

## Troubleshooting

### Common Issues

#### 1. API Not Available
**Error**: "Zoho CRM API is not available"
**Solution**:
- Ensure widget is running within Zoho CRM
- Check API permissions
- Verify Zoho SDK initialization

#### 2. Build Errors
**Error**: TypeScript compilation errors
**Solution**:
```bash
npm run build -- --mode development
# Check specific error messages
npx tsc --noEmit
```

#### 3. Widget Not Closing
**Error**: Close button not working
**Solution**:
- Verify `$Client` global declaration
- Check Zoho SDK availability
- Test in Zoho CRM environment

#### 4. Toast Notifications Not Showing
**Error**: No toast notifications
**Solution**:
- Verify Toaster component in App.tsx
- Check useToast hook implementation
- Ensure proper component mounting

### Debug Mode
Enable debug logging:
```typescript
// In development
console.log('Debug info:', data);
// Enable detailed Zoho API logging
```

---

## Development Guidelines

### Code Style
- **TypeScript**: Use strict type checking
- **ESLint**: Follow configured linting rules
- **Prettier**: Maintain consistent formatting
- **Comments**: Document complex logic

### Component Guidelines
```typescript
// Use functional components with hooks
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Custom hooks at the top
  const { data } = useCustomHook();
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  // Render
  return <div>...</div>;
};
```

### Testing
- **Unit Tests**: Test individual components
- **Integration Tests**: Test API interactions
- **E2E Tests**: Test complete workflows

### Version Control
- **Commit Messages**: Use conventional commits
- **Branching**: Feature branches for new development
- **Pull Requests**: Code review process

### Performance
- **Bundle Size**: Monitor bundle size
- **Lazy Loading**: Implement for large components
- **Memoization**: Use React.memo for expensive components

---

## Conclusion

This Product Grouping Widget provides a robust solution for managing product groupings within Zoho CRM. The modern React architecture ensures maintainability and scalability, while the integration with Zoho CRM provides seamless data synchronization.

For additional support or questions, please refer to the troubleshooting section or contact the development team.

---

**Version**: 1.0.0
**Last Updated**: June 6, 2025
**Author**: Development Team
