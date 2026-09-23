import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Layers,
  Calculator,
  Plus,
  Download,
  RotateCcw,
  Sparkles,
  Server,
  Database,
  Cpu,
  Globe,
  Radio,
  HardDrive,
  Share2,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { EstimationEnginePanel } from './common/EstimationEnginePanel';

// Architecture Blueprint Presets
const PRESET_BLUEPRINTS: Record<string, { title: string; description: string; nodes: Node[]; edges: Edge[] }> = {
  tinyurl: {
    title: 'URL Shortener (TinyURL)',
    description: 'Scalable URL shortening & redirection architecture with Redis cache & MySQL database.',
    nodes: [
      { id: '1', position: { x: 50, y: 150 }, data: { label: '📱 Client App / Browser' }, style: { background: '#0F172A', color: '#38BDF8', border: '1px solid #0284C7', borderRadius: '12px', padding: '10px' } },
      { id: '2', position: { x: 280, y: 150 }, data: { label: '⚖️ Nginx Load Balancer' }, style: { background: '#0F172A', color: '#34D399', border: '1px solid #059669', borderRadius: '12px', padding: '10px' } },
      { id: '3', position: { x: 500, y: 80 }, data: { label: '⚡ URL Writer Service' }, style: { background: '#0F172A', color: '#FBBF24', border: '1px solid #D97706', borderRadius: '12px', padding: '10px' } },
      { id: '4', position: { x: 500, y: 220 }, data: { label: '🔗 URL Redirector Service' }, style: { background: '#0F172A', color: '#FBBF24', border: '1px solid #D97706', borderRadius: '12px', padding: '10px' } },
      { id: '5', position: { x: 740, y: 220 }, data: { label: '🚀 Redis Cache (80/20 URLs)' }, style: { background: '#0F172A', color: '#C084FC', border: '1px solid #9333EA', borderRadius: '12px', padding: '10px' } },
      { id: '6', position: { x: 740, y: 80 }, data: { label: '💾 MySQL DB (Url Mapping)' }, style: { background: '#0F172A', color: '#F472B6', border: '1px solid #DB2777', borderRadius: '12px', padding: '10px' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-4', source: '2', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4-5', source: '4', target: '5', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e5-6', source: '5', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-6', source: '3', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },
  chat: {
    title: 'Real-time Chat App (WhatsApp/Slack)',
    description: 'WebSocket gateway with Redis Pub/Sub, Kafka queue & Cassandra message archive.',
    nodes: [
      { id: '1', position: { x: 50, y: 150 }, data: { label: '📱 Mobile / Web Client' }, style: { background: '#0F172A', color: '#38BDF8', border: '1px solid #0284C7', borderRadius: '12px', padding: '10px' } },
      { id: '2', position: { x: 280, y: 150 }, data: { label: '📡 WebSocket Gateway' }, style: { background: '#0F172A', color: '#34D399', border: '1px solid #059669', borderRadius: '12px', padding: '10px' } },
      { id: '3', position: { x: 520, y: 80 }, data: { label: '🔄 Redis Pub/Sub Session Router' }, style: { background: '#0F172A', color: '#C084FC', border: '1px solid #9333EA', borderRadius: '12px', padding: '10px' } },
      { id: '4', position: { x: 520, y: 220 }, data: { label: '📥 Kafka Message Queue' }, style: { background: '#0F172A', color: '#FBBF24', border: '1px solid #D97706', borderRadius: '12px', padding: '10px' } },
      { id: '5', position: { x: 760, y: 220 }, data: { label: '🗄 Cassandra DB (Chat History)' }, style: { background: '#0F172A', color: '#F472B6', border: '1px solid #DB2777', borderRadius: '12px', padding: '10px' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-4', source: '2', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },
  streaming: {
    title: 'Video Streaming Platform (YouTube/Netflix)',
    description: 'Distributed video uploading, HLS Transcoding worker pool, Cloudflare CDN & S3 Storage.',
    nodes: [
      { id: '1', position: { x: 50, y: 150 }, data: { label: '🌐 Video Viewer / Browser' }, style: { background: '#0F172A', color: '#38BDF8', border: '1px solid #0284C7', borderRadius: '12px', padding: '10px' } },
      { id: '2', position: { x: 260, y: 150 }, data: { label: '🌍 Cloudflare CDN Edge' }, style: { background: '#0F172A', color: '#34D399', border: '1px solid #059669', borderRadius: '12px', padding: '10px' } },
      { id: '3', position: { x: 480, y: 80 }, data: { label: '🎬 Video Upload API' }, style: { background: '#0F172A', color: '#FBBF24', border: '1px solid #D97706', borderRadius: '12px', padding: '10px' } },
      { id: '4', position: { x: 480, y: 230 }, data: { label: '⚙️ Transcoder Worker Pool' }, style: { background: '#0F172A', color: '#C084FC', border: '1px solid #9333EA', borderRadius: '12px', padding: '10px' } },
      { id: '5', position: { x: 720, y: 150 }, data: { label: '📦 AWS S3 Video Object Store' }, style: { background: '#0F172A', color: '#F472B6', border: '1px solid #DB2777', borderRadius: '12px', padding: '10px' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2-5', source: '2', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
    ],
  },
};

export const SystemDesignCanvas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'calculator'>('canvas');

  const [nodes, setNodes] = useState<Node[]>(PRESET_BLUEPRINTS.tinyurl.nodes);
  const [edges, setEdges] = useState<Edge[]>(PRESET_BLUEPRINTS.tinyurl.edges);
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('tinyurl');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    []
  );

  const handleSelectBlueprint = (key: string) => {
    setSelectedBlueprint(key);
    if (PRESET_BLUEPRINTS[key]) {
      setNodes(PRESET_BLUEPRINTS[key].nodes);
      setEdges(PRESET_BLUEPRINTS[key].edges);
    }
  };

  const handleAddNode = (label: string, colorClass: string, borderHex: string) => {
    const newId = `node_${Date.now()}`;
    const newNode: Node = {
      id: newId,
      position: { x: 300 + Math.random() * 100, y: 150 + Math.random() * 100 },
      data: { label },
      style: {
        background: '#0F172A',
        color: colorClass,
        border: `1px solid ${borderHex}`,
        borderRadius: '12px',
        padding: '10px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${selectedBlueprint}_architecture.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                System Design Studio & Estimator
              </h1>
              <p className="text-xs text-slate-400">
                Visual architecture canvas and back-of-the-envelope capacity estimator for HLD interviews.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Capacity Estimator</span>
          </button>
        </div>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'canvas' && (
        <div className="space-y-4">
          {/* Blueprint Selector & Tools Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Architecture Blueprint:</span>
              {Object.keys(PRESET_BLUEPRINTS).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectBlueprint(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedBlueprint === key
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {PRESET_BLUEPRINTS[key].title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => handleSelectBlueprint(selectedBlueprint)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Component Palette */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-purple-400" /> Add Component:
            </span>

            <button
              onClick={() => handleAddNode('⚖️ Nginx Load Balancer', '#34D399', '#059669')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-medium shrink-0 transition"
            >
              + Load Balancer
            </button>

            <button
              onClick={() => handleAddNode('🔑 API Gateway', '#38BDF8', '#0284C7')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 text-xs font-medium shrink-0 transition"
            >
              + API Gateway
            </button>

            <button
              onClick={() => handleAddNode('⚡ Microservice Node', '#FBBF24', '#D97706')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-medium shrink-0 transition"
            >
              + Microservice
            </button>

            <button
              onClick={() => handleAddNode('🚀 Redis Cache', '#C084FC', '#9333EA')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-500/30 text-xs font-medium shrink-0 transition"
            >
              + Redis Cache
            </button>

            <button
              onClick={() => handleAddNode('💾 PostgreSQL DB', '#F472B6', '#DB2777')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-pink-400 border border-pink-500/30 text-xs font-medium shrink-0 transition"
            >
              + Postgres DB
            </button>

            <button
              onClick={() => handleAddNode('📥 Kafka Queue', '#F87171', '#DC2626')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/30 text-xs font-medium shrink-0 transition"
            >
              + Kafka Queue
            </button>

            <button
              onClick={() => handleAddNode('📦 AWS S3 Storage', '#A7F3D0', '#10B981')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-medium shrink-0 transition"
            >
              + S3 Storage
            </button>
          </div>

          {/* Main React Flow Canvas Window */}
          <div className="w-full h-[620px] bg-slate-950 rounded-3xl border border-slate-800 p-2 shadow-2xl relative overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background color="#1E293B" gap={18} size={1} />
              <Controls />
            </ReactFlow>

            {/* Floating Blueprint Info Card */}
            <div className="absolute top-4 left-4 z-10 max-w-sm bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-1">
              <h4 className="text-xs font-black text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {PRESET_BLUEPRINTS[selectedBlueprint]?.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {PRESET_BLUEPRINTS[selectedBlueprint]?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <EstimationEnginePanel />
      )}
    </div>
  );
};
