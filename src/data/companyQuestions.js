import { TCS_QUESTIONS } from './questions/tcs.js';
import { INFOSYS_QUESTIONS } from './questions/infosys.js';
import { ACCENTURE_QUESTIONS } from './questions/accenture.js';
import { WIPRO_QUESTIONS } from './questions/wipro.js';
import { COGNIZANT_QUESTIONS } from './questions/cognizant.js';
import { AMAZON_QUESTIONS } from './questions/amazon.js';
import { MICROSOFT_QUESTIONS } from './questions/microsoft.js';
import { GOOGLE_QUESTIONS } from './questions/google.js';
import { SWIGGY_QUESTIONS } from './questions/swiggy.js';
import { ZOMATO_QUESTIONS } from './questions/zomato.js';
import { RAZORPAY_QUESTIONS } from './questions/razorpay.js';
import { GOLDMAN_SACHS_QUESTIONS } from './questions/goldmanSachs.js';
import { JPMORGAN_QUESTIONS } from './questions/jpmorgan.js';
import { ZOHO_QUESTIONS } from './questions/zoho.js';
import { META_QUESTIONS } from './questions/meta.js';
import { APPLE_QUESTIONS } from './questions/apple.js';
import { NETFLIX_QUESTIONS } from './questions/netflix.js';
import { ADOBE_QUESTIONS } from './questions/adobe.js';
import { FLIPKART_QUESTIONS } from './questions/flipkart.js';
import { UBER_QUESTIONS } from './questions/uber.js';
import { ATLASSIAN_QUESTIONS } from './questions/atlassian.js';
import { PHONEPE_QUESTIONS } from './questions/phonepe.js';
import { COMPANIES_CATALOG, COMPANY_CATEGORIES } from './companyData.js';

export const ALL_COMPANY_QUESTIONS = [
    ...TCS_QUESTIONS,
    ...INFOSYS_QUESTIONS,
    ...ACCENTURE_QUESTIONS,
    ...WIPRO_QUESTIONS,
    ...COGNIZANT_QUESTIONS,
    ...AMAZON_QUESTIONS,
    ...MICROSOFT_QUESTIONS,
    ...GOOGLE_QUESTIONS,
    ...META_QUESTIONS,
    ...APPLE_QUESTIONS,
    ...NETFLIX_QUESTIONS,
    ...ADOBE_QUESTIONS,
    ...FLIPKART_QUESTIONS,
    ...UBER_QUESTIONS,
    ...ATLASSIAN_QUESTIONS,
    ...SWIGGY_QUESTIONS,
    ...ZOMATO_QUESTIONS,
    ...RAZORPAY_QUESTIONS,
    ...PHONEPE_QUESTIONS,
    ...GOLDMAN_SACHS_QUESTIONS,
    ...JPMORGAN_QUESTIONS,
    ...ZOHO_QUESTIONS
];

export const COMPANY_QUESTIONS_BY_ID = ALL_COMPANY_QUESTIONS.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
}, {});

export const getQuestionsByCompany = (companyId) => {
    if (!companyId || companyId === 'all') return ALL_COMPANY_QUESTIONS;
    const norm = companyId.toLowerCase().replace(/[^a-z0-9]/g, '');
    return ALL_COMPANY_QUESTIONS.filter(q => {
        const qNorm = q.company.toLowerCase().replace(/[^a-z0-9]/g, '');
        return qNorm === norm;
    });
};

export const getQuestionById = (id) => {
    return COMPANY_QUESTIONS_BY_ID[id] || null;
};

export { COMPANIES_CATALOG, COMPANY_CATEGORIES };

