import { TrickItem, TrickProblem, CodeTemplateItem, RecognitionStep } from '../types';

export function parseTrickJsonText(str: string): TrickItem[] {
  const rawItems: any[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\' && inString) {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
          const jsonStr = str.slice(start, i + 1);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.tricks_and_techniques && Array.isArray(parsed.tricks_and_techniques)) {
              rawItems.push(...parsed.tricks_and_techniques);
            } else if (parsed.id || parsed.title) {
              rawItems.push(parsed);
            }
          } catch (err) {
            // Ignore malformed boundary chunks if any
          }
          start = -1;
        }
      }
    }
  }

  // Deduplicate by title or id
  const seenTitles = new Set<string>();
  const normalized: TrickItem[] = [];

  rawItems.forEach((t, index) => {
    const title = t.title || `Trick ${index + 1}`;
    if (seenTitles.has(title)) return;
    seenTitles.add(title);

    const id = t.id || normalized.length + 1;
    const category = t.category || 'General DSA';
    const rating = typeof t.rating === 'number' ? t.rating : 5;
    const tags = Array.isArray(t.tags) ? t.tags : [];

    // whenToUse
    let intro = '';
    const items: string[] = [];
    if (t.when_to_use) {
      intro = t.when_to_use.intro || '';
      if (Array.isArray(t.when_to_use.keywords)) items.push(...t.when_to_use.keywords);
      if (Array.isArray(t.when_to_use.patterns)) items.push(...t.when_to_use.patterns);
      if (Array.isArray(t.when_to_use.clues)) items.push(...t.when_to_use.clues);
    }

    // Code Templates
    const codeTemplates: CodeTemplateItem[] = [];
    if (t.template && typeof t.template === 'object') {
      codeTemplates.push({
        name: t.template.name || 'Standard Template',
        language: t.template.language || 'cpp',
        code: t.template.code || ''
      });
    }
    if (t.templates && typeof t.templates === 'object') {
      Object.entries(t.templates).forEach(([key, val]: [string, any]) => {
        if (val && typeof val === 'object') {
          codeTemplates.push({
            name: key.replace(/_/g, ' ').toUpperCase(),
            language: val.language || 'cpp',
            code: val.code || ''
          });
        }
      });
    }

    // Recognition flow
    const recognitionFlow: RecognitionStep[] = [];
    if (Array.isArray(t.recognition_flow)) {
      t.recognition_flow.forEach((item: any) => {
        if (typeof item === 'string') {
          if (item.includes('→') || item.includes('->')) {
            const parts = item.split(/→|->/);
            recognitionFlow.push({
              condition: parts[0].trim(),
              result: parts.slice(1).join('->').trim()
            });
          } else if (item.endsWith('?')) {
            recognitionFlow.push({ question: item.trim() });
          } else {
            recognitionFlow.push({ condition: item.trim() });
          }
        } else if (item && typeof item === 'object') {
          recognitionFlow.push({
            question: item.question,
            condition: item.condition,
            action: item.action,
            result: item.result
          });
        }
      });
    }

    if (recognitionFlow.length === 0 && Array.isArray(t.algorithm_selection)) {
      t.algorithm_selection.forEach((item: any) => {
        if (item && typeof item === 'object') {
          recognitionFlow.push({
            condition: item.graph_type || item.condition || item.type || 'Condition',
            result: item.algorithm || item.result || 'Algorithm'
          });
        }
      });
    }

    // Problems
    let problems: TrickProblem[] = [];
    if (Array.isArray(t.problems)) {
      problems = t.problems.map((p: any, pIdx: number) => {
        if (typeof p === 'string') {
          return { number: pIdx + 1, problem: p, leetcode: null, gfg: null };
        }
        return {
          number: p.number || pIdx + 1,
          problem: p.problem || p.title || `Problem ${pIdx + 1}`,
          leetcode: p.leetcode || null,
          gfg: p.gfg || null
        };
      });
    } else if (t.problems && typeof t.problems === 'object') {
      const lc = Array.isArray(t.problems.leetcode) ? t.problems.leetcode : [];
      const gfg = Array.isArray(t.problems.gfg) ? t.problems.gfg : [];
      const maxLen = Math.max(lc.length, gfg.length);
      for (let i = 0; i < maxLen; i++) {
        problems.push({
          number: i + 1,
          problem: lc[i] || gfg[i] || `Problem ${i + 1}`,
          leetcode: lc[i] || null,
          gfg: gfg[i] || null
        });
      }
    }

    const mustMaster = Array.isArray(t.must_master) 
      ? t.must_master 
      : Array.isArray(t.core_pattern) 
      ? t.core_pattern 
      : Array.isArray(t.important_distinction)
      ? t.important_distinction.map((d: any) => `${d.problem_pattern} → ${d.technique}`)
      : [];

    normalized.push({
      id,
      title,
      slug: t.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating,
      category,
      tags,
      description: t.description || '',
      whenToUse: {
        intro,
        items: Array.from(new Set(items))
      },
      codeTemplates,
      recognitionFlow,
      problems,
      mustMaster
    });
  });

  return normalized;
}
