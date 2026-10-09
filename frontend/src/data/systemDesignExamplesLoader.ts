/**
 * System Design Examples / Case Studies Loader
 * 
 * Loads and parses system-design-example.json (35 full real-world System Design case studies)
 * and transforms them into TopicItem[] format for KnowledgeHub under the System Design domain.
 * Formatted with structured Markdown, Tables, Step-by-Step workflows, and Deep Dives.
 */

import { TopicItem, CodeTemplate, Difficulty } from '../types';
import examplesData from './json/system-design-example.json';

interface RawExample {
  title?: string;
  systemDesignProblem?: string;
  difficulty?: string;
  interviewContext?: {
    targetLevel?: string;
    evaluationCriteria?: string[];
    [key: string]: any;
  };
  overview?: {
    definition?: string;
    coreChallenge?: string;
    coreMission?: string;
    [key: string]: any;
  };
  step1_requirements?: {
    functionalRequirements?: string[];
    nonFunctionalRequirements?: string[];
    [key: string]: any;
  };
  importantFeatures?: Array<{ feature: string; detail: string } | string>;
  step2_capacityEstimation?: Record<string, any>;
  scalingRequirementsAndCapacityEstimation?: {
    assumptions?: Record<string, string>;
    storageEstimation?: Record<string, string>;
    storageEstimations?: Record<string, string>;
    trafficThroughputQPS?: Record<string, string>;
    trafficEstimations?: Record<string, string>;
    scalingPillars?: Record<string, string>;
    memoryAndCaching?: Record<string, string>;
    [key: string]: any;
  };
  step3_coreConceptsAndAlgorithms?: Record<string, any>;
  step4_dataModelAndDatabaseDesign?: {
    databaseChoice?: string;
    justification?: string[];
    schemas?: Record<string, any>;
    [key: string]: any;
  };
  dataModelER?: {
    entities?: Array<{ table: string; fields: string[] }>;
    relationships?: string[];
    [key: string]: any;
  };
  step5_systemArchitectureAndFlow?: {
    components?: string[];
    writeFlow?: string[];
    readFlow?: string[];
    [key: string]: any;
  };
  highLevelDesignAndServices?: {
    assumptions?: string[];
    components?: string[];
    architectureComponents?: string[];
    microservices?: Array<{ name: string; responsibility: string }>;
    microservicesBreakdown?: Array<{ name: string; responsibility: string }>;
    writeFlow?: string[];
    readFlow?: string[];
    [key: string]: any;
  };
  completeDetailedDesignDeepDive?: Record<string, any>;
  step6_codeImplementations?: Record<string, string>;
  codeImplementations?: Record<string, string>;
  step7_advancedOperationalConcerns?: Record<string, any>;
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
  diagrams?: Record<string, string>;
  image?: string;
  [key: string]: any;
}

// Robust Sanitizer & Splitter for the 35 Case Studies JSON
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

function formatValue(v: any, depth = 0): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);

  if (Array.isArray(v)) {
    if (v.length === 0) return '';
    if (typeof v[0] === 'object' && v[0] !== null) {
      return v.map(item => {
        const entries = Object.entries(item).map(([ik, iv]) => `**${formatKeyLabel(ik)}:** ${typeof iv === 'object' ? JSON.stringify(iv) : iv}`);
        return `- ${entries.join(' | ')}`;
      }).join('\n');
    }
    return v.map(item => `- ${item}`).join('\n');
  }

  if (typeof v === 'object') {
    const lines: string[] = [];
    for (const [k, val] of Object.entries(v)) {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        lines.push(`\n**${formatKeyLabel(k)}:**\n` + formatValue(val, depth + 1));
      } else if (Array.isArray(val)) {
        lines.push(`\n**${formatKeyLabel(k)}:**`);
        lines.push(formatValue(val, depth + 1));
      } else {
        lines.push(`- **${formatKeyLabel(k)}:** ${val}`);
      }
    }
    return lines.join('\n');
  }

  return String(v);
}

