import { runCode } from './pistonService.js';

export const ARENA_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nReturn the answer with indices sorted in ascending order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    functionName: 'twoSum',
    initialCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`
    },
    testCases: [
      { inputArgs: [[2, 7, 11, 15], 9], expected: [0, 1], inputDesc: 'nums = [2,7,11,15], target = 9' },
      { inputArgs: [[3, 2, 4], 6], expected: [1, 2], inputDesc: 'nums = [3,2,4], target = 6' },
      { inputArgs: [[3, 3], 6], expected: [0, 1], inputDesc: 'nums = [3,3], target = 6' },
      { inputArgs: [[1, 5, 8, 3], 13], expected: [1, 2], inputDesc: 'nums = [1,5,8,3], target = 13' },
      { inputArgs: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], inputDesc: 'nums = [-1,-2,-3,-4,-5], target = -8' }
    ]
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        expectedOutput: 'true'
      },
      {
        input: 's = "rat", t = "car"',
        expectedOutput: 'false'
      }
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    functionName: 'isAnagram',
    initialCode: {
      python: `def isAnagram(s: str, t: str) -> bool:
    # Write your solution here
    pass`,
      javascript: `function isAnagram(s, t) {
    // Write your solution here
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        return false;
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        return false;
    }
}`
    },
    testCases: [
      { inputArgs: ['anagram', 'nagaram'], expected: true, inputDesc: 's = "anagram", t = "nagaram"' },
      { inputArgs: ['rat', 'car'], expected: false, inputDesc: 's = "rat", t = "car"' },
      { inputArgs: ['a', 'a'], expected: true, inputDesc: 's = "a", t = "a"' },
      { inputArgs: ['ab', 'a'], expected: false, inputDesc: 's = "ab", t = "a"' },
      { inputArgs: ['listen', 'silent'], expected: true, inputDesc: 's = "listen", t = "silent"' }
    ]
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        expectedOutput: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.'
      }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    functionName: 'merge',
    initialCode: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Write your solution here
    pass`,
      javascript: `function merge(intervals) {
    // Write your solution here
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        return {};
    }
};`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        return new int[][]{};
    }
}`
    },
    testCases: [
      { inputArgs: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], inputDesc: 'intervals = [[1,3],[2,6],[8,10],[15,18]]' },
      { inputArgs: [[[1, 4], [4, 5]]], expected: [[1, 5]], inputDesc: 'intervals = [[1,4],[4,5]]' },
      { inputArgs: [[[1, 4], [0, 4]]], expected: [[0, 4]], inputDesc: 'intervals = [[1,4],[0,4]]' },
      { inputArgs: [[[1, 4], [2, 3]]], expected: [[1, 4]], inputDesc: 'intervals = [[1,4],[2,3]]' },
      { inputArgs: [[[6, 8], [1, 9], [2, 4], [4, 7]]], expected: [[1, 9]], inputDesc: 'intervals = [[6,8],[1,9],[2,4],[4,7]]' }
    ]
  },
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        expectedOutput: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        expectedOutput: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    functionName: 'maxProfit',
    initialCode: {
      python: `def maxProfit(prices: list[int]) -> int:
    # Write your solution here
    pass`,
      javascript: `function maxProfit(prices) {
    // Write your solution here
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        return 0;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        return 0;
    }
}`
    },
    testCases: [
      { inputArgs: [[7, 1, 5, 3, 6, 4]], expected: 5, inputDesc: 'prices = [7,1,5,3,6,4]' },
      { inputArgs: [[7, 6, 4, 3, 1]], expected: 0, inputDesc: 'prices = [7,6,4,3,1]' },
      { inputArgs: [[1, 2]], expected: 1, inputDesc: 'prices = [1,2]' },
      { inputArgs: [[2, 4, 1]], expected: 2, inputDesc: 'prices = [2,4,1]' },
      { inputArgs: [[3, 2, 6, 5, 0, 3]], expected: 4, inputDesc: 'prices = [3,2,6,5,0,3]' }
    ]
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        expectedOutput: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    functionName: 'lengthOfLongestSubstring',
    initialCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your solution here
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        return 0;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        return 0;
    }
}`
    },
    testCases: [
      { inputArgs: ['abcabcbb'], expected: 3, inputDesc: 's = "abcabcbb"' },
      { inputArgs: ['bbbbb'], expected: 1, inputDesc: 's = "bbbbb"' },
      { inputArgs: ['pwwkew'], expected: 3, inputDesc: 's = "pwwkew"' },
      { inputArgs: [''], expected: 0, inputDesc: 's = ""' },
      { inputArgs: ['dvdf'], expected: 3, inputDesc: 's = "dvdf"' }
    ]
  }
];

