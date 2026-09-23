import fs from 'fs';
import path from 'path';

// Read TS file
const tsPath = 'frontend/src/data/algorithmsData.ts';
const content = fs.readFileSync(tsPath, 'utf-8');

// Match ALGORITHM_CATEGORIES
const catMatch = content.match(/export const ALGORITHM_CATEGORIES = (\[[\s\S]*?\]);/);
let categories = [];
if (catMatch) {
  categories = eval(catMatch[1]);
}

// Write json file
const outData = {
  categories,
  algorithms: [] // We will populate
};

// We can also evaluate ALGORITHMS_DATA
const algoMatch = content.match(/export const ALGORITHMS_DATA: AlgorithmItem\[\] = (\[[\s\S]*?\]);/);
if (algoMatch) {
  try {
    outData.algorithms = eval(algoMatch[1]);
  } catch(e) {
    console.log('Eval error:', e.message);
  }
}

fs.writeFileSync('frontend/public/data/algorithms/algorithms_visualizer.json', JSON.stringify(outData, null, 2), 'utf-8');
console.log('Wrote algorithms_visualizer.json successfully!');
