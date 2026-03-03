import axios from 'axios';
import { log } from '../utils/logger.js';

const API_BASE = process.env.SUPERBFSI_API_URL || 'https://api.superbfsi.com';
const API_KEY = process.env.SUPERBFSI_API_KEY;
const EXTERNAL_TIMEOUT_MS = Number(process.env.EXTERNAL_TIMEOUT_MS || 15000);

// ALWAYS fetch fresh cohort - NO CACHING (test phase compliance)
export async function fetchCustomerCohort(campaignId) {
  log(campaignId, 'Cohort', 'fetching_fresh', { timestamp: new Date().toISOString() });

  try {
    const response = await axios.get(`${API_BASE}/customers/cohort`, {
      timeout: EXTERNAL_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    log(campaignId, 'Cohort', 'fetched_real_api', { count: response.data.length });
    return response.data;

  } catch (error) {
    console.warn('Cohort API failed, using fresh mock cohort:', error.code || error.message);
    const mock = generateFreshCohort();
    log(campaignId, 'Cohort', 'using_fresh_mock', { count: mock.length });
    return mock;
  }
}

function generateFreshCohort() {
  const cohort = [];
  let id = Date.now();

  for (let i = 0; i < 1000; i++) {
    const age = 25 + Math.floor(Math.random() * 40);
    const gender = Math.random() > 0.5 ? 'female' : 'male';
    const is_active = Math.random() > 0.1; // 90% active, 10% inactive
    
    cohort.push({
      customer_id: `CUST_${id++}`,
      age,
      gender,
      is_active,
      segment: `age_${Math.floor(age / 10) * 10}_${Math.floor(age / 10) * 10 + 9}`,
      email: `cust${id}@example.com`
    });
  }
  return cohort;
}

export function selectFromCohort(cohort, segments, includeInactive = false) {
  return cohort
    .filter((c) => segments.includes(c.segment))
    .filter((c) => includeInactive || c.is_active)
    .map((c) => c.customer_id);
}

export function identifyFemaleSeniorCitizens(cohort) {
  return cohort.filter((c) => c.gender === 'female' && c.age >= 60).map((c) => c.customer_id);
}

export function checkFullCoverage(cohort, sentIds) {
  const sent = new Set(sentIds.flat());
  const uncovered = cohort.filter((c) => !sent.has(c.customer_id));
  return {
    total: cohort.length,
    covered: sent.size,
    uncovered: uncovered.length,
    percentage: ((sent.size / cohort.length) * 100).toFixed(2)
  };
}
