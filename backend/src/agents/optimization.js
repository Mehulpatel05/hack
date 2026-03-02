import { callLLMJSON } from '../utils/llm.js';
import { log } from '../utils/logger.js';

export async function generateOptimization(analysis, parsedBrief, previousContent, cohort, campaignId) {
  if (!analysis.needs_optimization) {
    return null;
  }
  
  // Get available segments from REAL cohort
  const availableSegments = [...new Set(cohort.map(c => c.segment))];
  
  const systemPrompt = `You are a campaign optimization expert. Analyze performance and suggest improvements.`;
  
  const prompt = `Campaign Performance:
- Open Rate: ${analysis.open_rate}%
- Click Rate: ${analysis.click_rate}%
- Issues: ${analysis.issues.join(', ')}
- Low Performing Segments: ${analysis.low_segments.join(', ')}

Available Segments: ${availableSegments.join(', ')}
Previous Content: ${JSON.stringify(previousContent)}
Product: ${parsedBrief.product}
Offer: ${parsedBrief.offer}

Generate optimization with:
- target_segment: which segment to focus (choose from available segments)
- new_subject: improved subject line (plain text + emojis only)
- new_cta: improved CTA text
- send_time: better send time
- reasoning: why these changes will improve performance
- expected_improvement: estimated improvement percentage

Return JSON only.`;

  const optimization = await callLLMJSON(prompt, systemPrompt);
  optimization.iteration = (analysis.iteration || 0) + 1;
  optimization.status = 'pending_approval';
  
  log(campaignId, 'Optimization', 'generated', optimization);
  
  return optimization;
}

export async function applyOptimization(optimization, originalContent) {
  const optimizedContent = {
    ...originalContent,
    subject: optimization.new_subject,
    cta_text: optimization.new_cta,
    optimized: true,
    iteration: optimization.iteration
  };
  
  return optimizedContent;
}
