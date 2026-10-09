/**
 * Microsoft Azure Loader
 * 
 * Reads the raw azure.json (concatenated JSON objects) and transforms them into
 * TopicItem[] format compatible with the AlgoVault / TopicDetailModal system.
 */

import { TopicItem, Difficulty } from '../types';
import azureData from './json/azure.json';

// Module metadata mapping
export interface AzureModuleMeta {
  id: string;
  key: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  badge: string;
  gradient: string;
  borderColor: string;
  badgeColor: string;
  iconBg: string;
  accentColor: string;
  hoverGlow: string;
  topicCount: number;
}

const MODULE_CONFIG: Record<string, {
  title: string;
  category: string;
  subtitle: string;
  description: string;
  badge: string;
  gradient: string;
  borderColor: string;
  badgeColor: string;
  iconBg: string;
  accentColor: string;
  hoverGlow: string;
  defaultDifficulty: Difficulty;
}> = {
  azure_foundation_deep_dive: {
    title: 'Cloud Foundation & Hierarchy',
    category: '1. Foundation & Governance',
    subtitle: 'Cloud Models, Hierarchy & Cost Control',
    description: 'Shared responsibility models (IaaS/PaaS/SaaS), 5-tier Azure hierarchy, availability zones, region pairs, budgets and cost governance.',
    badge: 'FOUNDATION',
    gradient: 'from-sky-500/10 via-blue-500/5 to-indigo-500/10',
    borderColor: 'border-sky-200/60',
    badgeColor: 'bg-sky-100 text-sky-700',
    iconBg: 'bg-sky-50 border-sky-200',
    accentColor: 'text-sky-600',
    hoverGlow: 'hover:shadow-sky-200/40',
    defaultDifficulty: 'Easy',
  },
  azure_compute_deep_dive: {
    title: 'Compute & Serverless',
    category: '2. Compute & Serverless',
    subtitle: 'Functions, App Service & Containers',
    description: 'Event-driven Azure Functions, triggers & bindings, cold start mitigation, Durable Functions, App Service scaling, ACR & Container Apps.',
    badge: 'COMPUTE',
    gradient: 'from-blue-500/10 via-cyan-500/5 to-teal-500/10',
    borderColor: 'border-blue-200/60',
    badgeColor: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-50 border-blue-200',
    accentColor: 'text-blue-600',
    hoverGlow: 'hover:shadow-blue-200/40',
    defaultDifficulty: 'Medium',
  },
  azure_storage_deep_dive: {
    title: 'Storage & Data Lake',
    category: '3. Storage & Data Lake',
    subtitle: 'Blob Tiers, SAS & Hybrid Shares',
    description: 'Hot/Cool/Archive access tiers, SAS tokens for secure browser uploads, lifecycle management, Queue Storage vs Service Bus, Table & File shares.',
    badge: 'STORAGE',
    gradient: 'from-cyan-500/10 via-sky-500/5 to-indigo-500/10',
    borderColor: 'border-cyan-200/60',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    iconBg: 'bg-cyan-50 border-cyan-200',
    accentColor: 'text-cyan-600',
    hoverGlow: 'hover:shadow-cyan-200/40',
    defaultDifficulty: 'Medium',
  },
  azure_messaging_and_events: {
    title: 'Messaging & Event Streaming',
    category: '4. Messaging & Event Streaming',
    subtitle: 'Service Bus, Event Grid & Event Hubs',
    description: 'Enterprise message broker, Peek-Lock, FIFO sessions, dead-lettering, duplicate detection, discrete event routing vs high-throughput streaming.',
    badge: 'MESSAGING',
    gradient: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10',
    borderColor: 'border-amber-200/60',
    badgeColor: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-50 border-amber-200',
    accentColor: 'text-amber-600',
    hoverGlow: 'hover:shadow-amber-200/40',
    defaultDifficulty: 'Hard',
  },
  azure_databases_and_caching: {
    title: 'Databases & In-Memory Caching',
    category: '5. Databases & Caching',
    subtitle: 'Cosmos DB, Azure SQL & Redis Cache',
    description: 'Cosmos DB multi-model NoSQL, 5 consistency levels, Request Units (RU/s), Azure SQL managed instances & Private Link, Redis cache-aside & write-through.',
    badge: 'DATA',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-green-500/10',
    borderColor: 'border-emerald-200/60',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-50 border-emerald-200',
    accentColor: 'text-emerald-600',
    hoverGlow: 'hover:shadow-emerald-200/40',
    defaultDifficulty: 'Medium',
  },
  azure_security_identity_and_networking: {
    title: 'Security, Identity & Networking',
    category: '6. Security, Identity & Networking',
    subtitle: 'Entra ID, Managed Identity, Vault & VNet',
    description: 'Microsoft Entra ID, passwordless Managed Identities, Azure Key Vault, RBAC scopes, OIDC/OAuth2/JWT, VNets, Subnets, NSGs & Private Endpoints.',
    badge: 'SECURITY',
    gradient: 'from-rose-500/10 via-pink-500/5 to-red-500/10',
    borderColor: 'border-rose-200/60',
    badgeColor: 'bg-rose-100 text-rose-700',
    iconBg: 'bg-rose-50 border-rose-200',
    accentColor: 'text-rose-600',
    hoverGlow: 'hover:shadow-rose-200/40',
    defaultDifficulty: 'Hard',
  },
  azure_monitoring_devops_and_governance: {
    title: 'Monitoring, DevOps & IaC',
    category: '7. Monitoring, DevOps & IaC',
    subtitle: 'App Insights, KQL, CI/CD, Bicep & APIM',
    description: 'Log Analytics, KQL queries, Azure Monitor alerts, CI/CD pipelines with OIDC, Azure Bicep / ARM templates, and API Management policies.',
    badge: 'DEVOPS',
    gradient: 'from-purple-500/10 via-violet-500/5 to-fuchsia-500/10',
    borderColor: 'border-purple-200/60',
    badgeColor: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-50 border-purple-200',
    accentColor: 'text-purple-600',
    hoverGlow: 'hover:shadow-purple-200/40',
    defaultDifficulty: 'Medium',
  },
  azure_architecture_patterns_and_frameworks: {
    title: 'Enterprise Architecture & GenAI',
    category: '8. Architecture & GenAI',
    subtitle: 'EDA, CQRS, Saga, WAF & Azure OpenAI',
    description: 'Event-driven architectures, CQRS, Saga distributed transactions, circuit breakers, Well-Architected Framework 5 pillars, Azure OpenAI & AI Foundry.',
    badge: 'ENTERPRISE',
    gradient: 'from-indigo-500/10 via-blue-500/5 to-violet-500/10',
    borderColor: 'border-indigo-200/60',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-50 border-indigo-200',
    accentColor: 'text-indigo-600',
    hoverGlow: 'hover:shadow-indigo-200/40',
    defaultDifficulty: 'Hard',
  },
};

