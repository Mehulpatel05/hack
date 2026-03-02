import axios from 'axios';

const COHERE_API_KEY = process.env.COHERE_API_KEY;

export async function callLLM(prompt, systemPrompt = '') {
  try {
    if (!COHERE_API_KEY) {
      throw new Error('COHERE_API_KEY not configured');
    }

    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: `${systemPrompt}\n\n${prompt}`,
        max_tokens: 2000,
        temperature: 0.7
      },
      { headers: { 'Authorization': `Bearer ${COHERE_API_KEY}` } }
    );
    return response.data.generations[0].text;
  } catch (error) {
    console.error('Cohere Error:', error.message);
    throw error;
  }
}

export async function callLLMJSON(prompt, systemPrompt = '') {
  const response = await callLLM(prompt, systemPrompt + '\n\nRespond ONLY with valid JSON.');
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
}
