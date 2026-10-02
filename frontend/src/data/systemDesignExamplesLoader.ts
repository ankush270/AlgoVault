/**
 * System Design Examples / Case Studies Loader
 * 
 * Loads and parses system-design-example.json (35 full real-world System Design case studies)
 * and transforms them into TopicItem[] format for KnowledgeHub under the System Design domain.
 */

import { TopicItem, CodeTemplate, Difficulty } from '../types';
import rawExamplesJson from '../../../system-design-example.json?raw';

interface RawExample {
  title?: string;
  systemDesignProblem?: string;
  difficulty?: string;
  overview?: {
    definition?: string;
    coreChallenge?: string;
    [key: string]: any;
  };
  importantFeatures?: Array<{ feature: string; detail: string } | string>;
  scalingRequirementsAndCapacityEstimation?: {
    assumptions?: Record<string, string>;
    storageEstimation?: Record<string, string>;
    trafficThroughputQPS?: Record<string, string>;
    scalingPillars?: Record<string, string>;
    [key: string]: any;
  };
  dataModelER?: {
    entities?: Array<{ table: string; fields: string[] }>;
    relationships?: string[];
  };
  highLevelDesignAndServices?: {
    assumptions?: string[];
    components?: string[];
    microservices?: Array<{ name: string; responsibility: string }>;
  };
  completeDetailedDesignDeepDive?: Record<string, any>;
  apiDesign?: Array<{
    endpoint: string;
    method: string;
    description?: string;
    requestPayload?: any;
    response200?: any;
    response201?: any;
    headers?: string[];
    queryParams?: any;
  }>;
  codeImplementations?: Record<string, string>;
  diagrams?: Record<string, string>;
  [key: string]: any;
}

