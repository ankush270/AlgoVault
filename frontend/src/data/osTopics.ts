import { TopicItem } from '../types';

export const osTopics: TopicItem[] = [
  {
    id: 'os-process-vs-threads',
    title: 'Process vs Threads, Context Switching & IPC',
    domain: 'os',
    category: 'Process Management',
    difficulty: 'Easy',
    companyTags: ['Microsoft', 'Google', 'Amazon', 'Cisco', 'Samsung'],
    importanceRating: 5,
    summary: 'Core distinction between Process and Thread execution models, virtual memory isolation, context switch overhead, and Inter-Process Communication (IPC).',
    keyConcepts: [
      'Process Control Block (PCB) vs Thread Control Block (TCB)',
      'Shared Memory vs Message Passing IPC',
      'Context Switch Overhead (TLB Flush, CPU Registers, Cache Misses)',
      'User Threads vs Kernel Threads (1:1, N:1, M:N mapping models)'
    ],
    detailedContent: `
### Comparison Table
| Feature | Process | Thread (Lightweight Process) |
| :--- | :--- | :--- |
| **Memory Space** | Separate address space (isolated page table) | Shared code, data, heap segment with parent process; private stack & registers |
| **Context Switch Time** | High (flushes TLB, swaps page tables, CPU registers) | Low (maintains same page table & TLB entries) |
| **Creation Overhead** | High (allocates PCB, virtual memory map, file descriptors) | Low (allocates TCB and stack space only) |
| **Fault Isolation** | High (if one process crashes, others continue) | Low (if one thread crashes/segfaults, entire process terminates) |
| **Communication** | IPC required (Pipes, Sockets, Shared Memory, Signals) | Direct variable/memory access with synchronization locks |

### Inter-Process Communication (IPC) Mechanisms
1. **Pipes / Named Pipes (FIFO)**: Unidirectional or bidirectional byte stream.
2. **Shared Memory**: Fastest IPC method; processes map same physical RAM pages to their address space. Requires Mutex/Semaphore to prevent data races.
3. **Sockets**: Network/Unix Domain sockets for process communication across machines or local system.
4. **Message Queues**: OS-managed message buffer queues.
    `,
    interviewQuestions: [
      {
        question: 'Why is context switching between threads in the same process faster than context switching between processes?',
        answer: 'Because threads share the same virtual memory address space. Switching threads does not require updating page table base registers (CR3 in x86) or flushing the Translation Lookaside Buffer (TLB), preventing cache invalidation penalty.'
      },
      {
        question: 'What happens during a CPU Context Switch?',
        answer: 'The CPU saves current execution state (Program Counter, CPU registers, stack pointer) into the active PCB/TCB, loads the next scheduled process/thread state from its PCB/TCB into registers, and updates virtual memory page tables if switching processes.'
      }
    ]
  },
  {
    id: 'os-deadlocks-synchronization',
    title: 'Deadlocks: 4 Coffman Conditions, Banker\'s Algorithm & Mutex vs Semaphore',
    domain: 'os',
    category: 'Synchronization & Concurrency',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Google', 'Adobe', 'Oracle', 'Qualcomm'],
    importanceRating: 5,
    summary: 'Master deadlock detection, prevention, avoidance (Banker\'s Algorithm) and synchronization primitives (Mutex, Counting Semaphore, Monitor).',
    keyConcepts: [
      'Coffman 4 Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
      'Banker\'s Algorithm for Safe State checking',
      'Mutex (Locking mechanism owned by thread) vs Semaphore (Signaling mechanism)',
      'Producer-Consumer Problem using Counting Semaphores'
    ],
    detailedContent: `
### 4 Coffman Conditions (All 4 must hold for Deadlock to occur)
1. **Mutual Exclusion**: At least one resource must be held in non-shareable mode.
2. **Hold and Wait**: A process holds at least one resource and waits to acquire additional resources held by others.
3. **No Preemption**: Resources cannot be forcibly taken away; released only voluntarily.
4. **Circular Wait**: A closed chain of processes exists ($P_0 \\rightarrow P_1 \\rightarrow P_2 \\dots \\rightarrow P_0$) where each process waits for a resource held by the next.

### Mutex vs Binary Semaphore
- **Mutex (Mutual Exclusion)**: Ownership concept. Only the thread that acquired the mutex can unlock it. Ideal for protecting critical sections.
- **Binary Semaphore**: Signaling concept. Any thread can post/signal (\`V()\`) to unlock a semaphore waited on (\`P()\`) by another thread.
    `,
    interviewQuestions: [
      {
        question: 'How can you break the Circular Wait condition to prevent deadlocks?',
        answer: 'Impose a global total ordering on all resource types. Require every process to request resources in strictly increasing order of their numerical resource IDs. This mathematically guarantees circular wait graph cannot form.'
      }
    ]
  },
  {
    id: 'os-virtual-memory-paging',
    title: 'Virtual Memory, Paging, Page Faults & Page Replacement Algorithms',
    domain: 'os',
    category: 'Memory Management',
    difficulty: 'Medium',
    companyTags: ['Intel', 'Google', 'Apple', 'Nvidia', 'Microsoft'],
    importanceRating: 5,
    summary: 'Deep dive into virtual to physical address translation, Page Tables, TLB, Page Fault handling, and LRU/FIFO/Optimal page replacement.',
    keyConcepts: [
      'Virtual Address to Physical Address translation via Page Table',
      'Translation Lookaside Buffer (TLB) hardware cache',
      'Page Fault trap execution flow',
      'LRU (Least Recently Used) & Belady\'s Anomaly in FIFO'
    ],
    detailedContent: `
### Address Translation Mechanics
Virtual Address is split into **Page Number (P)** and **Page Offset (d)**.
1. CPU checks TLB for Page $P$.
2. If **TLB Hit**: Retrieves Physical Frame Number $F$ instantly.
3. If **TLB Miss**: Queries Multi-Level Page Table in RAM. If valid bit is 1, returns Frame $F$ and updates TLB.
4. If valid bit is 0 $\\rightarrow$ **Page Fault Trap**!
   - OS pauses process.
   - Allocates free frame in RAM (or evicts victim frame using LRU).
   - Reads missing page from Disk/Swap file into RAM frame.
   - Updates Page Table bit to valid & resumes instruction.
    `,
    interviewQuestions: [
      {
        question: 'What is Belady\'s Anomaly in Memory Page Replacement?',
        answer: 'Belady\'s Anomaly occurs in FIFO page replacement algorithm where increasing the number of physical memory frames results in MORE page faults for certain access patterns. LRU and Optimal algorithms are stack algorithms and do not suffer from Belady\'s Anomaly.'
      }
    ]
  }
];
