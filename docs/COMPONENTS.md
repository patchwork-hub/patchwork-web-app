# Component Library Documentation

This document provides an overview of the component library used in the Channels application, following the Atomic Design methodology.

## 📋 Table of Contents

- [Design System](#design-system)
- [Atoms](#atoms)
- [Molecules](#molecules)
- [Organisms](#organisms)
- [Usage Guidelines](#usage-guidelines)
- [Styling Conventions](#styling-conventions)

## 🎨 Design System

### Color Palette

The application uses a semantic color system built on Tailwind CSS:

```typescript
// Semantic colors
const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  
  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};
```

### Typography

```typescript
// Font sizes and weights
const typography = {
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### Spacing

```typescript
// Consistent spacing scale
const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
};
```

## ⚛️ Atoms

Basic building blocks that cannot be broken down further.

### Button

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

### Input

```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

// Usage
<Input
  label="Username"
  placeholder="Enter your username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error={errors.username}
  required
/>
```

### Avatar

```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away';
}

// Usage
<Avatar
  src={user.avatar}
  alt={user.displayName}
  size="md"
  fallback={user.username[0].toUpperCase()}
  status="online"
/>
```

### Badge

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

// Usage
<Badge variant="success">Active</Badge>
```

## 🧬 Molecules

Combinations of atoms that serve specific purposes.

### SearchBox

```typescript
interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  suggestions?: string[];
}

// Usage
<SearchBox
  placeholder="Search users, posts, or hashtags"
  onSearch={handleSearch}
  loading={isSearching}
  suggestions={searchSuggestions}
/>
```

### UserCard

```typescript
interface UserCardProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio?: string;
    followersCount: number;
    isFollowing: boolean;
  };
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  compact?: boolean;
}

// Usage
<UserCard
  user={user}
  onFollow={handleFollow}
  onUnfollow={handleUnfollow}
  compact={false}
/>
```

### StatusCard

```typescript
interface StatusCardProps {
  status: {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    mediaAttachments?: MediaAttachment[];
    favouritesCount: number;
    reblogsCount: number;
    repliesCount: number;
    favourited: boolean;
    reblogged: boolean;
  };
  onFavourite?: (statusId: string) => void;
  onReblog?: (statusId: string) => void;
  onReply?: (statusId: string) => void;
  compact?: boolean;
}

// Usage
<StatusCard
  status={status}
  onFavourite={handleFavourite}
  onReblog={handleReblog}
  onReply={handleReply}
/>
```

### MediaUpload

```typescript
interface MediaUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  loading?: boolean;
}

// Usage
<MediaUpload
  onUpload={handleMediaUpload}
  maxFiles={4}
  acceptedTypes={['image/*', 'video/*']}
  maxSize={10 * 1024 * 1024} // 10MB
  loading={isUploading}
/>
```

## 🦠 Organisms

Complex components that combine molecules and atoms to form distinct sections.

### ComposeForm

```typescript
interface ComposeFormProps {
  onSubmit: (data: ComposeFormData) => void;
  defaultContent?: string;
  loading?: boolean;
  maxLength?: number;
  allowMedia?: boolean;
  allowPolls?: boolean;
  allowScheduling?: boolean;
}

interface ComposeFormData {
  content: string;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  sensitive: boolean;
  spoilerText?: string;
  mediaIds?: string[];
  poll?: PollData;
  scheduledAt?: Date;
}

// Usage
<ComposeForm
  onSubmit={handleSubmit}
  loading={isSubmitting}
  maxLength={500}
  allowMedia={true}
  allowPolls={true}
  allowScheduling={true}
/>
```

### Timeline

```typescript
interface TimelineProps {
  statuses: Status[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onStatusUpdate?: (statusId: string, updates: Partial<Status>) => void;
  emptyState?: React.ReactNode;
}

// Usage
<Timeline
  statuses={timelineData}
  loading={isLoading}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
  onStatusUpdate={handleStatusUpdate}
  emptyState={<EmptyTimeline />}
/>
```

### Navigation

```typescript
interface NavigationProps {
  user?: User;
  currentPath: string;
  notifications?: {
    unreadCount: number;
  };
  onSignOut?: () => void;
}

// Usage
<Navigation
  user={currentUser}
  currentPath={pathname}
  notifications={{ unreadCount: 5 }}
  onSignOut={handleSignOut}
/>
```

### ProfileHeader

```typescript
interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  relationship?: {
    following: boolean;
    followedBy: boolean;
    blocking: boolean;
    muting: boolean;
  };
  onFollow?: () => void;
  onUnfollow?: () => void;
  onEdit?: () => void;
}

// Usage
<ProfileHeader
  user={profileUser}
  isOwnProfile={user?.id === profileUser.id}
  relationship={userRelationship}
  onFollow={handleFollow}
  onUnfollow={handleUnfollow}
  onEdit={handleEditProfile}
/>
```

## 📝 Usage Guidelines

### Component Composition

Prefer composition over configuration:

```typescript
// ✅ Good - Flexible composition
<Card>
  <Card.Header>
    <Card.Title>User Profile</Card.Title>
    <Card.Actions>
      <Button variant="ghost">Edit</Button>
    </Card.Actions>
  </Card.Header>
  <Card.Content>
    <UserInfo user={user} />
  </Card.Content>
</Card>

// ❌ Avoid - Too many props
<Card
  title="User Profile"
  showActions={true}
  actionButtons={[{ label: 'Edit', onClick: handleEdit }]}
  content={<UserInfo user={user} />}
/>
```

### Prop Naming

Follow consistent naming conventions:

```typescript
// Event handlers: on + EventName
onClick, onChange, onSubmit, onFocus

// Boolean props: is/has/can/should + Description
isLoading, hasError, canEdit, shouldAutoFocus

// Data props: descriptive names
user, status, notifications, settings

// Configuration: descriptive names
variant, size, position, alignment
```

### Default Props

Use default parameters instead of defaultProps:

```typescript
// ✅ Preferred
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}) => {
  // Component implementation
};

// ❌ Avoid
const Button: React.FC<ButtonProps> = (props) => {
  // Component implementation
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
};
```

## 🎨 Styling Conventions

### Tailwind CSS Classes

Use consistent class ordering:

```typescript
// Order: layout → positioning → sizing → spacing → colors → typography → effects
className="flex items-center justify-between w-full h-12 px-4 py-2 bg-white text-gray-900 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
```

### CSS-in-JS with CVA

Use Class Variance Authority for variant-based styling:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ variant, size, children, onClick, ...props }) => {
  return (
    <button
      className={buttonVariants({ variant, size })}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Responsive Design

Use mobile-first responsive design:

```typescript
// ✅ Mobile-first approach
className="text-sm sm:text-base md:text-lg lg:text-xl"

// ✅ Responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"

// ✅ Conditional visibility
className="hidden sm:block" // Hidden on mobile, visible on larger screens
className="block sm:hidden" // Visible on mobile, hidden on larger screens
```

### Dark Mode Support

Use Tailwind's dark mode utilities:

```typescript
className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
```

### Animation and Transitions

Use consistent transition classes:

```typescript
// Hover transitions
className="transition-colors duration-200 hover:bg-gray-100"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

// Loading states
className="animate-pulse" // For skeleton loading
className="animate-spin" // For loading spinners
```

---

This component library documentation helps maintain consistency across the application. For questions about specific components or to propose new patterns, please open a discussion on GitHub.
