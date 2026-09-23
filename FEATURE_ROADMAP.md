# 🚀 AlgoVault — Comprehensive Feature Implementation Roadmap & Architecture Guide

This document provides an end-to-end technical blueprint for implementing next-generation features into **AlgoVault**. Each section details the architecture, required libraries, API endpoints, backend logic, and step-by-step frontend code structure.

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Feature 1: In-Browser Code Execution & AI Complexity Analyzer](#1-in-browser-code-execution--ai-complexity-analyzer)
3. [Feature 2: Interactive System Design Canvas & Estimation Engine](#2-interactive-system-design-canvas--estimation-engine)
4. [Feature 3: 1v1 Live Coding Arena (Real-time Multiplayer)](#3-1v1-live-coding-arena-real-time-multiplayer)
5. [Feature 4: AI Voice/Text Mock Interviewer & STAR Behavioral Builder](#4-ai-voicetext-mock-interviewer--star-behavioral-builder)
6. [Feature 5: One-Click PDF Cheat Sheet Generator & Readiness Predictor](#5-one-click-pdf-cheat-sheet-generator--readiness-predictor)
7. [Database Schemas & Data Flow](#-database-schemas--data-flow)

---

## 🏗 Architecture Overview

```
                      +---------------------------------------+
                      |         AlgoVault Client (Vite+React) |
                      +---------------------------------------+
                                          |
            +-----------------------------+-----------------------------+
            |                             |                             |
    +---------------+             +---------------+             +---------------+
    |  Monaco Code  |             |  React Flow   |             | WebSocket Client|
    |   Editor      |             | System Canvas |             |  (Socket.io)  |
    +---------------+             +---------------+             +---------------+
            |                             |                             |
            v                             v                             v
+-----------------------+     +-----------------------+     +-----------------------+
|  Execution Provider   |     | System Estimator Logic|     | Node.js Socket Server |
|  (Piston / Judge0)    |     |  (Client-side Math)   |     | (Matchmaking & Rooms) |
+-----------------------+     +-----------------------+     +-----------------------+
            |                                                           |
            v                                                           v
+-----------------------------------------------------------------------------------+
|                           Express Backend API (Node.js)                          |
|         - Gemini AI Service (/api/ai/code-review, /api/ai/mock-interview)         |
|         - Progress & Readiness Engine (/api/user/readiness)                      |
|         - MongoDB / PostgreSQL Persistence                                        |
+-----------------------------------------------------------------------------------+
```

---

## 1. In-Browser Code Execution & AI Complexity Analyzer

### 🎯 Objective
Allow users to write, test, execute C++, Python, Java, and JS solutions directly within `LeetCodeExplorer` and `AlgorithmHub`, while leveraging Gemini AI to analyze code efficiency and edge-case handling.

### 📦 Dependencies
* **Frontend**: `@monaco-editor/react`
* **Execution Service**: Free self-hosted / public [Piston API](https://github.com/engineer-man/piston) or [Judge0 API](https://judge0.com/)

### 🛠 Step-by-Step Implementation

#### Step 1.1: Install Monaco Editor in Frontend
```bash
cd frontend
npm install @monaco-editor/react
```

#### Step 1.2: Code Execution Service Helper (`frontend/src/services/codeExecutionService.ts`)
```typescript
export interface ExecutionResult {
  output: string;
  stderr: string;
  executionTime: number;
  memory: number;
  status: 'SUCCESS' | 'ERROR' | 'COMPILE_ERROR';
}

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const languageMap: Record<string, { language: string; version: string }> = {
  cpp: { language: 'cpp', version: '10.2.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  javascript: { language: 'javascript', version: '18.15.0' },
};

export async function executeCode(language: string, code: string, stdin = ''): Promise<ExecutionResult> {
  const langConfig = languageMap[language] || languageMap.javascript;
  
  const response = await fetch(PISTON_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
      stdin,
    }),
  });

  const data = await response.json();
  const run = data.run || {};

  return {
    output: run.stdout || '',
    stderr: run.stderr || '',
    executionTime: 0,
    memory: 0,
    status: run.code === 0 ? 'SUCCESS' : 'ERROR',
  };
}
```

#### Step 1.3: Backend AI Review Route (`backend/routes/chatRoutes.js`)
```javascript
router.post('/code-review', async (req, res) => {
  const { code, language, problemTitle, problemDescription } = req.body;

  const prompt = `
  You are an expert technical interviewer at Meta/Google.
  Analyze the following ${language} code for problem "${problemTitle}".
  
  Problem Description: ${problemDescription}
  User Code:
  \`\`\`${language}
  ${code}
  \`\`\`
  
  Respond strictly in JSON format with keys:
  - timeComplexity: string (e.g. "O(N log N)")
  - spaceComplexity: string (e.g. "O(N)")
  - isOptimal: boolean
  - codeQualityScore: number (out of 100)
  - suggestions: array of strings
  - optimalSnippet: string (code)
  `;

  // Call Gemini API and return JSON response
});
```

---

## 2. Interactive System Design Canvas & Estimation Engine

### 🎯 Objective
Provide a visual drag-and-drop architecture builder for System Design (Load Balancer, API Gateway, Redis Cache, Postgres DB, Kafka Queue) along with a Back-of-the-Envelope math calculator.

### 📦 Dependencies
* **Frontend**: `reactflow` (or `@xyflow/react`)

### 🛠 Step-by-Step Implementation

#### Step 2.1: Install React Flow
```bash
cd frontend
npm install @xyflow/react
```

#### Step 2.2: System Design Canvas Component (`frontend/src/components/SystemDesignCanvas.tsx`)
```tsx
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 50, y: 150 }, data: { label: 'Client / Mobile App' } },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'API Gateway / Nginx' } },
  { id: '3', position: { x: 450, y: 100 }, data: { label: 'Auth Service' } },
  { id: '4', position: { x: 450, y: 220 }, data: { label: 'Redis Cache' } },
  { id: '5', position: { x: 650, y: 220 }, data: { label: 'PostgreSQL DB (Master)' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

export const SystemDesignCanvas: React.FC = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div className="w-full h-[650px] bg-slate-950 rounded-xl border border-slate-800 p-4">
      <h2 className="text-lg font-bold text-white mb-2">Interactive System Architecture Canvas</h2>
      <div className="w-full h-[580px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#334155" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
```

#### Step 2.3: Estimation Engine Calculator (`frontend/src/utils/estimationMath.ts`)
```typescript
export interface SystemRequirements {
  dailyActiveUsers: number;
  readsPerUserPerDay: number;
  writesPerUserPerDay: number;
  payloadSizeBytes: number;
}

export function calculateSystemEstimates(reqs: SystemRequirements) {
  const totalReads = reqs.dailyActiveUsers * reqs.readsPerUserPerDay;
  const totalWrites = reqs.dailyActiveUsers * reqs.writesPerUserPerDay;
  
  const readQPS = Math.ceil(totalReads / 86400);
  const writeQPS = Math.ceil(totalWrites / 86400);
  
  const dailyStorageBytes = totalWrites * reqs.payloadSizeBytes;
  const yearlyStorageTB = (dailyStorageBytes * 365) / (1024 ** 4);
  const networkBandwidthMbps = ((readQPS + writeQPS) * reqs.payloadSizeBytes * 8) / (1024 ** 2);

  return {
    readQPS,
    writeQPS,
    peakReadQPS: readQPS * 2,
    yearlyStorageTB: yearlyStorageTB.toFixed(2),
    networkBandwidthMbps: networkBandwidthMbps.toFixed(2),
  };
}
```

---

## 3. 1v1 Live Coding Arena (Real-time Multiplayer)

### 🎯 Objective
Enable real-time 1v1 speed coding battles between two candidates or against an AI bot, featuring live opponent progress synchronization, timer, and leaderboard updates.

### 📦 Dependencies
* **Backend & Frontend**: `socket.io`, `socket.io-client`

### 🛠 Step-by-Step Implementation

#### Step 3.1: Socket.io Server Setup (`backend/socketServer.js`)
```javascript
const { Server } = require("socket.io");

function setupSocketServer(server) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const waitingQueue = [];
  const activeRooms = new Map();

  io.on("connection", (socket) => {
    socket.on("join_matchmaking", ({ userId, username }) => {
      if (waitingQueue.length > 0) {
        const opponent = waitingQueue.shift();
        const roomId = `room_${Date.now()}`;
        
        activeRooms.set(roomId, {
          players: [opponent, { socketId: socket.id, userId, username }],
          problemId: "two-sum",
          startTime: Date.now()
        });

        socket.join(roomId);
        io.to(opponent.socketId).socketsJoin(roomId);

        io.to(roomId).emit("match_found", {
          roomId,
          players: [opponent.username, username],
          problem: { title: "Two Sum", difficulty: "Easy" }
        });
      } else {
        waitingQueue.push({ socketId: socket.id, userId, username });
        socket.emit("waiting_for_opponent");
      }
    });

    socket.on("code_progress", ({ roomId, codeLength, testsPassed }) => {
      socket.to(roomId).emit("opponent_progress", { codeLength, testsPassed });
    });

    socket.on("submit_solution", ({ roomId, isCorrect, timeTaken }) => {
      io.to(roomId).emit("match_ended", { winnerSocketId: socket.id, timeTaken });
    });
  });
}

module.exports = setupSocketServer;
```

---

## 4. AI Voice/Text Mock Interviewer & STAR Behavioral Builder

### 🎯 Objective
Simulate real tech interview conversations (both DSA and Behavioral HR) using speech synthesis and structured AI response scoring.

### 🛠 Step-by-Step Implementation

#### Step 4.1: Speech-to-Text & Text-to-Speech Hook (`frontend/src/hooks/useVoiceInterview.ts`)
```typescript
import { useState } from 'react';

export function useVoiceInterview() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return { isListening, transcript, startListening, speakText };
}
```

#### Step 4.2: STAR Answer Builder Data Structure (`frontend/src/types/behavioral.ts`)
```typescript
export interface StarAnswer {
  id: string;
  title: string;
  companyTarget: string; // e.g. "Amazon - Ownership"
  situation: string;
  task: string;
  action: string;
  result: string;
  impactMetrics: string[]; // e.g. ["Reduced latency by 45%", "Saved $12k/mo"]
}
```

---

## 5. One-Click PDF Cheat Sheet Generator & Readiness Predictor

### 🎯 Objective
Generate a clean, printable PDF cheat sheet containing user's starred tricks, notes, and weak concepts, along with calculating an AI Readiness Score per company.

### 📦 Dependencies
* **Frontend**: `@react-pdf/renderer`

### 🛠 Step-by-Step Implementation

#### Step 5.1: Install React PDF Renderer
```bash
cd frontend
npm install @react-pdf/renderer
```

#### Step 5.2: PDF Generator Document (`frontend/src/components/RevisionPdfDocument.tsx`)
```tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#FFFFFF' },
  header: { fontSize: 24, marginBottom: 10, color: '#1E293B', fontWeight: 'bold' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, marginBottom: 5, color: '#4F46E5', fontWeight: 'bold' },
  text: { fontSize: 10, color: '#334155', lineHeight: 1.4 },
});