export function getProblemById(id) {
  return ARENA_PROBLEMS.find((p) => p.id === id) || ARENA_PROBLEMS[0];
}

// Specifications for C++ and Java harness generation
const PROBLEM_CPP_SPEC = {
  'two-sum': {
    fn: 'twoSum',
    argTypes: ['vector<int>', 'int'],
    returnType: 'vector<int>',
    formatArg: (arg, idx) => (idx === 0 ? `{${arg.join(', ')}}` : String(arg)),
    formatExpected: (exp) => `{${exp.join(', ')}}`,
    compareFn: '__areEqualSorted'
  },
  'valid-anagram': {
    fn: 'isAnagram',
    argTypes: ['string', 'string'],
    returnType: 'bool',
    formatArg: (arg) => JSON.stringify(arg),
    formatExpected: (exp) => (exp ? 'true' : 'false'),
    compareFn: '__areEqual'
  },
  'merge-intervals': {
    fn: 'merge',
    argTypes: ['vector<vector<int>>'],
    returnType: 'vector<vector<int>>',
    formatArg: (arg) => `{${arg.map((p) => `{${p.join(', ')}}`).join(', ')}}`,
    formatExpected: (exp) => `{${exp.map((p) => `{${p.join(', ')}}`).join(', ')}}`,
    compareFn: '__areEqual'
  },
  'best-time-stock': {
    fn: 'maxProfit',
    argTypes: ['vector<int>'],
    returnType: 'int',
    formatArg: (arg) => `{${arg.join(', ')}}`,
    formatExpected: (exp) => String(exp),
    compareFn: '__areEqual'
  },
  'longest-substring': {
    fn: 'lengthOfLongestSubstring',
    argTypes: ['string'],
    returnType: 'int',
    formatArg: (arg) => JSON.stringify(arg),
    formatExpected: (exp) => String(exp),
    compareFn: '__areEqual'
  }
};

const PROBLEM_JAVA_SPEC = {
  'two-sum': {
    fn: 'twoSum',
    argTypes: ['int[]', 'int'],
    returnType: 'int[]',
    formatArg: (arg, idx) => (idx === 0 ? `new int[]{${arg.join(', ')}}` : String(arg)),
    formatExpected: (exp) => `new int[]{${exp.join(', ')}}`,
    compareFn: 'areEqual'
  },
  'valid-anagram': {
    fn: 'isAnagram',
    argTypes: ['String', 'String'],
    returnType: 'boolean',
    formatArg: (arg) => JSON.stringify(arg),
    formatExpected: (exp) => (exp ? 'true' : 'false'),
    compareFn: 'areEqual'
  },
  'merge-intervals': {
    fn: 'merge',
    argTypes: ['int[][]'],
    returnType: 'int[][]',
    formatArg: (arg) => `new int[][]{${arg.map((p) => `new int[]{${p.join(', ')}}`).join(', ')}}`,
    formatExpected: (exp) => `new int[][]{${exp.map((p) => `new int[]{${p.join(', ')}}`).join(', ')}}`,
    compareFn: 'areEqual'
  },
  'best-time-stock': {
    fn: 'maxProfit',
    argTypes: ['int[]'],
    returnType: 'int',
    formatArg: (arg) => `new int[]{${arg.join(', ')}}`,
    formatExpected: (exp) => String(exp),
    compareFn: 'areEqual'
  },
  'longest-substring': {
    fn: 'lengthOfLongestSubstring',
    argTypes: ['String'],
    returnType: 'int',
    formatArg: (arg) => JSON.stringify(arg),
    formatExpected: (exp) => String(exp),
    compareFn: 'areEqual'
  }
};

