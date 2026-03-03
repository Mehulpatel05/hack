import { callLLMJSON } from '../utils/llm.js';
import { log } from '../utils/logger.js';

export async function generateContent(parsedBrief, strategy, cohort, campaignId) {
  const systemPrompt = `You are an email copywriter for BFSI campaigns.
IMPORTANT RULES:
- Use ONLY plain text with emojis
- NO images, NO external URLs (only ${parsedBrief.url})
- NO HTML tags, NO CSS
- Simple formatting only (line breaks, emojis)
- Keep it professional for BFSI sector`;

  const numVariants = strategy.variants || 2;
  const variants = {};
  
  // Identify female senior citizens from REAL cohort
  const femaleSeniorCitizens = cohort.filter(c => c.gender === 'female' && c.age >= 60);
  const hasFemaleSeniorOffer = parsedBrief.offer?.toLowerCase().includes('female senior');

  for (let i = 0; i < numVariants; i++) {
    const variantType = i === 0 ? 'emoji-rich, exciting' : 'professional, minimal emojis';
    
    const prompt = `Create email variant ${i + 1} (${variantType}) for:
Product: ${parsedBrief.product}
Offer: ${parsedBrief.offer}
Target: ${parsedBrief.target}
URL: ${parsedBrief.url}
Tone: ${parsedBrief.tone || 'professional'}
${hasFemaleSeniorOffer ? `
SPECIAL: Female senior citizens (60+) get extra benefits. Cohort has ${femaleSeniorCitizens.length} female senior citizens.` : ''}

RULES:
- Plain text only (no HTML)
- Use emojis for engagement
- Include ONLY this URL: ${parsedBrief.url}
- No images, no buttons
- Simple line breaks for formatting
${hasFemaleSeniorOffer ? '- Mention special offer for female senior citizens clearly' : ''}

Generate:
- subject: email subject (max 60 chars)
- preheader: preview text (max 100 chars)
- body: plain text email body with emojis and line breaks
- cta_text: call-to-action text

Return JSON only.`;

    variants[`variant_${String.fromCharCode(97 + i)}`] = await callLLMJSON(prompt, systemPrompt);
  }
  
  // Add metadata about female senior citizens if applicable
  if (hasFemaleSeniorOffer) {
    variants.female_senior_citizen_count = femaleSeniorCitizens.length;
    variants.female_senior_citizen_ids = femaleSeniorCitizens.map(c => c.customer_id);
  }

  log(campaignId, 'Content', 'generated', { variants: Object.keys(variants), female_senior_count: femaleSeniorCitizens.length });
  
  return variants;
}
