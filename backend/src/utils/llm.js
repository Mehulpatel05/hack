import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-1.5-flash';
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 20000);

export async function callLLM(prompt, systemPrompt = '') {
  try {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes('your_')) {
      throw new Error('Valid OPENROUTER_API_KEY is not configured in backend .env');
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OPENROUTER_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        timeout: LLM_TIMEOUT_MS,
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('OpenRouter returned an empty response');
    }

    return text;
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED';
    const upstreamMessage = error.response?.data?.message;
    const message = isTimeout
      ? `LLM request timed out after ${LLM_TIMEOUT_MS}ms`
      : upstreamMessage || error.message;

    console.error('OpenRouter Error:', message);
    throw new Error(message);
  }
}

export async function callLLMJSON(prompt, systemPrompt = '') {
  const response = await callLLM(prompt, systemPrompt + '\n\nRespond ONLY with valid JSON.');
  
  // Extract JSON from markdown fences or raw response
  let jsonStr = response;
  const fencedMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fencedMatch) {
    jsonStr = fencedMatch[1].trim();
  }
  
  // Find JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Fallback: escape unescaped control chars in string values only
    const fixed = jsonStr.replace(/"([^"]*)"/g, (match, content) => {
      const escaped = content
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return `"${escaped}"`;
    });
    return JSON.parse(fixed);
  }
}
