# API Documentation

This document describes the API integration layer of the Channels application, including service functions, data models, and integration patterns with Mastodon-compatible servers.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Service Layer Architecture](#service-layer-architecture)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌐 Overview

Channels integrates with Mastodon-compatible servers through their REST APIs. The application acts as a client that can connect to any Mastodon instance, providing a unified interface for multiple social media servers.

### Base URLs

- **Default Instance**: `https://channel.org`
- **Custom Instances**: User-configurable (e.g., `https://mastodon.social`)
- **Dashboard API**: `https://dashboard.channel.org`

### API Versions

- **Mastodon API v1**: Primary API for most operations
- **Mastodon API v2**: Used for enhanced instance information
- **Custom Extensions**: Channel-specific enhancements

## 🔐 Authentication

### OAuth 2.0 Flow

The application uses OAuth 2.0 Authorization Code flow for secure authentication:

#### 1. App Registration

```typescript
// services/auth/searchServer.ts
export const requestInstance = async (domain: string) => {
  const body = {
    client_name: domain,
    website: "https://channel.org",
    redirect_uris: DEFAULT_REDIRECT_URI,
    scopes: "read write follow push"
  };

  const res = await axios.post(`https://${domain}/api/v1/apps`, body);
  return res.data;
};
```

#### 2. Authorization

```typescript
// Redirect user to authorization URL
const authUrl = `https://${domain}/oauth/authorize?` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `response_type=code&` +
  `scope=read write follow push`;
```

#### 3. Token Exchange

```typescript
// services/auth/searchServer.ts
export const authorizeInstance = async (payload: {
  code: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  domain: string;
}) => {
  const resp = await axiosInstance.post(
    `https://${payload.domain}/oauth/token`,
    payload
  );
  return resp.data;
};
```

### Token Management

```typescript
// lib/http/index.ts
const axiosInstance = axios.create({
  timeout: 30000,
});

// Request interceptor for authentication
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🏗️ Service Layer Architecture

The service layer abstracts API calls into reusable functions organized by feature:

```
services/
├── auth/                   # Authentication services
├── profile/               # User profile management
├── status/                # Posts and timeline
├── notifications/         # Notification handling
├── conversations/         # Direct messages
├── media/                 # File uploads
├── search/                # Search functionality
└── settings/              # User preferences
```

### Service Function Pattern

```typescript
// services/status/createStatus.ts
export const createStatus = async (payload: CreateStatusPayload) => {
  try {
    const { data } = await axiosInstance.post('/api/v1/statuses', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
```

### React Query Integration

```typescript
// hooks/mutations/status/useCreateStatus.ts
export const useCreateStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createStatus,
    onSuccess: (newStatus) => {
      // Invalidate and refetch timeline
      queryClient.invalidateQueries(['timeline']);
      
      // Optimistically update cache
      queryClient.setQueryData(['timeline'], (old: Status[]) => [
        newStatus,
        ...old
      ]);
    },
    onError: (error) => {
      toast.error('Failed to create post');
    }
  });
};
```

## 🛠️ API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/oauth/token` | Exchange credentials for access token |
| GET | `/api/v1/accounts/verify_credentials` | Verify token and get user info |
| POST | `/api/v1/apps` | Register application with server |

### Timeline & Status Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/timelines/home` | Get home timeline |
| GET | `/api/v1/timelines/public` | Get public timeline |
| POST | `/api/v1/statuses` | Create new status |
| GET | `/api/v1/statuses/:id` | Get specific status |
| DELETE | `/api/v1/statuses/:id` | Delete status |
| POST | `/api/v1/statuses/:id/favourite` | Favorite status |
| POST | `/api/v1/statuses/:id/reblog` | Reblog status |

