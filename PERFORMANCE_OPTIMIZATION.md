# ⚡ Performance Optimization & Scaling Guide - Mlebu Link

Panduan lengkap untuk optimize performance dan scale aplikasi.

## 📊 Performance Metrics

### Target Metrics
| Metric | Target | Current Status |
|--------|--------|-----------------|
| First Contentful Paint (FCP) | < 1.5s | Monitor |
| Largest Contentful Paint (LCP) | < 2.5s | Monitor |
| Cumulative Layout Shift (CLS) | < 0.1 | Monitor |
| Time to Interactive (TTI) | < 3.5s | Monitor |
| Page Load Time | < 3s | Monitor |
| API Response Time | < 200ms | Monitor |
| Database Query Time | < 100ms | Monitor |

---

## 🖼️ Image Optimization

### Optimization Strategy

```typescript
// 1. Use Next.js Image component
import Image from 'next/image';

<Image
  src={url}
  alt="description"
  width={300}
  height={200}
  quality={80}
  priority={false}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// 2. Use WebP format
// Sharp automatically converts to WebP
await sharp(buffer)
  .resize(300, 200, { fit: 'cover' })
  .webp({ quality: 80 })
  .toBuffer();

// 3. Responsive Images
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img src="/image.jpg" alt="description" />
</picture>
```

### Image Size Optimization

```javascript
// Sharp configuration for production
const sharp = require('sharp');

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

// Results:
// Original: 2MB (JPEG)
// Optimized: 150KB (WebP)
// Savings: 92%
```

### Lazy Loading Strategy

```typescript
// Above-fold images: high priority
<Image priority src={heroImage} />

// Below-fold images: lazy load
<Image loading="lazy" src={cardImage} />

// With Intersection Observer
const [isVisible, setIsVisible] = useState(false);
const ref = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    setIsVisible(entry.isIntersecting);
  });
  
  if (ref.current) {
    observer.observe(ref.current);
  }
  
  return () => observer.disconnect();
}, []);

return (
  <div ref={ref}>
    {isVisible && <Image src={src} />}
  </div>
);
```

---

## 📦 Code Optimization

### Code Splitting

```typescript
// ❌ Load all code upfront
import HeavyComponent from './Heavy';

// ✅ Dynamic import for large components
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />,
});

// Verify bundle size
// Run: npm run analyze
```

### Tree Shaking

```typescript
// ❌ Import everything
import * as utils from './utils';
const result = utils.isValidUrl(url);

// ✅ Import only what you need
import { isValidUrl } from './utils';
const result = isValidUrl(url);
```

### Component Memoization

```typescript
// ❌ Re-renders on every parent render
export function LinkCard({ link }) {
  return <div>{link.title}</div>;
}

// ✅ Memoized - only re-renders if props change
import { memo } from 'react';
export const LinkCard = memo(({ link }) => {
  return <div>{link.title}</div>;
});
```

---

## 🗄️ Database Optimization

### Query Optimization

```sql
-- ❌ Slow: N+1 queries
SELECT * FROM links LIMIT 20;
-- Then in JS loop: SELECT * FROM users WHERE id = ?

-- ✅ Fast: Single JOIN query
SELECT 
  links.*,
  users.email
FROM links
JOIN users ON links.user_id = users.id
WHERE links.is_active = true
LIMIT 20;

-- ❌ Slow: Full table scan
SELECT * FROM links WHERE title LIKE '%search%';

-- ✅ Fast: Use indexed columns
SELECT * FROM links WHERE category = 'Design' LIMIT 20;

-- ❌ Slow: No LIMIT
SELECT * FROM links;

-- ✅ Fast: Paginated
SELECT * FROM links LIMIT 20 OFFSET 0;
```

### Index Optimization

