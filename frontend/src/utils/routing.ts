import { DomainType, TopicItem } from '../types';
import { allTopics } from '../data/allData';

export const domainRoutes: Record<string, DomainType> = {
  '/os': 'os',
  '/oops': 'oops',
  '/object-oriented-programming': 'oops',
  '/dbms': 'dbms-sql',
  '/dbms-sql': 'dbms-sql',
  '/networks': 'computer-networks',
  '/computer-networks': 'computer-networks',
  '/dsa': 'dsa',
  '/system-design': 'system-design',
  '/javascript': 'javascript',
  '/js': 'javascript',
  '/react': 'react',
  '/nodejs': 'nodejs',
  '/node': 'nodejs',
  '/genai': 'genai-ml',
  '/genai-ml': 'genai-ml',
  '/azure-domain': 'azure',
};

export const tabRoutes: Record<string, string> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/home': 'dashboard',
  '/knowledge': 'knowledge',
  '/modules': 'knowledge',
  '/learn': 'knowledge',
  '/dsa-tricks': 'dsa-tricks',
  '/tricks': 'dsa-tricks',
  '/interview-experiences': 'interview-experiences',
  '/interviews': 'interview-experiences',
  '/striver-a2z': 'striver-a2z',
  '/striver': 'striver-a2z',
  '/dsa-sheet': 'striver-a2z',
  '/leetcode-explorer': 'leetcode-explorer',
  '/leetcode': 'leetcode-explorer',
  '/algorithms': 'algorithms',
  '/sql-sandbox': 'sql-sandbox',
  '/sql': 'sql-sandbox',
  '/flashcards': 'flashcards',
  '/revision': 'revision',
  '/planner': 'revision',
  '/analytics': 'analytics',
  '/stats': 'analytics',
  '/pdf-readiness': 'pdf-readiness',
  '/readiness': 'pdf-readiness',
  '/cheatsheets': 'pdf-readiness',
  '/notes': 'notes',
  '/vault': 'vault',
  '/study-vault': 'vault',
  '/jobs': 'jobs',
  '/live-arena': 'live-arena',
  '/arena': 'live-arena',
  '/live': 'live-arena',
  '/system-design-canvas': 'system-design-canvas',
  '/canvas': 'system-design-canvas',
  '/studio': 'system-design-canvas',
  '/system-design-hub': 'system-design-hub',
  '/hld-hub': 'system-design-hub',
  '/azure': 'azure-hub',
  '/azure-hub': 'azure-hub',
};

export interface ParsedRoute {
  tab: string;
  domain: DomainType | 'all';
  topic: TopicItem | null;
  isAuthModalOpen: boolean;
  authTab: 'login' | 'signup';
  isNotFound: boolean;
  notFoundPath: string;
}

export function parseCurrentRoute(
  customPath?: string,
  customSearch?: string
): ParsedRoute {
  const rawPath = customPath !== undefined
    ? customPath
    : (typeof window !== 'undefined' ? window.location.pathname : '/');
  const path = rawPath.toLowerCase().replace(/\/$/, '') || '/';

  const rawSearch = customSearch !== undefined
    ? customSearch
    : (typeof window !== 'undefined' ? window.location.search : '');
  const urlParams = new URLSearchParams(rawSearch);
  const topicQuery = urlParams.get('topic');

  let matchedTopic: TopicItem | null = null;
  if (topicQuery) {
    const qLower = topicQuery.toLowerCase().trim();
    matchedTopic = allTopics.find(
      (t) => t.id.toLowerCase() === qLower || t.id.toLowerCase() === decodeURIComponent(qLower)
    ) || null;
  }

  // 1. Auth routes
  if (path === '/login') {
    return {
      tab: 'dashboard',
      domain: 'all',
      topic: matchedTopic,
      isAuthModalOpen: true,
      authTab: 'login',
      isNotFound: false,
      notFoundPath: '',
    };
  }
  if (path === '/signup') {
    return {
      tab: 'dashboard',
      domain: 'all',
      topic: matchedTopic,
      isAuthModalOpen: true,
      authTab: 'signup',
      isNotFound: false,
      notFoundPath: '',
    };
  }

  // 2. Direct topic URL: /topic/:topicId
  if (path.startsWith('/topic/')) {
    const topicIdFromPath = path.replace('/topic/', '').trim();
    const foundTopic = allTopics.find(
      (t) => t.id.toLowerCase() === topicIdFromPath || t.id.toLowerCase() === decodeURIComponent(topicIdFromPath)
    );
    if (foundTopic) {
      return {
        tab: 'knowledge',
        domain: foundTopic.domain,
        topic: foundTopic,
        isAuthModalOpen: false,
        authTab: 'login',
        isNotFound: false,
        notFoundPath: '',
      };
    }
    // Topic ID was not found
    return {
      tab: '404',
      domain: 'all',
      topic: null,
      isAuthModalOpen: false,
      authTab: 'login',
      isNotFound: true,
      notFoundPath: rawPath,
    };
  }

  // 3. Domain routes (/os, /dbms, /dsa, /system-design, etc.)
  if (domainRoutes[path]) {
    return {
      tab: 'knowledge',
      domain: domainRoutes[path],
      topic: matchedTopic,
      isAuthModalOpen: false,
      authTab: 'login',
      isNotFound: false,
      notFoundPath: '',
    };
  }

  // 4. Tab routes (/, /live-arena, /system-design-canvas, etc.)
  if (tabRoutes[path]) {
    return {
      tab: tabRoutes[path],
      domain: 'all',
      topic: matchedTopic,
      isAuthModalOpen: false,
      authTab: 'login',
      isNotFound: false,
      notFoundPath: '',
    };
  }

  // 5. Unrecognized route -> 404
  return {
    tab: '404',
    domain: 'all',
    topic: null,
    isAuthModalOpen: false,
    authTab: 'login',
    isNotFound: true,
    notFoundPath: rawPath,
  };
}

export function getPathForState(
  tab: string,
  domain?: DomainType | 'all',
  topicId?: string
): string {
  let basePath = '/';
  if (tab === 'knowledge' && domain && domain !== 'all') {
    basePath = `/${domain}`;
  } else {
    switch (tab) {
      case 'dashboard': basePath = '/'; break;
      case 'knowledge': basePath = '/knowledge'; break;
      case 'dsa-tricks': basePath = '/tricks'; break;
      case 'interview-experiences': basePath = '/interview-experiences'; break;
      case 'striver-a2z': basePath = '/striver-a2z'; break;
      case 'leetcode-explorer': basePath = '/leetcode'; break;
      case 'algorithms': basePath = '/algorithms'; break;
      case 'sql-sandbox': basePath = '/sql-sandbox'; break;
      case 'flashcards': basePath = '/flashcards'; break;
      case 'revision': basePath = '/revision'; break;
      case 'analytics': basePath = '/analytics'; break;
      case 'pdf-readiness': basePath = '/pdf-readiness'; break;
      case 'notes': basePath = '/notes'; break;
      case 'vault': basePath = '/vault'; break;
      case 'jobs': basePath = '/jobs'; break;
      case 'live-arena': basePath = '/live-arena'; break;
      case 'system-design-canvas': basePath = '/system-design-canvas'; break;
      case 'system-design-hub': basePath = '/system-design-hub'; break;
      case 'azure-hub': basePath = '/azure'; break;
      default: basePath = '/'; break;
    }
  }

  if (topicId) {
    const prefix = basePath === '/' ? '/' : basePath;
    return `${prefix}?topic=${encodeURIComponent(topicId)}`;
  }
  return basePath;
}
