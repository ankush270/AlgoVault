/**
 * System Design Concepts Loader
 * 
 * Reads the raw system-design.json (which contains multiple concatenated JSON objects,
 * each representing a module with topics) and transforms them into TopicItem[] format
 * compatible with the KnowledgeHub/TopicDetailModal system.
 * 
 * The raw JSON uses a custom schema with fields like: phase, module, topics[]
 * Each topic has: id, title, summary, and various deeply-nested concept-specific fields.
 * 
 * This loader flattens the rich nested content into the `detailedContent` markdown string
 * that the TopicDetailModal renders.
 */

import { TopicItem } from '../types';

// ---------- Raw JSON types ----------
interface RawTopic {
  id: string;
  title: string;
  summary: string;
  simpleDefinition?: string;
  everydayAnalogy?: string;
  [key: string]: any; // flexible nested content
}

interface RawModule {
  phase: string;
  module: string;
  description: string;
  topics?: RawTopic[];
  sections?: any[]; // LLD module uses "sections" instead of "topics"
  [key: string]: any;
}

// ---------- Difficulty heuristic ----------
function guessDifficulty(phase: string, moduleTitle: string): 'Easy' | 'Medium' | 'Hard' {
  if (phase.includes('Phase 1') && (moduleTitle.includes('Basics') || moduleTitle.includes('1.'))) return 'Easy';
  if (phase.includes('Phase 1')) return 'Medium';
  if (phase.includes('Phase 4') || moduleTitle.includes('LLD')) return 'Hard';
  return 'Hard'; // Phase 2+ advanced concepts
}

