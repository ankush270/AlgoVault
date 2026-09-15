import { TopicItem } from '../types';

export const systemDesignTopics: TopicItem[] = [
  {
    id: 'sd-url-shortener-hld',
    title: 'High-Level Design: TinyURL / Scalable URL Shortener',
    domain: 'system-design',
    category: 'High Level Design (HLD)',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Google', 'Meta', 'Uber', 'Swiggy'],
    importanceRating: 5,
    summary: 'Classic System Design interview problem covering Base62 encoding, KGS (Key Generation Service), caching strategy & database partitioning.',
    keyConcepts: [
      'Base62 Encoding vs MD5/SHA256 Hashing',
      'Key Generation Service (KGS) for zero-collision keys',
      'Read-heavy traffic caching (Redis LRU cache)',
      'Database Sharding by URL hash or range'
    ],
    detailedContent: `
### System Requirements & Estimations
- **Traffic Ratio**: 100:1 Read to Write ratio.
- **Scale**: 100 Million new URLs created per month (approx ~40 writes/sec, 4000 reads/sec).
- **Storage**: 500 Bytes per URL entry $\\rightarrow$ $100M \\times 500B = 50 GB / \\text{month} \\rightarrow 3TB / 5 \\text{years}$.

### Architecture Flow
1. **API Gateway / Load Balancer**: Distributes incoming requests to API App Servers.
2. **KGS (Key Generation Service)**: Pre-computes 7-character Base62 keys (\`[a-zA-Z0-9]\` gives $62^7 \\approx 3.5 \\text{ Trillion}\$) and stores them in DB. Loads key blocks in memory.
3. **App Server**: Fetches unused key from KGS, inserts \`(shortKey, longUrl, createdAt)\` into NoSQL DB (Cassandra or DynamoDB for high read throughput).
4. **Cache Layer**: Redis cluster storing hot URLs with 20% Pareto principle (\`80/20 rule\`).
5. **Redirection HTTP Status**: Return \`302 Found\` (Temporary Redirect) for analytics tracking, or \`301 Moved Permanently\` to reduce server load.
    `,
    interviewQuestions: [
      {
        question: 'Why choose 302 Redirect over 301 Redirect for TinyURL?',
        answer: 'HTTP 301 is cached permanently by browsers, meaning subsequent clicks bypass our servers so we lose click analytics. HTTP 302 forces browsers to hit our server every time, allowing accurate click analytics.'
      },
      {
        question: 'How to prevent duplicate URL insertions?',
        answer: 'Two approaches: 1) Allow duplicate short URLs for identical long URLs (standard for privacy & user isolation), or 2) Query database before generating key, or use KGS mapping with unique index on longUrl.'
      }
    ]
  },
  {
    id: 'sd-rate-limiter-hld',
    title: 'High-Level Design: Distributed Rate Limiter API Gateway',
    domain: 'system-design',
    category: 'High Level Design (HLD)',
    difficulty: 'Hard',
    companyTags: ['Cloudflare', 'Stripe', 'Google', 'Meta', 'Uber'],
    importanceRating: 5,
    summary: 'Design a scalable rate limiter to protect backend APIs from abuse, DDoS, and quota exhaustion.',
    keyConcepts: [
      'Token Bucket & Leaky Bucket Algorithms',
      'Sliding Window Counter vs Fixed Window Counter',
      'Redis Lua Scripts for atomic counter increments',
      'Race condition mitigation in distributed setup'
    ],
    detailedContent: `
### Algorithms Comparison
1. **Token Bucket**: Refills tokens at fixed rate. Allows bursts up to bucket capacity. Highly popular (AWS API Gateway, NGINX).
2. **Leaky Bucket**: FIFO queue processing requests at constant rate. Smooths out traffic spikes.
3. **Fixed Window Counter**: Divides time into fixed windows. Suffers from double quota issue at window boundaries.
4. **Sliding Window Log**: Stores timestamps in Redis Sorted Set (\`ZREMRANGEBYSCORE\`). Extremely accurate but high memory cost.
5. **Sliding Window Counter**: Combines current window and previous window counts using weighted overlap. Memory efficient & highly accurate.

### Architecture Components
- **Client Identification**: User ID, API Key, or IP Address.
- **Distributed Cache**: Redis cluster using atomic Lua scripts to eliminate race conditions between API servers.
- **Headers Returned**:
  - \`X-RateLimit-Remaining\`: Number of allowed requests remaining.
  - \`X-RateLimit-Limit\`: Max requests allowed per window.
  - \`X-RateLimit-Retry-After\`: Seconds to wait before retrying (HTTP 429 Too Many Requests).
    `,
    interviewQuestions: [
      {
        question: 'How do you prevent race conditions when multiple app servers update Redis counters concurrently?',
        answer: 'Use Redis Lua scripts! Lua scripts execute atomically in Redis single-threaded runtime engine, guaranteeing no race condition between checking remaining tokens and decrementing count.'
      }
    ]
  },
  {
    id: 'sd-design-patterns-lld',
    title: 'Low-Level Design (LLD): Creational, Structural & Behavioral Patterns',
    domain: 'system-design',
    category: 'Low Level Design (LLD)',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Flipkart', 'Microsoft', 'Oracle', 'Paytm'],
    importanceRating: 5,
    summary: 'Master Gang of Four (GoF) design patterns & SOLID principles required for LLD machine coding rounds.',
    keyConcepts: [
      'SOLID Principles (Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion)',
      'Factory Method & Abstract Factory Pattern',
      'Observer Pattern (Pub/Sub Event Dispatcher)',
      'Strategy Pattern (Pluggable Algorithms e.g. Payment Gateway, Sorting Strategy)'
    ],
    detailedContent: `
### Strategy Pattern Example (Payment Processing)
Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime without modifying client code.

\`\`\`typescript
interface PaymentStrategy {
  pay(amount: number): boolean;
}

class UPIPayment implements PaymentStrategy {
  pay(amount: number) { console.log(\`Paid \${amount} via UPI\`); return true; }
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number) { console.log(\`Paid \${amount} via Credit Card\`); return true; }
}

class ShoppingCart {
  constructor(private strategy: PaymentStrategy) {}
  setStrategy(strategy: PaymentStrategy) { this.strategy = strategy; }
  checkout(amount: number) { return this.strategy.pay(amount); }
}
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'What is the difference between Strategy Pattern and State Pattern?',
        answer: 'In Strategy Pattern, the client chooses the strategy algorithm explicitly and strategies are generally independent. In State Pattern, states transition automatically based on context internal state, changing context behavior dynamically.'
      }
    ]
  }
];
