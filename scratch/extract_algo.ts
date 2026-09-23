import { ALGORITHM_CATEGORIES, ALGORITHMS_DATA } from '../frontend/src/data/algorithmsData.js';
import fs from 'fs';

const data = {
  categories: ALGORITHM_CATEGORIES,
  algorithms: ALGORITHMS_DATA
};

fs.writeFileSync('frontend/public/data/algorithms/algorithms_visualizer.json', JSON.stringify(data, null, 2));
console.log('Successfully wrote algorithms_visualizer.json! Count:', ALGORITHMS_DATA.length);
