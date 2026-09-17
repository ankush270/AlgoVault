import { TopicItem } from '../types';

/**
 * DSA & Algorithms Topic Registry
 * Populated from public/data/bitmanipulatio.json & public/data/linkedlist.json
 */
export const dsaTopics: TopicItem[] = [
  // ==========================================
  // MODULE 1: BIT MANIPULATION
  // ==========================================
  {
    id: 'dsa-bit-01-binary-basics',
    title: '1. Binary Representation & Bit Extraction',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Easy',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Nvidia'],
    importanceRating: 5,
    summary: 'Master binary base-2 representation, place values, decimal-to-binary conversion, and formula for extracting the i-th bit from any integer.',
    keyConcepts: [
      'Decimal (Base 10) vs Binary (Base 2) place values (2⁰, 2¹, 2², 2³, ...)',
      'Extracting least significant bit via n % 2',
      'Extracting bit at position i using (n >> i) & 1',
      'Bit positions indexing from 0 at LSB to 31/63 at MSB'
    ],
    detailedContent: `
### 📌 1. Binary Basics & Place Values

Computers store integers in **binary format (base-2)** using powers of 2.

#### Decimal vs Binary Comparison

| System | Base | Digits | Place Values | Example (Decimal 14) |
| :--- | :--- | :--- | :--- | :--- |
| **Decimal** | 10 | 0–9 | Powers of 10 | 1 × 10³ + 2 × 10² + 3 × 10¹ + 4 × 10⁰ = 1234 |
| **Binary** | 2 | 0, 1 | Powers of 2 | 1 × 2³ + 1 × 2² + 1 × 2¹ + 0 × 2⁰ = (1110)₂ = 14 |

---

### 🔑 Bit Extraction Formula

To extract the bit at 0-indexed position **i** from an integer **n**:

Bit at position i = (n >> i) & 1

#### Step-by-Step Example: Extracting bits of 15 = (1111)₂
- Bit at position 0: (15 >> 0) & 1 = 15 & 1 = 1
- Bit at position 1: (15 >> 1) & 1 = 7 & 1 = 1
- Bit at position 2: (15 >> 2) & 1 = 3 & 1 = 1
- Bit at position 3: (15 >> 3) & 1 = 1 & 1 = 1

> 💡 **Key Takeaway**: Right-shifting by i moves the target bit to position 0. Bitwise AND with 1 isolates its value (0 or 1).
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `// C++: Extract i-th bit from integer n
int getBit(int n, int i) {
    return (n >> i) & 1;
}

void printAllBits(int n) {
    for (int i = 31; i >= 0; --i) {
        cout << ((n >> i) & 1);
    }
    cout << endl;
}`
      },
      {
        language: 'python',
        code: `# Python: Extract i-th bit from integer n
def get_bit(n: int, i: int) -> int:
    return (n >> i) & 1

def print_binary_32(n: int):
    bits = [(n >> i) & 1 for i in range(31, -1, -1)]
    print("".join(map(str, bits)))`
      }
    ],
    interviewQuestions: [
      {
        question: 'Why do we use (n >> i) & 1 instead of n % 2 to extract the i-th bit?',
        answer: 'n % 2 only gets the least significant bit (position 0). (n >> i) shifts the i-th bit into position 0 first, making it work for any bit index i in O(1) time.'
      }
    ]
  },
  {
    id: 'dsa-bit-02-bitwise-operators',
    title: '2. Bitwise Operators & Truth Tables (~, &, |, ^, <<, >>)',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Easy',
    companyTags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Uber'],
    importanceRating: 5,
    summary: 'Complete guide to the 6 core bitwise operators: NOT (~), AND (&), OR (|), XOR (^), Left Shift (<<), and Right Shift (>>).',
    keyConcepts: [
      'NOT (~) flips every 0 to 1 and 1 to 0 (unary operation)',
      'AND (&) yields 1 only when both inputs are 1 (masking & testing)',
      'OR (|) yields 1 when either input is 1 (setting bits)',
      'XOR (^) yields 1 when inputs differ (toggling & unique finding)',
      'Left Shift (x << k) multiplies by 2ᵏ',
      'Right Shift (x >> k) divides by 2ᵏ'
    ],
    detailedContent: `
### 🛠️ The 6 Bitwise Operators

#### 1. NOT (~) – Bit Inversion
Flips every bit of the operand: 0 → 1, 1 → 0.

#### 2. AND (&) – Bitwise Conjunction
Returns 1 only if **both** corresponding bits are 1.

#### 3. OR (|) – Bitwise Disjunction
Returns 1 if **either** corresponding bit is 1.

#### 4. XOR (^) – Exclusive OR
Returns 1 if the corresponding bits are **different**.

#### 5. Left Shift (<<) & Right Shift (>>)
- Left Shift: x << k = x × 2ᵏ
- Right Shift: x >> k = ⌊x / 2ᵏ⌋
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `void demonstrateBitwiseOperators() {
    int a = 12; // (1100)_2
    int b = 10; // (1010)_2
    int andRes = a & b;  // 8
    int orRes = a | b;   // 14
    int xorRes = a ^ b;  // 6
}`
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between logical right shift (>>>) and arithmetic right shift (>>)?',
        answer: 'Arithmetic right shift (>>) preserves the sign bit. Logical right shift (>>>) always zero-fills left positions regardless of sign.'
      }
    ]
  },
  {
    id: 'dsa-bit-03-core-operations',
    title: '3. Core Bit Operations & Character Bit Tricks',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Flipkart', 'Adobe'],
    importanceRating: 5,
    summary: 'Standard bit operations (Check, Set, Clear, Toggle, Count, Power of 2) alongside ASCII character manipulation tricks.',
    keyConcepts: [
      'Check i-th bit: (n & (1 << i)) != 0',
      'Set i-th bit: n |= (1 << i)',
      'Clear i-th bit: n &= ~(1 << i)',
      'Toggle i-th bit: n ^= (1 << i)',
      'Brian Kernighan set bit counting: n &= (n - 1)',
      'Power of 2 test: n > 0 && (n & (n - 1)) == 0'
    ],
    detailedContent: `
### ⚡ Core Bit Manipulation Cheat Sheet

| Operation | Formula | Example / Notes |
| :--- | :--- | :--- |
| **Check i-th bit** | (n & (1 << i)) != 0 | Returns true if bit i is 1 |
| **Set i-th bit** | n |= (1 << i) | Forces bit i to 1 |
| **Clear i-th bit** | n &= ~(1 << i) | Forces bit i to 0 |
| **Toggle i-th bit** | n ^= (1 << i) | Flips bit i (0 → 1) |
| **Count Set Bits** | Brian Kernighan: n &= (n - 1) | Runs in O(K) time |
| **Power of Two** | n > 0 && (n & (n - 1)) == 0 | Exactly one set bit |
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`
      }
    ]
  },
  {
    id: 'dsa-bit-04-rightmost-set-bit',
    title: '4. Rightmost Set Bit Patterns (n & -n, n & (n - 1))',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Medium',
    companyTags: ['Google', 'Meta', 'Amazon', 'Apple', 'Goldman Sachs'],
    importanceRating: 5,
    summary: 'Techniques for isolating lowest set bit (n & -n), clearing lowest set bit (n & (n - 1)), and Fenwick tree Applications.',
    keyConcepts: [
      'Extract Lowest Set Bit: n & -n',
      'Clear Lowest Set Bit: n & (n - 1)',
      'Position of Lowest Set Bit: log2(n & -n) + 1',
      'Binary Indexed Trees (Fenwick Trees)'
    ],
    detailedContent: `
### 🎯 Isolating the Lowest Set Bit (n & -n)

In Two's Complement arithmetic, -n = ~n + 1.
Performing n & -n isolates the rightmost set 1-bit.
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `int getLowestSetBitValue(int n) {
    return n & -n;
}`
      }
    ]
  },
  {
    id: 'dsa-bit-05-xor-mastery',
    title: '5. XOR Properties & Single Number Variations (I, II, III)',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Medium',
    companyTags: ['Meta', 'Google', 'Amazon', 'Microsoft', 'Bloomberg'],
    importanceRating: 5,
    summary: 'Master XOR cancellation (x ⊕ x = 0, x ⊕ 0 = x) and solve Single Number I, II, and III.',
    keyConcepts: [
      'Self-cancellation: x ⊕ x = 0',
      'Single Number I: XOR all elements in O(N) time',
      'Single Number II: 2-bit counter state machine',
      'Single Number III: Partitioning by xor_sum & -xor_sum'
    ],
    detailedContent: `
### 🧮 XOR Algebraic Properties

1. **Self-Cancellation**: x ⊕ x = 0
2. **Identity**: x ⊕ 0 = x
3. **Reversibility**: If a ⊕ b = c, then a = b ⊕ c.
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `vector<int> singleNumberIII(vector<int>& nums) {
    long long xor_sum = 0;
    for (int n : nums) xor_sum ^= n;
    long long diff = xor_sum & -xor_sum;
    int a = 0, b = 0;
    for (int n : nums) {
        if (n & diff) a ^= n;
        else b ^= n;
    }
    return {a, b};
}`
      }
    ]
  },
  {
    id: 'dsa-bit-06-bitmasking-subsets',
    title: '6. Bitmasking, Submask Enumeration & Gray Code',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Medium',
    companyTags: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Uber'],
    importanceRating: 5,
    summary: 'Represent sets as bitmask integers, iterate all submasks of a mask in O(3^N) time, and generate Gray Code sequences.',
    keyConcepts: [
      'Representing subsets of N items as integer bitmask',
      'Submask Enumeration: for (int s = mask; s > 0; s = (s - 1) & mask)',
      'Gray Code: G(n) = n ^ (n >> 1)'
    ],
    detailedContent: `
### 🎭 Bitmask Set Operations

- **Set Union**: maskA | maskB
- **Set Intersection**: maskA & maskB
- **Set Difference**: maskA & ~maskB
    `,
    codeTemplates: [
      {
        language: 'python',
        code: `def get_gray_code(n: int) -> list[int]:
    return [i ^ (i >> 1) for i in range(1 << n)]`
      }
    ]
  },
  {
    id: 'dsa-bit-07-subset-dp',
    title: '7. Subset DP with Bitmasks & Built-in Intrinsics',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Hard',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Atlassian'],
    importanceRating: 5,
    summary: 'Dynamic Programming over Bitmasks for NP-hard optimization problems (TSP, Matching) and GCC/Clang built-in intrinsics.',
    keyConcepts: [
      'Travelling Salesperson Problem (TSP) in O(N² 2ᴺ) time',
      'Compiler Intrinsics: __builtin_popcount(), __builtin_clz(), __builtin_ctz()'
    ],
    detailedContent: `
### 🧩 Subset Dynamic Programming (Bitmask DP)

When N <= 20, NP-hard search problems can be optimized using Bitmask DP.
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `int popcount(unsigned int n) {
    return __builtin_popcount(n);
}`
      }
    ]
  },
  {
    id: 'dsa-bit-08-cheatsheet-recognition',
    title: '8. Bit Manipulation Signal Recognition & Cheatsheet',
    domain: 'dsa',
    category: 'Bit Manipulation',
    difficulty: 'Medium',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber', 'Apple'],
    importanceRating: 5,
    summary: 'Comprehensive pattern recognition guide (13 key signals -> optimal technique) and curated LeetCode practice problem index.',
    keyConcepts: [
      'Problem Signal to Bit Technique Mapping',
      'Curated LeetCode Practice Problems'
    ],
    detailedContent: `
