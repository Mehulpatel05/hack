import axios from 'axios';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'HuggingFaceH4/zephyr-7b-beta';
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 20000);

export async function callLLM(prompt, systemPrompt = '') {
  try {
    if (!HUGGINGFACE_API_KEY || HUGGINGFACE_API_KEY.includes('your_')) {
      throw new Error('Valid HUGGINGFACE_API_KEY is not configured in backend .env');
    }

    const messages = [];
    if (systemPrompt?.trim()) {
      messages.push({ role: 'system', content: systemPrompt.trim() });
    }
    messages.push({ role: 'user', content: prompt.trim() });

    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: HUGGINGFACE_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        timeout: LLM_TIMEOUT_MS,
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Hugging Face returned an empty response');
    }

    return text;
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED';
    const upstreamMessage = error.response?.data?.error?.message || error.response?.data?.error || error.response?.data?.message;
    const message = isTimeout
      ? `LLM request timed out after ${LLM_TIMEOUT_MS}ms`
      : upstreamMessage || error.message;

    console.error('Hugging Face Error:', message);
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
