import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL?.trim();
const normalizedBase = rawBase ? rawBase.replace(/\/+$/, '') : '/api';
const API_BASE = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 120000);
const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT || 1);

const client = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT_MS
});

async function withTimeoutRetry(requestFn, retries = API_RETRY_COUNT) {
  try {
    return await requestFn();
  } catch (error) {
    const isTimeout = error?.code === 'ECONNABORTED';
    if (!isTimeout || retries <= 0) {
      throw error;
    }

    return withTimeoutRetry(requestFn, retries - 1);
  }
}

export const api = {
  createCampaign: (brief) => withTimeoutRetry(() => client.post('/campaigns', { brief })),
  getCampaign: (id) => withTimeoutRetry(() => client.get(`/campaigns/${id}`)),
  generateStrategy: (id) => withTimeoutRetry(() => client.post(`/campaigns/${id}/strategy`)),
  generateContent: (id) => withTimeoutRetry(() => client.post(`/campaigns/${id}/content`)),
  launchCampaign: (id) => withTimeoutRetry(() => client.post(`/campaigns/${id}/launch`)),
  getPerformance: (id) => withTimeoutRetry(() => client.get(`/campaigns/${id}/performance`)),
  optimize: (id) => withTimeoutRetry(() => client.post(`/campaigns/${id}/optimize`)),
  approveOptimization: (id, index) => withTimeoutRetry(() => client.post(`/campaigns/${id}/optimize/${index}/approve`)),
  getCoverage: (id) => withTimeoutRetry(() => client.get(`/campaigns/${id}/coverage`))
};
