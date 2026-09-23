const fs = require('fs');
const data = JSON.parse(fs.readFileSync('e:/Projects/practice/frontend/public/data/core-cs/operating_system.json', 'utf8'));
data.sections.forEach((s, i) => {
  console.log(`\nSection ${i+1}: ${s.title} (${s.topics.length} topics)`);
  s.topics.forEach(t => console.log(`  - ${t.id}: ${t.title}`));
});
console.log(`\nTotal sections: ${data.sections.length}`);
console.log(`Total topics: ${data.sections.reduce((acc, s) => acc + s.topics.length, 0)}`);