function getCppSpec(problem) {
  if (PROBLEM_CPP_SPEC[problem.id]) return PROBLEM_CPP_SPEC[problem.id];
  const firstTc = problem.testCases && problem.testCases[0];
  const inferType = (v) => {
    if (typeof v === 'boolean') return 'bool';
    if (typeof v === 'number') return 'int';
    if (typeof v === 'string') return 'string';
    if (Array.isArray(v)) {
      if (v.length > 0 && Array.isArray(v[0])) return 'vector<vector<int>>';
      return 'vector<int>';
    }
    return 'int';
  };
  const inferFormat = (v) => {
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string') return JSON.stringify(v);
    if (Array.isArray(v)) {
      if (v.length > 0 && Array.isArray(v[0])) {
        return `{${v.map((inner) => `{${inner.join(', ')}}`).join(', ')}}`;
      }
      return `{${v.join(', ')}}`;
    }
    return String(v);
  };
  return {
    fn: problem.functionName,
    argTypes: firstTc ? firstTc.inputArgs.map(inferType) : ['int'],
    returnType: firstTc ? inferType(firstTc.expected) : 'int',
    formatArg: (arg) => inferFormat(arg),
    formatExpected: (exp) => inferFormat(exp),
    compareFn: '__areEqual'
  };
}

function getJavaSpec(problem) {
  if (PROBLEM_JAVA_SPEC[problem.id]) return PROBLEM_JAVA_SPEC[problem.id];
  const firstTc = problem.testCases && problem.testCases[0];
  const inferType = (v) => {
    if (typeof v === 'boolean') return 'boolean';
    if (typeof v === 'number') return 'int';
    if (typeof v === 'string') return 'String';
    if (Array.isArray(v)) {
      if (v.length > 0 && Array.isArray(v[0])) return 'int[][]';
      return 'int[]';
    }
    return 'int';
  };
  const inferFormat = (v) => {
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string') return JSON.stringify(v);
    if (Array.isArray(v)) {
      if (v.length > 0 && Array.isArray(v[0])) {
        return `new int[][]{${v.map((inner) => `new int[]{${inner.join(', ')}}`).join(', ')}}`;
      }
      return `new int[]{${v.join(', ')}}`;
    }
    return String(v);
  };
  return {
    fn: problem.functionName,
    argTypes: firstTc ? firstTc.inputArgs.map(inferType) : ['int'],
    returnType: firstTc ? inferType(firstTc.expected) : 'int',
    formatArg: (arg) => inferFormat(arg),
    formatExpected: (exp) => inferFormat(exp),
    compareFn: 'areEqual'
  };
}

/**
 * Generate executable harness that runs the function against test cases
 * and outputs a structured JSON marker: __ARENA_EVAL__ (or custom session token)
 */
