import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  ChevronsUpDown,
  X,
  Trash2, 
  Edit, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Code2, 
  Layers, 
  Tag, 
  Filter,
  TrendingUp,
  Cpu,
  Database,
  Globe2,
  Boxes,
  Terminal,
  Server,
  Cloud,
  Bot
} from 'lucide-react';
import { 
  VaultTopic, 
  VaultSubtopicSummary, 
  VaultSubtopicNote, 
  vaultService 
} from '../services/vaultService';
import { VaultNoteEditor } from './VaultNoteEditor';
import { useAuth } from '../context/AuthContext';

interface VaultNotesHubProps {
  initialDomain?: string;
  onOpenAuthModal: () => void;
}

const DOMAIN_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'dsa': Code2,
  'system-design': Layers,
  'os': Cpu,
  'dbms-sql': Database,
  'computer-networks': Globe2,
  'oops': Boxes,
  'javascript': Terminal,
  'react': Sparkles,
  'nodejs': Server,
  'azure': Cloud,
  'genai-ml': Bot
};

interface DomainGroup {
  name: string;
  domains: { id: string; label: string }[];
}

const DOMAIN_GROUPS: DomainGroup[] = [
  {
    name: 'Algorithms & Architecture',
    domains: [
      { id: 'dsa', label: 'DSA & Algorithms' },
      { id: 'system-design', label: 'System Design (HLD)' }
    ]
  },
  {
    name: 'Core Computer Science',
    domains: [
      { id: 'os', label: 'Operating Systems' },
      { id: 'dbms-sql', label: 'DBMS & SQL' },
      { id: 'computer-networks', label: 'Computer Networks' },
      { id: 'oops', label: 'OOPs & LLD' }
    ]
  },
  {
    name: 'Full Stack, Cloud & AI',
    domains: [
      { id: 'javascript', label: 'JavaScript & V8' },
      { id: 'react', label: 'React.js & Frontend' },
      { id: 'nodejs', label: 'Node.js & Backend' },
      { id: 'azure', label: 'Microsoft Azure' },
      { id: 'genai-ml', label: 'Gen AI & LLMs' }
    ]
  }
];

