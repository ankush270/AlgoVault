import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to frontend public data directory
const DATA_DIR = path.resolve(__dirname, '../../frontend/public/data');

const cleanQuestionText = (qText) => {
  if (!qText) return '';
  return qText
    .replace(/^#+\s*/, '')            // Remove leading markdown headers like ###, ##, #
    .replace(/^\d+[\.\)]\s*/, '')     // Remove leading question numbers like "6. ", "9) "
    .replace(/\*\*/g, '')             // Remove bold Markdown
    .replace(/`/g, '')                // Remove backticks
    .replace(/^[-*•]\s*/, '')         // Remove leading list bullets
    .trim();
};

const DATASET_PART_FILES = [
  'interview_dataset_part1_A_to_D.json',
  'interview_dataset_part2_E_to_L.json',
  'interview_dataset_part3_M_to_R.json',
  'interview_dataset_part4_S_to_Z.json',
];

const MASTER_INDEX_FILE = 'interview_dataset_master_index.json';
const SUBJECT_INDEX_FILE = 'subject_wise_questions_index.json';

// Helper to safe read JSON
const readJson = (filePath) => {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Helper to safe write JSON
const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// DELETE /api/dataset/experience/:id
router.delete('/experience/:id', (req, res) => {
  try {
    const expId = req.params.id;
    if (!expId) {
      return res.status(400).json({ success: false, message: 'Experience ID is required.' });
    }

    let deletedFound = false;
    const allRemainingExperiences = [];

    // 1. Process 4 dataset part files
    DATASET_PART_FILES.forEach((fileName) => {
      const filePath = path.join(DATA_DIR, fileName);
      const data = readJson(filePath);
      if (data && Array.isArray(data.experiences)) {
        const initialCount = data.experiences.length;
        data.experiences = data.experiences.filter((exp) => exp.id !== expId);
        if (data.experiences.length < initialCount) {
          deletedFound = true;
          data.metadata.total_experiences = data.experiences.length;
          writeJson(filePath, data);
        }
        allRemainingExperiences.push(...data.experiences);
      }
    });

    if (!deletedFound) {
      return res.status(404).json({ success: false, message: 'Experience not found in JSON files.' });
    }

    // 2. Re-calculate and write Master Index
    const masterPath = path.join(DATA_DIR, MASTER_INDEX_FILE);
    const masterData = readJson(masterPath);

    if (masterData) {
      const compCounts = {};
      allRemainingExperiences.forEach((exp) => {
        if (exp.company) {
          compCounts[exp.company] = (compCounts[exp.company] || 0) + 1;
        }
      });

      const companiesSummary = Object.entries(compCounts)
        .map(([company, total_experiences]) => ({ company, total_experiences }))
        .sort((a, b) => b.total_experiences - a.total_experiences);

      masterData.metadata.total_experiences = allRemainingExperiences.length;
      masterData.metadata.total_companies = companiesSummary.length;
      masterData.companies_summary = companiesSummary;

      writeJson(masterPath, masterData);
    }

    res.json({
      success: true,
      message: `Experience ${expId} permanently deleted from JSON files.`,
    });
  } catch (error) {
    console.error('Error deleting experience from JSON:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/dataset/question
router.delete('/question', (req, res) => {
  try {
    const { questionText } = req.body;
    if (!questionText) {
      return res.status(400).json({ success: false, message: 'questionText is required.' });
    }

    const cleanedTarget = cleanQuestionText(questionText).toLowerCase();
    const rawTarget = questionText.trim().toLowerCase();

    // 1. Process Subject-Wise Question Index
    const subjectPath = path.join(DATA_DIR, SUBJECT_INDEX_FILE);
    const subjectData = readJson(subjectPath);
    let totalQuestionsRemoved = 0;

    if (subjectData) {
      Object.keys(subjectData).forEach((subjKey) => {
        if (Array.isArray(subjectData[subjKey])) {
          const initLen = subjectData[subjKey].length;
          subjectData[subjKey] = subjectData[subjKey].filter((qItem) => {
            const rawQ = (qItem.question || '').trim().toLowerCase();
            const cleanQ = cleanQuestionText(qItem.question || '').toLowerCase();
            return rawQ !== rawTarget && cleanQ !== cleanedTarget;
          });
          totalQuestionsRemoved += initLen - subjectData[subjKey].length;
        }
      });
      writeJson(subjectPath, subjectData);
    }

    // 2. Remove from extracted_questions in Dataset Part Files
    DATASET_PART_FILES.forEach((fileName) => {
      const filePath = path.join(DATA_DIR, fileName);
      const data = readJson(filePath);
      if (data && Array.isArray(data.experiences)) {
        let modified = false;
        data.experiences.forEach((exp) => {
          if (Array.isArray(exp.extracted_questions)) {
            const initLen = exp.extracted_questions.length;
            exp.extracted_questions = exp.extracted_questions.filter((q) => {
              const rawQ = q.trim().toLowerCase();
              const cleanQ = cleanQuestionText(q).toLowerCase();
              return rawQ !== rawTarget && cleanQ !== cleanedTarget;
            });
            if (exp.extracted_questions.length < initLen) {
              modified = true;
            }
          }
        });
        if (modified) {
          writeJson(filePath, data);
        }
      }
    });

    res.json({
      success: true,
      message: `Question permanently deleted from JSON files (${totalQuestionsRemoved} subject entries removed).`,
    });
  } catch (error) {
    console.error('Error deleting question from JSON:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
