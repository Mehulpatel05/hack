import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function callLLM(prompt, systemPrompt = '') {
  try {
    // Using Gemini (free tier)
    if (GEMINI_API_KEY) {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${prompt}` }]
          }]
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    }
    
    // Fallback to Groq
    if (GROQ_API_KEY) {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        },
        { headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` } }
      );
      return response.data.choices[0].message.content;
    }
    
    throw new Error('No LLM API key configured');
  } catch (error) {
    console.error('LLM Error:', error.message);
    throw error;
  }
}

export async function callLLMJSON(prompt, systemPrompt = '') {
  const response = await callLLM(prompt, systemPrompt + '\n\nRespond ONLY with valid JSON.');
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
}
