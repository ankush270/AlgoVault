import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProviders } from './context/AppProviders';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { NotesModal } from './components/NotesModal';
import { TopicDetailModal } from './components/TopicDetailModal';
import { AuthModal } from './components/AuthModal';
import { NotFoundPage } from './components/common/NotFoundPage';
import { DomainType, TopicItem } from './types';
import { 
  domainRoutes, 
  tabRoutes, 
  ParsedRoute, 
  parseCurrentRoute, 
  getPathForState 
} from './utils/routing';

// Dynamic code-splitting: Lazy load each distinct module on demand
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const KnowledgeHub = lazy(() => import('./components/KnowledgeHub').then(m => ({ default: m.KnowledgeHub })));
const SqlPlayground = lazy(() => import('./components/SqlPlayground').then(m => ({ default: m.SqlPlayground })));
const FlashcardMockEngine = lazy(() => import('./components/FlashcardMockEngine').then(m => ({ default: m.FlashcardMockEngine })));
const RevisionPlanner = lazy(() => import('./components/RevisionPlanner').then(m => ({ default: m.RevisionPlanner })));
const AnalyticsCharts = lazy(() => import('./components/AnalyticsCharts').then(m => ({ default: m.AnalyticsCharts })));
const LeetCodeExplorer = lazy(() => import('./components/LeetCodeExplorer').then(m => ({ default: m.LeetCodeExplorer })));
const StriverSheetView = lazy(() => import('./components/StriverSheetView').then(m => ({ default: m.StriverSheetView })));
const AlgorithmHub = lazy(() => import('./components/AlgorithmHub').then(m => ({ default: m.AlgorithmHub })));
const InterviewExperiencesExplorer = lazy(() => import('./components/InterviewExperiencesExplorer').then(m => ({ default: m.InterviewExperiencesExplorer })));
const TricksExplorer = lazy(() => import('./components/TricksExplorer').then(m => ({ default: m.TricksExplorer })));
const JobExplorer = lazy(() => import('./components/JobExplorer').then(m => ({ default: m.JobExplorer })));
const SystemDesignCanvas = lazy(() => import('./components/SystemDesignCanvas').then(m => ({ default: m.SystemDesignCanvas })));
const SystemDesignHub = lazy(() => import('./components/SystemDesignHub').then(m => ({ default: m.SystemDesignHub })));
const AzureHub = lazy(() => import('./components/AzureHub').then(m => ({ default: m.AzureHub })));
const LiveCodingArena = lazy(() => import('./components/LiveCodingArena').then(m => ({ default: m.LiveCodingArena })));
const CheatSheetReadinessHub = lazy(() => import('./components/CheatSheetReadinessHub').then(m => ({ default: m.CheatSheetReadinessHub })));
const AIChatbot = lazy(() => import('./components/common/AIChatbot').then(m => ({ default: m.AIChatbot })));
const VaultNotesHub = lazy(() => import('./components/VaultNotesHub').then(m => ({ default: m.VaultNotesHub })));

export { domainRoutes, tabRoutes, parseCurrentRoute, getPathForState };
export type { ParsedRoute };

const PageFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 py-16">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
      <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-slate-700">Loading module...</p>
      <p className="text-xs text-slate-400">Fetching optimized bundle chunk</p>
    </div>
  </div>
);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeState = useMemo(() => {
    return parseCurrentRoute(location.pathname, location.search);
  }, [location.pathname, location.search]);

  const activeTab = routeState.tab;
  const selectedDomain = routeState.domain;
  const authModalOpen = routeState.isAuthModalOpen;
  const authInitialTab = routeState.authTab;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [selectedTopicModal, setSelectedTopicModal] = useState<TopicItem | null>(() => routeState.topic);
  const [noteModalTarget, setNoteModalTarget] = useState<{ topicId: string; title: string } | null>(null);

  // Sync routeState topic with selectedTopicModal on route changes
  useEffect(() => {
    setSelectedTopicModal(routeState.topic);
  }, [routeState.topic]);

  const setActiveTab = (newTab: string) => {
    const targetPath = getPathForState(newTab, selectedDomain);
    navigate(targetPath);
    setSelectedTopicModal(null);
  };

  const setSelectedDomain = (newDomain: DomainType | 'all') => {
    const targetTab = (activeTab === 'dashboard' || activeTab === '404') ? 'knowledge' : activeTab;
    const targetPath = getPathForState(targetTab, newDomain);
    navigate(targetPath);
    setSelectedTopicModal(null);
  };

  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    navigate(`/${tab}`);
  };

  const handleCloseAuth = () => {
    const currentPath = location.pathname.toLowerCase();
    if (currentPath === '/login' || currentPath === '/signup') {
      const cleanPath = getPathForState(activeTab, selectedDomain);
      navigate(cleanPath, { replace: true });
    }
  };

  const handleSelectTopic = (topic: TopicItem) => {
    setSelectedTopicModal(topic);
    const targetTab = activeTab === '404' ? 'knowledge' : activeTab;
    const targetDomain = (selectedDomain === 'all' && topic.domain) ? topic.domain : selectedDomain;
    const targetPath = getPathForState(targetTab, targetDomain, topic.id);
    navigate(targetPath);
  };

  const handleCloseTopicModal = () => {
    setSelectedTopicModal(null);
    const targetTab = activeTab === '404' ? 'dashboard' : activeTab;
    const cleanPath = getPathForState(targetTab, selectedDomain);
    navigate(cleanPath);
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
          <Suspense fallback={<PageFallback />}>
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

            {activeTab === 'jobs' && (
              <JobExplorer
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'dsa-tricks' && (
              <TricksExplorer
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'interview-experiences' && <InterviewExperiencesExplorer />}

            {activeTab === 'live-arena' && <LiveCodingArena />}

            {activeTab === 'striver-a2z' && (
              <StriverSheetView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'system-design-canvas' && <SystemDesignCanvas />}

            {activeTab === 'system-design-hub' && (
              <SystemDesignHub
                onSelectTopic={handleSelectTopic}
                onOpenNote={handleOpenNote}
              />
            )}

            {activeTab === 'azure-hub' && (
              <AzureHub
                onSelectTopic={handleSelectTopic}
                onOpenNote={handleOpenNote}
              />
            )}

            {activeTab === 'leetcode-explorer' && (
              <LeetCodeExplorer
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'algorithms' && <AlgorithmHub />}

            {activeTab === 'sql-sandbox' && <SqlPlayground />}

            {activeTab === 'flashcards' && <FlashcardMockEngine />}

            {activeTab === 'revision' && (
              <RevisionPlanner onSelectTopic={handleSelectTopic} />
            )}

            {activeTab === 'analytics' && <AnalyticsCharts />}

            {activeTab === 'pdf-readiness' && <CheatSheetReadinessHub />}

            {(activeTab === 'notes' || activeTab === 'vault') && (
              <VaultNotesHub
                initialDomain={selectedDomain !== 'all' ? selectedDomain : 'dsa'}
                onOpenAuthModal={() => handleOpenAuth('login')}
              />
            )}

            {activeTab === '404' && (
              <NotFoundPage
                currentPath={routeState.notFoundPath || location.pathname}
                onNavigate={(tab, domain) => {
                  if (domain) {
                    setSelectedDomain(domain);
                  } else {
                    setActiveTab(tab);
                  }
                }}
                onSearch={(query) => {
                  setSearchQuery(query);
                }}
                onBack={() => navigate(-1)}
              />
            )}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation — visible only on mobile */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Detail Reader Modal */}
      <TopicDetailModal
        topic={selectedTopicModal}
        onClose={handleCloseTopicModal}
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
        onTabChange={(tab) => navigate(`/${tab}`, { replace: true })}
      />

      {/* Sarvam AI Chatbot */}
      <Suspense fallback={null}>
        <AIChatbot />
      </Suspense>
    </div>
  );
};

export default function App() {
  return (
    <AppProviders>
      <ScrollToTop />
      <AppContent />
    </AppProviders>
  );
}