// ---------- Deep JSON → Markdown converter ----------
function jsonToMarkdown(obj: any, depth: number = 0): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

  if (Array.isArray(obj)) {
    // If array of primitives, render as bullet list
    if (obj.every(item => typeof item === 'string' || typeof item === 'number')) {
      return obj.map(item => `- ${item}`).join('\n');
    }
    // Array of objects — render each
    return obj.map(item => jsonToMarkdown(item, depth)).join('\n\n');
  }

  // Object: convert each key-value pair
  const lines: string[] = [];
  const headingPrefix = '#'.repeat(Math.min(depth + 3, 6)); // ### at depth 0, #### at depth 1, etc.

  for (const [key, value] of Object.entries(obj)) {
    // Skip certain meta keys
    if (['id', 'sectionId'].includes(key)) continue;

    const label = formatKey(key);

    if (typeof value === 'string') {
      if (value.length > 100 || value.includes('\n')) {
        lines.push(`**${label}:** ${value}`);
      } else {
        lines.push(`**${label}:** ${value}`);
      }
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`**${label}:** ${value}`);
    } else if (Array.isArray(value)) {
      if (value.every(item => typeof item === 'string')) {
        lines.push(`**${label}:**`);
        value.forEach(item => lines.push(`- ${item}`));
      } else {
        lines.push(`${headingPrefix} ${label}`);
        lines.push(jsonToMarkdown(value, depth + 1));
      }
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${headingPrefix} ${label}`);
      lines.push(jsonToMarkdown(value, depth + 1));
    }
  }

  return lines.join('\n\n');
}

function formatKey(key: string): string {
  // Convert camelCase / snake_case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

// ---------- Extract key concepts from nested data ----------
function extractKeyConcepts(topic: RawTopic): string[] {
  const concepts: string[] = [];

  // Pull from common nested structures
  if (topic.comparison) {
    Object.keys(topic.comparison).forEach(k => {
      concepts.push(formatKey(k));
    });
  }
  if (topic.breakdown) {
    if (Array.isArray(topic.breakdown)) {
      topic.breakdown.forEach((item: any) => concepts.push(item.type || item.name || item.concept || ''));
    } else {
      Object.keys(topic.breakdown).forEach(k => concepts.push(formatKey(k)));
    }
  }
  if (topic.subSections) {
    topic.subSections.forEach((s: any) => concepts.push(s.concept || s.pattern || s.name || ''));
  }
  if (topic.mechanisms) {
    topic.mechanisms.forEach((m: any) => concepts.push(m.name || ''));
  }
  if (topic.models) {
    if (Array.isArray(topic.models)) {
      topic.models.forEach((m: any) => concepts.push(m.name || ''));
    } else {
      Object.keys(topic.models).forEach(k => concepts.push(formatKey(k)));
    }
  }
  if (topic.types) {
    topic.types.forEach((t: any) => concepts.push(t.category || t.name || ''));
  }
  if (topic.strategies) {
    topic.strategies.forEach((s: any) => concepts.push(s.strategy || s.name || ''));
  }
  if (topic.patterns) {
    topic.patterns.forEach((p: any) => concepts.push(p.name || ''));
  }
  if (topic.algorithms) {
    topic.algorithms.forEach((a: any) => concepts.push(a.name || ''));
  }
  if (topic.pillars) {
    topic.pillars.forEach((p: any) => concepts.push(p.pillar || ''));
  }
  if (topic.policies) {
    topic.policies.forEach((p: any) => concepts.push(p.name || ''));
  }
  if (topic.structures) {
    topic.structures.forEach((s: any) => concepts.push(s.name || s.type || ''));
  }
  if (topic.definitions) {
    Object.keys(topic.definitions).forEach(k => concepts.push(k));
  }
  if (topic.deliverySemantics) {
    topic.deliverySemantics.forEach((d: any) => concepts.push(d.type || ''));
  }
  if (topic.components) {
    topic.components.forEach((c: any) => concepts.push(c.name || ''));
  }
  if (topic.topologies) {
    topic.topologies.forEach((t: any) => concepts.push(t.name || ''));
  }
  if (topic.comparisonTable) {
    topic.comparisonTable.forEach((c: any) => concepts.push(c.paradigm || c.type || c.feature || c.system || ''));
  }
  if (topic.failureModes) {
    topic.failureModes.forEach((f: any) => concepts.push(f.problem || ''));
  }
  if (topic.paradigms) {
    topic.paradigms.forEach((p: any) => concepts.push(p.type || ''));
  }
  if (topic.layerComparison) {
    Object.keys(topic.layerComparison).forEach(k => concepts.push(formatKey(k)));
  }
  if (topic.cachingStrategies) {
    topic.cachingStrategies.forEach((s: any) => concepts.push(s.name || ''));
  }
  if (topic.benchmarks) {
    // Take first few
    topic.benchmarks.slice(0, 4).forEach((b: any) => concepts.push(b.operation || ''));
  }

  // If still empty, fallback to generic
  if (concepts.length === 0 && topic.simpleDefinition) {
    concepts.push(topic.simpleDefinition.substring(0, 80));
  }

  return concepts.filter(c => c.length > 0).slice(0, 6);
}

// ---------- Build detailedContent markdown from raw topic ----------
function buildDetailedContent(topic: RawTopic): string {
  const parts: string[] = [];

  if (topic.simpleDefinition) {
    parts.push(`### Simple Definition\n${topic.simpleDefinition}`);
  }
  if (topic.everydayAnalogy) {
    parts.push(`### Everyday Analogy\n> ${topic.everydayAnalogy}`);
  }

  // Build detailed markdown from all remaining fields
  const skipKeys = new Set(['id', 'title', 'summary', 'simpleDefinition', 'everydayAnalogy']);
  for (const [key, value] of Object.entries(topic)) {
    if (skipKeys.has(key)) continue;
    if (typeof value === 'object' && value !== null) {
      parts.push(`### ${formatKey(key)}\n${jsonToMarkdown(value, 1)}`);
    } else if (typeof value === 'string' && !skipKeys.has(key)) {
      parts.push(`**${formatKey(key)}:** ${value}`);
    }
  }

  return parts.join('\n\n');
}

// ---------- Build TopicItems from LLD sections ----------
function buildLLDTopics(module: RawModule): TopicItem[] {
  const items: TopicItem[] = [];

  if (!module.sections) return items;

  for (const section of module.sections) {
    const sectionTitle = section.sectionTitle || section.sectionId || 'LLD Section';
    const sectionSummary = section.summary || '';

    // Sections like SOLID principles, design patterns contain nested arrays
    if (section.principles) {
      // Create a single topic for the entire SOLID section
      items.push({
        id: `sd-concept-${section.sectionId || 'solid'}`,
        title: sectionTitle,
        domain: 'system-design',
        category: 'Low Level Design (LLD)',
        difficulty: 'Hard',
        companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Flipkart'],
        importanceRating: 5,
        summary: sectionSummary,
        keyConcepts: section.principles
          ? section.principles.map((p: any) => `${p.letter} - ${p.name}`)
          : [],
        detailedContent: jsonToMarkdown(section, 0),
      });
    } else if (section.patterns) {
      items.push({
        id: `sd-concept-${section.sectionId || 'design-patterns'}`,
        title: sectionTitle,
        domain: 'system-design',
        category: 'Low Level Design (LLD)',
        difficulty: 'Hard',
        companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Uber'],
        importanceRating: 5,
        summary: sectionSummary,
        keyConcepts: section.patterns
          ? section.patterns.map((p: any) => `${p.type}: ${p.name}`)
          : [],
        detailedContent: jsonToMarkdown(section, 0),
      });
    } else if (section.problems) {
      // Each LLD problem becomes its own topic
      for (const problem of section.problems) {
        items.push({
          id: `sd-concept-lld-${problem.id}`,
          title: problem.title,
          domain: 'system-design',
          category: 'Low Level Design (LLD)',
          difficulty: 'Hard',
          companyTags: ['Amazon', 'Google', 'Microsoft', 'Flipkart', 'Uber'],
          importanceRating: 5,
          summary: problem.problemScope || '',
          keyConcepts: [
            ...(problem.patternsUsed || []).slice(0, 3),
            ...(problem.coreEntities || []).slice(0, 3).map((e: any) => e.name),
          ],
          detailedContent: buildDetailedContent(problem),
        });
      }
    }
  }

  return items;
}

