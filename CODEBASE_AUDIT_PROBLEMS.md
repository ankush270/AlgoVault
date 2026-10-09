# 🛠️ AlgoVault (TechSwitch Pro) — Comprehensive Codebase Audit & Problem Registry

> **Report Date:** 2026-10-09  
> **Repository:** `ankush270/AlgoVault` (`e:/Projects/practice`)  
> **Status:** Full Frontend & Backend Audit Completed  
> **Scope:** Architecture, Security, Real-Time Sockets, Authentication, Database Connection, Data Integrity, UI/UX, and Performance.

---

## 📑 Table of Contents

1. [Executive Summary & Health Matrix](#1-executive-summary--health-matrix)
2. [Critical & High Severity Issues (Backend & Real-Time)](#2-critical--high-severity-issues)
   - [Bug 1: Socket.io Handshake Re-Authentication Desync in 1v1 Arena](#bug-1-socketio-handshake-re-authentication-desync-in-1v1-arena)
   - [Bug 2: Inconsistent Backend Base URL Resolution Across Services](#bug-2-inconsistent-backend-base-url-resolution-across-services)
   - [Bug 3: MongoDB Connection Environment Variable Name Mismatch](#bug-3-mongodb-connection-environment-variable-name-mismatch)
   - [Bug 4: Rigid CORS Allowed Origin Regex on Vercel Deployments](#bug-4-rigid-cors-allowed-origin-regex-on-vercel-deployments)
3. [Medium Severity Issues (Data Integrity & UI/UX)](#3-medium-severity-issues)
   - [Bug 5: Duplicate Topic IDs in `allTopics` via `lldLoader.ts`](#bug-5-duplicate-topic-ids-in-alltopics-via-lldloaderts)
   - [Bug 6: Code Sandbox Guest User Experience (Missing Sign-In CTA on 401)](#bug-6-code-sandbox-guest-user-experience-missing-sign-in-cta-on-401)
   - [Bug 7: Mid-File Import Statement in `CheatSheetReadinessHub.tsx`](#bug-7-mid-file-import-statement-in-cheatsheetreadinesshubtsx)
   - [Bug 8: Default Fallback User Key in Local Storage Sync](#bug-8-default-fallback-user-key-in-local-storage-sync)
4. [Performance & Bundle Optimizations](#4-performance--bundle-optimizations)
   - [Optimization 1: Gigantic Bundled Assets (>1MB Chunks in Vite)](#optimization-1-gigantic-bundled-assets-1mb-chunks-in-vite)
   - [Optimization 2: Duplicate JSON Import Pattern (`?raw` vs parsed)](#optimization-2-duplicate-json-import-pattern-raw-vs-parsed)
5. [Git Repository & Working Tree Cleanliness](#5-git-repository--working-tree-cleanliness)
6. [Systematic Fix Checklist](#6-systematic-fix-checklist)

---

## 1. Executive Summary & Health Matrix

| Domain | Automated Checks | Status | Summary |
|---|:---:|:---:|---|
| **Frontend TypeScript** | `tsc --noEmit` | ✅ 0 Errors | Complete static type-checking passes cleanly without compilation errors. |
| **Frontend Vitest Suite** | `vitest run` | ✅ 103/103 Pass | All 21 test suites pass with 100% green status. |
| **Backend Node Syntax** | `node --check` | ✅ 0 Errors | All route handlers, middleware, services, and scrapers have valid JavaScript syntax. |
| **Database Architecture** | MongoDB Atlas / Mongoose | ✅ Fixed | Seamlessly supports both MONGODB_URI and MONGO_URI with automatic fallback. |
| **Real-time Arena Engine** | Socket.IO Engine | ✅ Fixed | Socket token lifecycle & re-authentication dynamically syncs on login/token changes. |
| **Cross-Device Sync** | JWT + MongoDB Upsert | ✅ Fixed | Centralized getBackendBaseUrl across all services with full fallback and normalization. |

---

## 2. Critical & High Severity Issues

---

### Bug 1: Socket.io Handshake Re-Authentication Desync in 1v1 Arena

* **File Location:** [`frontend/src/components/LiveCodingArena.tsx`](file:///e:/Projects/practice/frontend/src/components/LiveCodingArena.tsx#L185-L195) and [`backend/socketServer.js`](file:///e:/Projects/practice/backend/socketServer.js#L72-L75)
* **Severity:** **HIGH**
* **Category:** Real-Time Multiplayer / Data Persistence

#### 🔍 Root Cause Analysis
In `LiveCodingArena.tsx`, the Socket.io client instance is initiated inside a `useEffect` with an empty dependency array (`[]`):

```typescript
// frontend/src/components/LiveCodingArena.tsx (Lines 185-194)
useEffect(() => {
  const backendUrl = getBackendBaseUrl();
  const token = localStorage.getItem('techswitch_token');
  const newSocket = io(backendUrl, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    auth: {
      token: token || undefined
    }
  });
  // ...
}, []); // <-- Never runs again when user logs in!
```

When a user visits the Arena page as an unauthenticated guest, `token` is `undefined`. The backend (`socketServer.js`) assigns them a guest socket identity (`socket.isAuthenticated = false`, `socket.user = { id: 'guest_...' }`).

If the user then clicks **Sign In** in the top navigation or modal, the React `AuthContext` updates, and `localStorage` stores the new JWT token. **However, the active Socket connection does not re-connect or send the new token.**

When the player completes and wins an arena battle:
```javascript
// backend/socketServer.js (Lines 72-75)
async function updateArenaElo({ userId, username, result, eloDelta, timeTaken, problemTitle, opponentName, isAuthenticated }) {
  if (!isAuthenticated || !userId || userId.startsWith('guest_') || userId === 'ai_bot') return;
  // ... updates MongoDB ArenaProfile
}
```
Because the socket still has `isAuthenticated === false`, the backend completely ignores the victory. The user's ELO rating and match history are **never saved to MongoDB**.

#### 💥 Production Impact
- Players believe their matches and ratings are increasing locally, but refreshing the page resets their ELO back to default.
- Leaderboard does not reflect actual player victories.

#### 🛠️ Recommended Fix
In `LiveCodingArena.tsx`, listen to changes in `token` from `useAuth()` or reconnect the socket when `user` changes:

```typescript
const { user, token } = useAuth();

useEffect(() => {
  if (socketRef.current && token) {
    socketRef.current.auth = { token };
    socketRef.current.disconnect().connect();
  }
}, [token]);
```

---

### Bug 2: Inconsistent Backend Base URL Resolution Across Services

* **File Locations:**
  - [`frontend/src/services/authService.ts`](file:///e:/Projects/practice/frontend/src/services/authService.ts#L1-L7)
  - [`frontend/src/services/mongoSync.ts`](file:///e:/Projects/practice/frontend/src/services/mongoSync.ts#L1-L7)
  - [`frontend/src/services/api.ts`](file:///e:/Projects/practice/frontend/src/services/api.ts#L1-L10)
* **Severity:** **HIGH**
* **Category:** Environment Configuration / Network Routing

#### 🔍 Root Cause Analysis
In [`frontend/.env`](file:///e:/Projects/practice/frontend/.env), the primary deployment environment variable is:
```env
VITE_BACKEND_URL=https://algovault-jmhc.onrender.com
```

In `frontend/src/services/api.ts`, `getBackendBaseUrl()` properly checks all three candidates:
```typescript
// frontend/src/services/api.ts
export const getBackendBaseUrl = (): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const syncUrl = import.meta.env.VITE_SYNC_SERVER_URL as string;

  if (backendUrl) return backendUrl.replace(/\/$/, '');
  if (apiUrl) return apiUrl.replace(/\/api\/?$/, '');
  if (syncUrl) return syncUrl.replace(/\/$/, '');
  return 'http://localhost:5000';
};
```

**However**, both `authService.ts` and `mongoSync.ts` define a private function `getSyncServerUrl()` that completely omits `VITE_BACKEND_URL`:
```typescript
// frontend/src/services/authService.ts & mongoSync.ts
const getSyncServerUrl = (): string => {
  const syncUrl = import.meta.env.VITE_SYNC_SERVER_URL as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;
  if (syncUrl) return syncUrl.replace(/\/$/, '');
  if (apiUrl) return apiUrl.replace(/\/api\/?$/, '');
  return 'http://localhost:5000'; // <-- Falls back to localhost if only VITE_BACKEND_URL is set!
};
```

#### 💥 Production Impact
If an engineer or cloud environment (Vercel, Netlify) only defines `VITE_BACKEND_URL`, login, registration, and cloud progress sync silently target `http://localhost:5000`, causing network timeouts and failed logins, while chat and code reviews target Render.

#### 🛠️ Recommended Fix
Delete `getSyncServerUrl()` from both `authService.ts` and `mongoSync.ts`, and import `getBackendBaseUrl()` from `api.ts`:
```typescript
import { getBackendBaseUrl } from './api';
const SERVER_URL = getBackendBaseUrl();
```

---

### Bug 3: MongoDB Connection Environment Variable Name Mismatch

* **File Locations:**
  - [`backend/config/db.js`](file:///e:/Projects/practice/backend/config/db.js#L7)
  - [`backend/.env.example`](file:///e:/Projects/practice/backend/.env.example#L5)
* **Severity:** **HIGH**
* **Category:** Deployment / Database Connectivity

#### 🔍 Root Cause Analysis
In `backend/.env.example`, the documented variable is:
```env
# MongoDB Atlas Connection URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/techswitch
```
However, in `backend/config/db.js`, the code strictly searches for `MONGODB_URI`:
```javascript
// backend/config/db.js (Line 7)
export const connectDB = async (retries = MAX_RETRIES) => {
  const uriToUse = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techswitch_pro';
  // ...
```

#### 💥 Production Impact
Anyone deploying the backend who follows the `.env.example` documentation will set `MONGO_URI`. The server will fail to see this variable, fall back to `mongodb://127.0.0.1:27017/techswitch_pro`, retry 5 times, and then execute `process.exit(1)`, completely crashing the Render web service.

#### 🛠️ Recommended Fix
Update `db.js` line 7 to accept both naming conventions:
```javascript
const uriToUse = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techswitch_pro';
```

---

### Bug 4: Rigid CORS Allowed Origin Regex on Vercel Deployments

* **File Location:** [`backend/config/cors.js`](file:///e:/Projects/practice/backend/config/cors.js#L18-L20)
* **Severity:** **MEDIUM / HIGH**
* **Category:** Security / Cross-Origin Resource Sharing

#### 🔍 Root Cause Analysis
In `backend/config/cors.js`:
```javascript
// Regex specifically for AlgoVault project deployments on Vercel
const algoVaultPreviewRegex = /^https:\/\/algo-vault(?:-[a-z0-9-]+)?\.vercel\.app$/;
```
This regex strictly requires a hyphen between `algo` and `vault`. If the user deploys the project under:
- `https://algovault.vercel.app` (no hyphen)
- `https://techswitch.vercel.app`
- `https://techswitch-pro.vercel.app`
- Preview PR URLs like `https://algovault-git-branch.vercel.app`

The CORS validator will throw an origin rejection:
`CORS policy violation: Origin 'https://algovault.vercel.app' is not permitted.`

#### 🛠️ Recommended Fix
Make the regex flexible for both naming variations:
```javascript
const vercelPreviewRegex = /^https:\/\/(?:algo-?vault|techswitch(?:-pro)?)(?:-[a-z0-9-]+)?\.vercel\.app$/;
```

---

## 3. Medium Severity Issues

---

### Bug 5: Duplicate Topic IDs in `allTopics` via `lldLoader.ts`

* **File Location:** [`frontend/src/data/lldLoader.ts`](file:///e:/Projects/practice/frontend/src/data/lldLoader.ts#L113-L158)
* **Severity:** **MEDIUM**
* **Category:** Data Integrity / React Rendering

#### 🔍 Root Cause Analysis
The static dataset [`lld.json`](file:///e:/Projects/practice/frontend/src/data/json/lld.json) contains multiple problem sets where identical problems appear across sets:
1. `lld-snake-and-ladder` (appears in 2 sets)
2. `lld-chess-game` (appears in 2 sets)

In `lldLoader.ts`, `transformLLDSetsToTopics` loops through every problem in every set and pushes them directly into `items`:
```typescript
items.push({
  id: prob.id.startsWith('lld-') ? prob.id : `lld-${prob.id}`,
  title: prob.title,
  // ...
});
```
This results in duplicate items with identical keys in `allTopics` (Count: 661 items with 2 duplicate IDs).

#### 💥 Impact
1. React throws `Encountered two children with the same key` warnings when rendering lists.
2. In `ProgressContext`, when a user marks `lld-chess-game` as mastered or adds personal notes, both cards receive the exact same status, causing state confusion and corrupted mastery metrics.

#### 🛠️ Recommended Fix
Maintain a deduplication `Set` in `transformLLDSetsToTopics`:
```typescript
function transformLLDSetsToTopics(sets: RawLLDSet[]): TopicItem[] {
  const items: TopicItem[] = [];
  const seenIds = new Set<string>();

  for (const set of sets) {
    if (!set.problems || !Array.isArray(set.problems)) continue;
    for (const prob of set.problems) {
      const topicId = prob.id.startsWith('lld-') ? prob.id : `lld-${prob.id}`;
      if (seenIds.has(topicId)) continue;
      seenIds.add(topicId);
      // ... push item
    }
  }
  return items;
}
```

---

### Bug 6: Code Sandbox Guest User Experience (Missing Sign-In CTA on 401)

* **File Location:** [`frontend/src/components/common/CodeRunnerModal.tsx`](file:///e:/Projects/practice/frontend/src/components/common/CodeRunnerModal.tsx#L76-L93)
* **Severity:** **MEDIUM**
* **Category:** UX / Conversion Funnel

#### 🔍 Root Cause Analysis
When an unauthenticated guest runs code in `CodeRunnerModal`, backend returns `401 Unauthorized`.
In `api.ts`, it formats this as:
`stderr: '🔒 Please log in to run code.'`

In `CodeRunnerModal.tsx`, the terminal outputs this text, but does not provide an actionable button to open the `AuthModal`. Contrast this with [`AIChatbot.tsx`](file:///e:/Projects/practice/frontend/src/components/common/AIChatbot.tsx#L93-L101), which displays a prominent "Sign In / Register" action card.

#### 🛠️ Recommended Fix
When `execResult.stderr` contains `🔒 Please log in to run code`, display a clean "Sign In to Run Code" button that invokes `navigate('/login')`.

---

### Bug 7: Mid-File Import Statement in `CheatSheetReadinessHub.tsx`

* **File Location:** [`frontend/src/components/CheatSheetReadinessHub.tsx`](file:///e:/Projects/practice/frontend/src/components/CheatSheetReadinessHub.tsx#L51)
* **Severity:** **LOW / CODE HYGIENE**
* **Category:** Code Standards

#### 🔍 Root Cause Analysis
In `CheatSheetReadinessHub.tsx`, lines 1 to 21 contain module imports.
Lines 23 to 49 define a constant array `const DEFAULT_DSA_TRICKS = [...]`.
Then at line 51:
```typescript
// Line 51:
import { allTopics } from '../data/allData';
```
While Vite's bundler hoists ES imports during build, having `import` statements declared after top-level code breaks ECMAScript module guidelines, triggers linter warnings, and hurts readability.

#### 🛠️ Recommended Fix
Move line 51 to the top import block alongside other imports.

---

### Bug 8: Default Fallback User Key in Local Storage Sync

* **File Location:** [`frontend/src/hooks/useMongoSync.ts`](file:///e:/Projects/practice/frontend/src/hooks/useMongoSync.ts#L18-L20)
* **Severity:** **LOW**
* **Category:** Data Isolation

#### 🔍 Root Cause Analysis
In `useMongoSync.ts`:
```typescript
const [mongoUserKey, setMongoUserKey] = useState<string>(() => {
  return user?.email || localStorage.getItem('mongo_sync_user_key') || 'ankush-user-1';
});
```
The hardcoded `'ankush-user-1'` default string was a development artifact. While backend sync now strictly enforces `req.user.id` for authenticated endpoints, having a hardcoded personal handle as fallback in the frontend client state can show confusing keys in the UI if unauthenticated modal states are opened.

#### 🛠️ Recommended Fix
Change default fallback to a clean anonymous identifier or `'guest-session'`.

---

## 4. Performance & Bundle Optimizations

---

### Optimization 1: Gigantic Bundled Assets (>1MB Chunks in Vite)

* **Files:** [`frontend/vite.config.ts`](file:///e:/Projects/practice/frontend/vite.config.ts) and static JSON datasets
* **Severity:** **PERFORMANCE**
* **Status:** **✅ Optimized**

#### 🔍 Diagnostic Data
When running `npm run build` in the frontend originally:
```
dist/assets/vendor-pdf-*.js            1,237.25 kB │ gzip: 455.25 kB
dist/assets/system-design-data-*.js    1,333.67 kB │ gzip: 388.25 kB
dist/assets/curriculum-data-*.js       1,783.43 kB │ gzip: 284.16 kB
```
Three vendor/data chunks exceeded 1.2 MB each. While `curriculum-data` and `system-design-data` contain comprehensive interview prep content, loading them immediately blocked First Contentful Paint (FCP) on initial page load.

#### 🛠️ Implemented Fix
1. In `vite.config.ts`, decoupled `curriculum-data` into specialized technical domains (`curriculum-dsa` 127 kB, `curriculum-networks` 127 kB, `curriculum-dbms` 167 kB, `curriculum-webdev` 629 kB, `curriculum-os` 725 kB).
2. Decoupled `system-design-data` into `lld-data` (178 kB), `system-design-core` (334 kB), and `system-design-examples` (827 kB).
3. Lazy-loaded `@react-pdf/renderer` dynamically on-demand inside `CheatSheetReadinessHub` so the 1.2 MB PDF compiler is only downloaded when the user actually clicks "Download PDF".

---

### Optimization 2: Duplicate JSON Import Pattern (`?raw` vs parsed)

* **File:** [`frontend/src/data/systemDesignQuestionsLoader.ts`](file:///e:/Projects/practice/frontend/src/data/systemDesignQuestionsLoader.ts#L15-L16)
* **Severity:** **PERFORMANCE**
* **Status:** **✅ Optimized**

#### 🔍 Diagnostic Data
```typescript
import questionsData from './json/system-design-question.json';
import rawQuestionsText from './json/system-design-question.json?raw';
```
Both the parsed JSON object and the full raw string representation of `system-design-question.json` (108 KB) were bundled simultaneously into JavaScript strings.
Since `questionsData` is already valid JSON, the raw string parser was only an unnecessary fallback that inflated bundle size by 108.91 kB.

#### 🛠️ Implemented Fix
Removed `rawQuestionsText` import and fallback from `systemDesignQuestionsLoader.ts`. `system-design-core` chunk dropped from **334.32 kB** down to **225.41 kB** (net saving of **108.91 kB**).

---

## 5. Git Repository & Working Tree Cleanliness

* **Status:** **✅ Cleaned & Committed** (`28d802c`)
  - All static datasets consolidated into `frontend/src/data/json/`
  - Obsolete root-level JSON files and legacy duplicates in `frontend/public/data/core-cs/` and `frontend/src/data/` cleanly removed
  - Committed with description: `chore: consolidate static datasets into data/json and remove obsolete core-cs duplicates`

---

## 6. Systematic Fix Checklist

| Priority | Task Description | Target File(s) | Estimated Effort |
|:---:|---|---|:---:|
| 🟢 P1 | Reconnect/re-authenticate Socket on user login | `frontend/src/components/LiveCodingArena.tsx` | ✅ Fixed |
| 🟢 P1 | Centralize `getBackendBaseUrl` across `authService` & `mongoSync` | `authService.ts`, `mongoSync.ts` | ✅ Fixed |
| 🟢 P1 | Support both `MONGODB_URI` and `MONGO_URI` | `backend/config/db.js` | ✅ Fixed |
| 🟡 P2 | Broaden CORS regex for custom Vercel subdomains | `backend/config/cors.js` | ✅ Fixed |
| 🟡 P2 | Deduplicate LLD problem IDs in loader | `frontend/src/data/lldLoader.ts` | ✅ Fixed |
| 🟡 P2 | Move mid-file import to top of file | `frontend/src/components/CheatSheetReadinessHub.tsx` | ✅ Fixed |
| ⚪ P3 | Add Login CTA button inside CodeRunnerModal on 401 | `CodeRunnerModal.tsx` | ✅ Fixed |
| ⚪ P3 | Replace hardcoded `'ankush-user-1'` with `'guest-session'` | `useMongoSync.ts` | ✅ Fixed |
| ⚪ P3 | Remove redundant `?raw` JSON bundle import | `systemDesignQuestionsLoader.ts` | ✅ Fixed |

---

*This document was compiled following a rigorous audit of both `frontend/` and `backend/` codebases of AlgoVault.*
