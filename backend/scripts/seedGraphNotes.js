import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TopicModel } from '../models/Topic.js';
import { SubtopicNoteModel } from '../models/SubtopicNote.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GRAPH_FILE = path.resolve(__dirname, '../../graph.txt');

const seedGraphNotes = async () => {
  console.log('🌱 Seeding graph.txt into DevForge MongoDB...');
  await connectDB();

  if (!fs.existsSync(GRAPH_FILE)) {
    console.error(`❌ graph.txt not found at: ${GRAPH_FILE}`);
    process.exit(1);
  }

  const rawText = fs.readFileSync(GRAPH_FILE, 'utf-8');

  // Find or create Graph Topic in DSA domain
  let topic = await TopicModel.findOne({ 
    domain: 'dsa', 
    title: 'Graph: Basics & Representations' 
  });

  if (!topic) {
    topic = await TopicModel.create({
      domain: 'dsa',
      category: 'Graphs',
      title: 'Graph: Basics & Representations',
      slug: 'dsa-graph-basics-representations',
      difficulty: 'Medium',
      importanceRating: 5,
      tags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
      order: 1,
      isSystem: true
    });
    console.log('✅ Created Topic: Graph: Basics & Representations');
  }

  // Remove old subtopics if re-seeding
  await SubtopicNoteModel.deleteMany({ topicId: topic._id });

  // Subtopic 1: Core Intuition & Basic Terms
  await SubtopicNoteModel.create({
    topicId: topic._id,
    title: '1. Intuition, Basic Terms & Handshaking Lemma',
    contentMarkdown: `> [!NOTE]
> **Intuition:** Graph ek aisa structure hai jisme cheezein (vertices) aur unke beech ke connections (edges) hote hain.
> - **FB/Insta:** Har insaan ek vertex, dosti ek edge.
> - **Google Maps:** Har shehar/chauraha ek vertex, road ek edge.
> - **HFT/Arbitrage:** Currency exchange rates (USD → EUR → INR) me arbitrage dhundhna ek graph problem hai.

---

### 🔑 Basic Terms & Properties

| Term | Definition & Rule | Example |
| :--- | :--- | :--- |
| **Vertex (Node)** | Graph ka ek point | A, B, C ya 0, 1, 2 |
| **Edge** | Do vertices ko jodne wali line $(u, v)$ | $A - B$ (undirected) ya $A \\rightarrow B$ (directed) |
| **Degree (Undirected)** | Ek vertex se kitni edges judi hain | $\\text{deg}(A) = 2$ |
| **In-Degree (Directed)** | Kitni edges is vertex me aa rahi hain | Arrows pointing in |
| **Out-Degree (Directed)** | Kitni edges is vertex se nikal rahi hain | Arrows pointing out |

> [!TIP]
> **Handshaking Lemma (Interview Favorite):**
> Undirected graph me sum of all degrees $= 2 \\times |E|$
> Kyunki har edge do vertices ki degree me count hoti hai!

---

### 🔄 Paths & Cycles
- **Path Length:** Edges ki sankhya (vertices ki nahi).
- **Simple Path:** Koi vertex repeat nahi hota.
- **Shortest Path:** Sabse kam edges wali path (BFS yahi nikalta hai).
- **Cycle:** Ek path jo usi vertex pe wapas aa jaye jahan se start hui thi.

### 📐 Maximum Edges Formulas (Constraints Trick)
- **Undirected Graph (no self-loops):** $\\frac{V(V-1)}{2}$
- **Directed Graph (no self-loops):** $V(V-1)$
`,
    problems: [
      {
        platform: 'leetcode',
        problemNumber: '1971',
        title: 'Find if Path Exists in Graph',
        url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/',
        difficulty: 'Easy',
        status: 'solved'
      }
    ],
    media: [
      {
        type: 'video',
        title: 'Striver Graph Series: Introduction to Graphs & Terms',
        url: 'https://www.youtube.com/watch?v=M3_pLsDdeuU'
      }
    ],
    revisionStatus: 'mastered',
    order: 0
  });

  // Subtopic 2: Graph Representations & Space Constraints
  await SubtopicNoteModel.create({
    topicId: topic._id,
    title: '2. Representations (Matrix vs Adj List vs Edge List) & Constraints',
    contentMarkdown: `### 📊 3 Primary Ways to Store a Graph

| Representation | Space Complexity | Check Edge $(u, v)$ | Find Neighbours of $u$ | Best Used When |
| :--- | :--- | :--- | :--- | :--- |
| **Adjacency Matrix** | $O(V^2)$ | $O(1)$ | $O(V)$ | Dense graph, $V \\le 500$, Floyd-Warshall |
| **Adjacency List** | $O(V + E)$ | $O(\\text{deg}(u))$ | $O(\\text{deg}(u))$ | Sparse graph, BFS/DFS traversal |
| **Edge List** | $O(E)$ | $O(E)$ | $O(E)$ | Kruskal's MST (sorting edges), Bellman-Ford |

---

### 💻 C++ Implementation Templates

#### 1. Adjacency List (Industry Standard)
\`\`\`cpp
// C++ Adjacency List for V vertices
#include <vector>
using namespace std;

int V = 5;
vector<vector<int>> adj(V);

// Undirected edge between u and v
void addEdge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);
}
\`\`\`

#### 2. Edge List (Used in Kruskal's MST & Bellman-Ford)
\`\`\`cpp
struct Edge {
    int u, v, weight;
};

vector<Edge> edges;
edges.push_back({0, 1, 5});
edges.push_back({0, 2, 3});
\`\`\`

---

> [!WARNING]
> ### 🎯 Problem Constraints Dekh Ke Representation Chuno:
> - $V \\le 10^5, E \\le 2 \\times 10^5 \\implies$ **Adjacency List** (Matrix $10^{10}$ bohot bada hoga, Memory Limit Exceeded dega!).
> - $V \\le 400-500$, "All pairs shortest path" $\\implies$ **Matrix + Floyd-Warshall**.
> - $V \\le 10^3 \\implies$ Dono chalenge.
`,
    problems: [
      {
        platform: 'leetcode',
        problemNumber: '133',
        title: 'Clone Graph',
        url: 'https://leetcode.com/problems/clone-graph/',
        difficulty: 'Medium',
        status: 'todo'
      }
    ],
    media: [
      {
        type: 'video',
        title: 'Graph Representation in C++ / Java (Adjacency List)',
        url: 'https://www.youtube.com/watch?v=3oI-34aPMWM'
      }
    ],
    revisionStatus: 'moderate',
    order: 1
  });

  // Subtopic 3: Trees, DAGs & Bipartite Graphs
  await SubtopicNoteModel.create({
    topicId: topic._id,
    title: '3. Trees, DAGs (Topological Sort) & Bipartite Graphs',
    contentMarkdown: `### 🌳 Tree Definition (2 Rules)
Graph tree kab hota hai:
1. **Connected ho** (koi bhi node kisi bhi node tak pahunch sake).
2. **Cycle na ho** (no closed loops).
3. Formula: **Edges = Nodes - 1** ($E = V - 1$).

---

### ⚡ DAG (Directed Acyclic Graph)
- **Topological Order:** Ek aisa linear ordering jisme har directed edge $u \\rightarrow v$ ke liye, vertex $u$ vertex $v$ se pehle aaye.
- **Source Node:** Kam se kam ek node aisa hoga jiska In-Degree = 0.
- **Pattern Keywords in Interview:** *"prerequisites"*, *"dependencies"*, *"build order"*, *"compile order"*, *"course schedule"*.

---

### 🎨 Bipartite Graph & 2-Color Rule
> [!TIP]
> **Golden Rule:** Graph bipartite hai $\\iff$ usme koi **ODD LENGTH KA CYCLE** nahi hai!
> - **Triangle (3 nodes, odd cycle):** 2 colors alternate nahi ho sakte $\\implies$ NOT Bipartite!
> - **Square (4 nodes, even cycle):** Colors: Red, Blue, Red, Blue alternate $\\implies$ Bipartite!
> - **Trees:** Tree me cycle hi nahi hota, isliye **HAR TREE BIPARTITE HOTA HAI**.
`,
    problems: [
      {
        platform: 'leetcode',
        problemNumber: '207',
        title: 'Course Schedule (Topological Sort / Cycle Detection)',
        url: 'https://leetcode.com/problems/course-schedule/',
        difficulty: 'Medium',
        status: 'review'
      },
      {
        platform: 'leetcode',
        problemNumber: '785',
        title: 'Is Graph Bipartite?',
        url: 'https://leetcode.com/problems/is-graph-bipartite/',
        difficulty: 'Medium',
        status: 'todo'
      }
    ],
    media: [],
    revisionStatus: 'weak',
    order: 2
  });

  console.log('🎉 graph.txt successfully seeded into 3 structured subtopics under Graph: Basics & Representations!');
  await mongoose.connection.close();
  process.exit(0);
};

seedGraphNotes().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
