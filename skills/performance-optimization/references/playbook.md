# Performance Playbook

## Measurement

Measure the exact user flow before changing code. Re-run the same flow after each change.

Frontend measurement options:
- Lighthouse via Chrome DevTools or CLI.
- Real-user metrics with `web-vitals`.
- React DevTools Profiler for render cost.
- Browser Performance panel for long tasks, scripting, layout, and network waterfalls.
- Bundle analyzer or framework-specific build analysis when JavaScript download or parse cost is high.

Backend measurement options:
- Endpoint timing at the server boundary.
- Slow query logs and `EXPLAIN` or `EXPLAIN ANALYZE`.
- Cache hit rate and payload size.

Example Lighthouse command:

```bash
npx lighthouse https://example.com --view
npx lighthouse https://example.com --output=json --output-path=./report.json
```

Example Web Vitals instrumentation:

```ts
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: unknown) {
  console.log(metric);
}

onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

Note: use `INP`, not `FID`. `INP` replaced `FID` as a Core Web Vital on March 12, 2024, and Chrome ended `FID` support on September 9, 2024.

## Frontend Patterns

Use these only when the measurements point to them.

Prevent unnecessary re-renders:

```tsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }: { data: Data }) {
  return <div>{/* complex rendering */}</div>;
});
```

Memoize expensive derived data or stable callbacks only when profiler data shows benefit:

```tsx
const filteredProducts = useMemo(() => {
  return products.filter((product) => product.category === category);
}, [products, category]);
```

Code split heavy routes or widgets:

```tsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

export function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyChart />
    </Suspense>
  );
}
```

Optimize images:
- Use framework-native image components where available.
- Serve responsive sizes and modern formats such as WebP or AVIF.
- Prioritize the LCP image and lazy-load below-the-fold images.

Reduce bundle size:
- Import only the modules actually used.
- Prefer dynamic import for rarely used code paths.
- Remove heavy libraries when a platform API or smaller package will do.

## Backend Patterns

Remove N+1 queries:

```ts
const posts = await db.post.findMany({
  include: {
    author: true,
  },
});
```

Validate indexes with query plans:

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
```

Cache hot reads:

```ts
const cached = await redis.get(`user:${userId}`);
if (cached) return JSON.parse(cached);
```

Also consider:
- Gzip or Brotli compression for large payloads.
- CDN caching for static assets and cacheable API responses.
- Parallelizing independent network or database calls.

## Checklist

Performance optimization checklist

## Frontend
- [ ] Prevent unnecessary re-renders with `React.memo`
- [ ] Use memoization appropriately and only with measurement evidence
- [ ] Apply lazy loading and code splitting where it reduces startup cost
- [ ] Optimize images with responsive sizes and modern formats
- [ ] Analyze and reduce bundle size

## Backend
- [ ] Remove N+1 queries
- [ ] Add or refine database indexes
- [ ] Add caching for hot or expensive reads
- [ ] Compress API responses
- [ ] Use a CDN where applicable

## Measurement
- [ ] Lighthouse score 90+
- [ ] LCP under 2.5s
- [ ] INP under 200ms
- [ ] CLS under 0.1
