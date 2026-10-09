import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Server,
  Database,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Activity,
  Flame,
  HelpCircle,
  Maximize2,
  Minimize2,
  HardDrive,
  Workflow
} from 'lucide-react';

export type ArchitectureScenario = 'load_balancer' | 'cache_aside' | 'message_queue' | 'db_replication';

interface SimulatorNode {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  w: number;
  h: number;
  icon?: string;
  status: 'healthy' | 'warning' | 'critical' | 'dead';
  loadPercent: number; // 0 to 100
  capacity: number; // max req/s
  color?: string;
  infoTitle?: string;
  infoDescription?: string;
}

interface SimulatorEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  color?: string;
}

interface Particle {
  id: number;
  edgeIndex: number;
  fromNodeId: string;
  toNodeId: string;
  progress: number; // 0 to 1
  speed: number;
  color?: string;
  size?: number;
  isError?: boolean;
}

export const InteractiveSystemFlowSimulator: React.FC<{
  initialScenario?: ArchitectureScenario;
  compact?: boolean;
}> = ({ initialScenario = 'load_balancer', compact = false }) => {
  const [scenario, setScenario] = useState<ArchitectureScenario>(initialScenario);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [trafficRate, setTrafficRate] = useState<number>(35); // requests per second (10 - 250)
  const [serverCount, setServerCount] = useState<number>(1); // For load balancer scenario: 1 to 4
  const [deadServerId, setDeadServerId] = useState<string | null>(null); // chaos simulation
  const [cacheEnabled, setCacheEnabled] = useState<boolean>(true);
  const [cacheHitRatio, setCacheHitRatio] = useState<number>(85); // 0 to 100%
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('server_1');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Stats calculation
  const totalCapacity = useMemo(() => {
    if (scenario === 'load_balancer') {
      const activeServers = serverCount - (deadServerId ? 1 : 0);
      return Math.max(activeServers * 40, 40);
    }
    if (scenario === 'cache_aside') {
      return cacheEnabled ? 180 : 50;
    }
    if (scenario === 'message_queue') {
      return 150;
    }
    return 120;
  }, [scenario, serverCount, deadServerId, cacheEnabled]);

  const isOverloaded = trafficRate > totalCapacity;
  const isNearCapacity = trafficRate > totalCapacity * 0.75 && !isOverloaded;

  const latencyMs = useMemo(() => {
    if (isOverloaded) {
      const factor = (trafficRate - totalCapacity) / 20;
      return Math.round(120 + factor * 140 + Math.random() * 30);
    }
    if (scenario === 'cache_aside' && cacheEnabled) {
      // 85% hit cache (2ms), 15% hit db (45ms)
      const avg = (cacheHitRatio / 100) * 4 + ((100 - cacheHitRatio) / 100) * 48;
      return Math.round(avg + Math.random() * 4);
    }
    if (scenario === 'message_queue') {
      return 8 + Math.round(Math.random() * 4); // fast ack from queue
    }
    return Math.round(22 + (trafficRate / totalCapacity) * 15 + Math.random() * 5);
  }, [trafficRate, totalCapacity, isOverloaded, scenario, cacheEnabled, cacheHitRatio]);

  const errorRatePercent = useMemo(() => {
    if (isOverloaded) {
      const excess = trafficRate - totalCapacity;
      return Math.min(Math.round((excess / trafficRate) * 100), 45);
    }
    if (deadServerId && serverCount === 1) return 100;
    return 0;
  }, [isOverloaded, trafficRate, totalCapacity, deadServerId, serverCount]);

  // Scenario Node & Edge Definitions
  const { nodes, edges } = useMemo(() => {
    const list: SimulatorNode[] = [];
    const edgeList: SimulatorEdge[] = [];

    if (scenario === 'load_balancer') {
      list.push({
        id: 'client',
        label: 'Client Apps',
        role: 'Web & Mobile',
        x: 100,
        y: 200,
        w: 120,
        h: 56,
        status: 'healthy',
        loadPercent: Math.min(Math.round((trafficRate / 200) * 100), 100),
        capacity: 999,
        infoTitle: 'Client Application Layer',
        infoDescription: 'Browsers, mobile clients, and external API consumers dispatching HTTP/REST and WebSocket requests.'
      });

      if (serverCount > 1) {
        list.push({
          id: 'lb',
          label: 'Load Balancer',
          role: 'Nginx / ALB',
          x: 290,
          y: 200,
          w: 130,
          h: 56,
          status: 'healthy',
          loadPercent: Math.min(Math.round((trafficRate / 300) * 100), 100),
          capacity: 500,
          infoTitle: 'Reverse Proxy & Load Balancer',
          infoDescription: 'Terminates TLS, health-checks upstream servers, and distributes incoming requests using Round Robin or Weighted Least Connections.'
        });
        edgeList.push({ from: 'client', to: 'lb' });
      }

      // Servers
      const serverStartY = serverCount === 1 ? 200 : serverCount === 2 ? 140 : serverCount === 3 ? 110 : 80;
      const serverGapY = serverCount === 1 ? 0 : serverCount === 2 ? 120 : serverCount === 3 ? 90 : 80;

      for (let i = 0; i < serverCount; i++) {
        const sId = `server_${i + 1}`;
        const isDead = deadServerId === sId;
        const activeServers = Math.max(serverCount - (deadServerId ? 1 : 0), 1);
        const serverTraffic = isDead ? 0 : trafficRate / activeServers;
        const sLoad = isDead ? 0 : Math.min(Math.round((serverTraffic / 40) * 100), 100);

        list.push({
          id: sId,
          label: `App Server ${i + 1}`,
          role: isDead ? 'OFFLINE (Crashed)' : 'Node.js / Go',
          x: 530,
          y: serverStartY + i * serverGapY,
          w: 130,
          h: 56,
          status: isDead ? 'dead' : sLoad >= 90 ? 'critical' : sLoad >= 70 ? 'warning' : 'healthy',
          loadPercent: sLoad,
          capacity: 40,
          infoTitle: `App Server Node ${i + 1}`,
          infoDescription: isDead
            ? 'Server crashed! Health-check ping failed. Load balancer stops routing requests here.'
            : `Stateless application container. Processing business logic. Load: ${sLoad}% (${Math.round(serverTraffic)} req/s).`
        });

        if (serverCount > 1) {
          edgeList.push({ from: 'lb', to: sId, dashed: isDead });
        } else {
          edgeList.push({ from: 'client', to: sId, dashed: isDead });
        }

        // Server to Database
        edgeList.push({ from: sId, to: 'database', dashed: isDead });
      }

      list.push({
        id: 'database',
        label: 'PostgreSQL DB',
        role: 'Primary ACID',
        x: 770,
        y: 200,
        w: 130,
        h: 56,
        status: isOverloaded ? 'warning' : 'healthy',
        loadPercent: Math.min(Math.round((trafficRate / 180) * 100), 100),
        capacity: 180,
        infoTitle: 'Relational Database (PostgreSQL)',
        infoDescription: 'Persistent transactional storage with connection pooling. Writes and complex joins consume connection slots.'
      });
    } else if (scenario === 'cache_aside') {
      list.push({
        id: 'client',
        label: 'Client App',
        role: 'HTTP Requests',
        x: 100,
        y: 200,
        w: 120,
        h: 56,
        status: 'healthy',
        loadPercent: 40,
        capacity: 500,
        infoTitle: 'Client Layer',
        infoDescription: 'Queries items like User Profile, Feed, or Product Details.'
      });

      list.push({
        id: 'server',
        label: 'API Server',
        role: 'FastAPI / Go',
        x: 320,
        y: 200,
        w: 130,
        h: 56,
        status: 'healthy',
        loadPercent: Math.min(Math.round((trafficRate / 180) * 100), 100),
        capacity: 200,
        infoTitle: 'API Gateway & Service',
        infoDescription: 'Implements Cache-Aside: checks Redis first; on miss, queries Postgres and populates Redis.'
      });
      edgeList.push({ from: 'client', to: 'server' });

      // Cache Node
      const cacheLoad = cacheEnabled ? Math.min(Math.round((trafficRate / 250) * 100), 100) : 0;
      list.push({
        id: 'redis',
        label: 'Redis Cache',
        role: cacheEnabled ? `${cacheHitRatio}% Hit Ratio` : 'BYPASSED / OFF',
        x: 580,
        y: 110,
        w: 140,
        h: 56,
        status: !cacheEnabled ? 'dead' : 'healthy',
        loadPercent: cacheLoad,
        capacity: 500,
        infoTitle: 'Redis In-Memory Key-Value Store',
        infoDescription: cacheEnabled
          ? `Sub-millisecond latency. Absorbs ${cacheHitRatio}% of read requests, protecting the DB from saturation.`
          : 'Cache disabled! All read queries fall back directly to the relational database.'
      });
      edgeList.push({ from: 'server', to: 'redis', dashed: !cacheEnabled });

      // Database Node
      const effectiveDbTraffic = cacheEnabled
        ? trafficRate * ((100 - cacheHitRatio) / 100)
        : trafficRate;
      const dbLoad = Math.min(Math.round((effectiveDbTraffic / 50) * 100), 100);

      list.push({
        id: 'database',
        label: 'PostgreSQL DB',
        role: cacheEnabled ? 'Cache Misses Only' : 'FULL TRAFFIC HIT!',
        x: 580,
        y: 290,
        w: 140,
        h: 56,
        status: dbLoad >= 90 ? 'critical' : dbLoad >= 65 ? 'warning' : 'healthy',
        loadPercent: dbLoad,
        capacity: 50,
        infoTitle: 'Relational Database',
        infoDescription: cacheEnabled
          ? `DB is protected! Only receives ${Math.round(100 - cacheHitRatio)}% of queries (${Math.round(effectiveDbTraffic)} req/s).`
          : 'DB is overwhelmed! Without caching, high read load exhausts database connection pools.'
      });
      edgeList.push({ from: 'server', to: 'database' });
    } else if (scenario === 'message_queue') {
      list.push({
        id: 'client',
        label: 'Burst Traffic',
        role: '10k Orders / min',
        x: 80,
        y: 200,
        w: 120,
        h: 56,
        status: 'healthy',
        loadPercent: Math.min(Math.round((trafficRate / 180) * 100), 100),
        capacity: 999,
        infoTitle: 'High Volume Producer',
        infoDescription: 'Flash sales or sudden traffic surges publishing order events.'
      });

      list.push({
        id: 'producer',
        label: 'Order Ingestion API',
        role: 'Fast ACK (1ms)',
        x: 260,
        y: 200,
        w: 140,
        h: 56,
        status: 'healthy',
        loadPercent: Math.min(Math.round((trafficRate / 180) * 100), 100),
        capacity: 250,
        infoTitle: 'Ingestion Service',
        infoDescription: 'Accepts order, writes to Kafka topic in <2ms, and immediately returns HTTP 202 Accepted to user.'
      });
      edgeList.push({ from: 'client', to: 'producer' });

      // Kafka Buffer
      const bufferFill = Math.min(Math.round((trafficRate / 120) * 75), 100);
      list.push({
        id: 'kafka',
        label: 'Apache Kafka',
        role: 'Distributed Log Queue',
        x: 480,
        y: 200,
        w: 140,
        h: 56,
        status: 'healthy',
        loadPercent: bufferFill,
        capacity: 400,
        infoTitle: 'Kafka Message Queue / Partition Buffer',
        infoDescription: 'Decouples producer and consumer. Buffers messages safely on disk so downstream consumers are not crushed.'
      });
      edgeList.push({ from: 'producer', to: 'kafka' });

      // Worker 1
      list.push({
        id: 'worker1',
        label: 'Payment Worker',
        role: 'Consumer Pool A',
        x: 710,
        y: 130,
        w: 130,
        h: 56,
        status: 'healthy',
        loadPercent: 60,
        capacity: 60,
        infoTitle: 'Payment Processing Consumer',
        infoDescription: 'Pulls orders at a controlled rate and speaks with payment gateways without timing out.'
      });
      edgeList.push({ from: 'kafka', to: 'worker1' });

      // Worker 2
      list.push({
        id: 'worker2',
        label: 'Inventory Worker',
        role: 'Consumer Pool B',
        x: 710,
        y: 270,
        w: 130,
        h: 56,
        status: 'healthy',
        loadPercent: 55,
        capacity: 60,
        infoTitle: 'Inventory & Notification Consumer',
        infoDescription: 'Deducts stock and dispatches email/SMS confirmation messages.'
      });
      edgeList.push({ from: 'kafka', to: 'worker2' });

      list.push({
        id: 'database',
        label: 'Warehouse DB',
        role: 'Smooth Writes',
        x: 910,
        y: 200,
        w: 120,
        h: 56,
        status: 'healthy',
        loadPercent: 45,
        capacity: 100,
        infoTitle: 'Data Store',
        infoDescription: 'Receives consistent, paced writes instead of a destructive sudden traffic spike.'
      });
      edgeList.push({ from: 'worker1', to: 'database' });
      edgeList.push({ from: 'worker2', to: 'database' });
    } else {
      // db_replication
      list.push({
        id: 'client',
        label: 'App Traffic',
        role: '80% Read / 20% Write',
        x: 100,
        y: 200,
        w: 120,
        h: 56,
        status: 'healthy',
        loadPercent: 60,
        capacity: 999,
        infoTitle: 'Application Layer',
        infoDescription: 'Generates both mutation writes and high-volume read queries.'
      });

      list.push({
        id: 'router',
        label: 'Database Proxy',
        role: 'Read/Write Splitter',
        x: 310,
        y: 200,
        w: 130,
        h: 56,
        status: 'healthy',
        loadPercent: 50,
        capacity: 400,
        infoTitle: 'SQL Proxy (e.g. ProxySQL / pgBouncer)',
        infoDescription: 'Inspects SQL AST: routes INSERT/UPDATE/DELETE to Primary DB, and routes SELECT queries to Read Replicas.'
      });
      edgeList.push({ from: 'client', to: 'router' });

      // Primary
      list.push({
        id: 'primary',
        label: 'Primary DB (Master)',
        role: 'Writes & WAL Stream',
        x: 580,
        y: 110,
        w: 140,
        h: 56,
        status: 'healthy',
        loadPercent: 35,
        capacity: 80,
        infoTitle: 'Primary Database Master',
        infoDescription: 'Single source of truth for all writes. Commits to Write-Ahead Log (WAL) and streams binlog to replicas asynchronously.'
      });
      edgeList.push({ from: 'router', to: 'primary' });

      // Replica 1
      list.push({
        id: 'rep1',
        label: 'Read Replica 1',
        role: 'Read Traffic Node',
        x: 580,
        y: 230,
        w: 140,
        h: 56,
        status: 'healthy',
        loadPercent: 50,
        capacity: 90,
        infoTitle: 'Read Replica 1',
        infoDescription: 'Read-only mirror answering user feed and catalog queries.'
      });
      edgeList.push({ from: 'router', to: 'rep1' });
      edgeList.push({ from: 'primary', to: 'rep1', dashed: true });

      // Replica 2
      list.push({
        id: 'rep2',
        label: 'Read Replica 2',
        role: 'Read Traffic Node',
        x: 580,
        y: 330,
        w: 140,
        h: 56,
        status: 'healthy',
        loadPercent: 48,
        capacity: 90,
        infoTitle: 'Read Replica 2',
        infoDescription: 'Horizontal read scaling. If Primary crashes, one replica can be promoted to Primary.'
      });
      edgeList.push({ from: 'router', to: 'rep2' });
      edgeList.push({ from: 'primary', to: 'rep2', dashed: true });
    }

    return { nodes: list, edges: edgeList };
  }, [scenario, serverCount, deadServerId, cacheEnabled, cacheHitRatio, trafficRate, isOverloaded]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null;
  }, [nodes, selectedNodeId]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let particleCounter = 0;

    // Responsive DPI scaling
    const updateCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = compact ? 340 : 420;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    // Particle Spawner based on trafficRate
    const spawnTimer = setInterval(() => {
      if (!isPlaying) return;

      // Rate determines count of particles spawned
      const spawnChance = Math.min(trafficRate / 40, 4);
      for (let i = 0; i < spawnChance; i++) {
        if (edges.length === 0) break;
        // Select an edge starting from client or first stage
        const firstStageEdges = edges.filter(
          (e) => e.from === 'client' || e.from === 'lb' || e.from === 'router'
        );
        const candidateEdge = firstStageEdges.length > 0
          ? firstStageEdges[Math.floor(Math.random() * firstStageEdges.length)]
          : edges[Math.floor(Math.random() * edges.length)];

        if (!candidateEdge || candidateEdge.dashed) continue;

        const isErr = isOverloaded && Math.random() < 0.28;

        particles.push({
          id: ++particleCounter,
          edgeIndex: edges.indexOf(candidateEdge),
          fromNodeId: candidateEdge.from,
          toNodeId: candidateEdge.to,
          progress: 0,
          speed: 0.007 + Math.random() * 0.006,
          color: isErr ? '#ef4444' : '#38bdf8',
          size: isErr ? 4.5 : 3.5,
          isError: isErr
        });
      }
    }, 100);

    const render = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : 900;
      const h = compact ? 340 : 420;

      ctx.clearRect(0, 0, w, h);

      // Background Grid Pattern (Cyber / Technical Aesthetic)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // Node lookup map
      const nodeMap = new Map<string, SimulatorNode>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      // ── DRAW EDGES (BEZIER WIRES) ──
      edges.forEach((edge) => {
        const source = nodeMap.get(edge.from);
        const target = nodeMap.get(edge.to);
        if (!source || !target) return;

        // Auto scale coordinates horizontally if canvas width changed
        const scaleX = w / 920;
        const sx = source.x * scaleX + source.w / 2;
        const sy = source.y;
        const tx = target.x * scaleX - target.w / 2;
        const ty = target.y;

        ctx.save();
        ctx.beginPath();
        if (edge.dashed) {
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)'; // Red dashed for dead connection
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        }
        ctx.lineWidth = 1.75;

        // Cubic Bezier midpoint curve
        const c1x = sx + (tx - sx) * 0.5;
        const c1y = sy;
        const c2x = sx + (tx - sx) * 0.5;
        const c2y = ty;

        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, tx, ty);
        ctx.stroke();
        ctx.restore();
      });

      // ── UPDATE & DRAW FLOWING PARTICLES (PACKETS) ──
      if (isPlaying) {
        particles.forEach((p) => {
          p.progress += p.speed;
        });

        // Chain particles from intermediate nodes to downstream nodes
        const activeParticles: Particle[] = [];
        particles.forEach((p) => {
          if (p.progress >= 1) {
            // Check if toNode has outgoing edges
            const downstreamEdges = edges.filter(
              (e) => e.from === p.toNodeId && !e.dashed
            );
            if (downstreamEdges.length > 0 && Math.random() < 0.9) {
              const nextEdge = downstreamEdges[Math.floor(Math.random() * downstreamEdges.length)];
              activeParticles.push({
                id: ++particleCounter,
                edgeIndex: edges.indexOf(nextEdge),
                fromNodeId: nextEdge.from,
                toNodeId: nextEdge.to,
                progress: 0,
                speed: p.speed,
                color: p.color,
                size: p.size,
                isError: p.isError
              });
            }
          } else {
            activeParticles.push(p);
          }
        });
        particles = activeParticles;
      }

      // Draw all active particles
      particles.forEach((p) => {
        const source = nodeMap.get(p.fromNodeId);
        const target = nodeMap.get(p.toNodeId);
        if (!source || !target) return;

        const scaleX = w / 920;
        const sx = source.x * scaleX + source.w / 2;
        const sy = source.y;
        const tx = target.x * scaleX - target.w / 2;
        const ty = target.y;

        const t = Math.max(0, Math.min(1, p.progress));
        const c1x = sx + (tx - sx) * 0.5;
        const c1y = sy;
        const c2x = sx + (tx - sx) * 0.5;
        const c2y = ty;

        // Bezier formula: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
        const cx =
          Math.pow(1 - t, 3) * sx +
          3 * Math.pow(1 - t, 2) * t * c1x +
          3 * (1 - t) * Math.pow(t, 2) * c2x +
          Math.pow(t, 3) * tx;
        const cy =
          Math.pow(1 - t, 3) * sy +
          3 * Math.pow(1 - t, 2) * t * c1y +
          3 * (1 - t) * Math.pow(t, 2) * c2y +
          Math.pow(t, 3) * ty;

        ctx.save();
        ctx.shadowBlur = p.isError ? 12 : 8;
        ctx.shadowColor = p.color || '#38bdf8';
        ctx.fillStyle = p.color || '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, p.size || 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── DRAW SYSTEM NODES ──
      nodes.forEach((n) => {
        const scaleX = w / 920;
        const nx = n.x * scaleX;
        const ny = n.y;
        const nw = n.w;
        const nh = n.h;
        const isSelected = selectedNodeId === n.id;

        ctx.save();

        // Node Box Background & Border
        ctx.beginPath();
        ctx.roundRect(nx - nw / 2, ny - nh / 2, nw, nh, 12);

        if (n.status === 'dead') {
          ctx.fillStyle = '#181216';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
        } else if (n.status === 'critical') {
          ctx.fillStyle = '#1c1317';
          ctx.strokeStyle = isSelected ? '#f87171' : 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = isSelected ? 2 : 1.5;
        } else if (isSelected) {
          ctx.fillStyle = '#151b28';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
        } else {
          ctx.fillStyle = '#0f141e';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.lineWidth = 1;
        }

        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Node Text
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Title
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillStyle = n.status === 'dead' ? '#94a3b8' : '#ffffff';
        ctx.fillText(n.label, nx, ny - 8);

        // Subtitle / Role
        ctx.font = '500 10px monospace';
        if (n.status === 'dead') {
          ctx.fillStyle = '#ef4444';
        } else if (n.status === 'critical') {
          ctx.fillStyle = '#f87171';
        } else if (n.status === 'warning') {
          ctx.fillStyle = '#fbbf24';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        }
        ctx.fillText(n.role, nx, ny + 10);
        ctx.restore();

        // Live Load Progress Bar underneath the box (exact feature from video!)
        if (n.status !== 'dead') {
          const barW = nw - 24;
          const barH = 3;
          const barX = nx - barW / 2;
          const barY = ny + nh / 2 - 5;

          // Track
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.beginPath();
          ctx.roundRect(barX, barY, barW, barH, 2);
          ctx.fill();

          // Fill
          const fillW = Math.max(2, (barW * n.loadPercent) / 100);
          ctx.fillStyle =
            n.loadPercent >= 90
              ? '#ef4444'
              : n.loadPercent >= 70
              ? '#fbbf24'
              : '#38bdf8';
          ctx.beginPath();
          ctx.roundRect(barX, barY, fillW, barH, 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [nodes, edges, trafficRate, isPlaying, isOverloaded, selectedNodeId, compact]);

  // Click detection for nodes on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const parent = canvas.parentElement;
    const w = parent ? parent.clientWidth : 900;
    const scaleX = w / 920;

    for (const node of nodes) {
      const nx = node.x * scaleX;
      const ny = node.y;
      if (
        clickX >= nx - node.w / 2 &&
        clickX <= nx + node.w / 2 &&
        clickY >= ny - node.h / 2 &&
        clickY <= ny + node.h / 2
      ) {
        setSelectedNodeId(node.id);
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#080b11] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'w-full'
      }`}
    >
      {/* ── TOP CONTROL & SCENARIO BAR ── */}
      <div className="bg-[#0c101a] border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Scenario Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1 shrink-0">
            <Workflow className="w-3.5 h-3.5 text-purple-400" /> Pattern:
          </span>

          <button
            onClick={() => {
              setScenario('load_balancer');
              setSelectedNodeId('server_1');
              setDeadServerId(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              scenario === 'load_balancer'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            ⚖️ Load Balancing & Scaling
          </button>

          <button
            onClick={() => {
              setScenario('cache_aside');
              setSelectedNodeId('redis');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              scenario === 'cache_aside'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            ⚡ Redis Cache-Aside
          </button>

          <button
            onClick={() => {
              setScenario('message_queue');
              setSelectedNodeId('kafka');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              scenario === 'message_queue'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            📥 Async Kafka Queue
          </button>

          <button
            onClick={() => {
              setScenario('db_replication');
              setSelectedNodeId('primary');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              scenario === 'db_replication'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            🗄️ Master-Replica Replication
          </button>
        </div>

        {/* Global Controls: Play/Pause, Reset, Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Run
              </>
            )}
          </button>

          <button
            onClick={() => {
              setTrafficRate(35);
              setServerCount(1);
              setDeadServerId(null);
              setCacheEnabled(true);
              setCacheHitRatio(85);
            }}
            title="Reset Simulator"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── TELEMETRY HUD & INTERACTIVE CANVAS CONTAINER ── */}
      <div className="relative w-full bg-[#080b11] overflow-hidden select-none">
        {/* Real-time Telemetry HUD (Top-Left, matching video aesthetic) */}
        <div className="absolute top-4 left-5 z-10 pointer-events-none space-y-1 font-mono">
          <div className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
            Throughput Rate
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2">
            <span>{String(trafficRate).padStart(3, '0')}</span>
            <span className="text-xs font-medium text-slate-400">req / s</span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isOverloaded
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : isNearCapacity
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isOverloaded ? (
                <>
                  <ShieldAlert className="w-3 h-3" /> OVERLOADED
                </>
              ) : isNearCapacity ? (
                <>
                  <AlertTriangle className="w-3 h-3" /> HIGH LOAD
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" /> BALANCED
                </>
              )}
            </span>

            <span className="text-[11px] text-slate-400">
              p99: <strong className="text-slate-200">{latencyMs}ms</strong>
            </span>

            {errorRatePercent > 0 && (
              <span className="text-[11px] text-red-400 font-bold">
                Errors: {errorRatePercent}%
              </span>
            )}
          </div>
        </div>

        {/* Top-Right Quick Scenario Status Tip */}
        <div className="hidden sm:block absolute top-4 right-5 z-10 pointer-events-none text-right font-mono text-xs">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Active Pattern</div>
          <div className="text-slate-200 font-semibold capitalize">
            {scenario.replace('_', ' ')}
          </div>
          <div className="text-[10px] text-purple-400">Click any box to inspect</div>
        </div>

        {/* The Animated Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full cursor-pointer block"
        />
      </div>

      {/* ── INTERACTIVE EXPERIMENT & CHAOS CONTROLS ── */}
      <div className="bg-[#0b0e17] border-t border-slate-800 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Traffic Control Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" /> Incoming Traffic
            </span>
            <span className="font-mono text-purple-400 font-bold">{trafficRate} req/s</span>
          </div>

          <input
            type="range"
            min="10"
            max="260"
            step="5"
            value={trafficRate}
            onChange={(e) => setTrafficRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10 (Idle)</span>
            <span>80 (Peak)</span>
            <span>260 (DDoS / Spike)</span>
          </div>
        </div>

        {/* Column 2: Scenario-specific Action Buttons */}
        <div className="space-y-2">
          <span className="font-bold text-slate-300 text-xs block">
            {scenario === 'load_balancer' && '⚙️ Horizontal Scaling & Chaos'}
            {scenario === 'cache_aside' && '⚡ Redis Cache Optimization'}
            {scenario === 'message_queue' && '📥 Queue Burst Injection'}
            {scenario === 'db_replication' && '🗄️ Replication Controls'}
          </span>

          {scenario === 'load_balancer' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServerCount(Math.max(1, serverCount - 1))}
                  disabled={serverCount <= 1}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {serverCount} {serverCount === 1 ? 'Server' : 'Replicas'}
                </span>
                <button
                  onClick={() => setServerCount(Math.min(4, serverCount + 1))}
                  disabled={serverCount >= 4}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setDeadServerId(deadServerId ? null : 'server_1')}
                  className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    deadServerId
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      : 'bg-red-950/70 hover:bg-red-900 text-red-400 border-red-800'
                  }`}
                >
                  {deadServerId ? 'Revive Node 1' : 'Crash Node 1 (Chaos)'}
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                {serverCount === 1
                  ? 'Traffic spikes above 40 req/s will overload this single server.'
                  : 'Load balancer distributes traffic evenly across all active servers.'}
              </div>
            </div>
          )}

          {scenario === 'cache_aside' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCacheEnabled(!cacheEnabled)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    cacheEnabled
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : 'bg-red-950 text-red-400 border-red-800'
                  }`}
                >
                  {cacheEnabled ? 'Cache: ACTIVE (Redis)' : 'Cache: DISABLED (Stampede)'}
                </button>

                {cacheEnabled && (
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {cacheHitRatio}% Hit Rate
                  </span>
                )}
              </div>

              {cacheEnabled && (
                <input
                  type="range"
                  min="20"
                  max="98"
                  value={cacheHitRatio}
                  onChange={(e) => setCacheHitRatio(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              )}
            </div>
          )}

          {scenario === 'message_queue' && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setTrafficRate(220);
                  setTimeout(() => setTrafficRate(45), 4500);
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-700 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Simulate Black Friday Flash Sale Spike
              </button>
              <div className="text-[11px] text-slate-400">
                Messages accumulate in Kafka log buffer, protecting downstream DB workers.
              </div>
            </div>
          )}

          {scenario === 'db_replication' && (
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span>Primary DB (Master):</span>
                <span className="font-mono text-emerald-400 font-semibold">Write ONLY</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span>Read Replicas (x2):</span>
                <span className="font-mono text-sky-400 font-semibold">Load-Balanced</span>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Deep Educational Insight Box for Selected Node */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> System Design Insight
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {selectedNode?.label}
            </span>
          </div>

          <h4 className="text-xs font-bold text-white">
            {selectedNode?.infoTitle || 'Architectural Component'}
          </h4>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {selectedNode?.infoDescription || 'Click any component in the visualizer above to understand how it handles traffic, failover, and scaling in real interviews.'}
          </p>
        </div>
      </div>
    </div>
  );
};
