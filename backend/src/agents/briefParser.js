import { callLLMJSON } from '../utils/llm.js';
import { log } from '../utils/logger.js';

export async function parseBrief(brief, campaignId) {
  const systemPrompt = `You are a campaign brief parser for SuperBFSI (BFSI company in India).
Extract structured information from the brief.`;

  const prompt = `Parse this campaign brief and extract:
- product: product name
- target: target audience (new_customers, existing_customers, all)
- offer: special offer or benefit
- url: any URL to include
- objectives: array of objectives (open_rate, click_rate, conversions)
- tone: email tone (professional, friendly, urgent)

Brief: "${brief}"

Return JSON only.`;

  const parsed = await callLLMJSON(prompt, systemPrompt);
  log(campaignId, 'BriefParser', 'parsed', parsed);
  
  return parsed;
}