### Account Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/accounts/:id` | Get account information |
| GET | `/api/v1/accounts/:id/statuses` | Get account's statuses |
| GET | `/api/v1/accounts/:id/followers` | Get account's followers |
| GET | `/api/v1/accounts/:id/following` | Get accounts being followed |
| POST | `/api/v1/accounts/:id/follow` | Follow account |
| POST | `/api/v1/accounts/:id/unfollow` | Unfollow account |

### Search Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/search` | Search across accounts, statuses, hashtags |
| GET | `/api/v1/trends/statuses` | Get trending statuses |
| GET | `/api/v1/trends/tags` | Get trending hashtags |

### Media Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/media` | Upload media attachment |
| PUT | `/api/v1/media/:id` | Update media description |
| GET | `/api/v1/media/:id` | Get media attachment |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications` | Get notifications |
| GET | `/api/v1/notifications/:id` | Get specific notification |
| POST | `/api/v1/notifications/clear` | Clear all notifications |
| POST | `/api/v1/notifications/:id/dismiss` | Dismiss notification |

## 📊 Data Models

### Account Model

```typescript
export type Account = {
  id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  bot: boolean;
  discoverable: boolean;
  group: boolean;
  created_at: string;
  note: string;
  url: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string;
  emojis: CustomEmoji[];
  fields: AccountField[];
};
```

### Status Model

```typescript
export type Status = {
  id: string;
  created_at: string;
  in_reply_to_id?: string;
  in_reply_to_account_id?: string;
  sensitive: boolean;
  spoiler_text: string;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  language?: string;
  uri: string;
  url?: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  edited_at?: string;
  favourited?: boolean;
  reblogged?: boolean;
  muted?: boolean;
  bookmarked?: boolean;
  content: string;
  filtered?: FilterResult[];
  reblog?: Status;
  account: Account;
  media_attachments: MediaAttachment[];
  mentions: Mention[];
  tags: Tag[];
  emojis: CustomEmoji[];
  card?: PreviewCard;
  poll?: Poll;
};
```

### Media Attachment Model

```typescript
export type MediaAttachment = {
  id: string;
  type: 'unknown' | 'image' | 'gifv' | 'video' | 'audio';
  url: string;
  preview_url: string;
  remote_url?: string;
  preview_remote_url?: string;
  text_url?: string;
  meta?: MediaMeta;
  description?: string;
  blurhash?: string;
};
```

### Notification Model

```typescript
export type Notification = {
  id: string;
  type: 'mention' | 'status' | 'reblog' | 'follow' | 'follow_request' | 'favourite' | 'poll' | 'update';
  created_at: string;
  account: Account;
  status?: Status;
  report?: Report;
};
```

## ❌ Error Handling

### Error Response Format

```typescript
interface APIError {
  error: string;
  error_description?: string;
  details?: Record<string, string[]>;
}
```

### Error Handler Utility

```typescript
// utils/helper/helper.ts
export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    
    if (response?.status === 401) {
      // Handle authentication error
      removeToken();
      window.location.href = '/auth/sign-in';
      return;
    }
    
    if (response?.status === 422) {
      // Handle validation errors
      const details = response.data?.details;
      throw new ValidationError(details);
    }
    
    if (response?.status >= 500) {
      // Handle server errors
      throw new ServerError('Server temporarily unavailable');
    }
  }
  
  throw error;
};
```

### Automatic Retry Logic

```typescript
// React Query retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status < 500) return false;
        
        // Retry up to 3 times for 5xx errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## 🚦 Rate Limiting

### Client-Side Rate Limiting

```typescript
// utils/rateLimiter.ts
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(endpoint: string, limit: number = 100, window: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    
    // Remove requests outside the window
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(endpoint, validRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter();

// Use in axios interceptor
axiosInstance.interceptors.request.use((config) => {
  const endpoint = config.url || '';
  
  if (!rateLimiter.canMakeRequest(endpoint)) {
    throw new Error('Rate limit exceeded');
  }
  
  return config;
});
```

### Server Response Headers

Monitor rate limit headers from the server:

