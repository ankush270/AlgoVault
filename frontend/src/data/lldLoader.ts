/**
 * Low Level Design (LLD) Loader
 * 
 * Loads lld.json (contains concatenated JSON objects of LLD problem sets with Modern C++ implementations)
 * and transforms them into TopicItem[] for KnowledgeHub and the System Design domain.
 */

import { TopicItem, CodeTemplate, Difficulty } from '../types';
import lldData from './json/lld.json';

interface RawLLDProblem {
  id: string;
  title: string;
  problemStatement: string;
  extensions?: string[];
  dataStructuresUsed?: string[];
  designPatterns?: string[];
  timeComplexity?: Record<string, string> | string;
  spaceComplexity?: string;
  edgeCasesHandled?: string[];
  cppCode?: string;
  javaCode?: string;
  pythonCode?: string;
  [key: string]: any;
}

interface RawLLDSet {
  phase?: string;
  setName?: string;
  language?: string;
  problems?: RawLLDProblem[];
  [key: string]: any;
}

// Parse concatenated JSON chunks safely
function parseRawLLDJSON(rawText: string): RawLLDSet[] {
  const sets: RawLLDSet[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < rawText.length; i++) {
    const ch = rawText[i];
    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const chunk = rawText.substring(start, i + 1);
        try {
          const parsed = JSON.parse(chunk);
          sets.push(parsed as RawLLDSet);
        } catch {
          console.warn('[LLDLoader] Failed to parse LLD set chunk at position', start);
        }
        start = -1;
      }
    }
  }

  return sets;
}

function buildLLDMarkdown(problem: RawLLDProblem, language: string = 'C++'): string {
  const parts: string[] = [];

  if (problem.problemStatement) {
    parts.push(`### 🎯 Problem Statement\n${problem.problemStatement}`);
  }

  if (problem.extensions && problem.extensions.length > 0) {
    parts.push(`### 🚀 Key Extensions & Real-world Requirements\n${problem.extensions.map(e => `- **${e}**`).join('\n')}`);
  }

  if (problem.designPatterns && problem.designPatterns.length > 0) {
    parts.push(`### 🏛️ Design Patterns Applied\n${problem.designPatterns.map(p => `- ${p}`).join('\n')}`);
  }

  if (problem.dataStructuresUsed && problem.dataStructuresUsed.length > 0) {
    parts.push(`### 📦 Core Data Structures\n${problem.dataStructuresUsed.map(d => `- ${d}`).join('\n')}`);
  }

  // Complexity Analysis
  const complexityLines: string[] = [];
  if (problem.timeComplexity) {
    if (typeof problem.timeComplexity === 'object') {
      complexityLines.push('**Time Complexity:**');
      for (const [op, comp] of Object.entries(problem.timeComplexity)) {
        complexityLines.push(`- \`${op}\`: **${comp}**`);
      }
    } else {
      complexityLines.push(`**Time Complexity:** ${problem.timeComplexity}`);
    }
  }
  if (problem.spaceComplexity) {
    complexityLines.push(`**Space Complexity:** ${problem.spaceComplexity}`);
  }
  if (complexityLines.length > 0) {
    parts.push(`### ⏱️ Complexity Analysis\n${complexityLines.join('\n')}`);
  }

  if (problem.edgeCasesHandled && problem.edgeCasesHandled.length > 0) {
    parts.push(`### 🛡️ Edge Cases Handled\n${problem.edgeCasesHandled.map(ec => `- ${ec}`).join('\n')}`);
  }

  if (problem.cppCode) {
    parts.push(`### 💻 Production Implementation (${language})\n\`\`\`cpp\n${problem.cppCode}\n\`\`\``);
  }

  return parts.join('\n\n');
}

export function transformLLDSetsToTopics(sets: RawLLDSet[]): TopicItem[] {
  const items: TopicItem[] = [];
  const seenIds = new Set<string>();

  for (const set of sets) {
    const rawSetName = set.setName || 'Low Level Design Problems';
    const cleanCategory = `Low Level Design: ${rawSetName.replace(/^Set \d+:\s*/, '')}`;
    const language = set.language || 'C++ (Modern C++17/20)';

    if (!set.problems || !Array.isArray(set.problems)) continue;

    for (const prob of set.problems) {
      if (!prob || !prob.id) continue;
      const topicId = prob.id.startsWith('lld-') ? prob.id : `lld-${prob.id}`;
      if (seenIds.has(topicId)) continue;
      seenIds.add(topicId);

      const difficulty: Difficulty = rawSetName.toLowerCase().includes('warm-up') ? 'Medium' : 'Hard';

      const keyConcepts: string[] = [
        ...(prob.designPatterns || []).slice(0, 3),
        ...(prob.dataStructuresUsed || []).slice(0, 2).map(d => d.split(' ')[0])
      ].filter(Boolean);

      const codeTemplates: CodeTemplate[] = [];
      if (prob.cppCode) {
        codeTemplates.push({
          language: 'cpp',
          code: prob.cppCode
        });
      }

      const detailedContent = buildLLDMarkdown(prob, language);

      items.push({
        id: topicId,
        title: prob.title,
        domain: 'system-design',
        category: cleanCategory,
        difficulty,
        companyTags: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Flipkart', 'Meta'],
        importanceRating: 5,
        summary: prob.problemStatement || '',
        keyConcepts,
        detailedContent,
        codeTemplates
      });
    }
  }

  return items;
}

const parsedSets: RawLLDSet[] = (Array.isArray(lldData) ? lldData : [lldData]) as unknown as RawLLDSet[];
export const lldTopics: TopicItem[] = transformLLDSetsToTopics(parsedSets);

export interface LLDSetMetadata {
  setName: string;
  problemCount: number;
}

export const lldSetsMetadata: LLDSetMetadata[] = parsedSets.map(s => ({
  setName: s.setName || 'LLD Problem Set',
  problemCount: s.problems?.length || 0
}));
