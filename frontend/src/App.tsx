import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
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
  '/notes': 'notes',
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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Top Sticky Navbar */}
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
      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-[1720px] mx-auto w-full">
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

          {activeTab === 'dsa-tricks' && <TricksExplorer />}

          {activeTab === 'interview-experiences' && <InterviewExperiencesExplorer />}

          {activeTab === 'striver-a2z' && <StriverSheetView />}

          {activeTab === 'leetcode-explorer' && <LeetCodeExplorer />}

          {activeTab === 'algorithms' && <AlgorithmHub />}

          {activeTab === 'sql-sandbox' && <SqlPlayground />}

          {activeTab === 'flashcards' && <FlashcardMockEngine />}

          {activeTab === 'revision' && (
            <RevisionPlanner onSelectTopic={handleSelectTopic} />
          )}

          {activeTab === 'analytics' && <AnalyticsCharts />}

          {activeTab === 'notes' && (
            <NotesModal
              topicId={null}
              onClose={() => {}}
            />
          )}
        </main>
      </div>

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
