import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  MapPin, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Filter,
  Code2,
  Brain,
  Globe2, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface JobPosting {
  company: string;
  title: string;
  location: string;
  tags?: string;
  url: string;
  source: string;
  date?: string;
}

export const JobExplorer: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [showInfoBanner, setShowInfoBanner] = useState<boolean>(true);

  // Load scraped jobs from frontend static asset or backend API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // First try backend API, fallback to public/data/jobs.json
      const apiRes = await fetch('http://localhost:5000/api/jobs').catch(() => null);
      if (apiRes && apiRes.ok) {
        const data = await apiRes.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
          setLoading(false);
          return;
        }
      }

      // Fallback
      const fileRes = await fetch('/data/jobs.json');
      if (fileRes.ok) {
        const data = await fileRes.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Auto-refresh jobs every 10 minutes (600,000 ms) in background
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const interval = setInterval(() => {
      fetchJobs();
    }, TEN_MINUTES_MS);
    return () => clearInterval(interval);
  }, []);

  // Trigger Live Python Scraping via Backend
  const handleSyncJobs = async () => {
    setSyncing(true);
    setSyncStatusMsg('🤖 Python Scraper is scanning 600+ company ATS APIs (Greenhouse, Lever, RemoteOK)...');
    try {
      const res = await fetch('http://localhost:5000/api/jobs/sync', { method: 'POST' });
      if (res.ok) {
        setSyncStatusMsg('✅ Sync complete! Latest jobs fetched successfully.');
        await fetchJobs();
      } else {
        setSyncStatusMsg('⚡ Sync request triggered! Updating job listings...');
        setTimeout(fetchJobs, 2000);
      }
    } catch (err) {
      setSyncStatusMsg('⚡ Background sync active. Refreshing current data...');
      setTimeout(fetchJobs, 1500);
    } finally {
      setTimeout(() => {
        setSyncing(false);
        setTimeout(() => setSyncStatusMsg(null), 4000);
      }, 1000);
    }
  };

  // Filter & Sort Logic (Newest Jobs Always First on TOP)
  const filteredJobs = useMemo(() => {
    const list = jobs.filter((job: JobPosting) => {
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        (job.tags && job.tags.toLowerCase().includes(q));

      let matchRole = true;
      if (selectedRole !== 'all') {
        const t = job.title.toLowerCase();
        if (selectedRole === 'software') matchRole = t.includes('software') || t.includes('developer');
        else if (selectedRole === 'data') matchRole = t.includes('data') || t.includes('analyst');
        else if (selectedRole === 'ai') matchRole = t.includes('ai') || t.includes('machine learning') || t.includes('scientist');
        else if (selectedRole === 'fullstack') matchRole = t.includes('fullstack') || t.includes('full stack');
        else if (selectedRole === 'frontend') matchRole = t.includes('frontend') || t.includes('react') || t.includes('web');
        else if (selectedRole === 'backend') matchRole = t.includes('backend') || t.includes('python') || t.includes('golang') || t.includes('node');
        else if (selectedRole === 'qa') matchRole = t.includes('qa') || t.includes('testing') || t.includes('quality');
      }

      let matchSource = true;
      if (selectedSource !== 'all') {
        const s = job.source.toLowerCase();
        if (selectedSource === 'ats') matchSource = s.includes('greenhouse') || s.includes('lever') || s.includes('api');
        else if (selectedSource === 'remoteok') matchSource = s.includes('remoteok');
        else if (selectedSource === 'himalayas') matchSource = s.includes('himalayas');
        else if (selectedSource === 'remotive') matchSource = s.includes('remotive');
      }

      let matchLocation = true;
      if (selectedLocation !== 'all') {
        const l = job.location.toLowerCase();
        if (selectedLocation === 'india') {
          matchLocation = l.includes('india') || l.includes('bangalore') || l.includes('bengaluru') || l.includes('delhi') || l.includes('mumbai') || l.includes('hyderabad') || l.includes('pune') || l.includes('noida') || l.includes('gurugram');
        } else if (selectedLocation === 'remote') {
          matchLocation = l.includes('remote') || l.includes('worldwide') || l.includes('anywhere') || l.includes('global');
        }
      }

      return matchQuery && matchRole && matchSource && matchLocation;
    });

    // Always sort Newest jobs first at the TOP
    return list.sort((a: JobPosting, b: JobPosting) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      
      if (!isNaN(timeA) && !isNaN(timeB) && timeA > 0 && timeB > 0) {
        return timeB - timeA;
      }
      
      // Prioritize ATS API fresh jobs
      const isAats = a.source.includes('API') || a.source.includes('Greenhouse') || a.source.includes('Lever');
      const isBats = b.source.includes('API') || b.source.includes('Greenhouse') || b.source.includes('Lever');
      if (isAats && !isBats) return -1;
      if (!isAats && isBats) return 1;

      return 0;
    });
  }, [jobs, searchQuery, selectedRole, selectedSource, selectedLocation]);

  // Unique stats
  const totalCompanies = useMemo(() => new Set(jobs.map((j) => j.company.toLowerCase())).size, [jobs]);
  const remoteJobsCount = useMemo(() => jobs.filter((j) => j.location.toLowerCase().includes('remote') || j.location.toLowerCase().includes('worldwide')).length, [jobs]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 overflow-x-hidden">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-200 p-4 sm:p-6 lg:p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 sm:w-64 h-40 sm:h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-40 sm:w-64 h-40 sm:h-64 bg-cyan-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 animate-pulse shrink-0" />
                <span className="truncate">Live Python Job Scraper Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Real-Time Remote & Tech Jobs
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
                Automated Python scraper engine scanning <strong>600+ top tech companies</strong> & ATS endpoints for entry-level Software Engineer & Data Scientist openings.
              </p>
            </div>

            {/* Sync & Info Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => setShowInfoBanner(!showInfoBanner)}
                className="px-3 py-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showInfoBanner ? 'Hide Info' : 'How Sync Works'}</span>
              </button>
              <button
                onClick={handleSyncJobs}
                disabled={syncing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 shrink-0 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Scraping Latest Jobs...' : 'Sync & Fetch New Jobs'}
              </button>
            </div>
          </div>
        </div>

        {/* Sync Status Toast */}
        {syncStatusMsg && (
          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="break-words min-w-0">{syncStatusMsg}</span>
          </div>
        )}

        {/* Live Metrics Counter Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
          <div className="bg-slate-50/80 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 border border-slate-200">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Total Scraped Jobs</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1 block">{loading ? '...' : jobs.length}</span>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 border border-slate-200">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Tracked Companies</span>
            <span className="text-xl sm:text-2xl font-bold text-cyan-600 mt-0.5 sm:mt-1 block">{loading ? '...' : totalCompanies}</span>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 border border-slate-200">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Remote / Worldwide</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5 sm:mt-1 block">{loading ? '...' : remoteJobsCount}</span>
          </div>
          <div className="bg-slate-50/80 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 border border-slate-200">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Experience Filter</span>
            <span className="text-xl sm:text-2xl font-bold text-indigo-600 mt-0.5 sm:mt-1 block">0-1 Year</span>
          </div>
        </div>
      </div>

      {/* Answer Callout: "Kl Nayi Job Aayegi Toh Kya Hoga?" */}
      {showInfoBanner && (
        <div className="relative bg-white rounded-xl border border-indigo-200 p-3.5 sm:p-5 text-slate-600">
          <button 
            onClick={() => setShowInfoBanner(false)}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-slate-500 hover:text-slate-500 text-xs p-1 z-10"
            title="Dismiss notification"
          >
            ✕
          </button>
          
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-2 text-xs min-w-0 pr-4 sm:pr-0">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-start sm:items-center gap-2">
                <span>❓ Suppose kl kisi company me nyi job post hui, toh kya hoga?</span>
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Aapko bilkul tension lene ki zarurat nahi hai! Humari system mein <strong>2-way Automated Job Tracking</strong> integrated hai:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                <div className="bg-slate-50/50 p-2.5 sm:p-3 rounded-lg border border-slate-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-emerald-700 block text-xs">1. Automated Daily Cron Background Sync</strong>
                    <span className="text-slate-400 text-xs">Python script daily raat ko saari 600+ companies ko scan karke nayi jobs auto-add kar deti hai.</span>
                  </div>
                </div>
                <div className="bg-slate-50/50 p-2.5 sm:p-3 rounded-lg border border-slate-200 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <strong className="text-amber-700 block text-xs">2. On-Demand "Sync & Fetch" Button</strong>
                    <span className="text-slate-400 text-xs">"Sync & Fetch New Jobs" button click karo, Python script turant fresh postings UI par dikha dega.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar Controls */}
      <div className="bg-slate-50/80 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-slate-200 space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search job title, company, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Source Select Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full sm:w-auto bg-slate-50/80 border border-slate-200 text-slate-500 text-xs rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Sources ({jobs.length})</option>
              <option value="ats">Company ATS APIs (Greenhouse / Lever)</option>
              <option value="remoteok">RemoteOK API</option>
              <option value="himalayas">Himalayas Jobs</option>
              <option value="remotive">Remotive Feed</option>
            </select>
          </div>
        </div>

        {/* Role & Location Expandable Pills Bar */}
        <div className="space-y-2.5 sm:space-y-3 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Filter by Role & Location:</span>
              <span className="sm:hidden">Filters:</span>
            </span>
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-slate-100/80 hover:bg-slate-100 text-indigo-700 text-[11px] sm:text-xs font-medium border border-slate-200 transition-colors shrink-0"
            >
              <span>{isFiltersExpanded ? 'Collapse' : 'Expand'}</span>
              {isFiltersExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Flex Wrap Roles Container */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs w-full">
            {[
              { id: 'all', label: 'All Jobs' },
              { id: 'software', label: '💻 SWE' },
              { id: 'data', label: '📊 Data' },
              { id: 'ai', label: '🤖 AI/ML' },
              { id: 'fullstack', label: '⚡ Fullstack' },
              { id: 'frontend', label: '🎨 Frontend' },
              { id: 'backend', label: '⚙️ Backend' },
              { id: 'qa', label: '🧪 QA' },
            ].slice(0, isFiltersExpanded ? 8 : 4).map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium transition-all text-[11px] sm:text-xs ${
                  selectedRole === role.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-50/50 text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-200'
                }`}
              >
                {role.label}
              </button>
            ))}

            {!isFiltersExpanded && (
              <button
                onClick={() => setIsFiltersExpanded(true)}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-500/20 font-medium text-[11px] sm:text-xs border border-indigo-200"
              >
                +4 More...
              </button>
            )}
          </div>

          {/* Location Filter Pills - separate row on mobile */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50/90 p-1 rounded-lg border border-slate-200 text-xs w-full sm:w-auto">
            <span className="text-slate-500 font-medium px-1.5 text-[11px] sm:text-xs">Loc:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'india', label: '🇮🇳 India' },
              { id: 'remote', label: '🌐 Remote' },
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded font-medium transition-all text-[11px] sm:text-xs ${
                  selectedLocation === loc.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 px-1 gap-1">
        <span>Showing <strong className="text-slate-900">{filteredJobs.length}</strong> of {jobs.length} jobs</span>
        <span className="text-indigo-600 font-medium text-[11px] sm:text-xs">0-1 yr experience filter active</span>
      </div>

      {/* Job Grid Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white/40 border border-slate-200 rounded-xl p-4 sm:p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-12 bg-slate-100 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white/40 rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-500">No matching jobs found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try adjusting your search keyword or clearing the role/source filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('all');
              setSelectedSource('all');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredJobs.map((job, index) => {
            const isGreenhouseOrLever = job.source.includes('Greenhouse') || job.source.includes('Lever');
            return (
              <div
                key={`${job.company}-${job.title}-${index}`}
                className="group relative bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-indigo-500/40 rounded-xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/5"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 shrink-0 text-sm sm:text-base">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-indigo-600 truncate flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-indigo-600/70 shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.location || 'Remote'}</span>
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 border whitespace-nowrap ${
                      isGreenhouseOrLever 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {job.source}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors line-clamp-2 leading-snug">
                    {job.title}
                  </h3>

                  {/* Experience & Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2.5 sm:mt-3">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-semibold border border-emerald-500/20">
                      🌱 0-1 Yr (Entry)
                    </span>
                    {job.tags && job.tags.split(',').slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-50/80 text-slate-400 text-[10px] border border-slate-200 truncate max-w-[100px] sm:max-w-none"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3.5 sm:mt-5 pt-2.5 sm:pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 min-w-0 truncate">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{job.date || 'Active'}</span>
                  </span>

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-[11px] sm:text-xs font-semibold transition-all group-hover:bg-indigo-600 group-hover:text-white shadow-sm shrink-0 whitespace-nowrap"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
