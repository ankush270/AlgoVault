export interface AlgorithmItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  explanation: string[];
  wAnswers: {
    whatItSolves: string;
    whenToUse: string;
    whereUsed: string;
    whyOptimal: string;
  };
  codeTemplates: {
    language: 'python' | 'cpp' | 'java' | 'javascript';
    code: string;
  }[];
  practiceProblems: {
    title: string;
    url: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
}

export const ALGORITHM_CATEGORIES = [
  { id: 'all', label: 'All Algorithms', icon: '🌐' },
  { id: 'arrays', label: 'Arrays & Math', icon: '🧊' },
  { id: 'strings', label: 'Strings & Matching', icon: '🔤' },
  { id: 'binary-search', label: 'Binary Search', icon: '🎯' },
  { id: 'sliding-window', label: 'Sliding Window & Pointers', icon: '↔️' },
  { id: 'linked-list', label: 'Linked Lists', icon: '🔗' },
  { id: 'stack-queue', label: 'Stack & Queue', icon: '🥞' },
  { id: 'trees', label: 'Trees & BST', icon: '🌲' },
  { id: 'graphs', label: 'Graphs & Networks', icon: '🌐' },
  { id: 'dp', label: 'Dynamic Programming', icon: '⚡' },
  { id: 'greedy', label: 'Greedy Algorithms', icon: '🎯' },
  { id: 'backtracking', label: 'Backtracking', icon: '🔄' },
  { id: 'bitmask', label: 'Bit Manipulation', icon: '🔢' },
  { id: 'trie', label: 'Trie & Advanced DS', icon: '🌳' },
];