```typescript
axiosInstance.interceptors.response.use((response) => {
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];
  
  if (remaining && parseInt(remaining) < 10) {
    console.warn('Approaching rate limit');
  }
  
  return response;
});
```

## 💡 Examples

### Creating a Status with Media

```typescript
// Complete example of creating a status with media attachment
const createStatusWithMedia = async () => {
  try {
    // 1. Upload media
    const mediaFormData = new FormData();
    mediaFormData.append('file', file);
    mediaFormData.append('description', 'Alt text for image');
    
    const mediaResponse = await uploadMedia(mediaFormData);
    
    // 2. Create status with media
    const statusPayload = {
      status: 'Check out this image!',
      media_ids: [mediaResponse.id],
      visibility: 'public',
      sensitive: false
    };
    
    const status = await createStatus(statusPayload);
    
    return status;
  } catch (error) {
    console.error('Failed to create status:', error);
    throw error;
  }
};
```

### Implementing Infinite Scroll

```typescript
// Infinite scroll for timeline
export const useTimelineInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['timeline'],
    queryFn: ({ pageParam = null }) => getTimeline({ max_id: pageParam }),
    getNextPageParam: (lastPage) => {
      // Get the oldest status ID for pagination
      return lastPage.length > 0 ? lastPage[lastPage.length - 1].id : null;
    },
    initialPageParam: null,
  });
};

// In component
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useTimelineInfinite();

// Flatten pages
const statuses = data?.pages.flat() || [];
```

### Real-time Updates with Server-Sent Events

```typescript
// Real-time timeline updates
export const useTimelineStream = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const eventSource = new EventSource('/api/v1/streaming/user');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.event === 'update') {
        const newStatus = JSON.parse(data.payload);
        
        // Add to timeline cache
        queryClient.setQueryData(['timeline'], (old: Status[]) => [
          newStatus,
          ...old
        ]);
      }
    };
    
    return () => {
      eventSource.close();
    };
  }, [queryClient]);
};
```

### Optimistic Updates

```typescript
// Optimistic favoriting
export const useFavoriteStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ statusId, favorited }: { statusId: string; favorited: boolean }) => {
      return favorited ? unfavoriteStatus(statusId) : favoriteStatus(statusId);
    },
    onMutate: async ({ statusId, favorited }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['timeline']);
      
      // Snapshot the previous value
      const previousTimeline = queryClient.getQueryData(['timeline']);
      
      // Optimistically update
      queryClient.setQueryData(['timeline'], (old: Status[]) =>
        old.map(status =>
          status.id === statusId
            ? {
                ...status,
                favourited: !favorited,
                favourites_count: status.favourites_count + (favorited ? -1 : 1)
              }
            : status
        )
      );
      
      return { previousTimeline };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['timeline'], context?.previousTimeline);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['timeline']);
    },
  });
};
```

## 🔧 Testing API Integration

### Mock Service Worker Setup

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/timelines/home', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          content: 'Test status',
          account: { id: '1', username: 'testuser' },
          created_at: new Date().toISOString(),
        },
      ])
    );
  }),
  
  rest.post('/api/v1/statuses', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '2',
        content: req.body.status,
        account: { id: '1', username: 'testuser' },
        created_at: new Date().toISOString(),
      })
    );
  }),
];
```

### Testing Service Functions

```typescript
// services/__tests__/status.test.ts
import { createStatus } from '../status/createStatus';
import { server } from '../../tests/mocks/server';

describe('Status Service', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('creates a status successfully', async () => {
    const payload = {
      status: 'Test post',
      visibility: 'public'
    };
    
    const result = await createStatus(payload);
    
    expect(result).toEqual({
      id: '2',
      content: 'Test post',
      account: expect.any(Object),
      created_at: expect.any(String),
    });
  });
});
```

---

This API documentation serves as a comprehensive guide for understanding and working with the Channels application's API integration layer. For questions or contributions, please refer to the [Contributing Guide](../CONTRIBUTING.md).
