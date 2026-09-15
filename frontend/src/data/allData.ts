import { TopicItem, Flashcard } from '../types';
import { dsaTopics } from './dsaTopics';
import { systemDesignTopics } from './systemDesignTopics';
import { osTopics } from './osTopics';
import { dbmsSqlTopics } from './dbmsSqlTopics';
import { networksTopics } from './networksTopics';
import { aiMlTopics } from './aiMlTopics';

export const allTopics: TopicItem[] = [
  ...dsaTopics,
  ...systemDesignTopics,
  ...osTopics,
  ...dbmsSqlTopics,
  ...networksTopics,
  ...aiMlTopics
];

// Helper to extract flashcards from topic interview questions
export const generateFlashcards = (): Flashcard[] => {
  const cards: Flashcard[] = [];
  let index = 1;

  allTopics.forEach(topic => {
    if (topic.interviewQuestions) {
      topic.interviewQuestions.forEach(q => {
        cards.push({
          id: `card-${index++}`,
          topicId: topic.id,
          domain: topic.domain,
          question: q.question,
          answer: q.answer,
          codeSnippet: q.explanation,
          difficulty: topic.difficulty
        });
      });
    }
  });

  return cards;
};

export const sampleFlashcards: Flashcard[] = generateFlashcards();