### 🧠 Pattern Recognition Decision Guide

| Problem Clue / Signal | Optimal Bit Technique |
| :--- | :--- |
| Single number in duplicates | XOR Cancellation (a ^ a = 0) |
| Subset representation | Bitmask Integer (1 << i) |
| Power of two check | n > 0 && (n & (n - 1)) == 0 |
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `bool isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }`
      }
    ]
  },

  // ==========================================
  // MODULE 2: LINKED LIST
  // ==========================================
  {
    id: 'dsa-ll-01-fundamentals',
    title: '1. Linked List Fundamentals, Node Anatomy & Types',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Apple', 'Uber'],
    importanceRating: 5,
    summary: 'Master node structures, memory allocation, Singly vs Doubly vs Circular linked lists, and Array vs Linked List trade-offs.',
    keyConcepts: [
      'Node Anatomy: Data payload + next/prev reference pointers',
      'Singly Linked List: HEAD -> [10|next] -> [20|next] -> null',
      'Doubly Linked List: null <- [prev|10|next] <-> [prev|20|next] -> null',
      'Circular Linked List: Tail node points back to HEAD',
      'Array vs Linked List: O(1) random access vs O(1) insertion/deletion at known nodes'
    ],
    detailedContent: `
### 📌 1. What is a Linked List?

A **Linked List** is a linear data structure consisting of nodes connected via pointers/references.

#### Singly vs Doubly vs Circular Node Structure

\`\`\`cpp
// Singly Linked List Node
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Doubly Linked List Node
struct DLNode {
    int val;
    DLNode* prev;
    DLNode* next;
    DLNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};
\`\`\`

---

### ⚖️ Array vs Linked List Comparison

| Feature | Array | Linked List |
| :--- | :--- | :--- |
| **Memory Allocation** | Contiguous block | Dynamic non-contiguous nodes |
| **Random Access (by Index)** | O(1) | O(N) traversal |
| **Insertion / Deletion (Known Position)** | O(N) element shifting | O(1) pointer updating |
| **Search (Unsorted)** | O(N) | O(N) |
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `// C++: Basic Singly Linked List Node Definition
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* head = new ListNode(10);
head->next = new ListNode(20);
head->next->next = new ListNode(30);`
      },
      {
        language: 'python',
        code: `# Python: Basic Singly Linked List Node Definition
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

head = ListNode(10)
head.next = ListNode(20)
head.next.next = ListNode(30)`
      }
    ],
    interviewQuestions: [
      {
        question: 'When should you prefer a Linked List over a Dynamic Array (std::vector / ArrayList)?',
        answer: 'Use a Linked List when frequent O(1) insertions and deletions are required at head or middle without shifting contiguous elements.'
      }
    ]
  },

  {
    id: 'dsa-ll-02-core-operations',
    title: '2. Core Pointer Operations & Dummy Node Pattern',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Flipkart'],
    importanceRating: 5,
    summary: 'Master node creation, traversal, insertion, deletion, and eliminating head edge-cases using Dummy Head nodes.',
    keyConcepts: [
      'Traversal template: curr = head; while (curr != nullptr) { process(curr); curr = curr.next; }',
      'Insertion Rule: Never break curr.next until the new node points to curr.next',
      'Deletion Rule: Connect prev.next = target.next to bypass and delete target',
      'Dummy Head Node: Eliminates special conditional logic for head modification'
    ],
    detailedContent: `
### 🛠️ Core Linked List Operations

#### 1. Traversal Pattern
\`\`\`cpp
ListNode* curr = head;
while (curr != nullptr) {
    curr = curr->next;
}
\`\`\`

#### 2. The Dummy Head Node Pattern
When operations modify or remove the head node:

\`\`\`cpp
ListNode dummy(0);
dummy.next = head;
ListNode* prev = &dummy;
// ...
return dummy.next;
\`\`\`
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* curr = &dummy;
    
    while (curr->next != nullptr) {
        if (curr->next->val == val) {
            ListNode* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        } else {
            curr = curr->next;
        }
    }
    return dummy.next;
}`
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the golden rule of pointer manipulation during linked list insertions?',
        answer: 'Never overwrite an existing node reference before saving the pointer to the rest of the list.'
      }
    ]
  },

  {
    id: 'dsa-ll-03-pointer-patterns',
    title: '3. Essential Pointer Patterns (Prev/Curr/Next, Fast/Slow, Gap, Pointer Switching)',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Medium',
    companyTags: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Bloomberg'],
    importanceRating: 5,
    summary: 'Master the 4 fundamental pointer strategies: Three-pointer iteration, Fast & Slow pointers, Fixed Gap distance, and Cross-list switching.',
    keyConcepts: [
      'Pattern 1: Previous / Current / Next (Reversal and re-linking)',
      'Pattern 2: Fast & Slow Pointers (Floyd Tortoise & Hare for middle and cycle)',
      'Pattern 3: Two Pointers with Fixed Gap K (Remove Nth node from end)',
      'Pattern 4: Pointer Switching (Cross traversal for list intersection)'
    ],
    detailedContent: `
### 🧭 The 4 Essential Pointer Patterns

#### 1. Previous / Current / Next
Used for in-place list reversal and segment re-linking.

#### 2. Fast & Slow Pointers
slow moves 1 step, fast moves 2 steps.

#### 3. Pointer Switching (Intersection of Two Lists)
Pointer A travels List A then List B. Pointer B travels List B then List A.
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
    if (!headA || !headB) return nullptr;
    ListNode *pA = headA, *pB = headB;
    
    while (pA != pB) {
        pA = (pA == nullptr) ? headB : pA->next;
        pB = (pB == nullptr) ? headA : pB->next;
    }
    return pA;
}`
      }
    ]
  },

  {
    id: 'dsa-ll-04-reversal-patterns',
    title: '4. Reversal Patterns & K-Group Reversals',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Medium',
    companyTags: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Uber', 'Apple'],
    importanceRating: 5,
    summary: 'Reversing entire lists, sub-segments (Reverse Linked List II), and group reversals (Reverse Nodes in K-Group).',
    keyConcepts: [
      'Full Reversal: Iterative 3-pointer in O(N) time & O(1) space',
      'Partial Reversal: Unlinking and inserting nodes at sub-segment start',
      'K-Group Reversal: Check if K nodes exist, reverse sub-group, recursively connect next groups'
    ],
    detailedContent: `
### 🔄 Reversal Variations Breakdown

1. **Full Reverse** (LeetCode 206)
2. **Reverse Portion from left to right** (LeetCode 92)
3. **Reverse Nodes in K-Group** (LeetCode 25 - Hard)
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* curr = head;
    int count = 0;
    while (curr && count < k) {
        curr = curr->next;
        count++;
    }
    if (count < k) return head;
    
    ListNode* prev = nullptr;
    ListNode* node = head;
    for (int i = 0; i < k; ++i) {
        ListNode* nextTemp = node->next;
        node->next = prev;
        prev = node;
        node = nextTemp;
    }
    
    head->next = reverseKGroup(node, k);
    return prev;
}`
      }
    ]
  },

  {
    id: 'dsa-ll-05-fast-slow-cycles',
    title: '5. Fast & Slow Pointer Patterns (Cycle Detection, Entry & Middle)',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Goldman Sachs'],
    importanceRating: 5,
    summary: 'Floyd Tortoise and Hare algorithm for cycle detection, finding cycle entrance, middle element retrieval, and Palindrome checks.',
    keyConcepts: [
      'Finding Middle: slow moves 1 step, fast moves 2 steps',
      'Cycle Detection: If fast == slow, cycle exists',
      'Cycle Entry Point: Reset slow = head. Move both 1 step until meeting at entrance',
      'Palindrome Linked List: Find middle, reverse second half, compare halves'
    ],
    detailedContent: `
### 🐢 Floyd Tortoise & Hare Proof

Resetting one pointer to head and moving both 1 step per iteration guarantees they will meet at the cycle entrance!
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `ListNode *detectCycle(ListNode *head) {
    if (!head || !head->next) return nullptr;
    ListNode *slow = head, *fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode* ptr = head;
            while (ptr != slow) {
                ptr = ptr->next;
                slow = slow->next;
            }
            return ptr;
        }
    }
    return nullptr;
}`
      }
    ]
  },

  {
    id: 'dsa-ll-06-merge-reorder',
    title: '6. Merging, In-Place Reordering & Partitioning',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Medium',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Adobe'],
    importanceRating: 5,
    summary: 'Merge Two Sorted Lists, Merge K Sorted Lists (Min-Heap / Divide & Conquer), Odd-Even partitioning, and List Merge Sort.',
    keyConcepts: [
      'Merge 2 Sorted Lists: Single pass with dummy head attaching smaller node',
      'Merge K Sorted Lists: Use Min-Heap in O(N log K) time',
      'Linked List Merge Sort: O(N log N) time, ideal for linked lists'
    ],
    detailedContent: `
