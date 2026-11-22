import { ALL_COMPANY_QUESTIONS } from './companyQuestions.js';

console.log('Total Questions:', ALL_COMPANY_QUESTIONS.length);
const idSet = new Set();
const titleSet = new Set();
const dupIds = [];
const dupTitles = [];

for (const q of ALL_COMPANY_QUESTIONS) {
    if (idSet.has(q.id)) dupIds.push(q.id);
    idSet.add(q.id);

    const lowerTitle = q.title.toLowerCase().trim();
    if (titleSet.has(lowerTitle)) dupTitles.push({ company: q.company, id: q.id, title: q.title });
    titleSet.add(lowerTitle);
}

console.log('Duplicate IDs:', dupIds);
console.log('Duplicate Titles:', dupTitles);

const companyCounts = {};
for (const q of ALL_COMPANY_QUESTIONS) {
    companyCounts[q.company] = (companyCounts[q.company] || 0) + 1;
}
console.log('Company counts:', companyCounts);

