/**
 * System Design Questions Loader
 * 
 * Loads and parses system-design-question.json (System Design interview handbook questions)
 * and transforms them into TopicItem[] format for the SystemDesignHub.
 * 
 * Structure: { system_design_handbook: { topics: [...] } }
 * Each topic has: id, title, overview, key_term_definitions, plus various deeply nested content.
 */

import { TopicItem } from '../types';
import rawQuestionsJson from '../../../system-design-question.json?raw';

interface RawSDQuestion {
  id: string;
  title: string;
  overview?: string;
  key_term_definitions?: Record<string, string>;
  [key: string]: any;
}

interface RawQuestionsData {
  system_design_handbook: {
    topics: RawSDQuestion[];
  };
}

function formatKeyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

function jsonToMarkdown(obj: any, depth: number = 0): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

  if (Array.isArray(obj)) {
    if (obj.every(item => typeof item === 'string' || typeof item === 'number')) {
      return obj.map(item => `- ${item}`).join('\n');
    }
    return obj.map(item => jsonToMarkdown(item, depth)).join('\n\n');
  }

  const lines: string[] = [];
  const headingPrefix = '#'.repeat(Math.min(depth + 3, 6));

  for (const [key, value] of Object.entries(obj)) {
    if (['id'].includes(key)) continue;
    const label = formatKeyLabel(key);

    if (typeof value === 'string') {
      lines.push(`**${label}:** ${value}`);
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

function extractKeyConcepts(topic: RawSDQuestion): string[] {
  const concepts: string[] = [];

  if (topic.key_term_definitions) {
    Object.keys(topic.key_term_definitions).slice(0, 3).forEach(k => concepts.push(formatKeyLabel(k)));
  }
  if (topic.isolation_levels) {
    topic.isolation_levels.forEach((l: any) => concepts.push(l.level || ''));
  }
  if (topic.models) {
    if (typeof topic.models === 'object' && !Array.isArray(topic.models)) {
      Object.keys(topic.models).forEach(k => concepts.push(formatKeyLabel(k)));
    } else if (Array.isArray(topic.models)) {
      topic.models.forEach((m: any) => concepts.push(m.name || ''));
    }
  }
  if (topic.languages) {
    topic.languages.slice(0, 3).forEach((l: any) => concepts.push(l.name || ''));
  }
  if (topic.purpose) {
    if (Array.isArray(topic.purpose)) {
      topic.purpose.slice(0, 2).forEach((p: string) => concepts.push(p.split('.')[0]));
    }
  }
  if (topic.types) {
    topic.types.slice(0, 3).forEach((t: any) => concepts.push(t.type || t.name || ''));
  }
  if (topic.strategies) {
    topic.strategies.slice(0, 3).forEach((s: any) => concepts.push(s.name || s.strategy || ''));
  }
  if (topic.components) {
    topic.components.slice(0, 3).forEach((c: any) => concepts.push(c.name || ''));
  }
  if (topic.protocols) {
    topic.protocols.slice(0, 3).forEach((p: any) => concepts.push(p.name || ''));
  }

  if (concepts.length === 0 && topic.overview) {
    concepts.push(topic.overview.substring(0, 80));
  }

  return concepts.filter(c => c.length > 0).slice(0, 6);
}

function buildQuestionMarkdown(topic: RawSDQuestion): string {
  const parts: string[] = [];

  if (topic.overview) {
    parts.push(`### 📖 Overview\n${topic.overview}`);
  }

  if (topic.key_term_definitions) {
    const termLines = Object.entries(topic.key_term_definitions)
      .map(([k, v]) => `- **${formatKeyLabel(k)}:** ${v}`)
      .join('\n');
    parts.push(`### 🔑 Key Terms\n${termLines}`);
  }

  const skipKeys = new Set(['id', 'title', 'overview', 'key_term_definitions']);
  for (const [key, value] of Object.entries(topic)) {
    if (skipKeys.has(key)) continue;
    if (typeof value === 'object' && value !== null) {
      parts.push(`### ${formatKeyLabel(key)}\n${jsonToMarkdown(value, 1)}`);
    } else if (typeof value === 'string') {
      parts.push(`**${formatKeyLabel(key)}:** ${value}`);
    }
  }

  return parts.join('\n\n');
}

function parseAndTransform(rawText: string): TopicItem[] {
  try {
    const data: RawQuestionsData = JSON.parse(rawText);
    const topics = data.system_design_handbook?.topics || [];

    return topics.map((topic, idx) => {
      const keyConcepts = extractKeyConcepts(topic);
      const detailedContent = buildQuestionMarkdown(topic);

      return {
        id: `sd-question-${topic.id || idx}`,
        title: topic.title,
        domain: 'system-design' as const,
        category: 'System Design: Interview Questions',
        difficulty: 'Medium' as const,
        companyTags: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Uber'],
        importanceRating: 5,
        summary: topic.overview || `Deep-dive into ${topic.title} for system design interviews.`,
        keyConcepts,
        detailedContent,
      };
    });
  } catch (err) {
    console.warn('[SystemDesignQuestionsLoader] Failed to parse questions JSON:', err);
    return [];
  }
}

export const systemDesignQuestionTopics: TopicItem[] = parseAndTransform(rawQuestionsJson);
