import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 20000);

export async function callLLM(prompt, systemPrompt = '') {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_')) {
      throw new Error('Valid GEMINI_API_KEY is not configured in backend .env');
    }

    const fullPrompt = `${systemPrompt}\n\n${prompt}`.trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      {
        timeout: LLM_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    return text;
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED';
    const upstreamMessage = error.response?.data?.error?.message || error.response?.data?.message;
    const message = isTimeout
      ? `LLM request timed out after ${LLM_TIMEOUT_MS}ms`
      : upstreamMessage || error.message;

    console.error('Gemini Error:', message);
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
