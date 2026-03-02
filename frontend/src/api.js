import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL?.trim();
const normalizedBase = rawBase ? rawBase.replace(/\/+$/, '') : '/api';
const API_BASE = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 30000);

const client = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT_MS
});

export const api = {
  createCampaign: (brief) => client.post('/campaigns', { brief }),
  getCampaign: (id) => client.get(`/campaigns/${id}`),
  generateStrategy: (id) => client.post(`/campaigns/${id}/strategy`),
  generateContent: (id) => client.post(`/campaigns/${id}/content`),
  launchCampaign: (id) => client.post(`/campaigns/${id}/launch`),
  getPerformance: (id) => client.get(`/campaigns/${id}/performance`),
  optimize: (id) => client.post(`/campaigns/${id}/optimize`),
  approveOptimization: (id, index) => client.post(`/campaigns/${id}/optimize/${index}/approve`),
  getCoverage: (id) => client.get(`/campaigns/${id}/coverage`)
};