// ---------- Company tag heuristic ----------
const MODULE_COMPANY_MAP: Record<string, string[]> = {
  '1. Basics and Estimation': ['Amazon', 'Google', 'Microsoft', 'Meta'],
  '2. Networking': ['Cloudflare', 'Google', 'Amazon', 'Meta'],
  '3. Databases (Storage & Persistence)': ['Amazon', 'Google', 'MongoDB', 'Meta', 'Uber'],
  '4. Caching': ['Redis', 'Amazon', 'Google', 'Stripe'],
  '5. Distributed Systems Theory': ['Google', 'Amazon', 'Microsoft', 'Meta'],
  '6. Messaging and Asynchronous Processing': ['Uber', 'LinkedIn', 'Amazon', 'Confluent'],
  '7. Architecture Patterns': ['Netflix', 'Uber', 'Amazon', 'Google'],
  '8. Storage and Search': ['Amazon', 'Elastic', 'Google', 'Databricks'],
  '9. Security Basics': ['Cloudflare', 'Auth0', 'Amazon', 'Google'],
};

// ---------- Main parsing function ----------
function parseRawSystemDesignJSON(rawText: string): RawModule[] {
  // The file contains multiple JSON objects concatenated (no wrapping array, no commas)
  // We need to split them apart carefully.
  const modules: RawModule[] = [];

  // Strategy: Find matching braces for top-level objects
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
          modules.push(parsed as RawModule);
        } catch {
          console.warn('[SystemDesign] Failed to parse module chunk at position', start);
        }
        start = -1;
      }
    }
  }

  return modules;
}

function transformModulesToTopicItems(modules: RawModule[]): TopicItem[] {
  const items: TopicItem[] = [];

  for (const mod of modules) {
    const moduleTitle = mod.module;
    const phase = mod.phase || '';

    // Handle LLD module separately (uses "sections" instead of "topics")
    if (mod.sections && !mod.topics) {
      items.push(...buildLLDTopics(mod));
      continue;
    }

    if (!mod.topics) continue;

    const difficulty = guessDifficulty(phase, moduleTitle);
    const companyTags = MODULE_COMPANY_MAP[moduleTitle] || ['Amazon', 'Google', 'Microsoft'];

    for (const topic of mod.topics) {
      const keyConcepts = extractKeyConcepts(topic);
      const detailedContent = buildDetailedContent(topic);

      items.push({
        id: `sd-concept-${topic.id}`,
        title: topic.title,
        domain: 'system-design',
        category: moduleTitle,
        difficulty,
        companyTags,
        importanceRating: 5,
        summary: topic.summary,
        keyConcepts,
        detailedContent,
      });
    }
  }

  return items;
}

// ---------- Load & Export ----------
import systemDesignData from './json/system-design.json';

const parsedModules: RawModule[] = (Array.isArray(systemDesignData) ? systemDesignData : [systemDesignData]) as unknown as RawModule[];
export const systemDesignConceptTopics: TopicItem[] = transformModulesToTopicItems(parsedModules);

// Also export the module structure for the KnowledgeHub category display
export interface SystemDesignModule {
  phase: string;
  module: string;
  description: string;
  topicCount: number;
}

export const systemDesignModules: SystemDesignModule[] = parsedModules.map(mod => ({
  phase: mod.phase,
  module: mod.module,
  description: mod.description,
  topicCount: mod.topics?.length || mod.sections?.length || 0,
}));
