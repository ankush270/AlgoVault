import { TopicItem } from '../types';

export const dsaTopics: TopicItem[] = [
  {
    id: 'dsa-two-pointers-two-sum',
    title: 'Two Pointers & Sliding Window (Two Sum II, 3Sum, Max Water)',
    domain: 'dsa',
    category: 'Arrays & Two Pointers',
    difficulty: 'Medium',
    companyTags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Flipkart'],
    importanceRating: 5,
    summary: 'Master technique for searching pairs/subarrays in sorted arrays or continuous sequences in O(N) time without nested loops.',
    keyConcepts: [
      'Left & Right pointer convergence on sorted data',
      'Expanding/Shrinking sliding window based on invariant condition',
      'Time complexity reduction from O(N²) to O(N)',
      'Handling duplicates using pointer skip logic'
    ],
    detailedContent: `
### Key Pattern & Strategy
When given a **sorted array** or asked for a contiguous subarray matching a condition (e.g. sum equal to target, longest subarray without repeating characters), linear search or nested loops take $O(N^2)$.
By maintaining two pointers (\`left\` at index 0, \`right\` at end or same start):
1. **Sorted Pair Search**: If \`arr[left] + arr[right] > target\`, decrement \`right\`. If smaller, increment \`left\`.
2. **Sliding Window**: Expand \`right\` to add elements. If window becomes invalid, shrink from \`left\` until valid.

### Big-O Complexity
- **Time Complexity**: $O(N)$ because each pointer moves at most $N$ times.
- **Space Complexity**: $O(1)$ auxiliary space.
    `,
    codeTemplates: [
      {
        language: 'python',
        code: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]: left += 1
                while left < right and nums[right] == nums[right-1]: right -= 1
                left += 1; right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return res`
      },
      {
        language: 'cpp',
        code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < (int)nums.size() - 2; ++i) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l+1]) l++;
                while (l < r && nums[r] == nums[r-1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}`
      },
      {
        language: 'java',
        code: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}`
      }
    ],
    interviewQuestions: [
      {
        question: 'Why does sorting the array first enable the Two Pointer technique?',
        answer: 'Sorting establishes a monotonic relationship. If current sum < target, increasing left guarantees a larger sum. If current sum > target, decreasing right guarantees a smaller sum. Without sorting, pointer movements are unpredictable.'
      },
      {
        question: 'How do you handle duplicate triplets in 3Sum?',
        answer: 'Skip identical elements for the anchor loop (i) and increment left / decrement right past identical elements after finding a valid triplet.'
      }
    ]
  },
  {
    id: 'dsa-binary-tree-lca-traversals',
    title: 'Trees & Graphs: Lowest Common Ancestor (LCA) & BFS/DFS',
    domain: 'dsa',
    category: 'Trees & Graphs',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Google', 'Meta', 'Uber', 'Atlassian'],
    importanceRating: 5,
    summary: 'Essential tree recursion pattern to find LCA and graph traversal algorithms (BFS shortest path, DFS topological sort).',
    keyConcepts: [
      'Post-order recursion traversal for Lowest Common Ancestor',
      'Level-order BFS using Queue data structure',
      'Graph cycle detection using Color/Visited state array',
      'Dijkstra Shortest Path with Priority Queue'
    ],
    detailedContent: `
### Lowest Common Ancestor (LCA) Principle
To find LCA of node \`p\` and \`q\` in Binary Tree:
- If root is \`null\`, or root equals \`p\` or \`q\`, return \`root\`.
- Recursively search left subtree and right subtree.
- If both left and right return non-null, current root is the **LCA**.
- If only one side returns non-null, bubble up that non-null node.

### Time & Space Complexity
- **LCA Time**: $O(N)$ visiting each node once.
- **Space**: $O(H)$ recursion call stack (H = tree height).
    `,
    codeTemplates: [
      {
        language: 'python',
        code: `def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root
    return left if left else right`
      },
      {
        language: 'cpp',
        code: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the time complexity of LCA in Binary Search Tree (BST) vs General Binary Tree?',
        answer: 'In BST, we can compare root.val with p.val and q.val to move left or right in O(H) time without searching both subtrees. In a general tree, we must inspect both subtrees taking O(N) time.'
      }
    ]
  },
  {
    id: 'dsa-dynamic-programming-knapsack-lis',
    title: 'Dynamic Programming: 0/1 Knapsack & Longest Increasing Subsequence',
    domain: 'dsa',
    category: 'Dynamic Programming',
    difficulty: 'Hard',
    companyTags: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Flipkart'],
    importanceRating: 5,
    summary: 'Core DP paradigms: 0/1 Knapsack choice model and LIS pattern (O(N^2) DP vs O(N log N) Binary Search Patient Sort).',
    keyConcepts: [
      'Identifying Overlapping Subproblems & Optimal Substructure',
      'Memoization (Top-down) vs Tabulation (Bottom-up)',
      '1D Space Optimization trick for Knapsack',
      'Patience Sorting algorithm for O(N log N) LIS'
    ],
    detailedContent: `
### 0/1 Knapsack Core State Equation
Let \`dp[i][w]\` be the max value using first \`i\` items with weight capacity \`w\`:
$$dp[i][w] = \\max(dp[i-1][w], \\text{value}[i-1] + dp[i-1][w - \\text{weight}[i-1]])$$

Space optimization: Traverse weight from right-to-left in a single 1D array to avoid overcounting the same item.
    `,
    codeTemplates: [
      {
        language: 'python',
        code: `def knapsack(weights, values, W):
    dp = [0] * (W + 1)
    for weight, val in zip(weights, values):
        for w in range(W, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + val)
    return dp[W]`
      }
    ],
    interviewQuestions: [
      {
        question: 'How do you optimize 0/1 Knapsack space complexity from O(N*W) to O(W)?',
        answer: 'By iterating weight capacity backwards from W down to item weight. This ensures dp[w - weight] holds values from the previous item iteration, preventing item reuse.'
      }
    ]
  }
];
