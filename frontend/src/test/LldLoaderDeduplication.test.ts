import { describe, it, expect } from 'vitest';
import { lldTopics, transformLLDSetsToTopics } from '../data/lldLoader';
import { allTopics } from '../data/allData';

describe('LLD Loader and allTopics ID Uniqueness and Deduplication', () => {
  it('ensures lldTopics contains zero duplicate topic IDs', () => {
    const idCountMap = new Map<string, number>();
    const duplicates: string[] = [];

    lldTopics.forEach((topic) => {
      const count = (idCountMap.get(topic.id) || 0) + 1;
      idCountMap.set(topic.id, count);
      if (count === 2) {
        duplicates.push(topic.id);
      }
    });

    expect(duplicates).toEqual([]);
    expect(idCountMap.get('lld-snake-and-ladder')).toBe(1);
    expect(idCountMap.get('lld-chess-game')).toBe(1);
  });

  it('transformLLDSetsToTopics gracefully ignores duplicate problem entries across sets', () => {
    const mockSets = [
      {
        setName: 'Set 1',
        problems: [
          { id: 'prob-1', title: 'Problem 1', problemStatement: 'Desc 1' },
          { id: 'prob-2', title: 'Problem 2', problemStatement: 'Desc 2' }
        ]
      },
      {
        setName: 'Set 2',
        problems: [
          { id: 'prob-2', title: 'Problem 2 Duplicate', problemStatement: 'Desc 2 Dup' },
          { id: 'prob-3', title: 'Problem 3', problemStatement: 'Desc 3' }
        ]
      }
    ];

    const topics = transformLLDSetsToTopics(mockSets as any);
    expect(topics).toHaveLength(3);
    expect(topics.map(t => t.id)).toEqual(['lld-prob-1', 'lld-prob-2', 'lld-prob-3']);
  });

  it('ensures allTopics across the entire platform has strictly unique IDs', () => {
    const idSet = new Set<string>();
    const duplicates: string[] = [];

    allTopics.forEach((topic) => {
      if (idSet.has(topic.id)) {
        duplicates.push(topic.id);
      }
      idSet.add(topic.id);
    });

    expect(duplicates).toEqual([]);
  });
});
