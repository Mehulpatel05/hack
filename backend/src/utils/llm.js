import axios from 'axios';

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_MODEL = process.env.COHERE_MODEL || 'command-r';
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 20000);

export async function callLLM(prompt, systemPrompt = '') {
  try {
    if (!COHERE_API_KEY || COHERE_API_KEY.includes('your_')) {
      throw new Error('Valid COHERE_API_KEY is not configured in backend .env');
    }

    const response = await axios.post(
      'https://api.cohere.com/v1/chat',
      {
        model: COHERE_MODEL,
        preamble: systemPrompt?.trim() || undefined,
        message: prompt.trim(),
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        timeout: LLM_TIMEOUT_MS,
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.text?.trim();
    if (!text) {
      throw new Error('Cohere Chat returned an empty response');
    }

    return text;
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED';
    const upstreamMessage = error.response?.data?.message || error.response?.data?.error;
    const message = isTimeout
      ? `LLM request timed out after ${LLM_TIMEOUT_MS}ms`
      : upstreamMessage || error.message;

    console.error('Cohere Error:', message);
    throw new Error(message);
  }
}

export async function callLLMJSON(prompt, systemPrompt = '') {
  const response = await callLLM(prompt, systemPrompt + '\n\nRespond ONLY with valid JSON.');
  const fencedMatch = response.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1] : response;
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(candidate);
}
