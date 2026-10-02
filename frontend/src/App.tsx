import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { KnowledgeHub } from './components/KnowledgeHub';
import { SqlPlayground } from './components/SqlPlayground';
import { FlashcardMockEngine } from './components/FlashcardMockEngine';
import { RevisionPlanner } from './components/RevisionPlanner';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { NotesModal } from './components/NotesModal';
import { TopicDetailModal } from './components/TopicDetailModal';
import { LeetCodeExplorer } from './components/LeetCodeExplorer';
import { StriverSheetView } from './components/StriverSheetView';
import { AlgorithmHub } from './components/AlgorithmHub';
import { InterviewExperiencesExplorer } from './components/InterviewExperiencesExplorer';
import { TricksExplorer } from './components/TricksExplorer';
import { JobExplorer } from './components/JobExplorer';
import { SystemDesignCanvas } from './components/SystemDesignCanvas';
import { SystemDesignHub } from './components/SystemDesignHub';
import { LiveCodingArena } from './components/LiveCodingArena';
import { CheatSheetReadinessHub } from './components/CheatSheetReadinessHub';
import { AuthModal } from './components/AuthModal';
import { AIChatbot } from './components/common/AIChatbot';
import { DomainType, TopicItem } from './types';

const domainRoutes: Record<string, DomainType> = {
  '/os': 'os',
  '/oops': 'oops',
  '/dbms': 'dbms-sql',
  '/dbms-sql': 'dbms-sql',
  '/networks': 'computer-networks',
  '/computer-networks': 'computer-networks',
  '/dsa': 'dsa',
  '/system-design': 'system-design',
  '/javascript': 'javascript',
  '/react': 'react',
  '/nodejs': 'nodejs',
  '/genai': 'genai-ml',
  '/genai-ml': 'genai-ml',
};

const tabRoutes: Record<string, string> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/knowledge': 'knowledge',
  '/modules': 'knowledge',
  '/dsa-tricks': 'dsa-tricks',
  '/tricks': 'dsa-tricks',
  '/interview-experiences': 'interview-experiences',
  '/interviews': 'interview-experiences',
  '/striver-a2z': 'striver-a2z',
  '/striver': 'striver-a2z',
  '/leetcode-explorer': 'leetcode-explorer',
  '/leetcode': 'leetcode-explorer',
  '/algorithms': 'algorithms',
  '/sql-sandbox': 'sql-sandbox',
  '/sql': 'sql-sandbox',
  '/flashcards': 'flashcards',
  '/revision': 'revision',
  '/analytics': 'analytics',
  '/pdf-readiness': 'pdf-readiness',
  '/notes': 'notes',
  '/jobs': 'jobs',
};

function parseCurrentRoute(): {
  tab: string;
  domain: DomainType | 'all';
  isAuthModalOpen: boolean;
  authTab: 'login' | 'signup';
} {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (path === '/login') {
    return { tab: 'dashboard', domain: 'all', isAuthModalOpen: true, authTab: 'login' };
  }
  if (path === '/signup') {
    return { tab: 'dashboard', domain: 'all', isAuthModalOpen: true, authTab: 'signup' };
  }

  if (domainRoutes[path]) {
    return { tab: 'knowledge', domain: domainRoutes[path], isAuthModalOpen: false, authTab: 'login' };
  }

  if (tabRoutes[path]) {
    return { tab: tabRoutes[path], domain: 'all', isAuthModalOpen: false, authTab: 'login' };
  }

  return { tab: 'dashboard', domain: 'all', isAuthModalOpen: false, authTab: 'login' };
}

function getPathForState(tab: string, domain?: DomainType | 'all'): string {
  if (tab === 'knowledge' && domain && domain !== 'all') {
    return `/${domain}`;
  }
  switch (tab) {
    case 'dashboard': return '/';
    case 'knowledge': return '/knowledge';
    case 'dsa-tricks': return '/tricks';
    case 'interview-experiences': return '/interview-experiences';
    case 'striver-a2z': return '/striver-a2z';
    case 'leetcode-explorer': return '/leetcode';
    case 'algorithms': return '/algorithms';
    case 'sql-sandbox': return '/sql-sandbox';
    case 'flashcards': return '/flashcards';
    case 'revision': return '/revision';
    case 'analytics': return '/analytics';
    case 'notes': return '/notes';
    case 'jobs': return '/jobs';
    default: return '/';
  }
}

