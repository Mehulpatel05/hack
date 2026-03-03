import { callLLMJSON } from '../utils/llm.js';
import { log } from '../utils/logger.js';

export async function generateStrategy(parsedBrief, cohort, campaignId) {
  const systemPrompt = `You are a campaign strategy expert for email marketing in BFSI sector.`;

  // Extract available segments from REAL cohort
  const availableSegments = [...new Set(cohort.map(c => c.segment))];
  
  // Apply target and inactive filters
  let targetCohort = cohort;
  if (parsedBrief.target === 'new_customers') {
    targetCohort = cohort.filter(c => c.is_new_customer);
  } else if (parsedBrief.target === 'existing_customers') {
    targetCohort = cohort.filter(c => !c.is_new_customer);
  }
  
  if (!parsedBrief.include_inactive) {
    targetCohort = targetCohort.filter(c => c.is_active);
  }
  
  const prompt = `Create email campaign strategy for:
Product: ${parsedBrief.product}
Target: ${parsedBrief.target}
Objectives: ${parsedBrief.objectives?.join(', ')}
Include Inactive: ${parsedBrief.include_inactive || false}

Available customer segments from API: ${availableSegments.join(', ')}
Total customers: ${cohort.length}
Target cohort size: ${targetCohort.length}

Generate strategy with:
- segments: array of segments to target (choose from available segments above)
- variants: number of A/B test variants (2-3)
- send_time: best time to send (e.g., "10:00 AM", "7:00 PM")
- ab_test: true/false
- reasoning: why this strategy

IMPORTANT: Use ONLY segments from the available list above.

Return JSON only.`;

  const strategy = await callLLMJSON(prompt, systemPrompt);
  strategy.target_cohort_size = targetCohort.length;
  strategy.include_inactive = parsedBrief.include_inactive || false;
  
  log(campaignId, 'Strategy', 'generated', strategy);
  
  return strategy;
}