```sql
-- Check if indexes exist
SELECT * FROM pg_indexes WHERE tablename = 'links';

-- Add indexes for frequently queried columns
CREATE INDEX idx_links_is_active ON links(is_active);
CREATE INDEX idx_links_category ON links(category);
CREATE INDEX idx_links_created_at ON links(created_at DESC);
CREATE INDEX idx_links_user_id ON links(user_id);

-- Add index for search
CREATE INDEX idx_links_search ON links USING gin(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Monitor index size
SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid)) 
FROM pg_indexes 
JOIN pg_class ON pg_indexes.indexname = pg_class.relname 
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Connection Pooling

```typescript
// Supabase handles connection pooling automatically
// But you can optimize:

// ✅ Reuse connections
const supabase = createClient(URL, KEY);
export default supabase;

// ✅ Close connections when done
const response = await supabase
  .from('links')
  .select('*')
  .limit(20);

// Verify connection pool
// Supabase Dashboard → Database → Connection Pool
```

### Query Caching

```typescript
// Cache frequently accessed data
const queryCache = new Map();

async function getCachedLinks(category: string) {
  const key = `links:${category}`;
  
  // Check cache
  if (queryCache.has(key)) {
    const cached = queryCache.get(key);
    if (Date.now() - cached.time < 5 * 60 * 1000) {
      return cached.data;
    }
  }
  
  // Fetch fresh data
  const { data } = await supabase
    .from('links')
    .select('*')
    .eq('category', category);
  
  // Cache result
  queryCache.set(key, { data, time: Date.now() });
  
  return data;
}

// Clear cache when data changes
function invalidateCache(key: string) {
  queryCache.delete(key);
}
```

---

## 🚀 API Optimization

### Response Caching

```typescript
// File: next.config.js
headers: async () => [
  {
    source: '/api/links',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=300, s-maxage=600',
      },
    ],
  },
];

// Cache levels:
// max-age: Browser cache (300s = 5 min)
// s-maxage: CDN cache (600s = 10 min)
// public: Can be cached by anyone
// private: Only for specific user
```

### Request Compression

```javascript
// next.config.js
module.exports = {
  compress: true, // Enable gzip compression
};

// Verify compression
// DevTools → Network → check Content-Encoding header
```

### Pagination Optimization

```typescript
// ✅ Cursor-based pagination (better for performance)
const response = await supabase
  .from('links')
  .select('*')
  .order('created_at', { ascending: false })
  .range(0, 19);

// Implementation:
const [cursor, setCursor] = useState(null);

const handleLoadMore = async () => {
  const { data: newLinks } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })
    .range(20, 39);
  
  setCursor(newLinks[newLinks.length - 1]?.id);
};
```

### Batch Operations

```typescript
// ❌ Slow: Multiple separate requests
await Promise.all([
  updateLink(link1),
  updateLink(link2),
  updateLink(link3),
]);

// ✅ Faster: Single batch update
await supabase
  .from('links')
  .upsert([link1, link2, link3]);
```

---

## 💾 Caching Strategy

### Browser Caching

```typescript
// Cache API responses locally
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedData(key: string, fetcher: () => Promise<any>) {
  const cached = localStorage.getItem(`cache:${key}`);
  const timestamp = localStorage.getItem(`cache:${key}:time`);
  
  if (cached && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < CACHE_DURATION) {
      return JSON.parse(cached);
    }
  }
  
  const data = await fetcher();
  localStorage.setItem(`cache:${key}`, JSON.stringify(data));
  localStorage.setItem(`cache:${key}:time`, Date.now().toString());
  
  return data;
}

// Use:
const links = await getCachedData('links', () => 
  fetch('/api/links').then(r => r.json())
);
```

### CDN Caching

```javascript
// Vercel handles CDN automatically
// But you can optimize:

// Cache static files
<link rel="preload" href="/style.css" as="style" />
<link rel="preconnect" href="https://cdn.example.com" />

// Add cache headers to API
response.headers.set('Cache-Control', 'public, max-age=60');
```

---

## 📊 Monitoring & Analytics

### Performance Monitoring

```typescript
// File: lib/performance.ts
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics service
  console.log(metric);
  
  // Example: Send to custom endpoint
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

