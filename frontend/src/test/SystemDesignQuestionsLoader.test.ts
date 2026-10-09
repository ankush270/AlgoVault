import { describe, it, expect } from 'vitest';
import {
  systemDesignQuestionTopics,
  parseRawQuestionsChunked,
  sanitizeRawJson,
  extractTopicsFromObject,
  transformQuestions
} from '../data/systemDesignQuestionsLoader';

describe('SystemDesignQuestionsLoader Unit Tests', () => {
  it('loads all 72 system design interview questions without being empty', () => {
    expect(systemDesignQuestionTopics).toBeDefined();
    expect(Array.isArray(systemDesignQuestionTopics)).toBe(true);
    expect(systemDesignQuestionTopics.length).toBe(72);

    // Verify first question
    const first = systemDesignQuestionTopics[0];
    expect(first.id).toBe('sd-question-database_isolation_levels');
    expect(first.category).toBe('System Design: Interview Questions');
    expect(first.domain).toBe('system-design');
    expect(first.title).toContain('Database Isolation Levels');
    expect(first.detailedContent).toContain('Overview');
  });

  it('sanitizes encoding issues (us, dashes, quotes, math symbols)', () => {
    const raw = 'Latency is 150 µs — fast! It’s ≈ 12 QPS × 2.';
    const cleaned = sanitizeRawJson(raw);
    expect(cleaned).toBe("Latency is 150 us - fast! It's ~ 12 QPS x 2.");
  });

  it('chunk-parses concatenated root JSON objects correctly', () => {
    const multiRootJson = `
      {
        "system_design_handbook": {
          "topics": [
            { "id": "t1", "title": "Topic One", "overview": "First topic overview" }
          ]
        }
      }
      {
        "system_design_handbook_part_2": {
          "topics": [
            { "id": "t2", "title": "Topic Two", "overview": "Second topic overview" }
          ]
        }
      }
    `;

    const parsed = parseRawQuestionsChunked(multiRootJson);
    expect(parsed.length).toBe(2);
    expect(parsed[0].id).toBe('t1');
    expect(parsed[1].id).toBe('t2');

    const topics = transformQuestions(parsed);
    expect(topics.length).toBe(2);
    expect(topics[0].id).toBe('sd-question-t1');
    expect(topics[1].id).toBe('sd-question-t2');
  });

  it('recovers gracefully from malformed chunks without crashing or clearing entire list', () => {
    const mixedJson = `
      {
        "system_design_handbook": {
          "topics": [
            { "id": "valid_1", "title": "Valid Topic 1" }
          ]
        }
      }
      { THIS IS INVALID JSON }
      {
        "system_design_handbook": {
          "topics": [
            { "id": "valid_2", "title": "Valid Topic 2" }
          ]
        }
      }
    `;

    const parsed = parseRawQuestionsChunked(mixedJson);
    expect(parsed.length).toBe(2);
    expect(parsed.map(t => t.id)).toEqual(['valid_1', 'valid_2']);
  });
});
