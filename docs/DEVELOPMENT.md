# Development Guide

This guide provides detailed information for developers working on the Channels project, including setup instructions, development workflows, and best practices.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style & Standards](#code-style--standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance](#performance)
- [Common Tasks](#common-tasks)

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **Yarn**: Latest version (recommended over npm)
- **Git**: For version control
- **VS Code**: Recommended editor with extensions

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/channel-web.git
   cd channel-web
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

### VS Code Setup

Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🛠️ Development Environment

### Available Scripts

```bash
# Development
yarn dev              # Start development server with Turbopack
yarn dev:debug        # Start with Node.js debugging enabled

# Building
yarn build            # Build for production
yarn start            # Start production server

# Testing
yarn test             # Run tests
yarn test:ui          # Run tests with Vitest UI
yarn test:watch       # Run tests in watch mode
yarn coverage         # Generate test coverage report

# Code Quality
yarn lint             # Run ESLint
yarn type-check       # Run TypeScript compiler check
```

### Environment Variables

Development environment variables (`.env.local`):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://channel.org
NEXT_PUBLIC_DASHBOARD_API_URL=https://dashboard.channel.org

# OAuth (get from your Mastodon instance)
NEXT_PUBLIC_CLIENT_ID=your_client_id
NEXT_PUBLIC_CLIENT_SECRET=your_client_secret

# Firebase (optional for push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

## 📁 Project Structure

### Directory Overview

```
src/
├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── (auth)/            # Route groups
│   ├── [acct]/            # Dynamic routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React Components (Atomic Design)
│   ├── atoms/             # Basic UI elements
│   ├── molecules/         # Composite components
│   ├── organisms/         # Complex feature components
│   ├── pages/             # Page-level components
│   └── template/          # Layout templates
├── hooks/                 # Custom React hooks
├── services/              # API service functions
├── store/                 # Global state management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── constants/             # Application constants
```

### Component Organization

Following Atomic Design principles:

**Atoms** (`components/atoms/`)
- Single-purpose components
- No dependencies on other components
- Examples: `Button`, `Input`, `Avatar`

**Molecules** (`components/molecules/`)
- Combinations of atoms
- Simple functionality
- Examples: `SearchBox`, `UserCard`

**Organisms** (`components/organisms/`)
- Complex components with business logic
- Compose molecules and atoms
- Examples: `ComposeForm`, `Timeline`, `Navigation`

**Pages** (`components/pages/`)
- Top-level page components
- Orchestrate organisms
- Handle page-specific state

## 🔄 Development Workflow

### Feature Development

1. **Create feature branch**
   ```bash
   git checkout -b feature/user-profile-editing
   ```

2. **Develop incrementally**
   - Start with types/interfaces
   - Create service functions
   - Build components bottom-up (atoms → molecules → organisms)
   - Add tests as you go

3. **Test thoroughly**
   ```bash
   yarn test
   yarn type-check
   yarn lint
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat(profile): add profile editing form"
   ```

### Hot Module Replacement

The development server supports fast refresh:

- **React components**: Update without losing state
- **CSS**: Instant updates
- **API routes**: Automatic restart

### TypeScript Development

#### Type-First Development

Always define types before implementation:

```typescript
// types/user.ts
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

// Then implement components
interface UserCardProps {
  user: User;
  onFollow?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollow }) => {
  // Implementation
};
```

#### Strict TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 🎨 Code Style & Standards

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Component Patterns

#### Functional Components with TypeScript

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### Custom Hooks

```typescript
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

## 🧪 Testing

### Test Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx
└── tests/
    ├── setup.ts
    ├── mocks/
    └── utils/
```

### Unit Testing

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Testing

```typescript
// ComposeForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComposeForm } from './ComposeForm';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ComposeForm Integration', () => {
  it('submits form with correct data', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<ComposeForm onSubmit={onSubmit} />);

    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Test post content' } });

    const submitButton = screen.getByRole('button', { name: /post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        content: 'Test post content',
        visibility: 'public',
        sensitive: false,
      });
    });
  });
});
```

### Testing Hooks

```typescript
// useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test')).toBe('"updated"');
  });
});
```

## 🐛 Debugging

### Browser DevTools

#### React Developer Tools
- Install React DevTools browser extension
- Use Profiler to identify performance issues
- Inspect component props and state

#### Network Tab
- Monitor API requests
- Check request/response headers
- Analyze payload sizes

### Next.js Debugging

#### Development Mode
```bash
# Start with debugging enabled
yarn dev:debug

# Open Chrome and go to chrome://inspect
# Click "Open dedicated DevTools for Node"
```

#### Production Debugging
```typescript
// Add debugging logs
console.log('Debug info:', { user, status, timestamp: Date.now() });

// Use conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('Development debug:', data);
}
```

### Common Issues

#### Hydration Mismatch
```typescript
// ❌ Problematic - different on server/client
const Component = () => {
  return <div>{Date.now()}</div>;
};

// ✅ Solution - use useEffect for client-only code
const Component = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>{Date.now()}</div>;
};
```

#### Memory Leaks
```typescript
// ❌ Memory leak - missing cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // Some work
  }, 1000);
}, []);

// ✅ Proper cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // Some work
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

## ⚡ Performance

### Bundle Analysis

```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true yarn build
```

### Core Web Vitals

Monitor these metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

#### Image Optimization
```typescript
import Image from 'next/image';

const OptimizedImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={300}
    height={200}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  />
);
```

#### Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// Memoize components
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});
```

## 🔧 Common Tasks

### Adding a New Page

1. **Create page file**
   ```typescript
   // app/new-feature/page.tsx
   import { NewFeaturePage } from '@/components/pages/NewFeaturePage';

   export default function NewFeature() {
     return <NewFeaturePage />;
   }
   ```

2. **Create page component**
   ```typescript
   // components/pages/NewFeaturePage.tsx
   export const NewFeaturePage = () => {
     return (
       <div>
         <h1>New Feature</h1>
         {/* Page content */}
       </div>
     );
   };
   ```

### Adding a New API Route

```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Handle GET request
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Handle POST request
    const result = await createData(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    );
  }
}
```

### Adding New Dependencies

```bash
# Add production dependency
yarn add package-name

# Add development dependency
yarn add -D package-name

# Update package.json and commit
git add package.json yarn.lock
git commit -m "deps: add package-name for feature X"
```

### Environment-Specific Code

```typescript
// Different behavior per environment
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.production.com'
  : 'https://api.staging.com';

// Feature flags
const isFeatureEnabled = process.env.NEXT_PUBLIC_FEATURE_FLAG === 'true';

if (isFeatureEnabled) {
  // New feature code
}
```

---

This development guide should help you get productive quickly with the Channels codebase. For questions or suggestions, please open an issue or discussion on GitHub!