export function buildExecutableTestHarness(problem, language, userCode, evalMarker = '__ARENA_EVAL__') {
  const lang = (language || 'javascript').toLowerCase().trim();
  const testCasesJson = JSON.stringify(problem.testCases);
  const fnName = problem.functionName;

  // Python Harness
  if (lang === 'python' || lang === 'py') {
    return `${userCode}

# === ARENA TEST RUNNER HARNESS ===
import json
import sys

test_cases = json.loads('''${testCasesJson}''')
results = []

for idx, tc in enumerate(test_cases, 1):
    desc = tc.get('inputDesc', f"Test #{idx}")
    expected = tc['expected']
    args = tc['inputArgs']
    try:
        if 'Solution' in globals() and hasattr(globals()['Solution'], '${fnName}'):
            actual = getattr(globals()['Solution'](), '${fnName}')(*args)
        elif '${fnName}' in globals():
            actual = globals()['${fnName}'](*args)
        else:
            raise NameError("Function '${fnName}' not found in user submission.")

        if isinstance(actual, list) and isinstance(expected, list) and sorted(actual) == sorted(expected):
            passed = True
        else:
            passed = (actual == expected)
            
        results.append({
            'testId': idx,
            'desc': desc,
            'passed': bool(passed),
            'expected': expected,
            'actual': actual
        })
    except BaseException as e:
        results.append({
            'testId': idx,
            'desc': desc,
            'passed': False,
            'expected': expected,
            'actual': None,
            'error': str(e) or type(e).__name__
        })

print("${evalMarker}" + json.dumps(results))
`;
  }

  // JavaScript / Node Harness
  if (lang === 'javascript' || lang === 'node' || lang === 'js') {
    return `${userCode}

// === ARENA TEST RUNNER HARNESS ===
const __testCases = ${testCasesJson};
const __results = [];

function __areEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const aSorted = [...a].sort();
    const bSorted = [...b].sort();
    return JSON.stringify(aSorted) === JSON.stringify(bSorted);
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

for (let idx = 0; idx < __testCases.length; idx++) {
  const tc = __testCases[idx];
  const testNum = idx + 1;
  const desc = tc.inputDesc || ("Test #" + testNum);
  const expected = tc.expected;
  try {
    let actual;
    if (typeof ${fnName} === 'function') {
      actual = ${fnName}(...tc.inputArgs);
    } else if (typeof Solution !== 'undefined' && typeof (new Solution())['${fnName}'] === 'function') {
      actual = (new Solution())['${fnName}'](...tc.inputArgs);
    } else {
      throw new Error("Function '${fnName}' is not defined.");
    }

    const passed = __areEqual(actual, expected);
    __results.push({
      testId: testNum,
      desc: desc,
      passed: Boolean(passed),
      expected: expected,
      actual: actual
    });
  } catch (err) {
    __results.push({
      testId: testNum,
      desc: desc,
      passed: false,
      expected: expected,
      actual: null,
      error: err ? err.message : String(err)
    });
  }
}

console.log("${evalMarker}" + JSON.stringify(__results));
`;
  }

  // C++ Harness
  if (lang === 'cpp' || lang === 'c++' || lang === 'cc') {
    const spec = getCppSpec(problem);
    // Sanitize user code to prevent premature exit bypass or conflicting main methods
    const sanitizedUserCode = (userCode || '')
      .replace(/\bint\s+main\s*\(/g, 'int __user_main(')
      .replace(/\bexit\s*\(/g, 'throw std::runtime_error("exit() is forbidden in arena validation"); //(')
      .replace(/\b_Exit\s*\(/g, 'throw std::runtime_error("_Exit() is forbidden in arena validation"); //(')
      .replace(/\bquick_exit\s*\(/g, 'throw std::runtime_error("quick_exit() is forbidden in arena validation"); //(');

    const testCasesCode = problem.testCases.map((tc, idx) => {
      const testNum = idx + 1;
      const desc = tc.inputDesc || `Test #${testNum}`;
      const argDeclarations = tc.inputArgs.map((arg, aIdx) => {
        const type = spec.argTypes[aIdx] || 'auto';
        const val = spec.formatArg(arg, aIdx);
        return `        ${type} arg_${aIdx} = ${val};`;
      }).join('\n');

      const argList = tc.inputArgs.map((_, aIdx) => `arg_${aIdx}`).join(', ');
      const expectedDecl = `        ${spec.returnType} expected = ${spec.formatExpected(tc.expected)};`;

      return `
    // Test Case #${testNum}
    {
        const int testId = ${testNum};
        const string desc = ${JSON.stringify(desc)};
${expectedDecl}
        try {
${argDeclarations}
            ${spec.returnType} actual = sol.${spec.fn}(${argList});
            bool passed = __ArenaRunner::${spec.compareFn}(actual, expected);
            if (!isFirst) cout << ",";
            isFirst = false;
            cout << "{\\"testId\\":" << testId
                 << ",\\"desc\\":\\"" << __ArenaRunner::escapeJson(desc) << "\\""
                 << ",\\"passed\\":" << (passed ? "true" : "false")
                 << ",\\"expected\\":" << __ArenaRunner::toJson(expected)
                 << ",\\"actual\\":" << __ArenaRunner::toJson(actual)
                 << "}";
        } catch (const std::exception& e) {
            if (!isFirst) cout << ",";
            isFirst = false;
            cout << "{\\"testId\\":" << testId
                 << ",\\"desc\\":\\"" << __ArenaRunner::escapeJson(desc) << "\\""
                 << ",\\"passed\\":false"
                 << ",\\"expected\\":" << __ArenaRunner::toJson(expected)
                 << ",\\"actual\\":null"
                 << ",\\"error\\":\\"" << __ArenaRunner::escapeJson(e.what()) << "\\""
                 << "}";
        } catch (...) {
            if (!isFirst) cout << ",";
            isFirst = false;
            cout << "{\\"testId\\":" << testId
                 << ",\\"desc\\":\\"" << __ArenaRunner::escapeJson(desc) << "\\""
                 << ",\\"passed\\":false"
                 << ",\\"expected\\":" << __ArenaRunner::toJson(expected)
                 << ",\\"actual\\":null"
                 << ",\\"error\\":\\"Unknown runtime exception occurred\\""
                 << "}";
        }
    }`;
    }).join('\n');

    return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <sstream>
#include <cmath>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <queue>
#include <stack>
#include <deque>
#include <numeric>
#include <utility>
#include <stdexcept>
#include <cstdlib>

using namespace std;

// === USER SOLUTION CODE ===
${sanitizedUserCode}

// === ARENA HARNESS HELPERS ===
namespace __ArenaRunner {
    inline string escapeJson(const string& s) {
        string res = "";
        for (char c : s) {
            if (c == '"') { res += '\\\\'; res += '"'; }
            else if (c == '\\\\') { res += '\\\\'; res += '\\\\'; }
            else if (c == '\\n') { res += '\\\\'; res += 'n'; }
            else if (c == '\\r') { res += '\\\\'; res += 'r'; }
            else if (c == '\\t') { res += '\\\\'; res += 't'; }
            else { res += c; }
        }
        return res;
    }

    inline string toJson(int val) { return to_string(val); }
    inline string toJson(long long val) { return to_string(val); }
    inline string toJson(bool val) { return val ? "true" : "false"; }
    inline string toJson(const string& val) {
        return "\\\"" + escapeJson(val) + "\\\"";
    }
    template <typename T>
    inline string toJson(const vector<T>& vec) {
        string s = "[";
        for (size_t i = 0; i < vec.size(); ++i) {
            if (i > 0) s += ",";
            s += toJson(vec[i]);
        }
        s += "]";
        return s;
    }

    inline bool __areEqualSorted(vector<int> a, vector<int> b) {
        if (a.size() != b.size()) return false;
        sort(a.begin(), a.end());
        sort(b.begin(), b.end());
        return a == b;
    }

    inline bool __areEqual(const vector<vector<int>>& a, const vector<vector<int>>& b) {
        return a == b;
    }

    inline bool __areEqual(const vector<int>& a, const vector<int>& b) {
        return a == b;
    }

    inline bool __areEqual(bool a, bool b) { return a == b; }
    inline bool __areEqual(int a, int b) { return a == b; }
    inline bool __areEqual(const string& a, const string& b) { return a == b; }
}

int main() {
    Solution sol;
    cout << "${evalMarker}[";
    bool isFirst = true;
${testCasesCode}
    cout << "]" << endl;
    return 0;
}
`;
  }

  // Java Harness
  if (lang === 'java') {
    const spec = getJavaSpec(problem);
    // Sanitize user code to prevent class collisions and entry point hijacking
    const sanitizedUserCode = (userCode || '')
      .replace(/^\s*package\s+[^;]+;/gm, '// package stripped')
      .replace(/\bpublic\s+class\s+Solution\b/g, 'class Solution')
      .replace(/\bclass\s+Main\b/g, 'class UserMain')
      .replace(/\bpublic\s+static\s+void\s+main\s*\(/g, 'public static void __user_main(')
      .replace(/\bSystem\s*\.\s*exit\s*\(/g, 'throw new RuntimeException("System.exit() is forbidden in arena validation"); //(');

    const testCasesCode = problem.testCases.map((tc, idx) => {
      const testNum = idx + 1;
      const desc = tc.inputDesc || `Test #${testNum}`;
      const argDeclarations = tc.inputArgs.map((arg, aIdx) => {
        const type = spec.argTypes[aIdx] || 'Object';
        const val = spec.formatArg(arg, aIdx);
        return `            ${type} arg_${aIdx} = ${val};`;
      }).join('\n');

      const argList = tc.inputArgs.map((_, aIdx) => `arg_${aIdx}`).join(', ');
      const expectedDecl = `            ${spec.returnType} expected = ${spec.formatExpected(tc.expected)};`;

      return `
        // Test Case #${testNum}
        {
            final int testId = ${testNum};
            final String desc = ${JSON.stringify(desc)};
${expectedDecl}
            try {
${argDeclarations}
                ${spec.returnType} actual = sol.${spec.fn}(${argList});
                boolean passed = ${spec.compareFn}(actual, expected);
                if (!isFirst) System.out.print(",");
                isFirst = false;
                System.out.print("{\\"testId\\":" + testId
                    + ",\\"desc\\":\\"" + escapeJson(desc) + "\\""
                    + ",\\"passed\\":" + passed
                    + ",\\"expected\\":" + toJson(expected)
                    + ",\\"actual\\":" + toJson(actual)
                    + "}");
            } catch (Throwable t) {
                if (!isFirst) System.out.print(",");
                isFirst = false;
                String errMsg = t.getMessage() != null ? t.getMessage() : t.toString();
                System.out.print("{\\"testId\\":" + testId
                    + ",\\"desc\\":\\"" + escapeJson(desc) + "\\""
                    + ",\\"passed\\":false"
                    + ",\\"expected\\":" + toJson(expected)
                    + ",\\"actual\\":null"
                    + ",\\"error\\":\\"" + escapeJson(errMsg) + "\\""
                    + "}");
            }
        }`;
    }).join('\n');

    return `import java.util.*;
import java.io.*;
import java.math.*;

// === USER SOLUTION CODE ===
${sanitizedUserCode}

// === ARENA HARNESS RUNNER ===
public class Main {
    static String escapeJson(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '"') { sb.append('\\\\').append('"'); }
            else if (c == '\\\\') { sb.append('\\\\').append('\\\\'); }
            else if (c == '\\n') { sb.append('\\\\').append('n'); }
            else if (c == '\\r') { sb.append('\\\\').append('r'); }
            else if (c == '\\t') { sb.append('\\\\').append('t'); }
            else { sb.append(c); }
        }
        return sb.toString();
    }

    static String toJson(int val) { return String.valueOf(val); }
    static String toJson(long val) { return String.valueOf(val); }
    static String toJson(boolean val) { return val ? "true" : "false"; }
    static String toJson(String val) {
        if (val == null) return "null";
        return "\\\"" + escapeJson(val) + "\\\"";
    }
    static String toJson(int[] arr) {
        if (arr == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(arr[i]);
        }
        sb.append("]");
        return sb.toString();
    }
    static String toJson(int[][] matrix) {
        if (matrix == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(toJson(matrix[i]));
        }
        sb.append("]");
        return sb.toString();
    }

    static boolean areEqual(int[] a, int[] b) {
        if (a == null || b == null) return a == b;
        if (a.length != b.length) return false;
        int[] aSorted = a.clone();
        int[] bSorted = b.clone();
        Arrays.sort(aSorted);
        Arrays.sort(bSorted);
        return Arrays.equals(aSorted, bSorted);
    }
    static boolean areEqual(int[][] a, int[][] b) {
        return Arrays.deepEquals(a, b);
    }
    static boolean areEqual(boolean a, boolean b) { return a == b; }
    static boolean areEqual(int a, int b) { return a == b; }
    static boolean areEqual(String a, String b) { return Objects.equals(a, b); }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.print("${evalMarker}[");
        boolean isFirst = true;
${testCasesCode}
        System.out.println("]");
    }
}
`;
  }

  // Fallback for unsupported languages
  throw new Error(`Unsupported arena language: '${language}'. Supported languages: python, javascript, cpp, java.`);
}

/**
 * Validates arena submission or runs tests against test cases
 */
export async function validateArenaCode({ problemId, language, code }) {
  const problem = getProblemById(problemId);
  const evalMarker = `__ARENA_EVAL_${Date.now()}_${Math.random().toString(36).slice(2, 10)}__`;

  let wrappedCode;
  try {
    wrappedCode = buildExecutableTestHarness(problem, language, code, evalMarker);
  } catch (err) {
    return {
      status: 'ERROR',
      testsPassed: 0,
      totalTests: problem.testCases.length,
      allPassed: false,
      testResults: [],
      output: '',
      stderr: err.message,
      executionTime: 0
    };
  }

  const rawResult = await runCode({ language, code: wrappedCode });

  const rawOutput = (rawResult.output || '') + '\n' + (rawResult.stderr || '');
  let markerIndex = rawOutput.lastIndexOf(evalMarker);
  let activeMarker = evalMarker;

  if (markerIndex === -1) {
    // Fallback check for standard marker
    markerIndex = rawOutput.lastIndexOf('__ARENA_EVAL__');
    activeMarker = '__ARENA_EVAL__';
  }

  if (markerIndex !== -1) {
    try {
      const jsonStr = rawOutput.slice(markerIndex + activeMarker.length).trim().split('\n')[0];
      const parsedResults = JSON.parse(jsonStr);

      const passedCount = parsedResults.filter((r) => r.passed).length;
      const totalCount = parsedResults.length;
      const allPassed = passedCount === totalCount && totalCount > 0;

      // Construct readable console output
      let formattedLog = `=== 🧪 ARENA TEST SUITE (${passedCount}/${totalCount} Passed) ===\n\n`;
      parsedResults.forEach((t) => {
        if (t.passed) {
          formattedLog += `✅ Test #${t.testId} PASSED\n   Input: ${t.desc}\n   Output: ${JSON.stringify(t.actual)}\n\n`;
        } else {
          formattedLog += `❌ Test #${t.testId} FAILED\n   Input: ${t.desc}\n   Expected: ${JSON.stringify(t.expected)}\n   Actual: ${JSON.stringify(t.actual)}${t.error ? `\n   Error: ${t.error}` : ''}\n\n`;
        }
      });

      return {
        status: allPassed ? 'SUCCESS' : (passedCount > 0 ? 'PARTIAL' : 'FAILED'),
        testsPassed: passedCount,
        totalTests: totalCount,
        allPassed,
        testResults: parsedResults,
        output: formattedLog,
        stderr: rawResult.stderr || '',
        executionTime: rawResult.executionTime
      };
    } catch (parseErr) {
      console.error('Failed to parse arena evaluation marker output:', parseErr.message);
    }
  }

  // If no marker found (syntax error, compile error, or crash)
  return {
    status: rawResult.status,
    testsPassed: 0,
    totalTests: problem.testCases.length,
    allPassed: false,
    testResults: [],
    output: rawResult.output || '',
    stderr: rawResult.stderr || 'Runtime or evaluation error occurred.',
    executionTime: rawResult.executionTime
  };
}