const DEFAULT_COMPANY_TAGS = [
  'Microsoft',
  'Accenture',
  'Deloitte',
  'TCS',
  'Infosys',
  'Wipro',
  'Cognizant',
  'Capgemini',
  'Amazon',
  'Google'
];

// Helper: Format snake_case / camelCase to Title Case
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

// Deep JSON → Markdown string converter
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
  const headingPrefix = '#'.repeat(Math.min(depth + 3, 5)); // ### at depth 0, #### at depth 1, etc.

  for (const [key, value] of Object.entries(obj)) {
    if (['id', 'topicId'].includes(key)) continue;

    const label = formatKey(key);

    if (typeof value === 'string') {
      if (value.length > 80 || value.includes('\n')) {
        lines.push(`**${label}:**\n${value}`);
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

// Extract concise bullet points for keyConcepts
function extractKeyConcepts(topicObj: any): string[] {
  const concepts: string[] = [];

  const visit = (item: any) => {
    if (!item || typeof item !== 'object') return;

    if (item.name && typeof item.name === 'string') concepts.push(item.name);
    if (item.term && typeof item.term === 'string') concepts.push(item.term);
    if (item.feature && typeof item.feature === 'string') concepts.push(item.feature);
    if (item.concept && typeof item.concept === 'string') concepts.push(item.concept);
    if (item.pattern && typeof item.pattern === 'string') concepts.push(item.pattern);
    if (item.tool_name && typeof item.tool_name === 'string') concepts.push(item.tool_name);
    if (item.trigger_type && typeof item.trigger_type === 'string') concepts.push(item.trigger_type);
    if (item.plan && typeof item.plan === 'string') concepts.push(item.plan);
    if (item.component && typeof item.component === 'string') concepts.push(item.component);
    if (item.tier && typeof item.tier === 'string') concepts.push(item.tier);
    if (item.protocol && typeof item.protocol === 'string') concepts.push(item.protocol);
    if (item.capability && typeof item.capability === 'string') concepts.push(item.capability);
    if (item.pillar && typeof item.pillar === 'string') concepts.push(item.pillar);
    if (item.level_1 && typeof item.level_1 === 'string') concepts.push(item.level_1);
    if (item.level_2 && typeof item.level_2 === 'string') concepts.push(item.level_2);
    if (item.level_3 && typeof item.level_3 === 'string') concepts.push(item.level_3);
    if (item.level_4 && typeof item.level_4 === 'string') concepts.push(item.level_4);
    if (item.level_5 && typeof item.level_5 === 'string') concepts.push(item.level_5);

    for (const val of Object.values(item)) {
      if (Array.isArray(val)) {
        val.forEach(visit);
      } else if (typeof val === 'object') {
        visit(val);
      }
    }
  };

  visit(topicObj);

  const unique = Array.from(new Set(concepts.filter(Boolean)));
  return unique.slice(0, 7);
}

// Build rich structured markdown content for a topic
function buildDetailedContent(topicTitle: string, topicObj: any, category: string): string {
  const parts: string[] = [];

  parts.push(`# ${topicTitle}`);
  parts.push(`*Azure Cloud Architectural Deep Dive | ${category}*`);
  parts.push('---');

  if (topicObj.simple_explanation) {
    parts.push(`### 💡 Quick Mental Model / Summary\n${topicObj.simple_explanation}`);
  }

  if (topicObj.overview) {
    parts.push(`### 📌 Overview & Architecture Role\n${topicObj.overview}`);
  }

  // Convert the rest of the object
  const skipKeys = new Set(['topic', 'overview', 'simple_explanation']);
  for (const [key, value] of Object.entries(topicObj)) {
    if (skipKeys.has(key)) continue;

    const sectionTitle = formatKey(key);

    if (typeof value === 'object' && value !== null) {
      parts.push(`## ${sectionTitle}\n${jsonToMarkdown(value, 0)}`);
    } else if (typeof value === 'string') {
      parts.push(`### ${sectionTitle}\n${value}`);
    }
  }

  return parts.join('\n\n');
}



// Unpack nested topics recursively into TopicItems
function extractTopicsFromModule(moduleKey: string, moduleContent: Record<string, any>): TopicItem[] {
  const cfg = MODULE_CONFIG[moduleKey] || {
    title: formatKey(moduleKey),
    category: formatKey(moduleKey),
    defaultDifficulty: 'Medium' as Difficulty,
  };

  const items: TopicItem[] = [];

  // Helper to process a leaf topic or sub-group
  const processEntry = (key: string, value: any, prefix = '') => {
    if (!value || typeof value !== 'object') return;

    // Check if it looks like a leaf topic (has 'topic', 'overview', 'simple_explanation', or direct features)
    const isLeaf = (
      typeof value.topic === 'string' ||
      typeof value.overview === 'string' ||
      typeof value.simple_explanation === 'string' ||
      Array.isArray(value.types) ||
      Array.isArray(value.levels) ||
      Array.isArray(value.concepts) ||
      Array.isArray(value.tools) ||
      Array.isArray(value.patterns) ||
      Array.isArray(value.services)
    );

    if (isLeaf) {
      const topicTitle = value.topic || formatKey(key);
      const summary = value.overview || value.simple_explanation || `${topicTitle} in Microsoft Azure ecosystem.`;
      const keyConcepts = extractKeyConcepts(value);
      const detailedContent = buildDetailedContent(topicTitle, value, cfg.category);

      items.push({
        id: `azure-${moduleKey}-${prefix ? prefix + '-' : ''}${key}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title: topicTitle,
        domain: 'azure',
        category: cfg.category,
        difficulty: cfg.defaultDifficulty,
        companyTags: DEFAULT_COMPANY_TAGS,
        importanceRating: 5,
        summary,
        keyConcepts: keyConcepts.length > 0 ? keyConcepts : [topicTitle, 'Microsoft Azure', 'Cloud Architecture'],
        detailedContent,
      });
    } else {
      // It's a sub-group (e.g. identity_and_access_management, networking_fundamentals, monitoring_and_observability)
      for (const [subKey, subVal] of Object.entries(value)) {
        processEntry(subKey, subVal, prefix ? `${prefix}-${key}` : key);
      }
    }
  };

  for (const [key, value] of Object.entries(moduleContent)) {
    processEntry(key, value);
  }

  return items;
}

// Main execution
const rawParsedObjects: Record<string, any>[] = Array.isArray(azureData) ? (azureData as Record<string, any>[]) : [azureData as Record<string, any>];

const allAzureTopicsList: TopicItem[] = [];
const azureModulesMap: Map<string, AzureModuleMeta> = new Map();

for (const obj of rawParsedObjects) {
  for (const [moduleKey, moduleContent] of Object.entries(obj)) {
    const topics = extractTopicsFromModule(moduleKey, moduleContent);
    allAzureTopicsList.push(...topics);

    const cfg = MODULE_CONFIG[moduleKey] || {
      title: formatKey(moduleKey),
      category: formatKey(moduleKey),
      subtitle: 'Azure Cloud Module',
      description: 'Comprehensive Microsoft Azure Architecture Module',
      badge: 'AZURE',
      gradient: 'from-blue-500/10 via-sky-500/5 to-indigo-500/10',
      borderColor: 'border-blue-200/60',
      badgeColor: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-50 border-blue-200',
      accentColor: 'text-blue-600',
      hoverGlow: 'hover:shadow-blue-200/40',
      defaultDifficulty: 'Medium' as Difficulty,
    };

    azureModulesMap.set(moduleKey, {
      id: moduleKey,
      key: moduleKey,
      title: cfg.title,
      category: cfg.category,
      subtitle: cfg.subtitle,
      description: cfg.description,
      badge: cfg.badge,
      gradient: cfg.gradient,
      borderColor: cfg.borderColor,
      badgeColor: cfg.badgeColor,
      iconBg: cfg.iconBg,
      accentColor: cfg.accentColor,
      hoverGlow: cfg.hoverGlow,
      topicCount: topics.length,
    });
  }
}

export const azureTopics: TopicItem[] = allAzureTopicsList;
export const azureModules: AzureModuleMeta[] = Array.from(azureModulesMap.values());
