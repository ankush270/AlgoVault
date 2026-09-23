import fs from 'fs';
import path from 'path';
import { dsaTopics } from '../frontend/src/data/dsaTopics.js';
import { systemDesignTopics } from '../frontend/src/data/systemDesignTopics.js';
import { osTopics } from '../frontend/src/data/osTopics.js';
import { dbmsSqlTopics } from '../frontend/src/data/dbmsSqlTopics.js';
import { networksTopics } from '../frontend/src/data/networksTopics.js';
import { aiMlTopics } from '../frontend/src/data/aiMlTopics.js';
import { oopsTopics } from '../frontend/src/data/oopsTopics.js';
import { javascriptTopics } from '../frontend/src/data/javascriptTopics.js';
import { reactTopics } from '../frontend/src/data/reactTopics.js';
import { nodeTopics } from '../frontend/src/data/nodeTopics.js';

const targetDir = 'frontend/public/data/core-cs';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const topicsMap = {
  'dsa_topics.json': dsaTopics,
  'system_design_topics.json': systemDesignTopics,
  'os_topics.json': osTopics,
  'dbms_sql_topics.json': dbmsSqlTopics,
  'networks_topics.json': networksTopics,
  'ai_ml_topics.json': aiMlTopics,
  'oops_topics.json': oopsTopics,
  'javascript_topics.json': javascriptTopics,
  'react_topics.json': reactTopics,
  'node_topics.json': nodeTopics,
};

for (const [filename, data] of Object.entries(topicsMap)) {
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Wrote ${filename} with ${data.length} topics!`);
}

console.log('🎉 All core-cs topic JSON files generated successfully!');