export const RevisionPdfDocument: React.FC<{ notes: any[] }> = ({ notes }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>AlgoVault - Last Minute Interview Revision Cheat Sheet</Text>
      {notes.map((note, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{note.title}</Text>
          <Text style={styles.text}>{note.content}</Text>
        </View>
      ))}
    </Page>
  </Document>
);
```

#### Step 5.3: Target Company Readiness Score Math (`frontend/src/utils/readinessMath.ts`)
```typescript
export function calculateCompanyReadiness(
  companyName: string,
  totalCompanyQuestions: number,
  solvedCompanyQuestions: number,
  accuracyRate: number
): number {
  if (totalCompanyQuestions === 0) return 0;
  
  const coverageWeight = 0.6;
  const accuracyWeight = 0.4;
  
  const coveragePercentage = (solvedCompanyQuestions / totalCompanyQuestions) * 100;
  const score = (coveragePercentage * coverageWeight) + (accuracyRate * accuracyWeight);
  
  return Math.min(100, Math.round(score));
}
```

---

## 🗄 Database Schemas & Data Flow

### MongoDB Schemas (`backend/models/`)

#### 1. User Progress Model (`backend/models/UserProgress.js`)
```javascript
const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  solvedProblems: [{
    problemId: String,
    solvedAt: Date,
    timeTakenSeconds: Number,
    languageUsed: String
  }],
  starNotes: [{
    topicId: String,
    title: String,
    noteText: String,
    updatedAt: Date
  }],
  streaks: {
    currentStreak: { type: Number, default: 0 },
    lastActiveDate: Date
  }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
```

---

## 📅 Recommended Build Order

1. **Phase 1 (Quick Win)**: In-Browser Code Execution (Monaco + Piston API) & AI Complexity Analyzer.
2. **Phase 2 (Visuals & Utility)**: System Design Canvas & Back-of-the-Envelope Estimation Calculator.
3. **Phase 3 (Exports & Analytics)**: PDF Cheat Sheet Generator & Company Readiness Score.
4. **Phase 4 (Interactive AI)**: AI Voice/Text Mock Interview Simulator & STAR Builder.
5. **Phase 5 (Multiplayer)**: 1v1 Live Speed Coding Arena (Socket.io).