### 🔀 Merging & Sorting Linked Lists

- **Merge K Sorted Lists** (LeetCode 23)
- **List Merge Sort** (LeetCode 148)
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (list1 && list2) {
        if (list1->val <= list2->val) {
            tail->next = list1;
            list1 = list1->next;
        } else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }
    tail->next = list1 ? list1 : list2;
    return dummy.next;
}`
      }
    ]
  },

  {
    id: 'dsa-ll-07-lru-lfu-cache',
    title: '7. Advanced Cache Design (LRU & LFU Cache)',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Hard',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber'],
    importanceRating: 5,
    summary: 'Designing O(1) LRU Cache (HashMap + Doubly Linked List) and O(1) LFU Cache (Frequency Map + Frequency Bucket Doubly Linked Lists).',
    keyConcepts: [
      'LRU Cache: HashMap (key -> Node*) + Doubly Linked List (head = MRU, tail = LRU)',
      'LRU get(key): Move node to head (MRU) in O(1)',
      'LRU put(key, val): If full, remove tail node (LRU) & insert at head in O(1)'
    ],
    detailedContent: `
### 🏎️ LRU Cache Architecture (O(1) Operations)

Combines HashMap for O(1) lookup and Doubly Linked List for recency ordering.
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `class LRUCache {
    struct Node {
        int key, val;
        Node *prev, *next;
        Node(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}
    };
    int capacity;
    unordered_map<int, Node*> cache;
    Node *head, *tail;

    void addNode(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }

    void removeNode(Node* node) {
        Node* p = node->prev;
        Node* n = node->next;
        p->next = n;
        n->prev = p;
    }

public:
    LRUCache(int cap) : capacity(cap) {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head->next = tail;
        tail->prev = head;
    }
};`
      }
    ],
    interviewQuestions: [
      {
        question: 'Why do we need a Doubly Linked List instead of a Singly Linked List for LRU Cache?',
        answer: 'Removing a node from a Singly Linked List requires finding its previous node in O(N) time. A Doubly Linked List stores node.prev, allowing O(1) removal of any node.'
      }
    ]
  },

  {
    id: 'dsa-ll-08-cheatsheet-roadmap',
    title: '8. Linked List Master Rules, Mistakes & LeetCode Roadmap',
    domain: 'dsa',
    category: 'Linked List',
    difficulty: 'Medium',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Uber', 'Netflix'],
    importanceRating: 5,
    summary: 'Master decision framework (5 rules, 6 common pitfalls) and 26 curated LeetCode problem roadmap.',
    keyConcepts: [
      'Rule 1: Never lose reference before re-linking',
      'Rule 2: Draw node pointers & arrows before coding',
      'Rule 3: Use Sentinel Dummy Head nodes',
      '26 Curated LeetCode Problems Index'
    ],
    detailedContent: `
### 🧠 The 5 Master Rules of Linked Lists

1. **Never Lose Your Reference**: Save next = curr.next before modifying curr.next.
2. **Draw the Pointers**: Draw nodes and arrows on paper.
3. **Use Sentinel Dummy Nodes**: Simplifies operations involving head.
4. **Protect Remaining List**: Ensure non-deleted nodes remain reachable.
5. **Verify Null Checks**: Check curr and curr.next before accessing .val.

---

### 📚 Complete LeetCode Problem Roadmap

- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) (LC 206)
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) (LC 876)
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) (LC 21)
- [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) (LC 141)
- [Remove Nth Node From End](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) (LC 19)
- [LRU Cache](https://leetcode.com/problems/lru-cache/) (LC 146)
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) (LC 23)
    `,
    codeTemplates: [
      {
        language: 'cpp',
        code: `ListNode* processList(ListNode* head) {
    ListNode dummy(0);
    dummy.next = head;
    return dummy.next;
}`
      }
    ]
  }
];
