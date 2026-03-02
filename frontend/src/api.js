import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://hack-019h.onrender.com/api';

export const api = {
  createCampaign: (brief) => axios.post(`${API_BASE}/campaigns`, { brief }),
  getCampaign: (id) => axios.get(`${API_BASE}/campaigns/${id}`),
  generateStrategy: (id) => axios.post(`${API_BASE}/campaigns/${id}/strategy`),
  generateContent: (id) => axios.post(`${API_BASE}/campaigns/${id}/content`),
  launchCampaign: (id) => axios.post(`${API_BASE}/campaigns/${id}/launch`),
  getPerformance: (id) => axios.get(`${API_BASE}/campaigns/${id}/performance`),
  optimize: (id) => axios.post(`${API_BASE}/campaigns/${id}/optimize`),
  approveOptimization: (id, index) => axios.post(`${API_BASE}/campaigns/${id}/optimize/${index}/approve`),
  getCoverage: (id) => axios.get(`${API_BASE}/campaigns/${id}/coverage`)
};