function buildExampleMarkdown(ex: RawExample): string {
  const parts: string[] = [];

  // 1. Interview Context & Header
  if (ex.interviewContext) {
    const ctx = ex.interviewContext;
    const ctxLines: string[] = [];
    if (ctx.targetLevel) {
      ctxLines.push(`> 🎯 **Target Engineering Level:** \`${ctx.targetLevel}\``);
    }
    if (ctx.evaluationCriteria && Array.isArray(ctx.evaluationCriteria)) {
      ctxLines.push(`\n#### 📋 Interview Evaluation Criteria`);
      ctx.evaluationCriteria.forEach(c => ctxLines.push(`- **Focus:** ${c}`));
    }
    if (ctxLines.length > 0) {
      parts.push(`### 🎯 Interview Context & Expectations\n${ctxLines.join('\n')}`);
    }
  }

  // 2. Overview / Definition
  if (ex.overview) {
    const ov = ex.overview;
    const ovLines: string[] = [];
    if (ov.definition) {
      ovLines.push(`> **System Definition:** ${ov.definition}`);
    }
    if (ov.coreChallenge) {
      ovLines.push(`**Core System Challenges:**\n${ov.coreChallenge}`);
    }
    if (ov.coreMission) {
      ovLines.push(`**Core Engineering Mission:**\n${ov.coreMission}`);
    }
    for (const [k, v] of Object.entries(ov)) {
      if (!['definition', 'coreChallenge', 'coreMission'].includes(k)) {
        ovLines.push(`**${formatKeyLabel(k)}:** ${typeof v === 'object' ? formatValue(v) : v}`);
      }
    }
    if (ovLines.length > 0) {
      parts.push(`### 💡 System Overview & Problem Statement\n${ovLines.join('\n\n')}`);
    }
  }

  // 3. Step 1: Requirements (Functional & Non-Functional)
  if (ex.step1_requirements) {
    const req = ex.step1_requirements;
    const reqLines: string[] = [];
    if (req.functionalRequirements && Array.isArray(req.functionalRequirements)) {
      reqLines.push('#### ⚙️ Functional Requirements');
      req.functionalRequirements.forEach(fr => reqLines.push(`- ${fr}`));
    }
    if (req.nonFunctionalRequirements && Array.isArray(req.nonFunctionalRequirements)) {
      reqLines.push('\n#### 🛡️ Non-Functional Requirements & SLAs');
      req.nonFunctionalRequirements.forEach(nfr => reqLines.push(`- ${nfr}`));
    }
    if (reqLines.length > 0) {
      parts.push(`### 📌 Scope & System Requirements (Step 1)\n${reqLines.join('\n')}`);
    }
  }

  // 4. Important Features
  if (ex.importantFeatures && Array.isArray(ex.importantFeatures) && ex.importantFeatures.length > 0) {
    const featureLines = ex.importantFeatures.map(f => {
      if (typeof f === 'string') return `- ${f}`;
      return `- **${f.feature}:** ${f.detail}`;
    });
    parts.push(`### 🚀 Core Functional Features & Specifications\n${featureLines.join('\n')}`);
  }

  // 5. Step 2: Capacity Estimation & Scaling
  const capData = ex.step2_capacityEstimation || ex.scalingRequirementsAndCapacityEstimation;
  if (capData) {
    const capLines: string[] = [];

    // Assumptions Table
    if (capData.assumptions) {
      capLines.push('#### 📊 Traffic & Scale Assumptions');
      capLines.push('| Parameter / Metric | Baseline Assumption |');
      capLines.push('| :--- | :--- |');
      for (const [k, v] of Object.entries(capData.assumptions)) {
        capLines.push(`| **${formatKeyLabel(k)}** | ${v} |`);
      }
    }

    // Traffic & QPS
    const traffic = capData.trafficEstimations || capData.trafficThroughputQPS;
    if (traffic) {
      capLines.push('\n#### ⚡ Throughput & QPS Math');
      capLines.push('| Query Type | Estimated QPS / Calculation |');
      capLines.push('| :--- | :--- |');
      for (const [k, v] of Object.entries(traffic)) {
        capLines.push(`| **${formatKeyLabel(k)}** | ${v} |`);
      }
    }

    // Storage Math
    const storage = capData.storageEstimations || capData.storageEstimation;
    if (storage) {
      capLines.push('\n#### 💾 Storage & Retention Math');
      capLines.push('| Horizon / Tier | Storage Volume & Infrastructure Strategy |');
      capLines.push('| :--- | :--- |');
      for (const [k, v] of Object.entries(storage)) {
        capLines.push(`| **${formatKeyLabel(k)}** | ${v} |`);
      }
    }

    // Memory & Caching
    if (capData.memoryAndCaching) {
      capLines.push('\n#### 🧠 In-Memory Cache (RAM) Sizing');
      for (const [k, v] of Object.entries(capData.memoryAndCaching)) {
        capLines.push(`- **${formatKeyLabel(k)}:** ${v}`);
      }
    }

    // Scaling Pillars
    if (capData.scalingPillars) {
      capLines.push('\n#### 🏛️ Architectural Scaling Pillars');
      for (const [k, v] of Object.entries(capData.scalingPillars)) {
        capLines.push(`- **${formatKeyLabel(k)}:** ${v}`);
      }
    }

    if (capLines.length > 0) {
      parts.push(`### 📐 Capacity Estimation & Scale Architecture (Step 2)\n${capLines.join('\n')}`);
    }
  }

  // 6. Step 3: Core Concepts & Algorithms
  if (ex.step3_coreConceptsAndAlgorithms) {
    const algos = ex.step3_coreConceptsAndAlgorithms;
    const algoLines: string[] = [];

    for (const [conceptKey, conceptVal] of Object.entries(algos)) {
      algoLines.push(`#### ⚙️ ${formatKeyLabel(conceptKey)}`);
      if (typeof conceptVal === 'object' && conceptVal !== null) {
        algoLines.push(formatValue(conceptVal));
      } else {
        algoLines.push(String(conceptVal));
      }
      algoLines.push('');
    }

    if (algoLines.length > 0) {
      parts.push(`### 🔬 Core Algorithms, Encodings & Technical Fundamentals (Step 3)\n${algoLines.join('\n')}`);
    }
  }

  // 7. Step 4 / dataModelER: Database Schema & Data Model
  const dbData = ex.step4_dataModelAndDatabaseDesign || ex.dataModelER;
  if (dbData) {
    const dbLines: string[] = [];

    if (dbData.databaseChoice) {
      dbLines.push(`> 🗄️ **Database Technology Choice:** \`${dbData.databaseChoice}\``);
    }
    if (dbData.justification && Array.isArray(dbData.justification)) {
      dbLines.push('**Database Selection Justification:**');
      dbData.justification.forEach(j => dbLines.push(`- ${j}`));
      dbLines.push('');
    }

    // Standard ER Entities
    if (dbData.entities && Array.isArray(dbData.entities)) {
      dbLines.push('#### 🗃️ Database Tables & Data Schema');
      for (const entity of dbData.entities) {
        dbLines.push(`\n**Table: \`${entity.table}\`**`);
        dbLines.push('| Column / Field Name | Data Type & Constraint |');
        dbLines.push('| :--- | :--- |');
        if (Array.isArray(entity.fields)) {
          entity.fields.forEach((f: string) => {
            const splitParts = f.split(/(\(.*?\))/);
            const fieldName = splitParts[0].trim();
            const constraint = splitParts.slice(1).join('').replace(/^\(|\)$/g, '').trim() || 'Attribute';
            dbLines.push(`| \`${fieldName}\` | ${constraint} |`);
          });
        }
      }
    }

    // Step 4 Schemas
    if (dbData.schemas && typeof dbData.schemas === 'object') {
      dbLines.push('#### 🗃️ Database Tables & Data Schema');
      for (const [tableName, fields] of Object.entries(dbData.schemas)) {
        dbLines.push(`\n**Table: \`${formatKeyLabel(tableName)}\`**`);
        dbLines.push('| Column / Field Name | Data Type & Constraint |');
        dbLines.push('| :--- | :--- |');
        if (Array.isArray(fields)) {
          fields.forEach((f: any) => {
            if (typeof f === 'object' && f !== null) {
              dbLines.push(`| \`${f.name || f.field}\` | ${f.type || f.constraint || 'Attribute'} |`);
            } else {
              dbLines.push(`| \`${f}\` | Column Attribute |`);
            }
          });
        }
      }
    }

    if (dbData.relationships && Array.isArray(dbData.relationships)) {
      dbLines.push('\n#### 🔗 Entity Relationships & Multiplicities');
      dbData.relationships.forEach(r => dbLines.push(`- ${r}`));
    }

    if (dbLines.length > 0) {
      parts.push(`### 🗄️ Database Architecture & Data Model (Step 4)\n${dbLines.join('\n')}`);
    }
  }

  // 8. Step 5 / highLevelDesignAndServices: Architecture & Request Flows
  const hldData = ex.step5_systemArchitectureAndFlow || ex.highLevelDesignAndServices;
  if (hldData) {
    const hldLines: string[] = [];

    // Components
    const components = hldData.components || hldData.architectureComponents;
    if (components && Array.isArray(components)) {
      hldLines.push('#### 🧩 Architecture Components');
      components.forEach(c => hldLines.push(`- ${c}`));
    }

    // Microservices
    const services = hldData.microservices || hldData.microservicesBreakdown;
    if (services && Array.isArray(services)) {
      hldLines.push('\n#### 🛠️ Microservices Responsibilities');
      hldLines.push('| Service Name | Core Domain Responsibility |');
      hldLines.push('| :--- | :--- |');
      services.forEach(m => {
        hldLines.push(`| **${m.name}** | ${m.responsibility} |`);
      });
    }

    // Write Flow
    if (hldData.writeFlow && Array.isArray(hldData.writeFlow)) {
      hldLines.push('\n#### 📝 End-to-End Write Workflow (Step-by-Step)');
      hldData.writeFlow.forEach(step => hldLines.push(`${/^\d+\./.test(step.trim()) ? step : '- ' + step}`));
    }

    // Read Flow
    if (hldData.readFlow && Array.isArray(hldData.readFlow)) {
      hldLines.push('\n#### 📖 End-to-End Read / Retrieval Workflow (Step-by-Step)');
      hldData.readFlow.forEach(step => hldLines.push(`${/^\d+\./.test(step.trim()) ? step : '- ' + step}`));
    }

    if (hldLines.length > 0) {
      parts.push(`### 🏗️ High-Level System Architecture & Workflow (Step 5)\n${hldLines.join('\n')}`);
    }
  }

  // 9. Deep Dives (completeDetailedDesignDeepDive)
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
      parts.push(`### 🔬 Deep Dive Technical Solutions & Concurrency\n${deepLines.join('\n')}`);
    }
  }

  // 10. Step 7: Advanced Operational Concerns & Monitoring
  if (ex.step7_advancedOperationalConcerns) {
    const ops = ex.step7_advancedOperationalConcerns;
    const opsLines: string[] = [];

    for (const [k, v] of Object.entries(ops)) {
      if (k === 'image' || k === 'diagrams' || (typeof v === 'object' && v && ('image link' in v || 'zookeeper_img' in v))) {
        continue;
      }
      opsLines.push(`#### 🛡️ ${formatKeyLabel(k)}`);
      if (typeof v === 'object' && v !== null) {
        for (const [subK, subV] of Object.entries(v)) {
          opsLines.push(`- **${formatKeyLabel(subK)}:** ${subV}`);
        }
      } else {
        opsLines.push(String(v));
      }
      opsLines.push('');
    }

    if (opsLines.length > 0) {
      parts.push(`### 🛡️ Operational Concerns, Security & Resiliency (Step 7)\n${opsLines.join('\n')}`);
    }
  }

  // 11. REST API Specifications (apiDesign)
  if (ex.apiDesign && Array.isArray(ex.apiDesign) && ex.apiDesign.length > 0) {
    const apiLines: string[] = [];
    for (const api of ex.apiDesign) {
      const method = api.method || 'GET';
      const endpoint = api.endpoint || '';
      apiLines.push(`#### \`${method}\` ${endpoint}`);
      if (api.description) {
        apiLines.push(`*${api.description}*`);
      }
      if (api.queryParams) {
        apiLines.push(`- **Query Parameters:** \`${JSON.stringify(api.queryParams)}\``);
      }
      if (api.requestPayload) {
        apiLines.push(`- **Request Body:** \`${JSON.stringify(api.requestPayload)}\``);
      }
      if (api.response200) {
        apiLines.push(`- **Response (200 OK):** \`${JSON.stringify(api.response200)}\``);
      }
      if (api.response201) {
        apiLines.push(`- **Response (201 Created):** \`${JSON.stringify(api.response201)}\``);
      }
      apiLines.push('');
    }
    parts.push(`### 🌐 REST API Endpoints & Interfaces\n${apiLines.join('\n')}`);
  }

  // 12. Diagrams & Architecture Visuals
  const allImages: Array<{ caption: string; url: string }> = [];
  if (ex.diagrams && typeof ex.diagrams === 'object') {
    Object.entries(ex.diagrams).forEach(([caption, url]) => {
      if (typeof url === 'string' && url.startsWith('http')) {
        allImages.push({ caption: formatKeyLabel(caption), url });
      }
    });
  }
  if (ex.image && typeof ex.image === 'string' && ex.image.startsWith('http')) {
    allImages.push({ caption: 'System Architecture Diagram', url: ex.image });
  }
  if (ex.step7_advancedOperationalConcerns) {
    for (const val of Object.values(ex.step7_advancedOperationalConcerns)) {
      if (typeof val === 'object' && val !== null) {
        for (const [imgKey, imgUrl] of Object.entries(val)) {
          if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
            allImages.push({ caption: formatKeyLabel(imgKey), url: imgUrl });
          }
        }
      }
    }
  }

  if (allImages.length > 0) {
    const imgLines = allImages.map(img => `![${img.caption}](${img.url})`);
    parts.push(`### 🖼️ Architecture Visuals & System Diagrams\n${imgLines.join('\n\n')}`);
  }

  return parts.join('\n\n');
}