export const VaultNotesHub: React.FC<VaultNotesHubProps> = ({
  initialDomain = 'dsa',
  onOpenAuthModal
}) => {
  const { isAuthenticated } = useAuth();

  const [domains, setDomains] = useState<string[]>([
    'dsa',
    'system-design',
    'os',
    'dbms-sql',
    'computer-networks',
    'oops',
    'javascript',
    'react',
    'nodejs',
    'azure',
    'genai-ml'
  ]);
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);
  const [isDomainsExpanded, setIsDomainsExpanded] = useState<boolean>(false);
  const [domainStats, setDomainStats] = useState<Record<string, number>>({});
  const [areAllTopicsExpanded, setAreAllTopicsExpanded] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'weak' | 'moderate' | 'mastered'>('all');
  
  const [topics, setTopics] = useState<VaultTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [expandedTopicIds, setExpandedTopicIds] = useState<Record<string, boolean>>({});

  // Active Selected Subtopic
  const [selectedTopic, setSelectedTopic] = useState<VaultTopic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<VaultSubtopicNote | null>(null);
  const [loadingSubtopic, setLoadingSubtopic] = useState(false);

  // Modals
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newTopicInitialSubtopic, setNewTopicInitialSubtopic] = useState('Overview & Notes');
  const [newTopicInitialContent, setNewTopicInitialContent] = useState('');

  const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false);
  const [targetTopicForSubtopic, setTargetTopicForSubtopic] = useState<VaultTopic | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [newSubtopicContent, setNewSubtopicContent] = useState('');

  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');

  const [showIngestRawModal, setShowIngestRawModal] = useState(false);
  const [rawTopicTitle, setRawTopicTitle] = useState('');
  const [rawCategory, setRawCategory] = useState('');
  const [rawContent, setRawContent] = useState('');

  // 1. Fetch Topics for current domain
  useEffect(() => {
    loadTopicsForDomain(selectedDomain);
  }, [selectedDomain]);

  const loadTopicsForDomain = async (domain: string) => {
    try {
      setLoadingTopics(true);
      // Fast check: Local cache
      const cached = localStorage.getItem(`vault_cache_${domain}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTopics(parsed);
          }
        } catch (_) {}
      }

      const fetchedTopics = await vaultService.getTopics({ domain });
      setTopics(fetchedTopics);
      localStorage.setItem(`vault_cache_${domain}`, JSON.stringify(fetchedTopics));
      setLoadingTopics(false);

      // Auto-select first subtopic if nothing is selected yet
      if (fetchedTopics.length > 0 && !selectedSubtopic) {
        const firstTopic = fetchedTopics[0];
        if (firstTopic.subtopics && firstTopic.subtopics.length > 0) {
          handleSelectSubtopic(firstTopic, firstTopic.subtopics[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load topics:', err);
      setLoadingTopics(false);
    }
  };

  // 2. Select a Subtopic and load its full note
  const handleSelectSubtopic = async (topic: VaultTopic, subtopicId: string) => {
    try {
      setLoadingSubtopic(true);
      setSelectedTopic(topic);
      const res = await vaultService.getSubtopic(subtopicId);
      setSelectedSubtopic(res.subtopic);
      setLoadingSubtopic(false);
    } catch (err: any) {
      console.error('Failed to load subtopic note:', err);
      setLoadingSubtopic(false);
    }
  };

  useEffect(() => {
    const fetchDomainCounts = async () => {
      try {
        const list = await vaultService.getDomains();
        const stats: Record<string, number> = {};
        list.forEach(d => {
          stats[d.domain] = d.topicCount;
        });
        setDomainStats(stats);
      } catch (_) {}
    };
    fetchDomainCounts();
  }, [topics.length]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopicIds(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const handleToggleAllTopics = () => {
    if (areAllTopicsExpanded) {
      const nextState: Record<string, boolean> = {};
      topics.forEach(t => {
        nextState[t._id] = false;
      });
      setExpandedTopicIds(nextState);
      setAreAllTopicsExpanded(false);
    } else {
      const nextState: Record<string, boolean> = {};
      topics.forEach(t => {
        nextState[t._id] = true;
      });
      setExpandedTopicIds(nextState);
      setAreAllTopicsExpanded(true);
    }
  };

  // 3. Handle Create Topic
  const handleCreateTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }

    if (!newTopicTitle.trim()) return;

    try {
      const created = await vaultService.createTopic({
        domain: selectedDomain,
        category: newTopicCategory.trim() || 'General',
        title: newTopicTitle.trim(),
        difficulty: newTopicDifficulty,
        initialSubtopicTitle: newTopicInitialSubtopic.trim() || 'Overview & Notes',
        contentMarkdown: newTopicInitialContent.trim() || `# ${newTopicTitle.trim()}\n\nStart writing notes...`
      });

      setShowAddTopicModal(false);
      setNewTopicTitle('');
      setNewTopicCategory('');
      setNewTopicInitialContent('');

      // Refresh list
      loadTopicsForDomain(selectedDomain);

      // Select new topic
      if (created.subtopics && created.subtopics.length > 0) {
        handleSelectSubtopic(created, created.subtopics[0]._id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create topic');
    }
  };

  // 4. Handle Create Subtopic
  const handleCreateSubtopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }
    if (!targetTopicForSubtopic || !newSubtopicTitle.trim()) return;

    try {
      const created = await vaultService.createSubtopic(targetTopicForSubtopic._id, {
        title: newSubtopicTitle.trim(),
        contentMarkdown: newSubtopicContent.trim() || `# ${newSubtopicTitle.trim()}\n\n`
      });

      setShowAddSubtopicModal(false);
      setNewSubtopicTitle('');
      setNewSubtopicContent('');

      loadTopicsForDomain(selectedDomain);
      handleSelectSubtopic(targetTopicForSubtopic, created._id);
    } catch (err: any) {
      alert(err.message || 'Failed to create subtopic');
    }
  };

  // 5. Handle Ingest Raw Notes (graph.txt support)
  const handleIngestRawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }
    if (!rawTopicTitle.trim() || !rawContent.trim()) return;

    try {
      const created = await vaultService.createTopic({
        domain: selectedDomain,
        category: rawCategory.trim() || 'Graphs & Networks',
        title: rawTopicTitle.trim(),
        difficulty: 'Medium',
        initialSubtopicTitle: 'Core Intuition, Representations & Notes',
        contentMarkdown: rawContent.trim()
      });

      setShowIngestRawModal(false);
      setRawTopicTitle('');
      setRawCategory('');
      setRawContent('');

      loadTopicsForDomain(selectedDomain);
      if (created.subtopics && created.subtopics.length > 0) {
        handleSelectSubtopic(created, created.subtopics[0]._id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to ingest notes');
    }
  };

  // 6. Subtopic Updated callback
  const handleSubtopicUpdated = (updatedNote: VaultSubtopicNote) => {
    setSelectedSubtopic(updatedNote);
    // Update local topic list metadata
    setTopics(prev => prev.map(t => {
      if (t._id === updatedNote.topicId) {
        return {
          ...t,
          subtopics: t.subtopics.map(st => st._id === updatedNote._id ? {
            ...st,
            title: updatedNote.title,
            revisionStatus: updatedNote.revisionStatus,
            lastRevisedAt: updatedNote.lastRevisedAt,
            problemsCount: updatedNote.problems.length,
            hasMedia: updatedNote.media.length > 0
          } : st)
        };
      }
      return t;
    }));
  };

  // Filter topics
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      // Search filter
      const matchesSearch = !searchQuery.trim() || 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtopics.some(st => st.title.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = t.subtopics.some(st => st.revisionStatus === statusFilter);
      }

      return matchesSearch && matchesStatus;
    });
  }, [topics, searchQuery, statusFilter]);

  // Group by category
  const groupedCategories = useMemo(() => {
    const map = new Map<string, VaultTopic[]>();
    filteredTopics.forEach(t => {
      const cat = t.category || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(t);
    });
    return Array.from(map.entries());
  }, [filteredTopics]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-slate-100 overflow-hidden">
      {/* Top Bar: Expandable/Collapsible Domain Switcher & Actions */}
      <div className="bg-white border-b border-slate-200 px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Left: Active Domain Trigger & Tree Toggle */}
        <div className="flex items-center gap-2">
          {/* Domain Expand/Collapse Trigger */}
          <button
            onClick={() => setIsDomainsExpanded(!isDomainsExpanded)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer group border ${
              isDomainsExpanded
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200/90'
            }`}
            title="Click to expand/collapse domain tracks"
          >
            {React.createElement(DOMAIN_ICONS[selectedDomain] || Code2, { className: 'w-4 h-4 shrink-0' })}
            <span className="uppercase tracking-wider font-extrabold">{selectedDomain.replace('-', ' ')}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
              isDomainsExpanded ? 'bg-indigo-700 text-white' : 'bg-indigo-200/80 text-indigo-900'
            }`}>
              {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
            </span>
            {isDomainsExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            )}
          </button>

          {/* Toggle All Topics Expand/Collapse in Tree */}
          <button
            onClick={handleToggleAllTopics}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition shadow-2xs"
            title={areAllTopicsExpanded ? "Collapse all topics in tree" : "Expand all topics in tree"}
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{areAllTopicsExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>
        </div>

        {/* Right: Global Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (!isAuthenticated) { onOpenAuthModal(); return; }
              setRawTopicTitle('Graph: Basics & Representations');
              setRawCategory('Graphs');
              setShowIngestRawModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition shadow-2xs"
            title="Quickly Paste Raw Notes (e.g. graph.txt) directly into DevForge"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste Raw Notes</span>
            <span className="sm:hidden">Paste</span>
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) { onOpenAuthModal(); return; }
              setShowAddTopicModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Topic</span>
          </button>
        </div>
      </div>

      {/* Expandable Domain Drawer / Panel */}
      {isDomainsExpanded && (
        <div className="bg-slate-900 text-white border-b border-slate-800 p-4 sm:p-5 shadow-lg animate-fadeIn z-20 shrink-0">
          <div className="max-w-[1600px] mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Engineering Tracks & Domains
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                  {domains.length} available
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!isAuthenticated) { onOpenAuthModal(); return; }
                    setShowAddDomainModal(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition"
                  title="Create custom domain"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>+ New Domain</span>
                </button>
                <button
                  onClick={() => setIsDomainsExpanded(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Collapse</span>
                </button>
              </div>
            </div>

            {/* Categorized Tracks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DOMAIN_GROUPS.map((group) => (
                <div key={group.name} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.name}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {group.domains.map(d => {
                      const Icon = DOMAIN_ICONS[d.id] || Code2;
                      const isSelected = selectedDomain === d.id;
                      const count = domainStats[d.id] ?? (d.id === selectedDomain ? topics.length : undefined);

                      return (
                        <button
                          key={d.id}
                          onClick={() => {
                            setSelectedDomain(d.id);
                            setSelectedSubtopic(null);
                            setIsDomainsExpanded(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                            <span>{d.label}</span>
                          </div>
                          {count !== undefined && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom user domains if any exist */}
            {domains.filter(d => !DOMAIN_GROUPS.some(g => g.domains.some(gd => gd.id === d))).length > 0 && (
              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Custom Tracks
                </div>
                <div className="flex flex-wrap gap-2">
                  {domains
                    .filter(d => !DOMAIN_GROUPS.some(g => g.domains.some(gd => gd.id === d)))
                    .map(d => {
                      const isSelected = selectedDomain === d;
                      return (
                        <button
                          key={d}
                          onClick={() => {
                            setSelectedDomain(d);
                            setSelectedSubtopic(null);
                            setIsDomainsExpanded(false);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>{d}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: 3-Tier Tree Navigation */}
        <div className="w-80 sm:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-hidden">
          {/* Search & Revision Filter */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or subtopics..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter pills & Tree Toggle */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                    statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({filteredTopics.length})
                </button>
                <button
                  onClick={() => setStatusFilter('weak')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                    statusFilter === 'weak' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🔴 Weak
                </button>
                <button
                  onClick={() => setStatusFilter('mastered')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                    statusFilter === 'mastered' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🟢 Mastered
                </button>
              </div>

              {/* Quick tree expand / collapse in sidebar */}
              <button
                onClick={handleToggleAllTopics}
                className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 px-1.5 py-0.5 rounded hover:bg-slate-200/70 transition flex items-center gap-0.5"
                title={areAllTopicsExpanded ? "Collapse all topics" : "Expand all topics"}
              >
                {areAllTopicsExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span>Collapse</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    <span>Expand</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tree Structure */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {loadingTopics ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Loading topics from Vault database...
              </div>
            ) : groupedCategories.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No topics found. Click <strong>+ Add Topic</strong> to create one!
              </div>
            ) : (
              groupedCategories.map(([category, catTopics]) => (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>{category}</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{catTopics.length}</span>
                  </div>

                  <div className="space-y-1 pl-1">
                    {catTopics.map(topic => {
                      const isExpanded = expandedTopicIds[topic._id] !== false; // expanded by default
                      const isTopicActive = selectedTopic?._id === topic._id;

                      return (
                        <div key={topic._id} className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                          {/* Topic Bar */}
                          <div 
                            className={`flex items-center justify-between p-2.5 cursor-pointer transition ${
                              isTopicActive ? 'bg-indigo-50/70 border-indigo-200' : 'hover:bg-slate-50'
                            }`}
                            onClick={() => toggleTopicExpand(topic._id)}
                          >
                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="text-xs font-bold text-slate-800 truncate" title={topic.title}>
                                {topic.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                topic.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                                topic.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {topic.difficulty}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isAuthenticated) { onOpenAuthModal(); return; }
                                  setTargetTopicForSubtopic(topic);
                                  setShowAddSubtopicModal(true);
                                }}
                                className="p-1 hover:bg-slate-200 rounded text-indigo-600"
                                title="Add Subtopic Note"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Subtopics List */}
                          {isExpanded && (
                            <div className="bg-slate-50/60 border-t border-slate-100 p-1.5 space-y-1">
                              {topic.subtopics.map(sub => {
                                const isSubActive = selectedSubtopic?._id === sub._id;
                                const dotColor = sub.revisionStatus === 'weak' ? 'bg-rose-500' : sub.revisionStatus === 'mastered' ? 'bg-emerald-500' : 'bg-amber-500';

                                return (
                                  <button
                                    key={sub._id}
                                    onClick={() => handleSelectSubtopic(topic, sub._id)}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                                      isSubActive 
                                        ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                                        : 'text-slate-700 hover:bg-white hover:shadow-2xs font-medium'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSubActive ? 'bg-white' : dotColor}`} />
                                      <span className="truncate">{sub.title}</span>
                                    </div>

                                    {sub.problemsCount > 0 && (
                                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                        isSubActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                                      }`}>
                                        {sub.problemsCount} Qs
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Active Note Canvas */}
        <div className="flex-1 h-full overflow-hidden p-3 sm:p-4 bg-slate-100">
          {loadingSubtopic ? (
            <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Loading subtopic notes...</p>
              </div>
            </div>
          ) : selectedSubtopic ? (
            <VaultNoteEditor
              subtopic={selectedSubtopic}
              topicTitle={selectedTopic?.title || 'Topic'}
              domainName={selectedDomain}
              categoryName={selectedTopic?.category || 'General'}
              isAuthenticated={isAuthenticated}
              onRequireAuth={onOpenAuthModal}
              onSubtopicUpdated={handleSubtopicUpdated}
              onSubtopicDeleted={(subId) => {
                loadTopicsForDomain(selectedDomain);
                setSelectedSubtopic(null);
              }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-lg font-black text-slate-900">DevForge Notes & Study Engine</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select any topic or subtopic from the left sidebar to revise, write notes, attach LeetCode problems, and embed video lectures.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!isAuthenticated) { onOpenAuthModal(); return; }
                    setShowAddTopicModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Topic</span>
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) { onOpenAuthModal(); return; }
                    setRawTopicTitle('Graph: Basics & Representations');
                    setRawCategory('Graphs');
                    setShowIngestRawModal(true);
                  }}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Paste graph.txt Notes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create New Topic */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-indigo-600" />
              <span>Create New Topic in {selectedDomain.toUpperCase()}</span>
            </h3>

            <form onSubmit={handleCreateTopicSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Category / Chapter</label>
                <input
                  type="text"
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                  placeholder="e.g. Graphs, Dynamic Programming, Deadlocks"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Topic Title</label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Graph: Basics & Representations"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Difficulty</label>
                  <select
                    value={newTopicDifficulty}
                    onChange={(e) => setNewTopicDifficulty(e.target.value as any)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Initial Subtopic Title</label>
                  <input
                    type="text"
                    value={newTopicInitialSubtopic}
                    onChange={(e) => setNewTopicInitialSubtopic(e.target.value)}
                    placeholder="e.g. Overview & Core Terms"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Initial Notes (Markdown / Optional)</label>
                <textarea
                  value={newTopicInitialContent}
                  onChange={(e) => setNewTopicInitialContent(e.target.value)}
                  placeholder="Write intuition, notes, or C++ snippet..."
                  rows={4}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Subtopic under Topic */}
      {showAddSubtopicModal && targetTopicForSubtopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>Add Subtopic to "{targetTopicForSubtopic.title}"</span>
            </h3>

            <form onSubmit={handleCreateSubtopicSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Subtopic Title</label>
                <input
                  type="text"
                  value={newSubtopicTitle}
                  onChange={(e) => setNewSubtopicTitle(e.target.value)}
                  placeholder="e.g. Cycle Detection using DFS / BFS"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Initial Content (Markdown)</label>
                <textarea
                  value={newSubtopicContent}
                  onChange={(e) => setNewSubtopicContent(e.target.value)}
                  placeholder="Write initial notes, constraints rules, code..."
                  rows={4}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubtopicModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Add Subtopic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ingest Raw Notes (graph.txt) */}
      {showIngestRawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Paste & Ingest Raw Study Notes (e.g. graph.txt)</span>
            </h3>

            <form onSubmit={handleIngestRawSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Topic Title</label>
                  <input
                    type="text"
                    value={rawTopicTitle}
                    onChange={(e) => setRawTopicTitle(e.target.value)}
                    placeholder="e.g. Graph: Basics & Representations"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Category</label>
                  <input
                    type="text"
                    value={rawCategory}
                    onChange={(e) => setRawCategory(e.target.value)}
                    placeholder="e.g. Graphs"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Paste Full Raw Text (Hinglish/Markdown/Code)</label>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Paste your raw text from graph.txt or notes here..."
                  rows={10}
                  className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngestRawModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
                >
                  Save as Vault Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Domain */}
      {showAddDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>Add Custom Domain</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Domain Name (e.g. Rust, DevOps, Distributed Systems)</label>
                <input
                  type="text"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  placeholder="e.g. Rust"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddDomainModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newDomainName.trim()) return;
                  const slug = newDomainName.trim().toLowerCase().replace(/\s+/g, '-');
                  if (!domains.includes(slug)) {
                    setDomains(prev => [...prev, slug]);
                    setSelectedDomain(slug);
                  }
                  setShowAddDomainModal(false);
                  setNewDomainName('');
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Add Domain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