// Use in: app/layout.tsx
import { reportWebVitals } from '@/lib/performance';

export function reportWebVitals(metric) {
  reportWebVitals(metric);
}
```

### Database Monitoring

```sql
-- Monitor slow queries
-- Supabase Dashboard → Logs → Query Performance

-- Check query execution time
EXPLAIN ANALYZE
SELECT * FROM links 
WHERE category = 'Design' 
ORDER BY created_at DESC;

-- Monitor table size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Error Monitoring

```typescript
// Setup error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Capture errors
try {
  // code
} catch (error) {
  Sentry.captureException(error);
}
```

---

## 🔧 Production Optimization

### Environment-Specific Settings

```typescript
// next.config.js
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  compress: !isDev,
  productionBrowserSourceMaps: isDev,
  swcMinify: true,
  
  // Optimize images in production
  images: {
    unoptimized: isDev, // Skip optimization in dev
  },
};
```

### Build Optimization

```bash
# Analyze bundle size
npm run build
npm run analyze

# Expected output:
# Total gzipped size: < 500KB
# Each page: < 200KB
```

### Runtime Optimization

```bash
# Monitor memory usage
node --max-old-space-size=512 server.js

# Use production flag
NODE_ENV=production npm start
```

---

## 🎯 Scaling Strategy

### Vertical Scaling
```
Current: 1 instance
↓
Upgrade instance size (CPU, RAM)
```

### Horizontal Scaling
```
Current: Single server
↓
Multiple servers behind load balancer
(Handled by Vercel automatically)
```

### Database Scaling

```sql
-- Monitor database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- When database grows > 100GB:
-- 1. Upgrade Supabase plan
-- 2. Archive old data
-- 3. Optimize queries
-- 4. Add more indexes

-- Archive old links
CREATE TABLE links_archive AS
SELECT * FROM links 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM links
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Storage Scaling

```bash
# Monitor storage usage
# Supabase Dashboard → Storage → Usage

# When > 50GB:
# 1. Delete unused files
# 2. Upgrade storage plan
# 3. Archive to external storage

# Cleanup old uploads
supabase storage list mlebu-link-uploads
# Delete old files manually or with script
```

---

## 📈 Scalability Checklist

- [ ] Database indexed properly
- [ ] Queries optimized
- [ ] Images compressed
- [ ] Code split
- [ ] Caching implemented
- [ ] API paginated
- [ ] Monitoring active
- [ ] Load testing done
- [ ] Backup strategy ready
- [ ] Scaling plan documented

---

## 🔍 Performance Testing

### Load Testing

```bash
# Install Apache Bench
brew install httpd  # macOS
apt-get install apache2-utils  # Linux

# Run test
ab -n 1000 -c 10 https://yourdomain.com/

# Results show:
# Requests per second
# Failed requests
# Average response time
```

### Stress Testing

```bash
# Test with increasing load
ab -n 5000 -c 50 https://yourdomain.com/

# Monitor:
# - Response times
# - Error rates
# - Server CPU/memory
```

### Real User Monitoring (RUM)

```typescript
// Use Vercel Analytics
// Automatically included with Vercel deployment

// Or setup custom RUM
const metrics = {
  fcp: performance.getEntriesByName('first-contentful-paint')[0],
  lcp: new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log('LCP:', entry.renderTime || entry.loadTime);
    });
  }),
};
```

---

## 💡 Performance Tips Summary

1. **Images**: Compress, use WebP, lazy load
2. **Database**: Index, paginate, cache queries
3. **Code**: Split, tree-shake, memoize
4. **API**: Cache responses, compress, batch
5. **Caching**: Browser, CDN, database
6. **Monitoring**: Track metrics, errors, usage
7. **Testing**: Load test before scaling
8. **Scaling**: Vertical → Horizontal → Database

---

**Happy optimizing! ⚡**
