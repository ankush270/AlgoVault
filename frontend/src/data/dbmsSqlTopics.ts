import { TopicItem } from '../types';

export const dbmsSqlTopics: TopicItem[] = [
  {
    id: 'dbms-acid-transactions-isolation',
    title: 'ACID Properties, Transaction Isolation Levels & Concurrency Control',
    domain: 'dbms-sql',
    category: 'Database Internals',
    difficulty: 'Hard',
    companyTags: ['Oracle', 'Amazon', 'Uber', 'Razorpay', 'Salesforce'],
    importanceRating: 5,
    summary: 'Core principles of database transactions: Atomicity, Consistency, Isolation, Durability, WAL (Write-Ahead Logging), and SQL isolation anomaly levels.',
    keyConcepts: [
      'ACID Guarantees & Write-Ahead Logging (WAL)',
      '4 ANSI SQL Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable',
      '3 Read Anomalies: Dirty Read, Non-Repeatable Read, Phantom Read',
      'Two-Phase Locking (2PL) vs MVCC (Multi-Version Concurrency Control)'
    ],
    detailedContent: `
### Isolation Levels vs Anomalies Matrix
| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
| :--- | :--- | :--- | :--- |
| **Read Uncommitted** | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Read Committed** (Default in Postgres) | ✅ Prevented | ❌ Allowed | ❌ Allowed |
| **Repeatable Read** (Default in MySQL InnoDB) | ✅ Prevented | ✅ Prevented | ❌ Allowed (MVCC prevents in InnoDB) |
| **Serializable** | ✅ Prevented | ✅ Prevented | ✅ Prevented |

### MVCC (Multi-Version Concurrency Control)
PostgreSQL and MySQL InnoDB use MVCC for high concurrency.
- Readers do not block writers, and writers do not block readers.
- Each transaction sees a snapshot of data at a specific point in time (xmin / xmax transaction IDs).
- Updates create new tuple versions rather than overwriting in place.
    `,
    interviewQuestions: [
      {
        question: 'What is a Phantom Read and how is it different from a Non-Repeatable Read?',
        answer: 'Non-Repeatable Read occurs when Transaction A reads a row, Transaction B updates that row and commits, then Transaction A re-reads the SAME row and sees changed values. Phantom Read occurs when Transaction A runs a range query (e.g. count WHERE age > 25), Transaction B INSERTS a new row matching that condition and commits, then Transaction A re-runs range query and sees new "phantom" rows.'
      }
    ]
  },
  {
    id: 'dbms-indexing-b-trees',
    title: 'Database Indexing: B-Trees, B+ Trees, Hash Index & Indexing Strategies',
    domain: 'dbms-sql',
    category: 'Indexing & Optimization',
    difficulty: 'Medium',
    companyTags: ['Google', 'Amazon', 'Meta', 'LinkedIn', 'Uber'],
    importanceRating: 5,
    summary: 'Understanding how database indices speed up queries, B+ Tree leaf node linked list chaining, Clustered vs Secondary Index, and Composite Index Leftmost Prefix Rule.',
    keyConcepts: [
      'Why B+ Trees are preferred over Binary Search Trees or B-Trees for Disk Storage',
      'Clustered Index (Primary key ordering) vs Non-Clustered/Secondary Index',
      'Composite Index & Leftmost Prefix Rule',
      'Index Covering Query optimization'
    ],
    detailedContent: `
### Why B+ Trees for Disk Storage?
1. **High Fanout & Low Tree Height**: B+ Trees have high node capacity (hundreds of keys per page), resulting in 3-4 tree depth even for billions of records ($O(\\log_B N)$ Disk I/Os).
2. **Sequential Leaf Node Scan**: Data pointers are stored ONLY in leaf nodes. Leaf nodes are linked together as a doubly linked list, enabling fast range queries (\`WHERE age BETWEEN 20 AND 30\`).

### Composite Index (a, b, c) Rule
An index on \`(a, b, c)\` can satisfy queries filtering on:
- \`WHERE a = 1\`
- \`WHERE a = 1 AND b = 2\`
- \`WHERE a = 1 AND b = 2 AND c = 3\`
It CANNOT utilize the index for queries like \`WHERE b = 2\` without \`a\`!
    `,
    interviewQuestions: [
      {
        question: 'What is a Covering Index in SQL optimization?',
        answer: 'A Covering Index is a secondary index that includes all the columns referenced in a SELECT query (both SELECT clause and WHERE clause). Because all needed columns exist inside the index tree, the database engine executes an Index Only Scan without incurring expensive disk lookup table fetches.'
      }
    ]
  },
  {
    id: 'dbms-sql-queries-window-functions',
    title: 'SQL Masterclass: Joins, Subqueries & Window Functions (ROW_NUMBER, DENSE_RANK)',
    domain: 'dbms-sql',
    category: 'SQL Practice',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Flipkart', 'Swiggy', 'PhonePe', 'Paytm'],
    importanceRating: 5,
    summary: 'Advanced SQL query writing, GROUP BY, HAVING, INNER/LEFT/FULL OUTER JOINs, and Analytic Window functions.',
    keyConcepts: [
      'ROW_NUMBER() vs RANK() vs DENSE_RANK()',
      'PARTITION BY & ORDER BY clause in Window Functions',
      'Self Join & Recursive CTEs for Hierarchical Data',
      'GROUP BY aggregation vs HAVING clause filtering'
    ],
    detailedContent: `
### Window Function Difference
Given salaries: \`[100, 100, 90, 80]\`:
- \`ROW_NUMBER()\`: \`1, 2, 3, 4\` (Unique strict sequence)
- \`RANK()\`: \`1, 1, 3, 4\` (Ties get same rank, skips next number)
- \`DENSE_RANK()\`: \`1, 1, 2, 3\` (Ties get same rank, NO skipping)

### Example Query: Finding 2nd Highest Salary per Department
\`\`\`sql
WITH RankedSalaries AS (
  SELECT 
    emp_id, 
    dept_id, 
    salary,
    DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rnk
  FROM employees
)
SELECT emp_id, dept_id, salary
FROM RankedSalaries
WHERE rnk = 2;
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'What is the execution order of a standard SQL SELECT statement?',
        answer: '1. FROM & JOINs -> 2. WHERE -> 3. GROUP BY -> 4. HAVING -> 5. SELECT -> 6. WINDOW Functions -> 7. DISTINCT -> 8. ORDER BY -> 9. LIMIT / OFFSET.'
      }
    ]
  }
];