export const ALGORITHMS_DATA: AlgorithmItem[] = [
  // ==================== ARRAYS ====================
  {
    id: 'kadanes-algorithm',
    title: "Kadane's Algorithm (Maximum Subarray Sum)",
    category: 'Arrays & Math',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    summary: 'Finds the contiguous subarray with the maximum sum in a 1D array in linear O(N) time.',
    explanation: [
      'Maintain two variables: `currMax` (sum of current subarray) and `maxSoFar` (global maximum sum).',
      'Iterate through the array. For each element `x`, add it to `currMax`.',
      'If `currMax` becomes negative, reset `currMax = 0` (starting a fresh subarray from next element).',
      'Update `maxSoFar = max(maxSoFar, currMax)` at each step.',
      'To handle all negative arrays, initialize `maxSoFar` with the first element or negative infinity instead of 0.'
    ],
    wAnswers: {
      whatItSolves: 'Finds the contiguous sequence of numbers in an array that has the largest combined sum.',
      whenToUse: 'When asked for maximum continuous subarray sum or maximum profit window in single-pass array problems.',
      whereUsed: 'Financial stock portfolio maximum gain calculation, image processing signal peak detection, genomic sequence alignment scoring.',
      whyOptimal: 'Reduces brute-force O(N³) or O(N²) nested loops to single linear scan O(N) with O(1) extra space.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def max_subarray_sum(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    
    for i in range(1, len(nums)):
        curr_max = max(nums[i], curr_max + nums[i])
        max_so_far = max(max_so_far, curr_max)
        
    return max_so_far`
      },
      {
        language: 'cpp',
        code: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int currMax = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        currMax = max(nums[i], currMax + nums[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    return maxSoFar;
}`
      },
      {
        language: 'java',
        code: `public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currMax = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currMax = Math.max(nums[i], currMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currMax);
    }
    return maxSoFar;
}`
      },
      {
        language: 'javascript',
        code: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 53 - Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', difficulty: 'Medium' },
      { title: 'Striver A2Z - Kadane Algorithm', url: 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/', difficulty: 'Medium' }
    ]
  },
  {
    id: 'dutch-national-flag',
    title: 'Dutch National Flag Algorithm (Sort 0s, 1s, 2s)',
    category: 'Arrays & Math',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    summary: 'Sorts an array containing only three distinct elements (e.g. 0s, 1s, 2s) in a single pass with O(1) space.',
    explanation: [
      'Maintain three pointers: `low` (boundary for 0s), `mid` (current element scanner), `high` (boundary for 2s).',
      'Initially `low = 0`, `mid = 0`, `high = n - 1`.',
      'Loop while `mid <= high`:',
      '  - If `arr[mid] == 0`: swap `arr[low]` & `arr[mid]`, then `low++`, `mid++`.',
      '  - If `arr[mid] == 1`: just `mid++`.',
      '  - If `arr[mid] == 2`: swap `arr[mid]` & `arr[high]`, then `high--` (do NOT increment mid yet).'
    ],
    wAnswers: {
      whatItSolves: 'Sorts a 3-valued array in-place without using extra counting arrays or multi-pass sorting algorithms.',
      whenToUse: 'When an array contains 3 unique key values (e.g. 0/1/2, Red/White/Blue, Low/Medium/High risk tags).',
      whereUsed: 'Partitioning elements in QuickSort pivot steps, multi-class classification bucket sorting in memory managers.',
      whyOptimal: 'Guarantees exact O(N) time with only 3 pointers and zero memory allocation.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`
      },
      {
        language: 'cpp',
        code: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 75 - Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'Medium' }
    ]
  },

  // ==================== STRINGS ====================
  {
    id: 'kmp-algorithm',
    title: 'KMP Algorithm (Knuth-Morris-Pratt Pattern Matching)',
    category: 'Strings & Matching',
    difficulty: 'Hard',
    timeComplexity: 'O(N + M)',
    spaceComplexity: 'O(M)',
    summary: 'Efficiently finds pattern matches in a text string without re-checking matching characters using the Longest Proper Prefix which is also Suffix (LPS) table.',
    explanation: [
      'Precompute the `LPS` (Longest Prefix Suffix) array for the pattern of length M.',
      '`LPS[i]` stores the length of the longest matching proper prefix of `pattern[0...i]` that is also a suffix of `pattern[0...i]`.',
      'Scan the text of length N with index `i` and pattern with index `j`.',
      'When characters match (`text[i] == pattern[j]`), advance both `i++` and `j++`.',
      'When a mismatch occurs, use `LPS[j-1]` to skip redundant pattern comparisons instead of resetting `i` back.'
    ],
    wAnswers: {
      whatItSolves: 'Finds exact occurrences of a pattern P of length M inside text T of length N in linear time.',
      whenToUse: 'When searching for substrings in huge text corpora, DNA sequence matching, or avoiding worst-case O(N * M) naive string matching.',
      whereUsed: 'Text editor search utilities (`grep`, Ctrl+F), genomic sequence search tools (BLAST), network packet filtering.',
      whyOptimal: 'Eliminates backtracking in the primary text stream. Time complexity remains linear O(N + M) regardless of text repetitions.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length != 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    lps = build_lps(pattern)
    i = j = 0
    matches = []
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return matches`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 28 - Find the Index of the First Occurrence in a String', url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', difficulty: 'Easy' }
    ]
  },

  // ==================== BINARY SEARCH ====================
  {
    id: 'binary-search-foundations',
    title: 'Binary Search & Lower/Upper Bound Patterns',
    category: 'Binary Search',
    difficulty: 'Easy',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    summary: 'Divide-and-conquer technique to locate elements or decision thresholds in sorted arrays or monotonic search spaces.',
    explanation: [
      'Maintain search space range `[low, high]`.',
      'Compute `mid = low + (high - low) // 2` to prevent integer overflow.',
      'Check condition at `mid`:',
      '  - If `arr[mid] == target`, return `mid`.',
      '  - If `arr[mid] < target`, shrink search space to right `low = mid + 1`.',
      '  - If `arr[mid] > target`, shrink search space to left `high = mid - 1`.',
      'For Binary Search on Answer Space: Replace array with boolean function `check(mid)` that is monotonic (TTT...FFF or FFF...TTT).'
    ],
    wAnswers: {
      whatItSolves: 'Finds an item or optimal threshold value in logarithmic O(log N) operations.',
      whenToUse: 'Whenever data is sorted, or whenever problem asks for min/max threshold matching a condition.',
      whereUsed: 'Database B-Tree indexing, Git bisect (finding bug commit), memory allocation address lookup, binary search trees.',
      whyOptimal: 'Reduces search space by half in each iteration: O(log₂ N). 1 Billion elements searched in just 30 comparisons!'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 704 - Binary Search', url: 'https://leetcode.com/problems/binary-search/', difficulty: 'Easy' },
      { title: 'LeetCode 33 - Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', difficulty: 'Medium' }
    ]
  },

  // ==================== SLIDING WINDOW ====================
  {
    id: 'sliding-window-technique',
    title: 'Sliding Window Technique (Fixed & Variable Length)',
    category: 'Sliding Window & Pointers',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K) / O(1)',
    summary: 'Maintains a active window range over continuous sequence data to compute max/min/sum metrics in linear time.',
    explanation: [
      'Fixed Window: Keep window size `K`. Move `right` pointer forward; when window size exceeds `K`, drop element at `left` and `left++`.',
      'Variable Window: Expand `right` to include elements.',
      'Check invariant condition (e.g. at most K distinct chars or sum >= target).',
      'While condition is violated, shrink window from left (`left++`) until valid again.',
      'Record best metric (max length, min window) during iteration.'
    ],
    wAnswers: {
      whatItSolves: 'Computes metrics over continuous subarrays or substrings in single O(N) pass.',
      whenToUse: 'When problem mentions contiguous subarray/substring with conditions like "at most K distinct", "longest valid", "minimum sum".',
      whereUsed: 'Network bandwidth throughput measurement, audio stream signal processing, rate limiters (sliding window log).',
      whyOptimal: 'Reuses previous calculation by adding new incoming element & removing outgoing element instead of recalculating from scratch.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def length_of_longest_substring(s):
    seen = {}
    left = max_len = 0
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 3 - Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'Medium' }
    ]
  },

  // ==================== LINKED LIST ====================
  {
    id: 'floyds-cycle-detection',
    title: "Floyd's Cycle Detection (Tortoise and Hare Algorithm)",
    category: 'Linked Lists',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    summary: 'Detects cycles in a linked list or sequence using two pointers moving at different speeds (slow = 1 step, fast = 2 steps).',
    explanation: [
      'Initialize `slow` and `fast` pointers at head.',
      'Move `slow` by 1 step (`slow = slow.next`) and `fast` by 2 steps (`fast = fast.next.next`).',
      'If there is a cycle, `slow` and `fast` will eventually meet at the same node.',
      'If `fast` reaches `null`, the list has no cycle.',
      'To find cycle entry point: Reset `slow = head`. Move both `slow` and `fast` by 1 step. Their intersection point is the cycle start node.'
    ],
    wAnswers: {
      whatItSolves: 'Detects presence of cycles and entry point in linked lists or pseudo-random generator sequences.',
      whenToUse: 'When asked if a linked list contains a loop or duplicate number in immutable array range [1, N].',
      whereUsed: 'Memory leak detection in circular references, deadlock detection in OS resource graphs, Pollard rho factorization.',
      whyOptimal: 'Uses zero auxiliary memory O(1) space compared to Hash Set lookup which takes O(N) space.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 141 - Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', difficulty: 'Easy' },
      { title: 'LeetCode 142 - Linked List Cycle II', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', difficulty: 'Medium' }
    ]
  },

  // ==================== STACK & QUEUE ====================
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack Pattern (Next Greater / Smaller Element)',
    category: 'Stack & Queue',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    summary: 'Maintains a stack with elements in strictly increasing or decreasing order to answer range boundary queries in O(1) amortized time.',
    explanation: [
      'Use a Monotonic Decreasing Stack for "Next Greater Element".',
      'Iterate through array. For each element `x`:',
      'While stack is non-empty and `stack.top() < x`:',
      '  - Pop element from stack. Current element `x` is its Next Greater Element!',
      'Push `x` onto stack.',
      'Each element is pushed and popped at most once, yielding linear O(N) total runtime.'
    ],
    wAnswers: {
      whatItSolves: 'Finds nearest greater or smaller element for every position in an array in O(N) time.',
      whenToUse: 'When asked for Next Greater Element, Daily Temperatures, Stock Span, or Largest Histogram Area.',
      whereUsed: 'Expression parsing (Shunting-Yard algorithm), histogram rendering engines, stock market breakout triggers.',
      whyOptimal: 'Replaces brute force O(N²) nested loops with single stack pass where total push/pop operations equal 2N.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def next_greater_element(nums):
    res = [-1] * len(nums)
    stack = []  # stores indices
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            idx = stack.pop()
            res[idx] = num
        stack.append(i)
    return res`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 739 - Daily Temperatures', url: 'https://leetcode.com/problems/daily-temperatures/', difficulty: 'Medium' },
      { title: 'LeetCode 84 - Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', difficulty: 'Hard' }
    ]
  },

  // ==================== TREES ====================
  {
    id: 'tree-traversals-lca',
    title: 'Binary Tree Traversals & Lowest Common Ancestor (LCA)',
    category: 'Trees & BST',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    summary: 'Fundamental tree patterns for recursive depth traversal (DFS) and level-by-level breadth traversal (BFS).',
    explanation: [
      'Preorder (Root, Left, Right): Best for tree serialization & cloning.',
      'Inorder (Left, Root, Right): Gives sorted order in Binary Search Trees (BST).',
      'Postorder (Left, Right, Root): Best for bottom-up computation (e.g. tree height, LCA, subtree deletion).',
      'Level Order BFS: Uses Queue to process nodes level by level.',
      'LCA Recursion: If current node is null or equals `p` or `q`, return node. If left & right recursive calls return non-null, current node is LCA.'
    ],
    wAnswers: {
      whatItSolves: 'Navigates hierarchical node relationships, computes subtree statistics, and finds shared ancestor nodes.',
      whenToUse: 'Any problem involving hierarchical data, AST parsing, or ancestor relationships in trees.',
      whereUsed: 'DOM tree manipulation in browsers, file system directory indexing, JSON AST compilation.',
      whyOptimal: 'Visits each tree node exactly once in O(N) time with minimal stack depth O(H).'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 236 - Lowest Common Ancestor of a Binary Tree', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', difficulty: 'Medium' }
    ]
  },

  // ==================== GRAPHS ====================
  {
    id: 'dijkstra-algorithm',
    title: "Dijkstra's Algorithm (Shortest Path in Weighted Graph)",
    category: 'Graphs & Networks',
    difficulty: 'Medium',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V + E)',
    summary: 'Finds the shortest distance from a single source node to all other nodes in a non-negatively weighted graph using a Min-Heap.',
    explanation: [
      'Maintain a `dist` array initialized to infinity, with `dist[source] = 0`.',
      'Use a Min-Heap (Priority Queue) to store `(current_distance, node)`.',
      'Pop the node with smallest distance `u` from heap.',
      'For each neighbor `v` of `u` with edge weight `w`:',
      '  - If `dist[u] + w < dist[v]`, update `dist[v] = dist[u] + w` and push `(dist[v], v)` into heap.',
      'Repeat until min-heap is empty.'
    ],
    wAnswers: {
      whatItSolves: 'Calculates minimum cost or distance path from source node to all other nodes in non-negative weighted graphs.',
      whenToUse: 'When given a weighted graph (no negative weights) and asked for shortest path or min cost traversal.',
      whereUsed: 'Google Maps GPS navigation routing, OSPF internet routing protocol, game pathfinding (A* basis).',
      whyOptimal: 'Min-Heap prioritization guarantees we process nodes in increasing distance order, ensuring O((V + E) log V) efficiency.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `import heapq

def dijkstra(graph, source, num_nodes):
    dist = [float('inf')] * num_nodes
    dist[source] = 0
    pq = [(0, source)]  # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
                
    return dist`
      },
      {
        language: 'cpp',
        code: `vector<int> dijkstra(int n, vector<vector<pair<int, int>>>& adj, int src) {
    vector<int> dist(n, 1e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : adj[u]) {
            int v = edge.first, w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 743 - Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', difficulty: 'Medium' }
    ]
  },
  {
    id: 'topological-sort-kahns',
    title: "Topological Sort & Kahn's Algorithm (DAG Scheduling)",
    category: 'Graphs & Networks',
    difficulty: 'Medium',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    summary: 'Linearly orders vertices in a Directed Acyclic Graph (DAG) such that for every edge u -> v, node u comes before v.',
    explanation: [
      'Compute `in-degree` (number of incoming edges) for every vertex.',
      'Push all vertices with `in-degree == 0` into a Queue.',
      'While Queue is not empty:',
      '  - Pop node `u`, add it to topological result list.',
      '  - For each neighbor `v` of `u`, decrement `in-degree[v]--`.',
      '  - If `in-degree[v] == 0`, push `v` into Queue.',
      'If result list length equals V, DAG is valid. Otherwise, a cycle exists!'
    ],
    wAnswers: {
      whatItSolves: 'Determines a valid task execution order when tasks have prerequisites or dependencies.',
      whenToUse: 'When given prerequisites (Course Schedule), build tool dependencies (npm/cmake), or cycle detection in directed graph.',
      whereUsed: 'Build systems (Webpack/Bazel dependency resolution), course prerequisite planning, Airflow DAG task scheduler.',
      whyOptimal: 'Linear O(V + E) processing time using in-degree BFS queue.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `from collections import deque

def findOrder(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
        
    queue = deque([i for i in range(numCourses) if indegree[i] == 0])
    topo_order = []
    
    while queue:
        u = queue.popleft()
        topo_order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
                
    return topo_order if len(topo_order) == numCourses else []`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 210 - Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/', difficulty: 'Medium' }
    ]
  },
  {
    id: 'disjoint-set-union',
    title: 'Disjoint Set Union (DSU / Union-Find with Rank & Path Compression)',
    category: 'Graphs & Networks',
    difficulty: 'Medium',
    timeComplexity: 'O(α(N)) ≈ O(1)',
    spaceComplexity: 'O(N)',
    summary: 'Tracks partitioned sets and connects elements in near-constant O(α(N)) time using Path Compression and Union by Rank.',
    explanation: [
      'Maintain `parent` array where `parent[i] = i` initially, and `rank` array initialized to 0.',
      '`find(i)`: Recursively find root of `i`. Apply **Path Compression** (`parent[i] = find(parent[i])`) to flatten tree.',
      '`union(i, j)`: Find roots `rootI` and `rootJ`. If different, attach smaller rank tree under larger rank tree.',
      'Inverse Ackermann function α(N) is effectively <= 4 for all realistic values of N, making ops practically O(1)!'
    ],
    wAnswers: {
      whatItSolves: 'Dynamically manages connected components, tests component connectivity, and detects cycles in undirected graphs.',
      whenToUse: 'When given dynamic connection queries ("are A and B connected?"), Kruskal\'s MST algorithm, or island connectivity.',
      whereUsed: 'Kruskal\'s Minimum Spanning Tree algorithm, social network friend circles, image segmentation component labeling.',
      whyOptimal: 'Achieves near-constant O(α(N)) time per operation with path compression.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1
            return True
        return False`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 547 - Number of Provinces', url: 'https://leetcode.com/problems/number-of-provinces/', difficulty: 'Medium' }
    ]
  },

  // ==================== DYNAMIC PROGRAMMING ====================
  {
    id: '01-knapsack-dp',
    title: '0/1 Knapsack & Subset Sum Dynamic Programming',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    timeComplexity: 'O(N * W)',
    spaceComplexity: 'O(W)',
    summary: 'Core DP pattern for selecting item combinations under weight capacity constraints to maximize total value.',
    explanation: [
      'Let `dp[w]` store the maximum value obtainable with capacity `w`.',
      'For each item with weight `wt` and value `val`:',
      '  - Loop capacity `w` backwards from `W` down to `wt`:',
      '  - `dp[w] = max(dp[w], val + dp[w - wt])`.',
      'Iterating backwards prevents reusing the same item multiple times in 0/1 choice.'
    ],
    wAnswers: {
      whatItSolves: 'Finds optimal subset of items given resource limits (weight/cost/budget).',
      whenToUse: 'When choosing items with binary pick/don\'t pick choices (e.g. Partition Equal Subset Sum, Target Sum).',
      whereUsed: 'Resource allocation in cloud servers, cargo load optimization, portfolio investment allocation.',
      whyOptimal: 'Eliminates 2ⁿ exponential brute-force recursion via table lookup in O(N * W) pseudo-polynomial time.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def knapsack_01(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[W]`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 416 - Partition Equal Subset Sum', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', difficulty: 'Medium' }
    ]
  },
  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence (LCS)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N)',
    summary: 'Finds the length of the longest subsequence present in both strings in same relative order.',
    explanation: [
      'Create 2D DP table `dp[i][j]` representing LCS of `text1[0...i-1]` and `text2[0...j-1]`.',
      'If `text1[i-1] == text2[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`.',
      'Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.',
      'Base cases: `dp[0][j] = 0` and `dp[i][0] = 0`.'
    ],
    wAnswers: {
      whatItSolves: 'Measures structural similarity between two strings or sequences.',
      whenToUse: 'When comparing two strings for matching characters, diff tool comparisons, or Edit Distance problems.',
      whereUsed: 'Git diff utility, bio-informatics DNA sequence comparison, plagiarism detection tools.',
      whyOptimal: 'Transforms O(2ⁿ) subset combinations into M x N subproblem grid solved in O(M * N) time.'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 1143 - Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/', difficulty: 'Medium' }
    ]
  },

  // ==================== TRIE ====================
  {
    id: 'trie-prefix-tree',
    title: 'Trie (Prefix Tree Data Structure)',
    category: 'Trie & Advanced DS',
    difficulty: 'Medium',
    timeComplexity: 'O(L) per search/insert',
    spaceComplexity: 'O(N * L * AlphabetSize)',
    summary: 'Tree structure used for fast string prefix searching, autocomplete, and dictionary lookups.',
    explanation: [
      'Each node contains a map/array of child nodes corresponding to characters (a-z) and a boolean `isEndOfWord`.',
      'Insert word: Walk down matching character nodes. Create new child nodes if absent. Mark last node `isEndOfWord = True`.',
      'Search word: Walk down matching nodes. Return `True` only if last node has `isEndOfWord == True`.',
      'StartsWith prefix: Walk down matching nodes. If all characters found, return `True`.'
    ],
    wAnswers: {
      whatItSolves: 'Provides fast O(L) string prefix matching independent of total dataset dictionary size N.',
      whenToUse: 'When implementing search auto-complete, spell checker, or finding longest common prefix across words.',
      whereUsed: 'Google search autocomplete, mobile keyboard predictive text, IP routing longest prefix match.',
      whyOptimal: 'Search time depends only on word length L, NOT on total dictionary size N!'
    },
    codeTemplates: [
      {
        language: 'python',
        code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`
      }
    ],
    practiceProblems: [
      { title: 'LeetCode 208 - Implement Trie (Prefix Tree)', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', difficulty: 'Medium' }
    ]
  }
];
