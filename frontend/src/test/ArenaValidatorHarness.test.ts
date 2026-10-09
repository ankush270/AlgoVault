import { describe, it, expect } from 'vitest';
// @ts-ignore
import { buildExecutableTestHarness, ARENA_PROBLEMS } from '../../../backend/services/arenaValidator.js';

describe('Arena Validator C++ and Java Test Harness Generator', () => {
  const twoSumProblem = ARENA_PROBLEMS.find((p: any) => p.id === 'two-sum');
  const validAnagramProblem = ARENA_PROBLEMS.find((p: any) => p.id === 'valid-anagram');
  const mergeIntervalsProblem = ARENA_PROBLEMS.find((p: any) => p.id === 'merge-intervals');

  describe('C++ Test Harness Generation', () => {
    it('generates a valid C++ runner with includes, namespace, and main method for Two Sum', () => {
      const code = twoSumProblem.initialCode.cpp;
      const harness = buildExecutableTestHarness(twoSumProblem, 'cpp', code, '__TEST_EVAL_MARKER__');

      expect(harness).toContain('#include <iostream>');
      expect(harness).toContain('#include <vector>');
      expect(harness).toContain('int main()');
      expect(harness).toContain('Solution sol;');
      expect(harness).toContain('__TEST_EVAL_MARKER__');
      expect(harness).toContain('__areEqualSorted');
      expect(harness).toContain('vector<int> expected = {0, 1};');
      expect(harness).toContain('vector<int> arg_0 = {2, 7, 11, 15};');
      expect(harness).toContain('int arg_1 = 9;');
    });

    it('generates 2D vector harness for Merge Intervals in C++', () => {
      const code = mergeIntervalsProblem.initialCode.cpp;
      const harness = buildExecutableTestHarness(mergeIntervalsProblem, 'cpp', code, '__TEST_EVAL_MARKER__');

      expect(harness).toContain('vector<vector<int>> expected = {{1, 6}, {8, 10}, {15, 18}};');
      expect(harness).toContain('vector<vector<int>> arg_0 = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};');
      expect(harness).toContain('actual = sol.merge(arg_0);');
    });

    it('sanitizes user code trying to hijack main or prematurely exit with exit(0)', () => {
      const maliciousCpp = `
int main() {
    exit(0);
    return 0;
}
`;
      const harness = buildExecutableTestHarness(twoSumProblem, 'cpp', maliciousCpp, '__TEST_EVAL__');

      const mainOccurrences = (harness.match(/\bint\s+main\s*\(/g) || []).length;
      expect(mainOccurrences).toBe(1);
      expect(harness).toContain('int __user_main()');
      expect(harness).toContain('throw std::runtime_error("exit() is forbidden in arena validation")');
    });
  });

  describe('Java Test Harness Generation', () => {
    it('generates a valid Java runner with public class Main, imports, and test runners', () => {
      const code = twoSumProblem.initialCode.java;
      const harness = buildExecutableTestHarness(twoSumProblem, 'java', code, '__TEST_EVAL_MARKER__');

      expect(harness).toContain('import java.util.*;');
      expect(harness).toContain('public class Main {');
      expect(harness).toContain('public static void main(String[] args) {');
      expect(harness).toContain('Solution sol = new Solution();');
      expect(harness).toContain('__TEST_EVAL_MARKER__');
      expect(harness).toContain('int[] expected = new int[]{0, 1};');
      expect(harness).toContain('int[] arg_0 = new int[]{2, 7, 11, 15};');
      expect(harness).toContain('int arg_1 = 9;');
      expect(harness).toContain('actual = sol.twoSum(arg_0, arg_1);');
    });

    it('generates 2D array harness for Merge Intervals in Java', () => {
      const code = mergeIntervalsProblem.initialCode.java;
      const harness = buildExecutableTestHarness(mergeIntervalsProblem, 'java', code, '__TEST_EVAL_MARKER__');

      expect(harness).toContain('int[][] expected = new int[][]{new int[]{1, 6}, new int[]{8, 10}, new int[]{15, 18}};');
      expect(harness).toContain('actual = sol.merge(arg_0);');
      expect(harness).toContain('areEqual(actual, expected)');
    });

    it('sanitizes user code with public class Solution, package declaration, and System.exit', () => {
      const maliciousJava = `
package com.algovault.solution;

public class Solution {
    public static void main(String[] args) {
        System.exit(0);
    }
}
class Main {
}
`;
      const harness = buildExecutableTestHarness(twoSumProblem, 'java', maliciousJava, '__TEST_EVAL__');

      expect(harness).not.toContain('package com.algovault.solution;');
      expect(harness).toContain('// package stripped');
      expect(harness).toContain('class Solution');
      expect(harness).not.toContain('public class Solution');
      expect(harness).toContain('class UserMain');
      expect(harness).toContain('public static void __user_main(String[] args)');
      expect(harness).toContain('throw new RuntimeException("System.exit() is forbidden in arena validation")');
    });
  });

  describe('Multi-Language Evaluation Marker & Error Handling', () => {
    it('supports Python harnesses with Solution class detection and BaseException handling', () => {
      const code = `
class Solution:
    def twoSum(self, nums, target):
        return [0, 1]
`;
      const harness = buildExecutableTestHarness(twoSumProblem, 'python', code, '__CUSTOM_NONCE__');
      expect(harness).toContain('__CUSTOM_NONCE__');
      expect(harness).toContain("getattr(globals()['Solution'](), 'twoSum')(*args)");
      expect(harness).toContain('except BaseException as e:');
    });

    it('supports JavaScript harnesses with Solution class fallback', () => {
      const code = `
class Solution {
    twoSum(nums, target) { return [0, 1]; }
}
`;
      const harness = buildExecutableTestHarness(twoSumProblem, 'javascript', code, '__CUSTOM_NONCE__');
      expect(harness).toContain('__CUSTOM_NONCE__');
      expect(harness).toContain("(new Solution())['twoSum'](...tc.inputArgs)");
    });

    it('throws descriptive error on unsupported programming language', () => {
      expect(() => {
        buildExecutableTestHarness(twoSumProblem, 'rust', 'fn main() {}');
      }).toThrow(/Unsupported arena language: 'rust'/);
    });
  });
});
