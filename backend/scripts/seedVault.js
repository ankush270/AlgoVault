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

const JSON_DIR = path.resolve(__dirname, '../../frontend/src/data/json');

const DOMAIN_MAP = {
  'dsa_topics.json': 'dsa',
  'os_topics.json': 'os',
  'operating_system.json': 'os',
  'dbms_sql_topics.json': 'dbms-sql',
  'dbmsRoadmap.json': 'dbms-sql',
  'networks_topics.json': 'computer-networks',
  'Computer_network.json': 'computer-networks',
  'system_design_topics.json': 'system-design',
  'system-design.json': 'system-design',
  'system-design-question.json': 'system-design',
  'system-design-example.json': 'system-design',
  'oops_topics.json': 'oops',
  'oops.json': 'oops',
  'javascript_topics.json': 'javascript',
  'react_topics.json': 'react',
  'node_topics.json': 'nodejs',
  'azure.json': 'azure',
  'ai_ml_topics.json': 'genai-ml',
  'case-studies.json': 'system-design',
  'lld.json': 'system-design'
};

const buildMarkdownContent = (item) => {
  const parts = [];

  if (item.summary) {
    parts.push(`> [!NOTE]\n> **Overview:** ${item.summary}\n`);
  }

  if (item.keyConcepts && Array.isArray(item.keyConcepts) && item.keyConcepts.length > 0) {
    parts.push(`### 🔑 Key Concepts\n${item.keyConcepts.map(kc => `- ${kc}`).join('\n')}\n`);
  }

  if (item.detailedContent) {
    parts.push(item.detailedContent.trim());
  }

  if (item.codeTemplates && Array.isArray(item.codeTemplates) && item.codeTemplates.length > 0) {
    parts.push(`\n### 💻 Code Implementations`);
    item.codeTemplates.forEach(ct => {
      parts.push(`\n#### Language: ${ct.language || 'code'}\n\`\`\`${ct.language || ''}\n${ct.code}\n\`\`\``);
    });
  }

  if (item.interviewQuestions && Array.isArray(item.interviewQuestions) && item.interviewQuestions.length > 0) {
    parts.push(`\n### ❓ Key Interview Questions & Answers`);
    item.interviewQuestions.forEach((iq, idx) => {
      parts.push(`\n**Q${idx + 1}: ${iq.question}**\n> **Ans:** ${iq.answer}${iq.explanation ? `\n>\n> *Explanation:* ${iq.explanation}` : ''}`);
    });
  }

  return parts.join('\n\n');
};

const seedJsonFiles = async () => {
  console.log('🚀 Starting AlgoVault JSON to MongoDB Seed Script...');
  await connectDB();

  if (!fs.existsSync(JSON_DIR)) {
    console.error(`❌ JSON directory not found at: ${JSON_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(JSON_DIR).filter(f => f.endsWith('.json'));
  console.log(`📂 Found ${files.length} JSON files in ${JSON_DIR}`);

  let totalTopicsCreated = 0;
  let totalSubtopicsCreated = 0;

  for (const file of files) {
    const filePath = path.join(JSON_DIR, file);
    const domain = DOMAIN_MAP[file] || 'dsa';

    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(rawData);

      // Normalize array of items
      let items = [];
      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (parsed.topics && Array.isArray(parsed.topics)) {
        items = parsed.topics;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        items = parsed.questions;
      } else {
        console.warn(`⚠️ Skipping ${file}: Format is neither an array nor has topics/questions array.`);
        continue;
      }

      console.log(`⏳ Processing ${file} (${items.length} items for domain '${domain}')...`);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item || (!item.title && !item.name && !item.id)) continue;

        const title = item.title || item.name || `Topic ${i + 1}`;
        const category = item.category || item.section || 'General';
        const difficulty = ['Easy', 'Medium', 'Hard'].includes(item.difficulty) ? item.difficulty : 'Medium';
        const importanceRating = typeof item.importanceRating === 'number' ? item.importanceRating : 3;
        const tags = item.companyTags || item.tags || [];

        // Check if topic exists
        let topic = await TopicModel.findOne({ 
          domain, 
          title: title.trim(),
          isSystem: true 
        });

        if (!topic) {
          topic = await TopicModel.create({
            domain,
            category: category.trim(),
            title: title.trim(),
            slug: item.id || `topic-${domain}-${i}`,
            difficulty,
            importanceRating,
            tags: Array.isArray(tags) ? tags : [],
            order: i,
            isSystem: true
          });
          totalTopicsCreated++;
        }

        // Check if subtopic note exists for this topic
        const existingSubtopic = await SubtopicNoteModel.findOne({ topicId: topic._id });
        if (!existingSubtopic) {
          const contentMarkdown = buildMarkdownContent(item);
          await SubtopicNoteModel.create({
            topicId: topic._id,
            title: 'Core Concepts & Notes',
            contentMarkdown,
            problems: [],
            media: [],
            revisionStatus: 'moderate',
            order: 0
          });
          totalSubtopicsCreated++;
        }
      }
    } catch (fileErr) {
      console.error(`❌ Error parsing ${file}:`, fileErr.message);
    }
  }

  console.log(`\n🎉 Seed Completed!`);
  console.log(`✅ Topics created: ${totalTopicsCreated}`);
  console.log(`✅ Subtopics created: ${totalSubtopicsCreated}`);
  await mongoose.connection.close();
  process.exit(0);
};

seedJsonFiles().catch(err => {
  console.error('💥 Fatal seed error:', err);
  process.exit(1);
});