// Extract company tags intelligently
function extractCompaniesFromTitle(title: string): string[] {
  const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Uber', 'Spotify', 'Stripe', 'Airbnb', 'Twitter', 'Slack', 'Microsoft', 'DoorDash', 'PayPal', 'Tinder', 'Dropbox', 'Reddit', 'Salesforce', 'HubSpot', 'DocuSign', 'Agoda', 'Razorpay', 'Disney', 'Hotstar', 'Pinterest', 'Expedia', 'Trip', 'Coinbase', 'MetaMask', 'Bumble', 'Hinge', 'Pramp', 'Interviewing.io', 'Unsplash', 'Swiggy', 'WeChat', 'Sina Weibo', 'Vimeo', 'YouTube', 'Venmo', 'Cash App'];
  const matched = companies.filter(c => title.toLowerCase().includes(c.toLowerCase()));
  return matched.length > 0 ? matched : ['FAANG / Top Tech'];
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
    if (ex.step1_requirements?.functionalRequirements) {
      ex.step1_requirements.functionalRequirements.slice(0, 3).forEach(f => {
        keyConcepts.push(f.split(':')[0]);
      });
    }
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
    const codeSource = ex.codeImplementations || ex.step6_codeImplementations;
    if (codeSource && typeof codeSource === 'object') {
      for (const [implName, code] of Object.entries(codeSource)) {
        if (typeof code === 'string') {
          let language: CodeTemplate['language'] = 'python';
          const lower = implName.toLowerCase();
          if (lower.includes('cpp') || lower.includes('c++')) language = 'cpp';
          else if (lower.includes('java')) language = 'java';
          else if (lower.includes('sql')) language = 'sql';
          else if (lower.includes('script') || lower.includes('node') || lower.includes('js')) language = 'javascript';
          else if (lower.includes('kazoo') || lower.includes('flask') || lower.includes('python')) language = 'python';

          codeTemplates.push({ language, code });
        }
      }
    }

    const detailedContent = buildExampleMarkdown(ex);
    const summary = ex.overview?.definition || ex.overview?.coreChallenge || ex.overview?.coreMission || `Comprehensive end-to-end architectural breakdown, scale calculations, microservices, and design patterns for ${cleanTitle}.`;

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

const parsedExamples: RawExample[] = (Array.isArray(examplesData) ? examplesData : [examplesData]) as RawExample[];
export const systemDesignExampleTopics: TopicItem[] = transformExamplesToTopics(parsedExamples);
