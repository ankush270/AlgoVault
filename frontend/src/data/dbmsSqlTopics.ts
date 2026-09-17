import dbmsRoadmapData from '../../public/data/core-cs/dbmsRoadmap.json';
import { TopicItem } from '../types';

/**
 * DBMS & SQL Topic Registry
 * Dynamically generated from dbmsRoadmap.json (Single Source of Truth)
 * Exhaustive, rich deep-dive explanations for all 16 modules
 */
const sections = (dbmsRoadmapData as any).sections || (dbmsRoadmapData as any).modules || [];

export const dbmsSqlTopics: TopicItem[] = sections.flatMap((section: any) =>
  section.topics.map((t: any) => {
    let diff: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    const rawDiff = (t.difficulty || section.difficulty || 'medium').toLowerCase();
    if (rawDiff === 'beginner' || rawDiff === 'easy') diff = 'Easy';
    if (rawDiff === 'intermediate' || rawDiff === 'medium') diff = 'Medium';
    if (rawDiff === 'advanced' || rawDiff === 'hard') diff = 'Hard';

    const defaultCompanyTags = [
      'PostgreSQL',
      'MySQL',
      'Oracle',
      'Amazon',
      'Google',
      'Uber',
      'Razorpay',
      'Microsoft',
    ];

    const cleanTitle = t.title;
    const topicIdStr = t.topicId ? t.topicId.replace('.', '-') : t.id;

    // Detailed Markdown Content Generation
    const mdLines: string[] = [];
    mdLines.push(`### 📌 ${cleanTitle}\n`);

    if (t.what_is_it) {
      mdLines.push(`**What is it?**  \n${t.what_is_it}\n`);
    }

    if (t.simple_explanation) {
      mdLines.push(`### 💡 Simple Explanation\n${t.simple_explanation}\n`);
    }

    if (t.real_world_analogy) {
      mdLines.push(`> 🏢 **Real-World Analogy**:  \n> ${t.real_world_analogy}\n`);
    }

    if (t.why_it_exists && Array.isArray(t.why_it_exists) && t.why_it_exists.length > 0) {
      mdLines.push(`### 🎯 Why It Exists & Core Objectives`);
      t.why_it_exists.forEach((item: string) => mdLines.push(`- ${item}`));
      mdLines.push('');
    }

    if (t.tech_world && Array.isArray(t.tech_world) && t.tech_world.length > 0) {
      mdLines.push(`### 🌐 Real World & Tech Industry Usage`);
      t.tech_world.forEach((item: string) => mdLines.push(`- ${item}`));
      mdLines.push('');
    }

    if (t.key_points && Array.isArray(t.key_points) && t.key_points.length > 0) {
      mdLines.push(`### 🔑 Key Takeaways & Core Concepts`);
      t.key_points.forEach((item: string) => mdLines.push(`- ${item}`));
      mdLines.push('');
    }

    if (t.syntaxOrCode) {
      mdLines.push(`### 💻 SQL Syntax / Execution Plan / Diagram\n\`\`\`sql\n${t.syntaxOrCode}\n\`\`\`\n`);
    }

    if (t.quickRevisionNotes && Array.isArray(t.quickRevisionNotes) && t.quickRevisionNotes.length > 0) {
      mdLines.push(`### 📝 Quick Revision & Interview Takeaways`);
      t.quickRevisionNotes.forEach((item: string) => mdLines.push(`- ${item}`));
      mdLines.push('');
    }

    if (t.interview_focus && Array.isArray(t.interview_focus) && t.interview_focus.length > 0) {
      mdLines.push(`### 🎯 Top Interview Focus Areas`);
      t.interview_focus.forEach((item: string) => mdLines.push(`- ${item}`));
      mdLines.push('');
    }

    const detailedContent = mdLines.join('\n');

    // Interview Questions
    let interviewQuestions: { question: string; answer: string }[] | undefined = undefined;
    if (t.interview_questions && Array.isArray(t.interview_questions) && t.interview_questions.length > 0) {
      interviewQuestions = t.interview_questions.map((iq: any) => ({
        question: iq.question,
        answer: iq.answer,
      }));
    } else if (t.quickRevisionNotes && Array.isArray(t.quickRevisionNotes)) {
      interviewQuestions = t.quickRevisionNotes.map((note: string, idx: number) => ({
        question: `Key Takeaway #${idx + 1} for ${cleanTitle}`,
        answer: note,
      }));
    }

    return {
      id: `dbms-${topicIdStr}`,
      title: cleanTitle,
      domain: 'dbms-sql' as const,
      category: section.title.includes(': ') ? section.title.split(': ')[1] : section.title,
      difficulty: diff,
      companyTags: defaultCompanyTags,
      importanceRating: (section.moduleNumber || 1) > 10 ? 5 : 4,
      summary: (t.simple_explanation || t.what_is_it || '').slice(0, 160) + '...',
      keyConcepts: t.key_points || t.keyConcepts || [cleanTitle],
      detailedContent: detailedContent,
      codeTemplates: t.syntaxOrCode
        ? [
            {
              language: 'sql' as const,
              code: t.syntaxOrCode,
            },
          ]
        : undefined,
      interviewQuestions: interviewQuestions,
    };
  })
);
