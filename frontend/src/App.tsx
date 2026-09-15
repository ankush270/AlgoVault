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
import { DomainType, TopicItem } from './types';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<DomainType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [selectedTopicModal, setSelectedTopicModal] = useState<TopicItem | null>(null);
  const [noteModalTarget, setNoteModalTarget] = useState<{ topicId: string; title: string } | null>(null);

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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full">
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