// Robust Sanitizer & Splitter
function parseExamplesJSON(rawText: string): RawExample[] {
  const regex = /^\{\s*"(?:title|systemDesignProblem)"/gm;
  const indices: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    indices.push(match.index);
  }

  const parsedObjects: RawExample[] = [];

  for (let i = 0; i < indices.length; i++) {
    const from = indices[i];
    const to = i + 1 < indices.length ? indices[i + 1] : rawText.length;
    const rawChunk = rawText.substring(from, to).trim();

    let clean = rawChunk.replace(/,\s*([\}\]])/g, '$1');
    clean = clean.replace(/,\s*\{(\s*"image link":)/g, ',\n    "diagrams": {$1');
    clean = clean.replace(/("completeDetailedDesignDeepDive":\s*\{[\s\S]*?)\n\s*\](,\s*\n\s*"apiDesign")/g, '$1\n  }$2');
    clean = clean.replace(/("scalingRequirementsAndCapacityEstimation":\s*\{[\s\S]*?)\n\s*\](,\s*\n\s*"dataModelER")/g, '$1\n  }$2');
    clean = clean.replace(/\\([^"\\\/bfnrtu])/g, '$1');

    try {
      const obj = JSON.parse(clean);
      parsedObjects.push(obj as RawExample);
    } catch {
      try {
        const obj2 = JSON.parse(rawChunk);
        parsedObjects.push(obj2 as RawExample);
      } catch (err) {
        console.warn(`[SystemDesignExamples] Could not parse chunk #${i + 1}`, err);
      }
    }
  }

  return parsedObjects;
}

function formatKeyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

function buildExampleMarkdown(ex: RawExample): string {
  const parts: string[] = [];

  // 1. Overview
  if (ex.overview) {
    const overviewLines: string[] = [];
    if (ex.overview.definition) {
      overviewLines.push(`**Definition:** ${ex.overview.definition}`);
    }
    if (ex.overview.coreChallenge) {
      overviewLines.push(`**Core System Challenges:** ${ex.overview.coreChallenge}`);
    }
    parts.push(`### 🎯 System Overview\n${overviewLines.join('\n\n')}`);
  }

  // 2. Important Features
  if (ex.importantFeatures && ex.importantFeatures.length > 0) {
    const featureLines = ex.importantFeatures.map(f => {
      if (typeof f === 'string') return `- ${f}`;
      return `- **${f.feature}:** ${f.detail}`;
    });
    parts.push(`### 🚀 Core Functional Requirements & Features\n${featureLines.join('\n')}`);
  }

  // 3. Scaling & Capacity Estimation
  if (ex.scalingRequirementsAndCapacityEstimation) {
    const cap = ex.scalingRequirementsAndCapacityEstimation;
    const capLines: string[] = [];

    if (cap.assumptions) {
      capLines.push('#### 📊 Traffic & Scale Assumptions');
      for (const [k, v] of Object.entries(cap.assumptions)) {
        capLines.push(`- **${formatKeyLabel(k)}:** ${v}`);
      }
    }

    if (cap.trafficThroughputQPS) {
      capLines.push('\n#### ⚡ Throughput & QPS');
      for (const [k, v] of Object.entries(cap.trafficThroughputQPS)) {
        capLines.push(`- **${formatKeyLabel(k)}:** ${v}`);
      }
    }

    if (cap.storageEstimation) {
      capLines.push('\n#### 💾 Storage & Retention Math');
      for (const [k, v] of Object.entries(cap.storageEstimation)) {
        capLines.push(`- **${formatKeyLabel(k)}:** ${v}`);
      }
    }

    if (cap.scalingPillars) {
      capLines.push('\n#### 🏛️ Scaling Pillars & Strategy');
      for (const [k, v] of Object.entries(cap.scalingPillars)) {
        capLines.push(`- **${formatKeyLabel(k)}:** ${v}`);
      }
    }

    if (capLines.length > 0) {
      parts.push(`### 📐 Capacity Estimation & Scaling Architecture\n${capLines.join('\n')}`);
    }
  }

  // 4. Data Model (ER)
  if (ex.dataModelER) {
    const erLines: string[] = [];
    if (ex.dataModelER.entities && ex.dataModelER.entities.length > 0) {
      erLines.push('#### 🗄️ Database Tables & Schema');
      for (const entity of ex.dataModelER.entities) {
        erLines.push(`**Table: \`${entity.table}\`**`);
        entity.fields.forEach(f => erLines.push(`- \`${f}\``));
        erLines.push('');
      }
    }
    if (ex.dataModelER.relationships && ex.dataModelER.relationships.length > 0) {
      erLines.push('#### 🔗 Relationships');
      ex.dataModelER.relationships.forEach(r => erLines.push(`- ${r}`));
    }
    if (erLines.length > 0) {
      parts.push(`### 🗄️ Data Model & Schema Design\n${erLines.join('\n')}`);
    }
  }

  // 5. High Level Design & Services
  if (ex.highLevelDesignAndServices) {
    const hld = ex.highLevelDesignAndServices;
    const hldLines: string[] = [];

    if (hld.components && hld.components.length > 0) {
      hldLines.push('#### 🧩 Architecture Components');
      hld.components.forEach(c => hldLines.push(`- ${c}`));
    }

    if (hld.microservices && hld.microservices.length > 0) {
      hldLines.push('\n#### 🛠️ Microservices Responsibilities');
      hld.microservices.forEach(m => hldLines.push(`- **${m.name}:** ${m.responsibility}`));
    }

    if (hldLines.length > 0) {
      parts.push(`### 🏗️ High-Level System Architecture\n${hldLines.join('\n')}`);
    }
  }

  // 6. Deep Dives
  if (ex.completeDetailedDesignDeepDive) {
    const deepLines: string[] = [];
    for (const [topicKey, topicVal] of Object.entries(ex.completeDetailedDesignDeepDive)) {
      deepLines.push(`#### 🔍 ${formatKeyLabel(topicKey)}`);
      if (typeof topicVal === 'object' && topicVal !== null) {
        for (const [k, v] of Object.entries(topicVal)) {
          if (Array.isArray(v)) {
            deepLines.push(`**${formatKeyLabel(k)}:**`);
            v.forEach(item => deepLines.push(`- ${item}`));
          } else {
            deepLines.push(`**${formatKeyLabel(k)}:** ${v}`);
          }
        }
      } else {
        deepLines.push(String(topicVal));
      }
      deepLines.push('');
    }
    if (deepLines.length > 0) {
      parts.push(`### 🔬 Deep Dive Technical Solutions\n${deepLines.join('\n')}`);
    }
  }

  // 7. API Design
  if (ex.apiDesign && ex.apiDesign.length > 0) {
    const apiLines: string[] = [];
    for (const api of ex.apiDesign) {
      apiLines.push(`- **\`${api.method} ${api.endpoint}\`**${api.description ? ` — ${api.description}` : ''}`);
      if (api.requestPayload) {
        apiLines.push(`  - *Request Body:* \`${JSON.stringify(api.requestPayload)}\``);
      }
      if (api.response200 || api.response201) {
        apiLines.push(`  - *Response:* \`${JSON.stringify(api.response200 || api.response201)}\``);
      }
    }
    parts.push(`### 🌐 REST API Specifications\n${apiLines.join('\n')}`);
  }

  // 8. Step-based structures (e.g. TinyURL)
  for (const [k, v] of Object.entries(ex)) {
    if (k.startsWith('step') && typeof v === 'object' && v !== null) {
      parts.push(`### ${formatKeyLabel(k)}\n\`\`\`json\n${JSON.stringify(v, null, 2)}\n\`\`\``);
    }
  }

  // 9. Code Implementations
  if (ex.codeImplementations) {
    for (const [implName, codeStr] of Object.entries(ex.codeImplementations)) {
      const lang = implName.toLowerCase().includes('cpp') ? 'cpp' : implName.toLowerCase().includes('java') ? 'java' : 'python';
      parts.push(`### 💻 ${formatKeyLabel(implName)}\n\`\`\`${lang}\n${codeStr}\n\`\`\``);
    }
  }

  return parts.join('\n\n');
}

// Extract company tags intelligently
function extractCompaniesFromTitle(title: string): string[] {
  const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Uber', 'Spotify', 'Stripe', 'Airbnb', 'Twitter', 'Slack', 'Microsoft', 'DoorDash', 'PayPal', 'Tinder', 'Dropbox', 'Reddit', 'Salesforce'];
  const matched = companies.filter(c => title.toLowerCase().includes(c.toLowerCase()));
  return matched.length > 0 ? matched : ['Google', 'Amazon', 'Meta'];
}

function transformExamplesToTopics(examples: RawExample[]): TopicItem[] {
  const items: TopicItem[] = [];

  for (let idx = 0; idx < examples.length; idx++) {
    const ex = examples[idx];
    const rawTitle = ex.title || ex.systemDesignProblem || `System Design Case Study #${idx + 1}`;
    const cleanTitle = rawTitle.replace(/^System Design:\s*/i, '');
    const idSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const companyTags = extractCompaniesFromTitle(rawTitle);
    const difficulty: Difficulty = (ex.difficulty && ex.difficulty.toLowerCase().includes('medium')) ? 'Medium' : 'Hard';

    const keyConcepts: string[] = [];
    if (ex.importantFeatures) {
      ex.importantFeatures.slice(0, 3).forEach(f => {
        keyConcepts.push(typeof f === 'string' ? f.split(':')[0] : f.feature);
      });
    }
    if (ex.completeDetailedDesignDeepDive) {
      Object.keys(ex.completeDetailedDesignDeepDive).slice(0, 3).forEach(k => {
        keyConcepts.push(formatKeyLabel(k));
      });
    }

    const codeTemplates: CodeTemplate[] = [];
    if (ex.codeImplementations) {
      for (const [implName, code] of Object.entries(ex.codeImplementations)) {
        let language: CodeTemplate['language'] = 'python';
        if (implName.toLowerCase().includes('cpp')) language = 'cpp';
        else if (implName.toLowerCase().includes('java')) language = 'java';
        else if (implName.toLowerCase().includes('sql')) language = 'sql';
        else if (implName.toLowerCase().includes('script')) language = 'javascript';

        codeTemplates.push({ language, code });
      }
    }

    const detailedContent = buildExampleMarkdown(ex);
    const summary = ex.overview?.definition || ex.overview?.coreChallenge || `Comprehensive architectural breakdown and end-to-end design for ${cleanTitle}.`;

    items.push({
      id: `sd-example-${idSlug}`,
      title: cleanTitle,
      domain: 'system-design',
      category: 'System Design: Real-World Case Studies',
      difficulty,
      companyTags,
      importanceRating: 5,
      summary,
      keyConcepts: keyConcepts.slice(0, 6),
      detailedContent,
      codeTemplates
    });
  }

  return items;
}

const parsedExamples = parseExamplesJSON(rawExamplesJson);
export const systemDesignExampleTopics: TopicItem[] = transformExamplesToTopics(parsedExamples);