export const AppContent: React.FC = () => {
  const [routeState, setRouteState] = useState(() => parseCurrentRoute());
  const activeTab = routeState.tab;
  const selectedDomain = routeState.domain;
  const authModalOpen = routeState.isAuthModalOpen;
  const authInitialTab = routeState.authTab;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [selectedTopicModal, setSelectedTopicModal] = useState<TopicItem | null>(null);
  const [noteModalTarget, setNoteModalTarget] = useState<{ topicId: string; title: string } | null>(null);

  const setActiveTab = (newTab: string) => {
    const targetPath = getPathForState(newTab, selectedDomain);
    if (window.location.pathname.toLowerCase() !== targetPath.toLowerCase()) {
      window.history.pushState(null, '', targetPath);
    }
    setRouteState((prev) => ({
      ...prev,
      tab: newTab,
      isAuthModalOpen: false,
    }));
  };

  const setSelectedDomain = (newDomain: DomainType | 'all') => {
    const targetTab = activeTab === 'dashboard' ? 'knowledge' : activeTab;
    const targetPath = getPathForState(targetTab, newDomain);
    if (window.location.pathname.toLowerCase() !== targetPath.toLowerCase()) {
      window.history.pushState(null, '', targetPath);
    }
    setRouteState((prev) => ({
      ...prev,
      tab: targetTab,
      domain: newDomain,
      isAuthModalOpen: false,
    }));
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const parsed = parseCurrentRoute();
      setRouteState(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    if (window.location.pathname.toLowerCase() !== `/${tab}`) {
      window.history.pushState(null, '', `/${tab}`);
    }
    setRouteState((prev) => ({
      ...prev,
      isAuthModalOpen: true,
      authTab: tab,
    }));
  };

  const handleCloseAuth = () => {
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath === '/login' || currentPath === '/signup') {
      const cleanPath = getPathForState(activeTab, selectedDomain);
      window.history.replaceState(null, '', cleanPath);
    }
    setRouteState((prev) => ({
      ...prev,
      isAuthModalOpen: false,
    }));
  };

  const handleSelectTopic = (topic: TopicItem) => {
    setSelectedTopicModal(topic);
  };

  const handleOpenNote = (topicId: string, title: string) => {
    setNoteModalTarget({ topicId, title });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Body */}
      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* Left Sidebar — Desktop Only */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-8 py-4 sm:py-5 lg:py-6 min-w-0 max-w-[1720px] mx-auto w-full h-full pb-safe-nav">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              setSelectedDomain={setSelectedDomain}
              setSelectedTopicId={(id) => {
                // optional topic launcher
              }}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeHub
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectTopic={handleSelectTopic}
              onOpenNote={handleOpenNote}
            />
          )}

          {activeTab === 'jobs' && <JobExplorer />}

          {activeTab === 'dsa-tricks' && <TricksExplorer />}

          {activeTab === 'interview-experiences' && <InterviewExperiencesExplorer />}

          {activeTab === 'live-arena' && <LiveCodingArena />}

          {activeTab === 'striver-a2z' && <StriverSheetView />}

          {activeTab === 'system-design-canvas' && <SystemDesignCanvas />}

          {activeTab === 'system-design-hub' && (
            <SystemDesignHub
              onSelectTopic={handleSelectTopic}
              onOpenNote={handleOpenNote}
            />
          )}

          {activeTab === 'leetcode-explorer' && <LeetCodeExplorer />}

          {activeTab === 'algorithms' && <AlgorithmHub />}

          {activeTab === 'sql-sandbox' && <SqlPlayground />}

          {activeTab === 'flashcards' && <FlashcardMockEngine />}

          {activeTab === 'revision' && (
            <RevisionPlanner onSelectTopic={handleSelectTopic} />
          )}

          {activeTab === 'analytics' && <AnalyticsCharts />}

          {activeTab === 'pdf-readiness' && <CheatSheetReadinessHub />}

          {activeTab === 'notes' && (
            <NotesModal
              topicId={null}
              onClose={() => {}}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation — visible only on mobile */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Detail Reader Modal */}
      <TopicDetailModal
        topic={selectedTopicModal}
        onClose={() => setSelectedTopicModal(null)}
        onOpenNote={handleOpenNote}
      />

      {/* Personal Notes Modal */}
      {noteModalTarget && (
        <NotesModal
          topicId={noteModalTarget.topicId}
          topicTitle={noteModalTarget.title}
          onClose={() => setNoteModalTarget(null)}
        />
      )}

      {/* Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialTab={authInitialTab}
      />

      {/* Sarvam AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
