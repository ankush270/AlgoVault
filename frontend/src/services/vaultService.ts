import { getApiBaseUrl } from './api';
import { allTopics } from '../data/allData';
import { TopicItem } from '../types';

export interface VaultDomainStat {
  domain: string;
  topicCount: number;
  categories: string[];
}

export interface VaultProblem {
  _id?: string;
  platform: 'leetcode' | 'striver' | 'gfg' | 'codeforces' | 'other';
  problemNumber?: string;
  title: string;
  url: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status: 'todo' | 'solved' | 'review';
}

export interface VaultMedia {
  _id?: string;
  type: 'image' | 'video' | 'pdf';
  title?: string;
  url: string;
}

export interface VaultSubtopicSummary {
  _id: string;
  title: string;
  revisionStatus: 'weak' | 'moderate' | 'mastered';
  lastRevisedAt: string;
  problemsCount: number;
  hasMedia: boolean;
  order: number;
}

export interface VaultTopic {
  _id: string;
  domain: string;
  category: string;
  title: string;
  slug?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  importanceRating: number;
  tags: string[];
  order: number;
  isSystem: boolean;
  subtopics: VaultSubtopicSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface VaultSubtopicNote {
  _id: string;
  topicId: string;
  title: string;
  contentMarkdown: string;
  problems: VaultProblem[];
  media: VaultMedia[];
  revisionStatus: 'weak' | 'moderate' | 'mastered';
  lastRevisedAt: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('techswitch_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Multi-tier URL candidates: First primary configured API, then localhost:5000 fallback
const getCandidateUrls = (endpoint: string): string[] => {
  const primary = `${getApiBaseUrl()}${endpoint}`;
  const local = `http://localhost:5000/api${endpoint}`;
  if (primary.includes('localhost:5000') || primary.includes('127.0.0.1:5000')) {
    return [primary];
  }
  return [primary, local];
};

async function fetchVaultApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const candidates = getCandidateUrls(endpoint);
  let lastError: any = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, options);
      // If we got a 404 from Render (meaning endpoint not yet deployed remotely), try local candidate
      if (!res.ok && res.status === 404 && candidates.length > 1 && url !== candidates[candidates.length - 1]) {
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Network error: Unable to reach Vault API');
}

// Built-in Graph Notes Seed fallback
const GRAPH_TOPIC_FALLBACK: VaultTopic = {
  _id: 'graph-topic-root',
  domain: 'dsa',
  category: 'Graphs',
  title: 'Graph: Basics & Representations',
  slug: 'dsa-graph-basics-representations',
  difficulty: 'Medium',
  importanceRating: 5,
  tags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
  order: 0,
  isSystem: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  subtopics: [
    {
      _id: 'graph-sub-1',
      title: '1. Intuition, Basic Terms & Handshaking Lemma',
      revisionStatus: 'mastered',
      lastRevisedAt: new Date().toISOString(),
      problemsCount: 1,
      hasMedia: true,
      order: 0
    },
    {
      _id: 'graph-sub-2',
      title: '2. Representations (Matrix vs Adj List vs Edge List) & Constraints',
      revisionStatus: 'moderate',
      lastRevisedAt: new Date().toISOString(),
      problemsCount: 1,
      hasMedia: true,
      order: 1
    },
    {
      _id: 'graph-sub-3',
      title: '3. Trees, DAGs (Topological Sort) & Bipartite Graphs',
      revisionStatus: 'weak',
      lastRevisedAt: new Date().toISOString(),
      problemsCount: 2,
      hasMedia: false,
      order: 2
    }
  ]
};

const GRAPH_SUBTOPICS_MAP: Record<string, VaultSubtopicNote> = {
  'graph-sub-1': {
    _id: 'graph-sub-1',
    topicId: 'graph-topic-root',
    title: '1. Intuition, Basic Terms & Handshaking Lemma',
    contentMarkdown: `> [!NOTE]\n> **Intuition:** Graph ek aisa structure hai jisme cheezein (vertices) aur unke beech ke connections (edges) hote hain.\n> - **FB/Insta:** Har insaan ek vertex, dosti ek edge.\n> - **Google Maps:** Har shehar/chauraha ek vertex, road ek edge.\n> - **HFT/Arbitrage:** Currency exchange rates (USD → EUR → INR) me arbitrage dhundhna ek graph problem hai.\n\n---\n\n### 🔑 Basic Terms & Properties\n\n| Term | Definition & Rule | Example |\n| :--- | :--- | :--- |\n| **Vertex (Node)** | Graph ka ek point | A, B, C ya 0, 1, 2 |\n| **Edge** | Do vertices ko jodne wali line $(u, v)$ | $A - B$ (undirected) ya $A \\rightarrow B$ (directed) |\n| **Degree (Undirected)** | Ek vertex se kitni edges judi hain | $\\text{deg}(A) = 2$ |\n| **In-Degree (Directed)** | Kitni edges is vertex me aa rahi hain | Arrows pointing in |\n| **Out-Degree (Directed)** | Kitni edges is vertex se nikal rahi hain | Arrows pointing out |\n\n> [!TIP]\n> **Handshaking Lemma (Interview Favorite):**\n> Undirected graph me sum of all degrees $= 2 \\times |E|$\n> Kyunki har edge do vertices ki degree me count hoti hai!\n\n---\n\n### 🔄 Paths & Cycles\n- **Path Length:** Edges ki sankhya (vertices ki nahi).\n- **Simple Path:** Koi vertex repeat nahi hota.\n- **Shortest Path:** Sabse kam edges wali path (BFS yahi nikalta hai).\n- **Cycle:** Ek path jo usi vertex pe wapas aa jaye jahan se start hui thi.\n\n### 📐 Maximum Edges Formulas (Constraints Trick)\n- **Undirected Graph (no self-loops):** $\\frac{V(V-1)}{2}$\n- **Directed Graph (no self-loops):** $V(V-1)$`,
    problems: [
      {
        platform: 'leetcode',
        problemNumber: '1971',
        title: 'Find if Path Exists in Graph',
        url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/',
        difficulty: 'Easy',
        status: 'solved'
      }
    ],
    media: [
      {
        type: 'video',
        title: 'Striver Graph Series: Introduction to Graphs & Terms',
        url: 'https://www.youtube.com/watch?v=M3_pLsDdeuU'
      }
    ],
    revisionStatus: 'mastered',
    lastRevisedAt: new Date().toISOString(),
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'graph-sub-2': {
    _id: 'graph-sub-2',
    topicId: 'graph-topic-root',
    title: '2. Representations (Matrix vs Adj List vs Edge List) & Constraints',
    contentMarkdown: `### 📊 3 Primary Ways to Store a Graph\n\n| Representation | Space Complexity | Check Edge $(u, v)$ | Find Neighbours of $u$ | Best Used When |\n| :--- | :--- | :--- | :--- | :--- |\n| **Adjacency Matrix** | $O(V^2)$ | $O(1)$ | $O(V)$ | Dense graph, $V \\le 500$, Floyd-Warshall |\n| **Adjacency List** | $O(V + E)$ | $O(\\text{deg}(u))$ | $O(\\text{deg}(u))$ | Sparse graph, BFS/DFS traversal |\n| **Edge List** | $O(E)$ | $O(E)$ | $O(E)$ | Kruskal's MST (sorting edges), Bellman-Ford |\n\n---\n\n### 💻 C++ Implementation Templates\n\n#### 1. Adjacency List (Industry Standard)\n\`\`\`cpp\n// C++ Adjacency List for V vertices\n#include <vector>\nusing namespace std;\n\nint V = 5;\nvector<vector<int>> adj(V);\n\n// Undirected edge between u and v\nvoid addEdge(int u, int v) {\n    adj[u].push_back(v);\n    adj[v].push_back(u);\n}\n\`\`\`\n\n#### 2. Edge List (Used in Kruskal's MST & Bellman-Ford)\n\`\`\`cpp\nstruct Edge {\n    int u, v, weight;\n};\n\nvector<Edge> edges;\nedges.push_back({0, 1, 5});\nedges.push_back({0, 2, 3});\n\`\`\`\n\n---\n\n> [!WARNING]\n> ### 🎯 Problem Constraints Dekh Ke Representation Chuno:\n> - $V \\le 10^5, E \\le 2 \\times 10^5 \\implies$ **Adjacency List** (Matrix $10^{10}$ bohot bada hoga, Memory Limit Exceeded dega!).\n> - $V \\le 400-500$, "All pairs shortest path" $\\implies$ **Matrix + Floyd-Warshall**.\n> - $V \\le 10^3 \\implies$ Dono chalenge.`,
    problems: [
      {
        platform: 'leetcode',
        problemNumber: '133',
        title: 'Clone Graph',
        url: 'https://leetcode.com/problems/clone-graph/',
        difficulty: 'Medium',
        status: 'todo'
      }
    ],
    media: [
      {
        type: 'video',
        title: 'Graph Representation in C++ / Java (Adjacency List)',
        url: 'https://www.youtube.com/watch?v=3oI-34aPMWM'
      }
    ],
    revisionStatus: 'moderate',
    lastRevisedAt: new Date().toISOString(),
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'graph-sub-3': {
    _id: 'graph-sub-3',
    topicId: 'graph-topic-root',
    title: '3. Trees, DAGs (Topological Sort) & Bipartite Graphs',
    contentMarkdown: `### 🌳 Tree Definition (2 Rules)\nGraph tree kab hota hai:\n1. **Connected ho** (koi bhi node kisi bhi node tak pahunch sake).\n2. **Cycle na ho** (no closed loops).\n3. Formula: **Edges = Nodes - 1** ($E = V - 1$).\n\n---\n\n### ⚡ DAG (Directed Acyclic Graph)\n- **Topological Order:** Ek aisa linear ordering jisme har directed edge $u \\rightarrow v$ ke liye, vertex $u$ vertex $v$ se pehle aaye.\n- **Source Node:** Kam se kam ek node aisa hoga jiska In-Degree = 0.\n- **Pattern Keywords in Interview:** *"prerequisites"*, *"dependencies"*, *"build order"*, *"compile order"*, *"course schedule"*.\n\n---\n\n### 🎨 Bipartite Graph & 2-Color Rule\n> [!TIP]\n> **Golden Rule:** Graph bipartite hai $\\iff$ usme koi **ODD LENGTH KA CYCLE** nahi hai!\n> - **Triangle (3 nodes, odd cycle):** 2 colors alternate nahi ho sakte $\\implies$ NOT Bipartite!\n> - **Square (4 nodes, even cycle):** Colors: Red, Blue, Red, Blue alternate $\\implies$ Bipartite!\n> - **Trees:** Tree me cycle hi nahi hota, isliye **HAR TREE BIPARTITE HOTA HAI**.`,
    problems: [
      {
        platform: 'leetcode',
        problemNumber: '207',
        title: 'Course Schedule (Topological Sort / Cycle Detection)',
        url: 'https://leetcode.com/problems/course-schedule/',
        difficulty: 'Medium',
        status: 'review'
      },
      {
        platform: 'leetcode',
        problemNumber: '785',
        title: 'Is Graph Bipartite?',
        url: 'https://leetcode.com/problems/is-graph-bipartite/',
        difficulty: 'Medium',
        status: 'todo'
      }
    ],
    media: [],
    revisionStatus: 'weak',
    lastRevisedAt: new Date().toISOString(),
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

const buildTopicFromItem = (item: TopicItem, idx: number): VaultTopic => {
  return {
    _id: `bundled-${item.id}`,
    domain: item.domain,
    category: item.category || 'General',
    title: item.title,
    slug: item.id,
    difficulty: item.difficulty || 'Medium',
    importanceRating: item.importanceRating || 3,
    tags: item.companyTags || [],
    order: idx,
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtopics: [
      {
        _id: `sub-bundled-${item.id}`,
        title: 'Core Concepts & Notes',
        revisionStatus: 'moderate',
        lastRevisedAt: new Date().toISOString(),
        problemsCount: (item.interviewQuestions || []).length,
        hasMedia: false,
        order: 0
      }
    ]
  };
};

const getOfflineTopicsFallback = (domain: string): VaultTopic[] => {
  // Get any user custom created topics from localStorage
  let customTopics: VaultTopic[] = [];
  try {
    const rawCustom = localStorage.getItem(`vault_custom_topics_${domain}`);
    if (rawCustom) customTopics = JSON.parse(rawCustom);
  } catch (_) {}

  const domainTopics = allTopics.filter(t => t.domain === domain);
  const bundledTopics = domainTopics.map(buildTopicFromItem);

  const result: VaultTopic[] = [];
  if (domain === 'dsa') {
    result.push(GRAPH_TOPIC_FALLBACK);
  }
  result.push(...customTopics, ...bundledTopics);
  return result;
};

export const vaultService = {
  async getDomains(): Promise<VaultDomainStat[]> {
    try {
      const res = await fetchVaultApi('/vault/domains');
      if (res.ok) {
        const data = await res.json();
        if (data.domains && Array.isArray(data.domains)) return data.domains;
      }
    } catch (_) {}

    return [
      { domain: 'dsa', topicCount: 20, categories: ['Graphs', 'Dynamic Programming', 'Trees', 'Bit Manipulation'] },
      { domain: 'system-design', topicCount: 15, categories: ['HLD Architecture', 'LLD Design Patterns', 'Distributed Caching'] },
      { domain: 'os', topicCount: 25, categories: ['Memory Management', 'Process Scheduling', 'Concurrency & Locks'] },
      { domain: 'dbms-sql', topicCount: 20, categories: ['Indexing', 'Normalization', 'ACID Transactions'] },
      { domain: 'computer-networks', topicCount: 18, categories: ['HTTP/2 vs HTTP/3', 'TCP/IP', 'DNS Resolution'] },
      { domain: 'oops', topicCount: 12, categories: ['SOLID Principles', 'Inheritance', 'Polymorphism'] },
      { domain: 'javascript', topicCount: 16, categories: ['V8 Engine', 'Event Loop', 'Closures & Scope'] },
      { domain: 'react', topicCount: 14, categories: ['Fiber Architecture', 'Hooks Deep Dive', 'Reconciliation'] },
      { domain: 'nodejs', topicCount: 15, categories: ['Libuv Event Loop', 'Streams & Buffers', 'Microservices'] },
      { domain: 'azure', topicCount: 10, categories: ['Cloud Compute', 'Serverless', 'Networking'] },
      { domain: 'genai-ml', topicCount: 8, categories: ['RAG Pipeline Flow', 'Embeddings', 'Vector DBs'] }
    ];
  },

  async getTopics(params?: { domain?: string; category?: string; search?: string }): Promise<VaultTopic[]> {
    const query = new URLSearchParams();
    if (params?.domain && params.domain !== 'all') query.append('domain', params.domain);
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);

    try {
      const res = await fetchVaultApi(`/vault/topics?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.topics && Array.isArray(data.topics) && data.topics.length > 0) {
          return data.topics;
        }
      }
    } catch (_) {}

    // Robust Offline Fallback
    const domain = params?.domain && params.domain !== 'all' ? params.domain : 'dsa';
    return getOfflineTopicsFallback(domain);
  },

  async getSubtopics(topicId: string): Promise<VaultSubtopicNote[]> {
    try {
      const res = await fetchVaultApi(`/vault/topics/${topicId}/subtopics`);
      if (res.ok) {
        const data = await res.json();
        if (data.subtopics && Array.isArray(data.subtopics)) return data.subtopics;
      }
    } catch (_) {}

    if (topicId === 'graph-topic-root') {
      return Object.values(GRAPH_SUBTOPICS_MAP);
    }
    return [];
  },

  async getSubtopic(id: string): Promise<{ subtopic: VaultSubtopicNote; topic?: { domain: string; category: string; title: string } }> {
    try {
      const res = await fetchVaultApi(`/vault/subtopics/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.subtopic) return data;
      }
    } catch (_) {}

    // Check Graph Fallback
    if (GRAPH_SUBTOPICS_MAP[id]) {
      return {
        subtopic: GRAPH_SUBTOPICS_MAP[id],
        topic: { domain: 'dsa', category: 'Graphs', title: 'Graph: Basics & Representations' }
      };
    }

    // Check localStorage custom notes
    try {
      const savedNote = localStorage.getItem(`vault_note_${id}`);
      if (savedNote) {
        return JSON.parse(savedNote);
      }
    } catch (_) {}

    // Bundled fallback
    const rawId = id.replace(/^sub-bundled-/, '');
    const found = allTopics.find(t => t.id === rawId);
    if (found) {
      const note: VaultSubtopicNote = {
        _id: id,
        topicId: `bundled-${found.id}`,
        title: 'Core Concepts & Notes',
        contentMarkdown: found.detailedContent || `# ${found.title}\n\n${found.summary || ''}`,
        problems: (found.interviewQuestions || []).map(q => ({
          platform: 'other',
          title: q.question,
          url: '',
          status: 'todo'
        })),
        media: [],
        revisionStatus: 'moderate',
        lastRevisedAt: new Date().toISOString(),
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        subtopic: note,
        topic: { domain: found.domain, category: found.category || 'General', title: found.title }
      };
    }

    throw new Error('Subtopic note not found');
  },

  async createTopic(payload: {
    domain: string;
    category: string;
    title: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    importanceRating?: number;
    tags?: string[];
    initialSubtopicTitle?: string;
    contentMarkdown?: string;
  }): Promise<VaultTopic> {
    try {
      const res = await fetchVaultApi('/vault/topics', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.topic) return data.topic;
      }
    } catch (_) {}

    // Offline creation fallback
    const newTopicId = `custom-topic-${Date.now()}`;
    const newSubtopicId = `custom-sub-${Date.now()}`;
    const newTopic: VaultTopic = {
      _id: newTopicId,
      domain: payload.domain,
      category: payload.category,
      title: payload.title,
      difficulty: payload.difficulty || 'Medium',
      importanceRating: payload.importanceRating || 3,
      tags: payload.tags || [],
      order: 0,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtopics: [
        {
          _id: newSubtopicId,
          title: payload.initialSubtopicTitle || 'Overview & Notes',
          revisionStatus: 'moderate',
          lastRevisedAt: new Date().toISOString(),
          problemsCount: 0,
          hasMedia: false,
          order: 0
        }
      ]
    };

    const newSubtopic: VaultSubtopicNote = {
      _id: newSubtopicId,
      topicId: newTopicId,
      title: payload.initialSubtopicTitle || 'Overview & Notes',
      contentMarkdown: payload.contentMarkdown || `# ${payload.title}\n\nStart writing notes...`,
      problems: [],
      media: [],
      revisionStatus: 'moderate',
      lastRevisedAt: new Date().toISOString(),
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const rawCustom = localStorage.getItem(`vault_custom_topics_${payload.domain}`) || '[]';
      const parsed = JSON.parse(rawCustom);
      parsed.unshift(newTopic);
      localStorage.setItem(`vault_custom_topics_${payload.domain}`, JSON.stringify(parsed));
      localStorage.setItem(`vault_note_${newSubtopicId}`, JSON.stringify({ subtopic: newSubtopic, topic: newTopic }));
    } catch (_) {}

    return newTopic;
  },

  async updateTopic(id: string, payload: Partial<{
    domain: string;
    category: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    importanceRating: number;
    tags: string[];
    order: number;
  }>): Promise<VaultTopic> {
    try {
      const res = await fetchVaultApi(`/vault/topics/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.topic) return data.topic;
      }
    } catch (_) {}

    return { _id: id, ...payload } as any;
  },

  async deleteTopic(id: string): Promise<void> {
    try {
      await fetchVaultApi(`/vault/topics/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (_) {}
  },

  async createSubtopic(topicId: string, payload: {
    title: string;
    contentMarkdown?: string;
    problems?: VaultProblem[];
    media?: VaultMedia[];
    revisionStatus?: 'weak' | 'moderate' | 'mastered';
  }): Promise<VaultSubtopicNote> {
    try {
      const res = await fetchVaultApi(`/vault/topics/${topicId}/subtopics`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.subtopic) return data.subtopic;
      }
    } catch (_) {}

    const newSubtopicId = `custom-sub-${Date.now()}`;
    const newNote: VaultSubtopicNote = {
      _id: newSubtopicId,
      topicId,
      title: payload.title,
      contentMarkdown: payload.contentMarkdown || `# ${payload.title}\n\n`,
      problems: payload.problems || [],
      media: payload.media || [],
      revisionStatus: payload.revisionStatus || 'moderate',
      lastRevisedAt: new Date().toISOString(),
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`vault_note_${newSubtopicId}`, JSON.stringify({ subtopic: newNote }));
    } catch (_) {}

    return newNote;
  },

  async updateSubtopic(id: string, payload: Partial<{
    title: string;
    contentMarkdown: string;
    problems: VaultProblem[];
    media: VaultMedia[];
    revisionStatus: 'weak' | 'moderate' | 'mastered';
    order: number;
  }>): Promise<VaultSubtopicNote> {
    try {
      const res = await fetchVaultApi(`/vault/subtopics/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.subtopic) {
          // Also save to local cache
          localStorage.setItem(`vault_note_${id}`, JSON.stringify({ subtopic: data.subtopic }));
          return data.subtopic;
        }
      }
    } catch (_) {}

    // Fallback: update in localStorage
    try {
      const existing = localStorage.getItem(`vault_note_${id}`);
      const parsed = existing ? JSON.parse(existing) : { subtopic: { _id: id } };
      const updatedSubtopic = { ...parsed.subtopic, ...payload, lastRevisedAt: new Date().toISOString() };
      localStorage.setItem(`vault_note_${id}`, JSON.stringify({ ...parsed, subtopic: updatedSubtopic }));
      return updatedSubtopic;
    } catch (_) {}

    return { _id: id, ...payload } as any;
  },

  async updateRevisionStatus(id: string, revisionStatus: 'weak' | 'moderate' | 'mastered'): Promise<VaultSubtopicNote> {
    try {
      const res = await fetchVaultApi(`/vault/subtopics/${id}/revision`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ revisionStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.subtopic) return data.subtopic;
      }
    } catch (_) {}

    try {
      const existing = localStorage.getItem(`vault_note_${id}`);
      if (existing) {
        const parsed = JSON.parse(existing);
        parsed.subtopic.revisionStatus = revisionStatus;
        parsed.subtopic.lastRevisedAt = new Date().toISOString();
        localStorage.setItem(`vault_note_${id}`, JSON.stringify(parsed));
        return parsed.subtopic;
      }
    } catch (_) {}

    return { _id: id, revisionStatus, lastRevisedAt: new Date().toISOString() } as any;
  },

  async deleteSubtopic(id: string): Promise<void> {
    try {
      await fetchVaultApi(`/vault/subtopics/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (_) {}
  }
};
