import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL?.trim();
const normalizedBase = rawBase ? rawBase.replace(/\/+$/, '') : '/api';
const API_BASE = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

const client = axios.create({
  baseURL: API_BASE
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
